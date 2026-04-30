import { useState, useCallback } from 'react';
import type { ScheduleBlock, ScheduleStore, NotesStore } from './types';
import {
  loadSchedules, saveSchedules, loadNotes, saveNotes,
  getBlocksForDate, setBlocksForDate, clearDate, duplicateDate,
  todayStr, offsetDate,
} from './storage';
import { getDefaultSchedule, CUSTOM_SCHEDULE_DATES } from './defaultSchedule';
import { parseStartMinutes } from './components/AddBlockModal';

function migrateStore(s: ScheduleStore): ScheduleStore {
  const SCHEMA_KEY = 'schedule_schema_v';
  const CURRENT_VERSION = 21;
  const stored = parseInt(localStorage.getItem(SCHEMA_KEY) ?? '0', 10);
  if (stored >= CURRENT_VERSION) return s;

  let changed = false;
  const migrated: ScheduleStore = {};

  for (const date of Object.keys(s)) {
    const blocks = s[date].map(b => {
      // V1→V2: rename 'Fitness' section label → 'Evening'
      if (b.section === 'Fitness') { changed = true; return { ...b, section: 'Evening' }; }
      return b;
    });

    // V2→V3: Work day is 9–5; 4pm blocks belong in Work, Evening starts at 5pm.
    let eveningAssigned = false;
    const fixed = blocks.map((b, i) => {
      if (b.section === 'Evening') {
        const earlyMatch = b.time.match(/^(\d{1,2}):(\d{2})\s*[–-]/);
        if (earlyMatch) {
          const hour = parseInt(earlyMatch[1], 10);
          const ampm = b.time.toUpperCase();
          const isPM = ampm.includes('PM') || (hour >= 5 && hour <= 11 && !ampm.includes('AM'));
          const hour24 = isPM && hour !== 12 ? hour + 12 : hour;
          if (hour24 < 17) { changed = true; return { ...b, section: undefined }; }
        }
      }
      return b;
    }).map(b => {
      if (!eveningAssigned && !b.section) {
        const m = b.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (m) {
          let h = parseInt(m[1], 10);
          const ampm = m[3].toUpperCase();
          if (ampm === 'PM' && h !== 12) h += 12;
          if (h >= 17) { eveningAssigned = true; changed = true; return { ...b, section: 'Evening' }; }
        }
      }
      if (b.section === 'Evening') eveningAssigned = true;
      return b;
    });

    migrated[date] = fixed;
  }

  if (stored < 5 && migrated['2026-04-11']) { delete migrated['2026-04-11']; changed = true; }
  if (stored < 7 && migrated['2026-04-13']) { delete migrated['2026-04-13']; changed = true; }
  if (stored < 8 && migrated['2026-04-14']) { delete migrated['2026-04-14']; changed = true; }
  if (stored < 9 && migrated['2026-04-15']) { delete migrated['2026-04-15']; changed = true; }
  if (stored < 10 && migrated['2026-04-16']) { delete migrated['2026-04-16']; changed = true; }
  if (stored < 11 && migrated['2026-04-17']) { delete migrated['2026-04-17']; changed = true; }

  if (stored < 12) {
    for (const d of ['2026-04-20','2026-04-21','2026-04-22','2026-04-23','2026-04-24','2026-04-25','2026-04-26']) {
      if (migrated[d]) { delete migrated[d]; changed = true; }
    }
  }
  if (stored < 13) {
    for (const d of ['2026-04-20','2026-04-21','2026-04-22','2026-04-23','2026-04-24','2026-04-25','2026-04-26']) {
      delete migrated[d]; changed = true;
    }
  }
  if (stored < 14) { delete migrated['2026-04-21']; changed = true; }
  if (stored < 15) {
    for (const d of ['2026-04-22','2026-04-23','2026-04-24','2026-04-25','2026-04-26']) {
      delete migrated[d]; changed = true;
    }
  }
  if (stored < 16) {
    for (const d of ['2026-04-24','2026-04-25','2026-04-26']) {
      delete migrated[d]; changed = true;
    }
  }
  if (stored < 17) { delete migrated['2026-04-26']; changed = true; }
  if (stored < 18) { delete migrated['2026-04-26']; changed = true; }
  if (stored < 19) { delete migrated['2026-04-25']; changed = true; }
  if (stored < 20) { delete migrated['2026-04-25']; changed = true; }
  if (stored < 21) {
    for (const d of ['2026-04-28','2026-04-29','2026-04-30','2026-05-01','2026-05-02','2026-05-03']) {
      delete migrated[d]; changed = true;
    }
  }

  if (changed) saveSchedules(migrated);
  localStorage.setItem(SCHEMA_KEY, String(CURRENT_VERSION));
  return changed ? migrated : s;
}

export function useSchedule() {
  const [store, setStore] = useState<ScheduleStore>(() => {
    let s = loadSchedules();
    s = migrateStore(s);
    const today = todayStr();
    if (!s[today]) {
      const defaults = getDefaultSchedule(today);
      if (defaults.length > 0) { s[today] = defaults; saveSchedules(s); }
    }
    for (const d of CUSTOM_SCHEDULE_DATES) {
      if (!s[d]) {
        const defaults = getDefaultSchedule(d);
        if (defaults.length > 0) { s[d] = defaults; saveSchedules(s); }
      }
    }
    return s;
  });

  const [notes, setNotes] = useState<NotesStore>(() => loadNotes());
  const [currentDate, setCurrentDate] = useState<string>(todayStr);

  const blocks = getBlocksForDate(store, currentDate);

  const updateStore = useCallback((next: ScheduleStore) => {
    setStore(next);
    saveSchedules(next);
  }, []);

  const updateNotes = useCallback((next: NotesStore) => {
    setNotes(next);
    saveNotes(next);
  }, []);

  const today = todayStr();
  const canGoPrev = currentDate > today;

  const goToday = useCallback(() => setCurrentDate(todayStr()), []);
  const goNext = useCallback(() => setCurrentDate(d => offsetDate(d, 1)), []);
  const goPrev = useCallback(() => {
    setCurrentDate(d => {
      const prev = offsetDate(d, -1);
      return prev >= todayStr() ? prev : todayStr();
    });
  }, []);
  const goToDate = useCallback((date: string) => {
    if (date >= todayStr()) setCurrentDate(date);
  }, []);

  const addBlock = useCallback((block: Omit<ScheduleBlock, 'id' | 'date'>) => {
    const newBlock: ScheduleBlock = { ...block, id: crypto.randomUUID(), date: currentDate };
    const updated = [...blocks, newBlock].sort(
      (a, b) => parseStartMinutes(a.time) - parseStartMinutes(b.time)
    );
    updateStore(setBlocksForDate(store, currentDate, updated));
  }, [blocks, currentDate, store, updateStore]);

  const updateBlock = useCallback((id: string, changes: Partial<ScheduleBlock>) => {
    const updated = blocks.map(b => b.id === id ? { ...b, ...changes } : b);
    updateStore(setBlocksForDate(store, currentDate, updated));
  }, [blocks, currentDate, store, updateStore]);

  const deleteBlock = useCallback((id: string) => {
    updateStore(setBlocksForDate(store, currentDate, blocks.filter(b => b.id !== id)));
  }, [blocks, currentDate, store, updateStore]);

  const reorderBlocks = useCallback((fromIdx: number, toIdx: number) => {
    const updated = [...blocks];
    const [item] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, item);
    updateStore(setBlocksForDate(store, currentDate, updated));
  }, [blocks, currentDate, store, updateStore]);

  const clearDay = useCallback(() => {
    updateStore(clearDate(store, currentDate));
  }, [currentDate, store, updateStore]);

  const resetDay = useCallback(() => {
    const defaults = getDefaultSchedule(currentDate);
    updateStore(setBlocksForDate(store, currentDate, defaults));
  }, [currentDate, store, updateStore]);

  const duplicateDay = useCallback((fromDate: string) => {
    updateStore(duplicateDate(store, fromDate, currentDate));
  }, [currentDate, store, updateStore]);

  const getDayNote = useCallback(() => notes[currentDate] ?? '', [notes, currentDate]);
  const setDayNote = useCallback((note: string) => {
    updateNotes({ ...notes, [currentDate]: note });
  }, [notes, currentDate, updateNotes]);

  const datesWithSchedules = Object.keys(store).filter(d => store[d].length > 0).sort();

  return {
    blocks, currentDate, notes, store,
    canGoPrev,
    goToday, goNext, goPrev, goToDate,
    addBlock, updateBlock, deleteBlock, reorderBlocks,
    clearDay, resetDay, duplicateDay,
    getDayNote, setDayNote,
    datesWithSchedules,
  };
}
