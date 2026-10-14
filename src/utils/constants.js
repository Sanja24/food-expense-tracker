export const USERS = {
  DSK: {
    id: 'DSK',
    name: 'Dineth Sandeepa',
    shortName: 'DSK',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    avatarBg: 'bg-emerald-600',
  },
  HSK: {
    id: 'HSK',
    name: 'Heshan Sanjeewa',
    shortName: 'HSK',
    color: 'blue',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    avatarBg: 'bg-sky-600',
  },
};

/**
 * Standard Meal Full Rates (in LKR / Rs)
 * Breakfast: Rs 250 (If shared: Rs 125 each)
 * Lunch: Rs 350 (If shared: Rs 175 each)
 * Dinner: Rs 350 (If shared: Rs 175 each)
 */
export const DEFAULT_MEAL_RATES = {
  morning: 250, // Breakfast
  day: 350,     // Lunch
  night: 350,   // Dinner
};

export const MEAL_TYPES = [
  {
    id: 'morning',
    label: 'Breakfast',
    timeLabel: 'Morning',
    icon: 'Sunrise',
    defaultFullCost: 250,
    desc: 'Breakfast (Full 250 / Shared 125 each)',
  },
  {
    id: 'day',
    label: 'Lunch',
    timeLabel: 'Day',
    icon: 'Sun',
    defaultFullCost: 350,
    desc: 'Lunch (Full 350 / Shared 175 each)',
  },
  {
    id: 'night',
    label: 'Dinner',
    timeLabel: 'Night',
    icon: 'Moon',
    defaultFullCost: 350,
    desc: 'Dinner (Full 350 / Shared 175 each)',
  },
];

export const MEAL_MODES = {
  SHARED: 'shared',       // 1 meal shared 50/50 between both
  SEPARATE: 'separate',   // 2 separate meals (1 full portion each)
  DSK_ONLY: 'dsk_only',   // 1 full meal for DSK only
  HSK_ONLY: 'hsk_only',   // 1 full meal for HSK only
  NONE: 'none',           // Neither ate
  CUSTOM: 'custom',       // Custom amount per person
};

export const STORAGE_KEYS = {
  RECORDS: 'food_tracker_records_v2',
  RATES: 'food_tracker_rates_v2',
  ACTIVE_TAB: 'food_tracker_active_tab_v2',
};
