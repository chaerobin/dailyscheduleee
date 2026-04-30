import React, { useState } from 'react';
import type { ScheduleBlock as ScheduleBlockType, Category } from '../types';
import { CATEGORY_CONFIG } from '../categoryConfig';
import { EditableField } from './EditableField';
import { Drum, HOURS, MINUTES, AMPM } from './AddBlockModal';

const PICKER_CATEGORIES: Category[] = ['work', 'fitness', 'home', 'errand', 'key'];

interface ScheduleBlockProps {
  block: ScheduleBlockType;
  isLast: boolean;
  editMode: boolean;
  onUpdate: (id: string, changes: Partial<ScheduleBlockType>) => void;
  onDelete: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isCurrent: boolean;
}

// Parse existing time string back into drum state
function parseTimeStr(raw: string) {
  const clean = raw.replace(/~/g, '').trim();
  const dashIdx = clean.indexOf('–');
  const startPart = dashIdx !== -1 ? clean.slice(0, dashIdx).trim() : clean;
  const endPart = dashIdx !== -1 ? clean.slice(dashIdx + 1).trim() : '';

  const ampmMatch = clean.match(/(AM|PM)/i);
  const globalAmpm = ampmMatch ? ampmMatch[1].toUpperCase() : 'AM';

  function parse(part: string, fallbackAmpm: string) {
    const m = part.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!m) return { h: '9', min: '00', a: fallbackAmpm };
    const a = m[3] ? m[3].toUpperCase() : fallbackAmpm;
    return { h: m[1], min: m[2].padStart(2, '0'), a };
  }

  const start = parse(startPart, globalAmpm);
  const end = endPart ? parse(endPart, globalAmpm) : { h: String(parseInt(start.h) % 12 + 1 || 1), min: start.min, a: start.a };
  return { startH: start.h, startM: start.min, startA: start.a, endH: end.h, endM: end.min, endA: end.a };
}

function timeToStr(sH: string, sM: string, sA: string, eH: string, eM: string, eA: string) {
  return `${sH}:${sM} – ${eH}:${eM} ${eA}`;
}

export function ScheduleBlockItem({
  block, isLast, editMode, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isCurrent,
}: ScheduleBlockProps) {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [useTextTime, setUseTextTime] = useState(false);
  const [manualTime, setManualTime] = useState(block.time);

  const parsed = parseTimeStr(block.time);
  const [startH, setStartH] = useState(parsed.startH);
  const [startM, setStartM] = useState(parsed.startM);
  const [startA, setStartA] = useState(parsed.startA);
  const [endH, setEndH] = useState(parsed.endH);
  const [endM, setEndM] = useState(parsed.endM);
  const [endA, setEndA] = useState(parsed.endA);

  const cfg = CATEGORY_CONFIG[block.category];
  const borderColor = isCurrent && !editMode ? cfg.currentBorder : cfg.rowBorder;
  const rowBg = isCurrent && !editMode ? cfg.currentBg : cfg.rowBg;
  const isActive = isCurrent && !editMode;

  const handleUpdate = (field: keyof ScheduleBlockType, val: string) => {
    onUpdate(block.id, { [field]: val });
  };

  const confirmTime = () => {
    const timeStr = useTextTime ? manualTime.trim() : timeToStr(startH, startM, startA, endH, endM, endA);
    onUpdate(block.id, { time: timeStr });
    setShowTimePicker(false);
  };

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'stretch',
        background: rowBg,
        borderTop: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        borderLeft: isActive ? `3px solid ${cfg.currentBorder}` : `1px solid ${borderColor}`,
        borderRadius: 8, marginBottom: 4, minHeight: 44,
        overflow: 'hidden', transition: 'background 0.2s, border-color 0.2s',
      }}>
        {/* Time column — tap to open time picker in edit mode */}
        <div
          style={{
            width: 88, minWidth: 88, fontSize: 10.5, color: cfg.timeColor,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 400,
            padding: '8px 8px 8px 10px',
            display: 'flex', alignItems: 'center', lineHeight: 1.3,
            borderRight: `1px solid ${borderColor}`, flexShrink: 0,
            cursor: editMode ? 'pointer' : 'default',
          }}
          onClick={editMode ? () => { setManualTime(block.time); setShowTimePicker(true); } : undefined}
          title={editMode ? 'Tap to edit time' : undefined}
        >
          {block.time}
        </div>

        {/* Content column */}
        <div style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: cfg.titleColor, lineHeight: 1.3, fontFamily: 'DM Sans, sans-serif' }}>
            {editMode ? (
              <EditableField value={block.title} onSave={v => handleUpdate('title', v)} placeholder="Title" editMode={editMode} className="" />
            ) : block.title}
          </div>

          {(block.subtitle || editMode) && (
            <div style={{ fontSize: 10.5, color: cfg.subtitleColor, marginTop: 2, lineHeight: 1.35, fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              {editMode ? (
                <EditableField value={block.subtitle} onSave={v => handleUpdate('subtitle', v)} placeholder="Details (optional)" editMode={editMode} className="" multiline />
              ) : block.subtitle}
            </div>
          )}

          {block.badge && (
            <div style={{ marginTop: 4 }}>
              <span style={{ display: 'inline-block', fontSize: 9.5, fontWeight: 500, padding: '2px 7px', borderRadius: 20, background: '#f0dfc0', color: '#7a4a10', letterSpacing: '0.01em' }}>
                {editMode ? (
                  <EditableField value={block.badge.text} onSave={v => onUpdate(block.id, { badge: { ...block.badge!, text: v } })} editMode={editMode} className="" placeholder="Badge text" />
                ) : block.badge.text}
              </span>
              {editMode && (
                <button onClick={() => onUpdate(block.id, { badge: null })} style={{ marginLeft: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#9a5a5a' }}>✕</button>
              )}
            </div>
          )}

          {editMode && !block.badge && (
            <button onClick={() => onUpdate(block.id, { badge: { text: 'note', color: 'amber' } })} style={{ marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#9a8f82', fontFamily: 'DM Sans, sans-serif', padding: 0, textAlign: 'left' }}>
              + badge
            </button>
          )}
        </div>

        {/* Edit controls */}
        {editMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 6px 6px 0', justifyContent: 'center', flexShrink: 0 }}>
            <button
              onClick={() => setShowCategoryPicker(true)}
              title="Change category"
              style={{ background: cfg.rowBg, border: `1.5px solid ${cfg.rowBorder}`, borderRadius: 4, padding: '2px 5px', cursor: 'pointer', fontSize: 10, color: cfg.timeColor, opacity: 0.8 }}
            >●</button>
            <button onClick={onMoveUp} disabled={isFirst} style={{ background: 'rgba(255,255,255,0.6)', border: `1px solid ${cfg.rowBorder}`, borderRadius: 4, padding: '2px 5px', cursor: isFirst ? 'not-allowed' : 'pointer', fontSize: 10, color: cfg.timeColor, opacity: isFirst ? 0.35 : 0.8 }}>↑</button>
            <button onClick={onMoveDown} disabled={isLast} style={{ background: 'rgba(255,255,255,0.6)', border: `1px solid ${cfg.rowBorder}`, borderRadius: 4, padding: '2px 5px', cursor: isLast ? 'not-allowed' : 'pointer', fontSize: 10, color: cfg.timeColor, opacity: isLast ? 0.35 : 0.8 }}>↓</button>
            <button onClick={() => { if (confirm('Delete this block?')) onDelete(block.id); }} style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #d4bfc8', borderRadius: 4, padding: '2px 5px', cursor: 'pointer', fontSize: 10, color: '#9a3a4a' }}>✕</button>
          </div>
        )}
      </div>

      {/* Category picker sheet */}
      {showCategoryPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(58,50,40,0.45)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowCategoryPicker(false)}>
          <div style={{ background: '#faf7f2', borderRadius: '16px 16px 0 0', padding: '20px 20px 44px', width: '100%', maxWidth: 480, border: '1px solid #ddd8ce' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: 16, fontWeight: 600, color: '#3a3228', marginBottom: 14 }}>Category</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PICKER_CATEGORIES.map(cat => {
                const c = CATEGORY_CONFIG[cat];
                const isSelected = cat === block.category;
                return (
                  <button key={cat} onClick={() => { onUpdate(block.id, { category: cat }); setShowCategoryPicker(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: isSelected ? `1.5px solid ${c.rowBorder}` : `1px solid ${c.rowBorder}`, borderRadius: 8, background: isSelected ? c.currentBg : c.rowBg, cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif', color: c.titleColor, fontWeight: isSelected ? 500 : 400 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: c.rowBg, border: `1.5px solid ${c.rowBorder}`, display: 'inline-block', flexShrink: 0 }} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Minimal time picker sheet */}
      {showTimePicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(58,50,40,0.35)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowTimePicker(false)}>
          <div style={{ background: '#faf7f2', borderRadius: '14px 14px 0 0', padding: '12px 16px 28px', width: '100%', maxWidth: 480, border: '1px solid #ddd8ce' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Lora, serif', fontSize: 14, fontWeight: 600, color: '#3a3228' }}>Edit Time</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="button" onClick={() => setUseTextTime(t => !t)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#9a8f82', fontFamily: 'DM Sans, sans-serif', textDecoration: 'underline', padding: 0 }}>
                  {useTextTime ? 'Use picker' : 'Type time'}
                </button>
                <button onClick={() => setShowTimePicker(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9a8f82', lineHeight: 1, padding: 0 }}>×</button>
              </div>
            </div>

            {useTextTime ? (
              <input
                value={manualTime}
                onChange={e => setManualTime(e.target.value)}
                placeholder="9:00 – 10:00 AM"
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd8ce', borderRadius: 7, fontSize: 12, fontFamily: 'DM Sans, sans-serif', color: '#3a3228', outline: 'none', background: '#f5f0e8', boxSizing: 'border-box' }}
              />
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 4 }}>
                {/* Start drums */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontSize: 9, color: '#9a8f82', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Start</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#f5f0e8', borderRadius: 8, padding: '2px 4px' }}>
                    <Drum items={HOURS} selected={startH} onSelect={setStartH} width={36} />
                    <span style={{ fontSize: 13, color: '#3a3228', fontWeight: 500 }}>:</span>
                    <Drum items={MINUTES} selected={startM} onSelect={setStartM} width={36} />
                    <Drum items={AMPM} selected={startA} onSelect={setStartA} width={36} />
                  </div>
                </div>
                <div style={{ width: 1, background: '#ddd8ce', alignSelf: 'stretch', marginTop: 16 }} />
                {/* End drums */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontSize: 9, color: '#9a8f82', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>End</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#f5f0e8', borderRadius: 8, padding: '2px 4px' }}>
                    <Drum items={HOURS} selected={endH} onSelect={setEndH} width={36} />
                    <span style={{ fontSize: 13, color: '#3a3228', fontWeight: 500 }}>:</span>
                    <Drum items={MINUTES} selected={endM} onSelect={setEndM} width={36} />
                    <Drum items={AMPM} selected={endA} onSelect={setEndA} width={36} />
                  </div>
                </div>
              </div>
            )}

            <button onClick={confirmTime} style={{ width: '100%', padding: '9px', background: '#3a3228', color: '#f5f0e8', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', marginTop: 10 }}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
