// USCIS Categories (derived from official test structure)
export const CATEGORIES = [
  'Any',
  'American Government',
  'American History',
  'Integrated Civics',
] as const;

export type Category = typeof CATEGORIES[number];

// Subcategories by category
export const SUBCATEGORIES: Record<string, string[]> = {
  'Any': ['Any'],
  'American Government': [
    'Any',
    'Principles of American Democracy',
    'System of Government',
    'Rights and Responsibilities',
  ],
  'American History': [
    'Any',
    'Colonial Period and Independence',
    '1800s',
    'Recent American History and Other Important Historical Information',
  ],
  'Integrated Civics': [
    'Any',
    'Geography',
    'Symbols',
    'Holidays',
  ],
};

// Configuration limits
export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 25;
export const DEFAULT_QUESTIONS = 10;
