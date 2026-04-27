import React from 'react';
import { formatDate, todayStr } from '../storage';

interface HeaderProps {
  currentDate: string;
  canGoPrev: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  editMode: boolean;
  onToggleEdit: () => void;
  onAdd: () => void;
  dayActions: React.ReactNode;
}

export function Header({
  currentDate, canGoPrev, onPrev, onNext, onToday, editMode, onToggleEdit, onAdd, dayActions,
}: HeaderProps) {
  const isToday = currentDate === todayStr();
  const formatted = formatDate(currentDate);

  return (
    <div style={{ paddingBottom: 0 }}>
      {/* Date navigation row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        {/* Prev arrow — only shown when we can go back (i.e. we're on a future date) */}
        <button
          onClick={canGoPrev ? onPrev : undefined}
          style={{
            background: 'none', border: 'none',
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: canGoPrev ? '#9a8f82' : 'transparent',
            fontSize: 18, borderRadius: 8,
            cursor: canGoPrev ? 'pointer' : 'default',
            flexShrink: 0,
          }}
          aria-hidden={!canGoPrev}
        >
          ‹
        </button>

        {/* Date + Edit inline */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <h1 style={{
              fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 600, color: '#3a3228',
              letterSpacing: '0.01em', margin: 0, lineHeight: 1.2,
            }}>
              {formatted}
            </h1>
            <button
              onClick={onToggleEdit}
              style={{
                display: 'flex', alignItems: 'center', gap: 3,
                padding: '4px 10px',
                background: editMode ? '#e8e0d4' : 'transparent',
                color: editMode ? '#3a3228' : '#9a8f82',
                border: `1px solid ${editMode ? '#ccc0ae' : '#ddd8ce'}`,
                borderRadius: 20, fontSize: 11,
                fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                fontWeight: editMode ? 500 : 400,
                flexShrink: 0,
              }}
            >
              {editMode ? '✓ Done' : 'Edit'}
            </button>
          </div>

          {!isToday && (
            <button
              onClick={onToday}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
                fontSize: 11, color: '#7a6f62', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500, letterSpacing: '0.02em', marginTop: 2,
              }}
            >
              ← Today
            </button>
          )}
        </div>

        {/* Next arrow */}
        <button
          onClick={onNext}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9a8f82', fontSize: 18, borderRadius: 8, flexShrink: 0,
          }}
        >
          ›
        </button>
      </div>

      {/* Edit toolbar — only visible in edit mode */}
      {editMode && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12,
        }}>
          <button
            onClick={onAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px',
              background: '#3a3228', color: '#f5f0e8', border: 'none', borderRadius: 20,
              fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, cursor: 'pointer',
            }}
          >
            + Add Block
          </button>
          {dayActions}
        </div>
      )}
    </div>
  );
}
