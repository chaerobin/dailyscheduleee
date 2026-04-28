import { useState, useCallback } from 'react';
import type { ScheduleBlock, ScheduleStore, NotesStore } from './types';
import {
  loadSchedules, saveSchedules, loadNotes, saveNotes,
  getBlocksForDate, setBlocksForDate, clearDate, duplicateDate,
  todayStr, offsetDate,
} from './storage';
import { getDefaultSchedule, CUSTOM_SCHEDULE_DATES } from './defaultSchedule';

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
    // Find any block with section 'Evening' whose time begins before 5pm and clear it.
    // Then assign section 'Evening' to the first block at or after 5:00 PM that lacks one.
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
      // Give section 'Evening' to first 5pm+ block that has no section
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

  // V3→V4: Replace the April 11 generic default with the custom schedule.
  // V4→V5: Re-seed April 11 to fix wedding meeting category (work → home).
  // Deleting it here causes the initializer below to reload via getDefaultSchedule.
  if (stored < 5 && migrated['2026-04-11']) {
    delete migrated['2026-04-11'];
    changed = true;
  }

  // V5→V6: Re-seed April 13 to fix Taxes category (work → home).
  // V6→V7: Replace April 13 with updated schedule from LittleBird.
  if (stored < 7 && migrated['2026-04-13']) {
    delete migrated['2026-04-13'];
    changed = true;
  }

  // V7→V8: Seed April 14 with custom schedule (replaces any generic default).
  if (stored < 8 && migrated['2026-04-14']) {
    delete migrated['2026-04-14'];
    changed = true;
  }

  // V8→V9: Seed April 15 with custom schedule.
  if (stored < 9 && migrated['2026-04-15']) {
    delete migrated['2026-04-15'];
    changed = true;
  }

  // V9→V10: Seed April 16 with custom schedule.
  if (stored < 10 && migrated['2026-04-16']) {
    delete migrated['2026-04-16'];
    changed = true;
  }

  // V10→V11: Seed April 17 with custom schedule.
  if (stored < 11 && migrated['2026-04-17']) {
    delete migrated['2026-04-17'];
    changed = true;
  }

  // V11→V12: Seed April 20–26 with custom schedules.
  if (stored < 12) {
    for (const d of ['2026-04-20','2026-04-21','2026-04-22','2026-04-23','2026-04-24','2026-04-25','2026-04-26']) {
      if (migrated[d]) { delete migrated[d]; changed = true; }
    }
  }

  // V12→V13: Replace April 20–26 with final corrected schedules.
  if (stored < 13) {
    for (const d of ['2026-04-20','2026-04-21','2026-04-22','2026-04-23','2026-04-24','2026-04-25','2026-04-26']) {
      delete migrated[d]; changed = true;
    }
  }

  // V13→V14: Add Emergency Fund + Create TikTok to April 21 evening.
  if (stored < 14) {
    delete migrated['2026-04-21']; changed = true;
  }

  // V14→V15: Wed morning slim-down + Thu/Fri/Sat/Sun task redistribution.
  if (stored < 15) {
    for (const d of ['2026-04-22','2026-04-23','2026-04-24','2026-04-25','2026-04-26']) {
      delete migrated[d]; changed = true;
    }
  }

  // V15→V16: Fri/Sat/Sun rebuilt — Netlify+Golden Hour on Fri, Ladder/StretchIt/Makeup on Sat,
  //          Ladder/StretchIt/Grocery on Sun, Sat Lights Out → 9:30 PM, Sun Lights Out → 8:35 PM.
  if (stored < 16) {
    for (const d of ['2026-04-24','2026-04-25','2026-04-26']) {
      delete migrated[d]; changed = true;
    }
  }

  // V16→V17: Sunday Meal Prep + rest of day pushed 45 min later, Lights Out → 9:50 PM.
  if (stored < 17) {
    delete migrated['2026-04-26']; changed = true;
  }

  // V17→V18: Sunday Makeup Practice moved to morning Floater slot, Lights Out → 9:20 PM.
  if (stored < 18) {
    delete migrated['2026-04-26']; changed = true;
  }

  // V18→V19: Saturday fully rebuilt — shorter morning blocks, Hair Wash before Makeup,
  //          2hr Wardrobe Audit, Golden Hour + Plan Grocery, DND 6h05m, Lights Out 11 PM.
  if (stored < 19) {
    delete migrated['2026-04-25']; changed = true;
  }

  // V19→V20: Saturday morning pushed back 1h40m, DND shrinks to 4h25m (5:10–9:35 PM).
  if (stored < 20) {
    delete migrated['2026-04-25']; changed = true;
  }

  // V20→V21: Reseed Apr 28–May 3 with updated weekly schedule.
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
    // Seed today's generic default
    if (!s[today]) {
      const defaults = getDefaultSchedule(today);
      if (defaults.length > 0) {
        s[today] = defaults;
        saveSchedules(s);
      }
    }
    // Seed any custom pre-built dates that haven't been loaded yet
    for (const d of CUSTOM_SCHEDULE_DATES) {
      if (!s[d]) {
        const defaults = getDefaultSchedule(d);
        if (defaults.length > 0) {
          s[d] = defaults;
          saveSchedules(s);
        }
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

  // Can only go back to today — never before today
  const canGoPrev = currentDate > today;

  const goToday = useCallback(() => setCurrentDate(todayStr()), []);

  const goNext = useCallback(() => setCurrentDate(d => offsetDate(d, 1)), []);

  const goPrev = useCallback(() => {
    setCurrentDate(d => {
      const prev = offsetDate(d, -1);
      // Never navigate before today
      return prev >= todayStr() ? prev : todayStr();
    });
  }, []);

  const goToDate = useCallback((date: string) => {
    // Only allow navigating to today or future
    if (date >= todayStr()) setCurrentDate(date);
  }, []);

  const addBlock = useCallback((block: Omit<ScheduleBlock, 'id' | 'date'>) => {
    const newBlock: ScheduleBlock = { ...block, id: crypto.randomUUID(), date: currentDate };
    updateStore(setBlocksForDate(store, currentDate, [...blocks, newBlock]));
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
    clearDay, duplicateDay,
    getDayNote, setDayNote,
    datesWithSchedules,
  };
}
