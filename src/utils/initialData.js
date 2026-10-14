import { MEAL_MODES } from './constants.js';

/**
 * Historical seed data based on Dineth Sandeepa (DSK) & Heshan Sanjeewa (HSK) Google Sheet
 * Full Meal Rates: Breakfast Rs 250 (Shared = Rs 125), Lunch Rs 350 (Shared = Rs 175), Dinner Rs 350 (Shared = Rs 175)
 *
 * September Total: DSK Rs 3,800.00 | HSK Rs 3,800.00 | Paid Rs 7,000.00 (Rs 3,500 each)
 * October Total:   DSK Rs 4,575.00 | HSK Rs 5,775.00 | Paid Rs 11,000.00 (DSK 4,875 / HSK 6,125)
 * Combined Total:  DSK Rs 8,375.00 | HSK Rs 9,575.00 | Paid Rs 18,000.00 | Net: -Rs 50.00 (Settled)
 */
export const INITIAL_HISTORICAL_RECORDS = [
  // September 2026 Records (8 days)
  {
    date: '2026-09-23',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },   // 125 each
      day: { mode: MEAL_MODES.SEPARATE },     // 350 each (two separate meals)
      night: { mode: MEAL_MODES.SHARED },     // 175 each => 650 each
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: 'Initial day: shared breakfast & dinner, separate lunch meals',
  },
  {
    date: '2026-09-24',
    meals: {
      morning: { mode: MEAL_MODES.SHARED }, // 125 each
      day: { mode: MEAL_MODES.SHARED },     // 175 each
      night: { mode: MEAL_MODES.SHARED },   // 175 each => 475 each
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-09-25',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-09-26',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-09-27',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-09-28',
    meals: {
      morning: { mode: MEAL_MODES.SHARED }, // 125 each
      day: { mode: MEAL_MODES.SHARED },     // 175 each
      night: { mode: MEAL_MODES.NONE },     // Skipped => 300 each
    },
    dskMeals: { morning: true, day: true, night: false },
    hskMeals: { morning: true, day: true, night: false },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: 'Dinner skipped by both (300 each)',
  },
  {
    date: '2026-09-29',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 3500,
    hskPayment: 3500,
    paymentNotes: 'September mid-cycle food payment settled (Rs 3,500 each)',
  },
  {
    date: '2026-09-30',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: 'End of September',
  },

  // October 2026 Records
  // Oct 1-8: 8 days * 475 = 3,800 each
  {
    date: '2026-10-01',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-10-02',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-10-03',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-10-04',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-10-05',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-10-06',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-10-07',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-10-08',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },
      day: { mode: MEAL_MODES.SHARED },
      night: { mode: MEAL_MODES.SHARED },
    },
    dskMeals: { morning: true, day: true, night: true },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: '',
  },
  {
    date: '2026-10-09',
    meals: {
      morning: { mode: MEAL_MODES.NONE },        // 0
      day: { mode: MEAL_MODES.SHARED },          // DSK: 175, HSK: 175
      night: { mode: MEAL_MODES.HSK_ONLY },      // DSK: 0, HSK: 350
    },
    dskMeals: { morning: false, day: true, night: false },
    hskMeals: { morning: false, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: 'Dinner taken by HSK only',
  },
  {
    date: '2026-10-10',
    meals: {
      morning: { mode: MEAL_MODES.SHARED },      // DSK: 125, HSK: 125
      day: { mode: MEAL_MODES.HSK_ONLY },        // DSK: 0, HSK: 350
      night: { mode: MEAL_MODES.HSK_ONLY },      // DSK: 0, HSK: 350
    },
    dskMeals: { morning: true, day: false, night: false },
    hskMeals: { morning: true, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: 'Lunch & dinner taken by HSK only',
  },
  {
    date: '2026-10-11',
    meals: {
      morning: { mode: MEAL_MODES.NONE },        // 0
      day: { mode: MEAL_MODES.SHARED },          // DSK: 175, HSK: 175
      night: { mode: MEAL_MODES.HSK_ONLY },      // DSK: 0, HSK: 350
    },
    dskMeals: { morning: false, day: true, night: false },
    hskMeals: { morning: false, day: true, night: true },
    dskPayment: 0,
    hskPayment: 0,
    paymentNotes: 'Dinner taken by HSK only',
  },
  {
    date: '2026-10-12',
    meals: {
      morning: { mode: MEAL_MODES.CUSTOM, customDsk: 125, customHsk: 100 },
      day: { mode: MEAL_MODES.CUSTOM, customDsk: 175, customHsk: 0 },
      night: { mode: MEAL_MODES.NONE },
    },
    dskMeals: { morning: true, day: true, night: false },
    hskMeals: { morning: true, day: false, night: true },
    dskPayment: 4875,
    hskPayment: 6125,
    paymentNotes: 'October full settlement paid to food supplier',
  },
];
