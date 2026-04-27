import React, { useState } from 'react';
import type { Category, Badge } from '../types';
import { CATEGORY_CONFIG } from '../categoryConfig';

// Only the categories a user can manually add — no Home/Drive, Out & About shown once
const PICKER_CATEGORIES: Category[] = ['work', 'fitness', 'errand', 'key'];

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

export function AddBlockModal({ onAdd, onClose }: AddBlockModalProps) {
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [section, setSection] = useState('');
  const [category, setCategory] = useState<Category>('work');
  const [badgeText, setBadgeText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      section: section.trim() || undefined,
      time: time.trim(),
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
    background: '#f5f0e8',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(58,50,40,0.45)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div
        style={{
          background: '#faf7f2', borderRadius: '16px 16px 0 0',
          padding: '24px 20px 44px', width: '100%', maxWidth: 480,
          border: '1px solid #ddd8ce',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 17, fontWeight: 600, color: '#3a3228' }}>Add Block</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9a8f82', lineHeight: 1 }}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <FieldRow label="Section label (optional)">
            <input value={section} onChange={e => setSection(e.target.value)} placeholder="Morning, Evening…" style={inputStyle} />
          </FieldRow>
          <FieldRow label="Time">
            <input value={time} onChange={e => setTime(e.target.value)} placeholder="9:00 – 10:00 AM" style={inputStyle} />
          </FieldRow>
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
    <div style={{ marginBottom: 14 }}>
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
