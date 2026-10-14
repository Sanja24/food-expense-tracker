import { calculateDailyRecord } from './calculations.js';
import { MEAL_MODES } from './constants.js';

/**
 * Generate CSV string from records and rates
 */
export function generateCSV(records, rates) {
  const headers = [
    'Date',
    'Breakfast_Mode',
    'Lunch_Mode',
    'Dinner_Mode',
    'DSK_Breakfast',
    'DSK_Lunch',
    'DSK_Dinner',
    'HSK_Breakfast',
    'HSK_Lunch',
    'HSK_Dinner',
    'DSK_Daily_Cost',
    'HSK_Daily_Cost',
    'Total_Daily_Cost',
    'DSK_Paid',
    'HSK_Paid',
    'Total_Paid',
    'Notes',
  ];

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  const rows = sorted.map((rec) => {
    const calc = calculateDailyRecord(rec, rates);
    return [
      rec.date,
      calc.morning.mode || 'shared',
      calc.day.mode || 'shared',
      calc.night.mode || 'shared',
      calc.morning.dskCost.toFixed(2),
      calc.day.dskCost.toFixed(2),
      calc.night.dskCost.toFixed(2),
      calc.morning.hskCost.toFixed(2),
      calc.day.hskCost.toFixed(2),
      calc.night.hskCost.toFixed(2),
      calc.dskCost.toFixed(2),
      calc.hskCost.toFixed(2),
      calc.totalCost.toFixed(2),
      calc.dskPaid.toFixed(2),
      calc.hskPaid.toFixed(2),
      calc.totalPaid.toFixed(2),
      `"${(rec.paymentNotes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Download CSV file in browser
 */
export function downloadCSV(csvContent, filename = 'food-expenses.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parseNum(val) {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

function parseBool(val) {
  if (typeof val === 'boolean') return val;
  if (!val) return false;
  const s = String(val).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 't';
}

function normalizeDate(raw) {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/\//g, '-');
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const altMatch = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (altMatch) {
    const d = altMatch[1].padStart(2, '0');
    const m = altMatch[2].padStart(2, '0');
    const y = altMatch[3];
    return `${y}-${m}-${d}`;
  }
  return null;
}

/**
 * Parse uploaded CSV file content into standard app records
 */
export function parseCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    throw new Error('Empty or invalid CSV file.');
  }

  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const parseLine = (line) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const header = parseLine(lines[0]);
  const records = [];
  const errors = [];

  const isModernExport = header.includes('Breakfast_Mode') || header.includes('DSK_Breakfast');
  const isLegacyExport = header.includes('DSK_Morning');
  const isGoogleSheet = header[0] === 'Month' && header[1]?.startsWith('Date');

  for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i]);
    if (!row || row.length === 0 || row.every((c) => !c)) continue;

    if (isModernExport) {
      const dateIdx = header.indexOf('Date');
      const bModeIdx = header.indexOf('Breakfast_Mode');
      const lModeIdx = header.indexOf('Lunch_Mode');
      const dModeIdx = header.indexOf('Dinner_Mode');
      const dskPIdx = header.indexOf('DSK_Paid');
      const hskPIdx = header.indexOf('HSK_Paid');
      const noteIdx = header.indexOf('Notes');

      const rawDate = row[dateIdx];
      const validDate = normalizeDate(rawDate);
      if (!validDate) continue;

      const sanitizeMode = (m) => {
        if (!m) return MEAL_MODES.SHARED;
        const lower = m.toLowerCase();
        if (Object.values(MEAL_MODES).includes(lower)) return lower;
        return MEAL_MODES.SHARED;
      };

      records.push({
        date: validDate,
        meals: {
          morning: { mode: sanitizeMode(row[bModeIdx]) },
          day: { mode: sanitizeMode(row[lModeIdx]) },
          night: { mode: sanitizeMode(row[dModeIdx]) },
        },
        dskPayment: parseNum(row[dskPIdx]),
        hskPayment: parseNum(row[hskPIdx]),
        paymentNotes: noteIdx !== -1 ? (row[noteIdx] || '') : '',
      });
    } else if (isLegacyExport) {
      const dateIdx = header.indexOf('Date');
      const dskM = parseBool(row[header.indexOf('DSK_Morning')]);
      const dskD = parseBool(row[header.indexOf('DSK_Day')]);
      const dskN = parseBool(row[header.indexOf('DSK_Night')]);
      const hskM = parseBool(row[header.indexOf('HSK_Morning')]);
      const hskD = parseBool(row[header.indexOf('HSK_Day')]);
      const hskN = parseBool(row[header.indexOf('HSK_Night')]);
      const dskP = parseNum(row[header.indexOf('DSK_Paid')]);
      const hskP = parseNum(row[header.indexOf('HSK_Paid')]);
      const notes = row[header.indexOf('Notes')] || '';

      const validDate = normalizeDate(row[dateIdx]);
      if (!validDate) continue;

      const toMode = (dAte, hAte) => {
        if (dAte && hAte) return MEAL_MODES.SHARED;
        if (dAte && !hAte) return MEAL_MODES.DSK_ONLY;
        if (!dAte && hAte) return MEAL_MODES.HSK_ONLY;
        return MEAL_MODES.NONE;
      };

      records.push({
        date: validDate,
        meals: {
          morning: { mode: toMode(dskM, hskM) },
          day: { mode: toMode(dskD, hskD) },
          night: { mode: toMode(dskN, hskN) },
        },
        dskPayment: dskP,
        hskPayment: hskP,
        paymentNotes: notes,
      });
    } else if (isGoogleSheet) {
      if (i === 1 && row.includes('Goten')) continue;
      const validDate = normalizeDate(row[1]);
      if (!validDate) continue;

      const dskM = parseBool(row[5]);
      const hskM = parseBool(row[6]);
      const dskD = parseBool(row[9]);
      const hskD = parseBool(row[10]);
      const dskN = parseBool(row[13]);
      const hskN = parseBool(row[14]);
      const dskP = parseNum(row[21]);
      const hskP = parseNum(row[22]);

      const toMode = (dAte, hAte) => {
        if (dAte && hAte) return MEAL_MODES.SHARED;
        if (dAte && !hAte) return MEAL_MODES.DSK_ONLY;
        if (!dAte && hAte) return MEAL_MODES.HSK_ONLY;
        return MEAL_MODES.NONE;
      };

      records.push({
        date: validDate,
        meals: {
          morning: { mode: toMode(dskM, hskM) },
          day: { mode: toMode(dskD, hskD) },
          night: { mode: toMode(dskN, hskN) },
        },
        dskPayment: dskP,
        hskPayment: hskP,
        paymentNotes: 'Imported from Google Sheet',
      });
    } else {
      // Fallback
      const dateIdx = header.findIndex((h) => /date/i.test(h));
      if (dateIdx === -1) throw new Error('Missing "Date" column.');
      const validDate = normalizeDate(row[dateIdx]);
      if (!validDate) continue;

      records.push({
        date: validDate,
        meals: {
          morning: { mode: MEAL_MODES.SHARED },
          day: { mode: MEAL_MODES.SHARED },
          night: { mode: MEAL_MODES.SHARED },
        },
        dskPayment: 0,
        hskPayment: 0,
        paymentNotes: '',
      });
    }
  }

  if (records.length === 0) {
    throw new Error('No valid records could be extracted from the file.');
  }

  return { records, errors };
}
