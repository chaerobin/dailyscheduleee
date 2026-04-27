import type { Category } from './types';

export interface CategoryConfig {
  label: string;
  legendLabel?: string;
  rowBg: string;
  rowBorder: string;
  timeColor: string;
  titleColor: string;
  subtitleColor: string;
  timeBorderColor: string;
  currentBorder: string;
  currentBg: string;
}

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  // Work — sage green (per reference design)
  work: {
    label: 'Work',
    rowBg: '#c8d8c0',
    rowBorder: '#b8ccb0',
    timeColor: '#3a5230',
    titleColor: '#3a5230',
    subtitleColor: '#4a6a40',
    timeBorderColor: '#b8ccb0',
    currentBorder: '#6a9a5a',
    currentBg: '#b0cc9e',
  },
  // Fitness → Wellness/Breaks — blue (per reference design)
  fitness: {
    label: 'Wellness/Breaks',
    legendLabel: 'Wellness / Breaks',
    rowBg: '#ccd4e0',
    rowBorder: '#bcc8d8',
    timeColor: '#2a3a50',
    titleColor: '#2a3a50',
    subtitleColor: '#3a4a60',
    timeBorderColor: '#bcc8d8',
    currentBorder: '#5a7aaa',
    currentBg: '#b8c4d8',
  },
  // Appointment → Out & About — rose
  appointment: {
    label: 'Out & About',
    rowBg: '#e0cdd4',
    rowBorder: '#d4bfc8',
    timeColor: '#6a3a4a',
    titleColor: '#6a3a4a',
    subtitleColor: '#7a4a5a',
    timeBorderColor: '#d4bfc8',
    currentBorder: '#a06070',
    currentBg: '#d0b8c4',
  },
  // Errand → Out & About — rose (same as appointment)
  errand: {
    label: 'Out & About',
    rowBg: '#e0cdd4',
    rowBorder: '#d4bfc8',
    timeColor: '#6a3a4a',
    titleColor: '#6a3a4a',
    subtitleColor: '#7a4a5a',
    timeBorderColor: '#d4bfc8',
    currentBorder: '#a06070',
    currentBg: '#d0b8c4',
  },
  // Social — same rose palette as Out & About
  social: {
    label: 'Out & About',
    rowBg: '#e0cdd4',
    rowBorder: '#d4bfc8',
    timeColor: '#6a3a4a',
    titleColor: '#6a3a4a',
    subtitleColor: '#7a4a5a',
    timeBorderColor: '#d4bfc8',
    currentBorder: '#a06070',
    currentBg: '#d0b8c4',
  },
  // Key Moments — gold
  key: {
    label: 'Key Moment',
    rowBg: '#e0d0bc',
    rowBorder: '#d4c4ac',
    timeColor: '#5a3a1a',
    titleColor: '#5a3a1a',
    subtitleColor: '#6a4a2a',
    timeBorderColor: '#d4c4ac',
    currentBorder: '#a0783a',
    currentBg: '#ceb88a',
  },
  // Home — neutral parchment (hidden from legend)
  home: {
    label: 'Home',
    rowBg: '#faf7f2',
    rowBorder: '#ddd8ce',
    timeColor: '#7a6f62',
    titleColor: '#3a3228',
    subtitleColor: '#7a6f62',
    timeBorderColor: '#ddd8ce',
    currentBorder: '#b8a070',
    currentBg: '#f0e8d4',
  },
  // Drive — neutral parchment (hidden from legend)
  drive: {
    label: 'Drive',
    rowBg: '#faf7f2',
    rowBorder: '#ddd8ce',
    timeColor: '#7a6f62',
    titleColor: '#3a3228',
    subtitleColor: '#7a6f62',
    timeBorderColor: '#ddd8ce',
    currentBorder: '#b8a070',
    currentBg: '#f0e8d4',
  },
};

export const CATEGORIES: Category[] = ['work', 'fitness', 'appointment', 'errand', 'home', 'drive', 'key'];
