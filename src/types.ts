export type Category = 'fitness' | 'work' | 'home' | 'drive' | 'appointment' | 'errand' | 'social' | 'key';

export interface Badge {
  text: string;
  color: 'amber';
}

export interface ScheduleBlock {
  id: string;
  date: string;
  section?: string;
  time: string;
  title: string;
  subtitle: string;
  category: Category;
  badge?: Badge | null;
}

export interface DayNote {
  date: string;
  note: string;
}

export type ScheduleStore = {
  [date: string]: ScheduleBlock[];
};

export type NotesStore = {
  [date: string]: string;
};
