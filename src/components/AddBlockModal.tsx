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

// ── Shared drum constants ────────────────────────────────────────────────────

export const ITEM_H = 22; // compact cell height
export const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
export const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
export const AMPM = ['AM', 'PM'];

export function Drum({
  items,
  selected,
  onSelect,
  width = 44,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  width?: number;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  const scrollTo = (i: number) => {
    if (listRef.current) listRef.current.scrollTop = i * ITEM_H;
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
      <div style={{
        position: 'absolute', top: ITEM_H, left: 0, right: 0, height: ITEM_H,
        background: 'rgba(58,50,40,0.07)', borderRadius: 4,
        borderTop: '1px solid #ddd8ce', borderBottom: '1px solid #ddd8ce',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_H,
        background: 'linear-gradient(to bottom, #faf7f2, transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />
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
        {items.map(item => (
          <div
            key={item}
            style={{
              height: ITEM_H, display: 'flex', alignItems: 'center', justifyContent: 'center',
              scrollSnapAlign: 'center',
              fontFamily: 'DM Sans, sans-serif', fontSize: 12,
              color: item === selected ? '#3a3228' : '#b0a898',
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

function DrumRow({
  h, m, a, onH, onM, onA, label,
}: {
  h: string; m: string; a: string;
  onH: (v: string) => void; onM: (v: string) => void; onA: (v: string) => void;
  label: string;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <span style={{ fontSize: 9, color: '#9a8f82', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#f5f0e8', borderRadius: 8, padding: '2px 4px' }}>
        <Drum items={HOURS} selected={h} onSelect={onH} width={36} />
        <span style={{ fontSize: 13, color: '#3a3228', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>:</span>
        <Drum items={MINUTES} selected={m} onSelect={onM} width={36} />
        <Drum items={AMPM} selected={a} onSelect={onA} width={36} />
      </div>
    </div>
  );
}

// ── Parse helper (exported for useSchedule auto-sort) ────────────────────────

export function parseStartMinutes(timeStr: string): number {
  const clean = timeStr.replace(/~/g, '').trim();
  const dashIdx = clean.indexOf('–');
  const part = dashIdx !== -1 ? clean.slice(0, dashIdx).trim() : clean;
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

function timeToStr(sH: string, sM: string, sA: string, eH: string, eM: string, eA: string) {
  return `${sH}:${sM} – ${eH}:${eM} ${eA}`;
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

  const now = new Date();
  const initH = String(now.getHours() % 12 || 12);
  const initM = String(now.getMinutes()).padStart(2, '0');
  const initA = now.getHours() < 12 ? 'AM' : 'PM';
  const initEH = String((now.getHours() % 12) + 1 > 12 ? 1 : (now.getHours() % 12) + 1);

  const [startH, setStartH] = useState(initH);
  const [startM, setStartM] = useState(initM);
  const [startA, setStartA] = useState(initA);
  const [endH, setEndH] = useState(initEH);
  const [endM, setEndM] = useState(initM);
  const [endA, setEndA] = useState(initA);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const timeStr = useTextInput ? manualTime.trim() : timeToStr(startH, startM, startA, endH, endM, endA);
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
    width: '100%', padding: '7px 10px', border: '1px solid #ddd8ce', borderRadius: 7,
    fontSize: 12, fontFamily: 'DM Sans, sans-serif', color: '#3a3228', outline: 'none',
    background: '#f5f0e8', boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(58,50,40,0.35)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div
        style={{
          background: '#faf7f2', borderRadius: '14px 14px 0 0',
          padding: '12px 16px 24px', width: '100%', maxWidth: 480,
          border: '1px solid #ddd8ce', maxHeight: '50vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 15, fontWeight: 600, color: '#3a3228', margin: 0 }}>Add Block</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="button" onClick={() => setUseTextInput(t => !t)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 10, color: '#9a8f82', fontFamily: 'DM Sans, sans-serif',
              textDecoration: 'underline', padding: 0,
            }}>
              {useTextInput ? 'Use picker' : 'Type time'}
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9a8f82', lineHeight: 1, padding: 0 }}>×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Time section */}
          {useTextInput ? (
            <Row label="Time">
              <input value={manualTime} onChange={e => setManualTime(e.target.value)} placeholder="9:00 – 10:00 AM" style={inputStyle} />
            </Row>
          ) : (
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <DrumRow h={startH} m={startM} a={startA} onH={setStartH} onM={setStartM} onA={setStartA} label="Start" />
              <div style={{ width: 1, background: '#ddd8ce', alignSelf: 'stretch', marginTop: 16 }} />
              <DrumRow h={endH} m={endM} a={endA} onH={setEndH} onM={setEndM} onA={setEndA} label="End" />
            </div>
          )}

          {/* Title */}
          <Row label="Title *">
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Block title" style={inputStyle} />
          </Row>

          {/* Details */}
          <Row label="Details">
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Notes…" style={inputStyle} />
          </Row>

          {/* Category */}
          <Row label="Category">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {PICKER_CATEGORIES.map(cat => {
                const cfg = CATEGORY_CONFIG[cat];
                const sel = category === cat;
                return (
                  <button key={cat} type="button" onClick={() => setCategory(cat)} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 8px', borderRadius: 20,
                    border: sel ? `1.5px solid ${cfg.rowBorder}` : `1px solid ${cfg.rowBorder}`,
                    background: sel ? cfg.currentBg : cfg.rowBg,
                    cursor: 'pointer', fontSize: 10, fontFamily: 'DM Sans, sans-serif',
                    color: cfg.titleColor, fontWeight: sel ? 500 : 400,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: cfg.rowBg, border: `1.5px solid ${cfg.rowBorder}`, display: 'inline-block' }} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </Row>

          {/* Section + Badge inline */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Section</label>
              <input value={section} onChange={e => setSection(e.target.value)} placeholder="Morning…" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Badge</label>
              <input value={badgeText} onChange={e => setBadgeText(e.target.value)} placeholder="closes 9 PM" style={inputStyle} />
            </div>
          </div>

          <button type="submit" style={{
            width: '100%', padding: '10px', background: '#3a3228', color: '#f5f0e8',
            border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', marginTop: 4,
          }}>
            Add to Schedule
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 500, color: '#9a8f82',
  textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 4,
  fontFamily: 'DM Sans, sans-serif',
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}
