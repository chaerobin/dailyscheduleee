import React, { useState } from 'react';
import { formatDate } from '../storage';

interface DayActionsMenuProps {
  currentDate: string;
  onClear: () => void;
  onReset: () => void;
  onDuplicateFrom: (date: string) => void;
  datesWithSchedules: string[];
}

export function DayActionsMenu({ currentDate, onClear, onReset, onDuplicateFrom, datesWithSchedules }: DayActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);

  const otherDates = datesWithSchedules.filter(d => d !== currentDate);

  const sheetStyle: React.CSSProperties = {
    background: '#faf7f2', borderRadius: '16px 16px 0 0',
    padding: '24px 20px 44px', width: '100%', maxWidth: 480,
    border: '1px solid #ddd8ce',
  };

  const cancelBtn: React.CSSProperties = {
    marginTop: 14, width: '100%', padding: 12,
    border: '1px solid #ddd8ce', borderRadius: 8,
    background: 'transparent', cursor: 'pointer',
    fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: '#7a6f62',
  };

  if (showDuplicate) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(58,50,40,0.45)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }} onClick={() => setShowDuplicate(false)}>
        <div style={sheetStyle} onClick={e => e.stopPropagation()}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 17, fontWeight: 600, color: '#3a3228', marginBottom: 16 }}>
            Copy from…
          </h2>
          {otherDates.length === 0 ? (
            <p style={{ color: '#9a8f82', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>No other days with schedules yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {otherDates.map(d => (
                <button
                  key={d}
                  onClick={() => { onDuplicateFrom(d); setShowDuplicate(false); setOpen(false); }}
                  style={{
                    textAlign: 'left', padding: '12px 16px', border: '1px solid #ddd8ce',
                    borderRadius: 8, background: '#f5f0e8', cursor: 'pointer',
                    fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: '#3a3228',
                  }}
                >
                  {formatDate(d)}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setShowDuplicate(false)} style={cancelBtn}>Cancel</button>
        </div>
      </div>
    );
  }

  if (open) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(58,50,40,0.45)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }} onClick={() => setOpen(false)}>
        <div style={sheetStyle} onClick={e => e.stopPropagation()}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 17, fontWeight: 600, color: '#3a3228', marginBottom: 16 }}>
            Day Options
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <MenuBtn label="Copy from another day" onClick={() => setShowDuplicate(true)} />
            <MenuBtn
              label="Reset to default"
              onClick={() => {
                if (confirm('Reset this day to the default schedule? Any changes will be lost.')) {
                  onReset();
                  setOpen(false);
                }
              }}
            />
            <MenuBtn
              label="Clear this day"
              onClick={() => { if (confirm('Clear all blocks from this day?')) { onClear(); setOpen(false); } }}
              danger
            />
          </div>
          <button onClick={() => setOpen(false)} style={cancelBtn}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      style={{
        background: 'transparent', border: '1px solid #ddd8ce',
        borderRadius: 20, cursor: 'pointer',
        padding: '4px 10px', fontSize: 14, color: '#9a8f82',
        fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em',
        lineHeight: 1,
      }}
      title="Day options"
    >
      ···
    </button>
  );
}

function MenuBtn({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 16px', border: '1px solid #ddd8ce', borderRadius: 8,
        background: '#f5f0e8', cursor: 'pointer', width: '100%',
        fontSize: 13, fontFamily: 'DM Sans, sans-serif',
        color: danger ? '#8a3a3a' : '#3a3228', textAlign: 'left',
      }}
    >
      {label}
    </button>
  );
}
