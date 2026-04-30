import React, { useState, useRef, useEffect } from 'react';
import type { Category, Badge } from '../types';
import { CATEGORY_CONFIG } from '../categoryConfig';

const PICKER_CATEGORIES: Category[] = ['work', 'fitness', 'home', 'errand', 'key'];

interface AddBlockModalProps {
  onAdd: (block: {
    section?: string;
    time: string;
    title: string;
    subtitle: string;
    category: Category;
    badge?: Badge | null;
  }) => void;
  onClose: () => void;
}

// ── Rotary drum helpers ──────────────────────────────────────────────────────

const ITEM_H = 28; // px per drum cell — compact for mobile

function Drum({
  items,
  selected,
  onSelect,
  width = 64,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  width?: number;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  const scrollTo = (i: number) => {
    if (listRef.current) {
      listRef.current.scrollTop = i * ITEM_H;
    }
  };

  useEffect(() => {
    scrollTo(items.indexOf(selected));
  }, [selected, items]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const i = Math.round(listRef.current.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    if (items[clamped] !== selected) onSelect(items[clamped]);
  };

  return (
    <div style={{ position: 'relative', width, overflow: 'hidden', height: ITEM_H * 3 }}>
      {/* selection highlight */}
      <div style={{
        position: 'absolute', top: ITEM_H, left: 0, right: 0, height: ITEM_H,
        background: 'rgba(58,50,40,0.07)', borderRadius: 6,
        borderTop: '1px solid #ddd8ce', borderBottom: '1px solid #ddd8ce',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* fade top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_H,
        background: 'linear-gradient(to bottom, #faf7f2, transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      {/* fade bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_H,
        background: 'linear-gradient(to top, #faf7f2, transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      <div
        ref={listRef}
        onScroll={handleScroll}
        style={{
          height: '100%', overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          paddingTop: ITEM_H,
          paddingBottom: ITEM_H,
        }}
      >
        {/* spacer top */}
        <div style={{ height: 0 }} />
        {items.map(item => (
          <div
            key={item}
            style={{
              height: ITEM_H, display: 'flex', alignItems: 'center', justifyContent: 'center',
              scrollSnapAlign: 'center',
              fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              color: item === selected ? '#3a3228' : '#9a8f82',
              fontWeight: item === selected ? 500 : 400,
              cursor: 'pointer', userSelect: 'none',
            }}
            onClick={() => { onSelect(item); scrollTo(items.indexOf(item)); }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Time picker state helpers ────────────────────────────────────────────────

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const AMPM = ['AM', 'PM'];

function timeToStr(startH: string, startM: string, startA: string, endH: string, endM: string, endA: string) {
  return `${startH}:${startM} – ${endH}:${endM} ${endA}`;
}

// Parse a time string like "9:00 – 10:00 AM" into sortable minutes (start time)
export function parseStartMinutes(timeStr: string): number {
  const clean = timeStr.replace(/~/g, '').trim();
  const dashIdx = clean.indexOf('–');
  const part = dashIdx !== -1 ? clean.slice(0, dashIdx).trim() : clean;
  // Try to find AM/PM from end part if not in start part
  const ampmMatch = clean.match(/(AM|PM)/i);
  const ampm = ampmMatch ? ampmMatch[1].toUpperCase() : 'AM';
  const m = part.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return 0;
  const partAmpm = m[3] ? m[3].toUpperCase() : ampm;
  let h = parseInt(m[1]);
  if (partAmpm === 'PM' && h !== 12) h += 12;
  if (partAmpm === 'AM' && h === 12) h = 0;
  return h * 60 + parseInt(m[2]);
}

// ── Main modal ───────────────────────────────────────────────────────────────

export function AddBlockModal({ onAdd, onClose }: AddBlockModalProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [section, setSection] = useState('');
  const [category, setCategory] = useState<Category>('work');
  const [badgeText, setBadgeText] = useState('');
  const [useTextInput, setUseTextInput] = useState(false);
  const [manualTime, setManualTime] = useState('');

  // Time picker state
  const now = new Date();
  const initHour = String(now.getHours() % 12 || 12);
  const initMin = String(now.getMinutes()).padStart(2, '0');
  const initAmpm = now.getHours() < 12 ? 'AM' : 'PM';
  const initEndHour = String((now.getHours() % 12) + 1 > 12 ? 1 : (now.getHours() % 12) + 1);

  const [startH, setStartH] = useState(initHour);
  const [startM, setStartM] = useState(initMin);
  const [startA, setStartA] = useState(initAmpm);
  const [endH, setEndH] = useState(initEndHour);
  const [endM, setEndM] = useState(initMin);
  const [endA, setEndA] = useState(initAmpm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const timeStr = useTextInput
      ? manualTime.trim()
      : timeToStr(startH, startM, startA, endH, endM, endA);
    onAdd({
      section: section.trim() || undefined,
      time: timeStr,
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      badge: badgeText.trim() ? { text: badgeText.trim(), color: 'amber' } : null,
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1px solid #ddd8ce', borderRadius: 8,
    fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: '#3a3228', outline: 'none',
    background: '#f5f0e8', boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(58,50,40,0.45)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div
        style={{
          background: '#faf7f2', borderRadius: '16px 16px 0 0',
          padding: '16px 20px 32px', width: '100%', maxWidth: 480,
          border: '1px solid #ddd8ce', maxHeight: '60vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 17, fontWeight: 600, color: '#3a3228' }}>Add Block</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9a8f82', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Time input mode toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button
              type="button"
              onClick={() => setUseTextInput(t => !t)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 10, color: '#9a8f82', fontFamily: 'DM Sans, sans-serif',
                textDecoration: 'underline', padding: 0,
              }}
            >
              {useTextInput ? 'Use rotary picker' : 'Type instead'}
            </button>
          </div>

          {useTextInput ? (
            <FieldRow label="Time">
              <input
                value={manualTime}
                onChange={e => setManualTime(e.target.value)}
                placeholder="9:00 – 10:00 AM"
                style={inputStyle}
              />
            </FieldRow>
          ) : (
            <>
              <FieldRow label="Start time">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: '#f5f0e8', borderRadius: 10, padding: '4px 8px' }}>
                  <Drum items={HOURS} selected={startH} onSelect={setStartH} width={52} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 18, color: '#3a3228', fontWeight: 500 }}>:</span>
                  <Drum items={MINUTES} selected={startM} onSelect={setStartM} width={52} />
                  <Drum items={AMPM} selected={startA} onSelect={setStartA} width={52} />
                </div>
              </FieldRow>
              <FieldRow label="End time">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: '#f5f0e8', borderRadius: 10, padding: '4px 8px' }}>
                  <Drum items={HOURS} selected={endH} onSelect={setEndH} width={52} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 18, color: '#3a3228', fontWeight: 500 }}>:</span>
                  <Drum items={MINUTES} selected={endM} onSelect={setEndM} width={52} />
                  <Drum items={AMPM} selected={endA} onSelect={setEndA} width={52} />
                </div>
              </FieldRow>
            </>
          )}

          <FieldRow label="Title *">
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Block title" style={inputStyle} />
          </FieldRow>

          <FieldRow label="Details">
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Duration, location, notes…" style={inputStyle} />
          </FieldRow>

          <FieldRow label="Category">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PICKER_CATEGORIES.map(cat => {
                const cfg = CATEGORY_CONFIG[cat];
                const selected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '5px 10px', borderRadius: 20,
                      border: selected ? `1.5px solid ${cfg.rowBorder}` : `1px solid ${cfg.rowBorder}`,
                      background: selected ? cfg.currentBg : cfg.rowBg,
                      cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans, sans-serif',
                      color: cfg.titleColor, fontWeight: selected ? 500 : 400,
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: cfg.rowBg, border: `1.5px solid ${cfg.rowBorder}`, display: 'inline-block' }} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </FieldRow>

          <FieldRow label="Section label (optional)">
            <input value={section} onChange={e => setSection(e.target.value)} placeholder="Morning, Evening…" style={inputStyle} />
          </FieldRow>

          <FieldRow label="Badge (optional)">
            <input value={badgeText} onChange={e => setBadgeText(e.target.value)} placeholder="closes 9:00 PM" style={inputStyle} />
          </FieldRow>

          <button
            type="submit"
            style={{
              width: '100%', padding: 13, background: '#3a3228', color: '#f5f0e8',
              border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', marginTop: 8,
            }}
          >
            Add to Schedule
          </button>
        </form>
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 500, color: '#9a8f82',
        textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 5,
        fontFamily: 'DM Sans, sans-serif',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}
