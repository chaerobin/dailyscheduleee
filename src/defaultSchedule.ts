import type { ScheduleBlock } from './types';
import { SCHEDULE_DATA } from './scheduleData';

function b(
  date: string,
  time: string,
  title: string,
  subtitle: string,
  category: ScheduleBlock['category'],
  section?: string,
  badge?: ScheduleBlock['badge'],
): ScheduleBlock {
  return { id: crypto.randomUUID(), date, section, time, title, subtitle, category, badge };
}

// ─────────────────────────────────────────────────────────────
// SCHEDULE DATA PARSER
// Reads from scheduleData.ts and converts pipe-delimited blocks
// into ScheduleBlock arrays. You never need to edit this.
// ─────────────────────────────────────────────────────────────

function parseScheduleData(raw: string): Record<string, ScheduleBlock[]> {
  const result: Record<string, ScheduleBlock[]> = {};
  let currentDate: string | null = null;
  let currentSection: string | undefined = undefined;

  const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  for (const line of lines) {
    // Date header line e.g. "2026-05-07"
    if (/^\d{4}-\d{2}-\d{2}$/.test(line)) {
      currentDate = line;
      currentSection = undefined;
      if (!result[currentDate]) result[currentDate] = [];
      continue;
    }

    if (!currentDate) continue;

    const parts = line.split('|').map(p => p.trim());
    if (parts.length < 3) continue;

    const time = parts[0];
    const title = parts[1];
    const categoryRaw = parts[2];
    const categoryMatch = categoryRaw.match(/^\[(\w+)\]$/);
    if (!categoryMatch) continue;
    const category = categoryMatch[1] as ScheduleBlock['category'];

    let details = '';
    let badge: ScheduleBlock['badge'] | undefined = undefined;
    let section: string | undefined = undefined;

    for (let i = 3; i < parts.length; i++) {
      const part = parts[i];
      if (part.startsWith('badge:')) {
        const addr = part.replace('badge:', '').trim();
        if (addr) badge = { text: addr, color: 'amber' };
      } else if (part.startsWith('section:')) {
        section = part.replace('section:', '').trim();
        currentSection = section;
      } else {
        if (!details) details = part;
      }
    }

    const blockSection = section ?? (result[currentDate].length === 0 ? currentSection : undefined);

    result[currentDate].push(
      b(currentDate, time, title, details, category, blockSection, badge)
    );
  }

  return result;
}

const PARSED_SCHEDULE_DATA = parseScheduleData(SCHEDULE_DATA);

// ─────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────

export const CUSTOM_SCHEDULE_DATES = Object.keys(PARSED_SCHEDULE_DATA);

export function getDefaultSchedule(date: string): ScheduleBlock[] {
  return PARSED_SCHEDULE_DATA[date] ?? [];
}
