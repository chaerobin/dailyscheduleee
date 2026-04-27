import React, { useMemo, useEffect, useRef } from 'react';
import type { ScheduleBlock } from '../types';
import { ScheduleBlockItem } from './ScheduleBlock';

interface TimelineProps {
  blocks: ScheduleBlock[];
  editMode: boolean;
  onUpdate: (id: string, changes: Partial<ScheduleBlock>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
}

function getCurrentBlockId(blocks: ScheduleBlock[]): string | null {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  function parseTimeStr(raw: string): number | null {
    const clean = raw.replace(/~/g, '').trim();
    const m = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return null;
    let h = parseInt(m[1]);
    const min = parseInt(m[2]);
    const ampm = m[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + min;
  }

  function parseBlockTimes(timeStr: string): { start: number | null; end: number | null } {
    const dashIdx = timeStr.indexOf('–');
    if (dashIdx !== -1) {
      const startStr = timeStr.slice(0, dashIdx).trim();
      const endStr = timeStr.slice(dashIdx + 1).trim();
      const ampmMatch = endStr.match(/(AM|PM)/i);
      const startFull = startStr.match(/(AM|PM)/i) ? startStr : `${startStr} ${ampmMatch?.[1] ?? ''}`.trim();
      return { start: parseTimeStr(startFull), end: parseTimeStr(endStr) };
    }
    return { start: parseTimeStr(timeStr), end: null };
  }

  for (let i = 0; i < blocks.length; i++) {
    const { start, end } = parseBlockTimes(blocks[i].time);
    if (start === null) continue;
    if (end !== null) {
      if (nowMinutes >= start && nowMinutes < end) return blocks[i].id;
    } else {
      const next = blocks[i + 1];
      const nextStart = next ? parseBlockTimes(next.time).start : null;
      const endTime = nextStart ?? start + 60;
      if (nowMinutes >= start && nowMinutes < endTime) return blocks[i].id;
    }
  }
  return null;
}

export function Timeline({ blocks, editMode, onUpdate, onDelete, onMoveUp, onMoveDown }: TimelineProps) {
  const currentId = useMemo(() => getCurrentBlockId(blocks), [blocks]);
  const currentRef = useRef<HTMLDivElement>(null);

  // Scroll the active block into view on load and whenever the active block changes
  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentId]);

  if (blocks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 20px' }}>
        <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.4 }}>📅</div>
        <p style={{ fontFamily: 'Lora, serif', fontSize: 15, color: '#9a8f82', marginBottom: 6 }}>
          No schedule yet
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#b0a898', fontWeight: 300 }}>
          {editMode ? 'Tap "+ Add Block" to get started' : 'Tap Edit to add blocks'}
        </p>
      </div>
    );
  }

  let lastSection: string | undefined = undefined;

  return (
    <div>
      {blocks.map((block, idx) => {
        const showSection = block.section && block.section !== lastSection;
        if (block.section) lastSection = block.section;
        const isCurrent = !editMode && block.id === currentId;

        return (
          <React.Fragment key={block.id}>
            {showSection && (
              <div style={{
                fontSize: 9, fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#9a8f82',
                margin: idx === 0 ? '0 0 6px 4px' : '18px 0 6px 4px',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                {editMode ? (
                  <input
                    value={block.section}
                    onChange={e => onUpdate(block.id, { section: e.target.value })}
                    style={{
                      background: 'transparent', border: '1px dashed #c8bfb4',
                      borderRadius: 3, padding: '1px 6px',
                      fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: '#9a8f82', fontFamily: 'DM Sans, sans-serif',
                      fontWeight: 500, outline: 'none', width: 120,
                    }}
                  />
                ) : (
                  block.section
                )}
              </div>
            )}
            {/* Ref wrapper lets us scroll the active block into view */}
            <div ref={isCurrent ? currentRef : undefined}>
              <ScheduleBlockItem
                block={block}
                isLast={idx === blocks.length - 1}
                isFirst={idx === 0}
                editMode={editMode}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onMoveUp={() => onMoveUp(idx)}
                onMoveDown={() => onMoveDown(idx)}
                isCurrent={isCurrent}
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
