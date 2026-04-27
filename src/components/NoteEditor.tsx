import React, { useState } from 'react';

interface NoteEditorProps {
  note: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

export function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const [draft, setDraft] = useState(note);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div
        style={{
          background: '#fff', borderRadius: '16px 16px 0 0', padding: '24px 20px 40px',
          width: '100%', maxWidth: 480,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 17, fontWeight: 600, color: '#1a1a1a' }}>Day Note</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        </div>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Add a note for this day — intentions, reminders, thoughts…"
          rows={5}
          autoFocus
          style={{
            width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0',
            borderRadius: 8, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
            color: '#1a1a1a', resize: 'vertical', outline: 'none',
            background: '#fafafa', lineHeight: 1.5,
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            onClick={() => { onSave(draft); onClose(); }}
            style={{
              flex: 1, padding: 12, background: '#1a1a1a', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
            }}
          >
            Save Note
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px', background: 'transparent', color: '#666',
              border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13,
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
