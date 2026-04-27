import type { ScheduleBlock, ScheduleStore, NotesStore } from './types';

const SCHEDULE_KEY = 'daily-schedule-v1';
const NOTES_KEY = 'daily-schedule-notes-v1';

export function loadSchedules(): ScheduleStore {
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveSchedules(store: ScheduleStore): void {
  try {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(store));
  } catch {}
}

export function loadNotes(): NotesStore {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveNotes(store: NotesStore): void {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(store));
  } catch {}
}

export function getBlocksForDate(store: ScheduleStore, date: string): ScheduleBlock[] {
  return store[date] ?? [];
}

export function setBlocksForDate(store: ScheduleStore, date: string, blocks: ScheduleBlock[]): ScheduleStore {
  return { ...store, [date]: blocks };
}

export function clearDate(store: ScheduleStore, date: string): ScheduleStore {
  const next = { ...store };
  delete next[date];
  return next;
}

export function duplicateDate(store: ScheduleStore, fromDate: string, toDate: string): ScheduleStore {
  const blocks = getBlocksForDate(store, fromDate);
  const cloned = blocks.map(b => ({ ...b, id: crypto.randomUUID(), date: toDate }));
  return { ...store, [toDate]: cloned };
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function offsetDate(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}
