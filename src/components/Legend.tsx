import React from 'react';

const LEGEND = [
  { color: '#c8d8c0', border: '#b8ccb0', label: 'Work' },
  { color: '#ccd4e0', border: '#bcc8d8', label: 'Wellness / Breaks' },
  { color: '#e0cdd4', border: '#d4bfc8', label: 'Out & About' },
  { color: '#e0d0bc', border: '#d4c4ac', label: 'Key Moments' },
];

export function Legend() {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16, justifyContent: 'center',
    }}>
      {LEGEND.map(({ color, border, label }) => (
        <div key={label} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 10, color: '#5a5248', fontFamily: 'DM Sans, sans-serif',
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: 2, flexShrink: 0,
            background: color, border: `1.5px solid ${border}`,
          }} />
          {label}
        </div>
      ))}
    </div>
  );
}
