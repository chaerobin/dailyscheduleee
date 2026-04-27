import React, { useRef, useEffect, useState } from 'react';

interface EditableFieldProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  editMode: boolean;
}

export function EditableField({ value, onSave, className = '', placeholder = '', multiline = false, editMode }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [editing]);

  if (!editMode) {
    return <span className={className}>{value || <span style={{ color: '#ccc' }}>{placeholder}</span>}</span>;
  }

  if (!editing) {
    return (
      <span
        className={className}
        onClick={() => setEditing(true)}
        style={{ cursor: 'text', borderBottom: '1px dashed #ddd', minWidth: 40, display: 'inline-block' }}
      >
        {value || <span style={{ color: '#ccc' }}>{placeholder}</span>}
      </span>
    );
  }

  const handleBlur = () => {
    setEditing(false);
    onSave(draft);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      setEditing(false);
      onSave(draft);
    }
    if (e.key === 'Escape') {
      setEditing(false);
      setDraft(value);
    }
  };

  if (multiline) {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        placeholder={placeholder}
        rows={2}
        style={{
          background: 'transparent',
          border: '1px solid #ddd',
          borderRadius: 4,
          padding: '2px 4px',
          resize: 'none',
          width: '100%',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          color: 'inherit',
          lineHeight: 'inherit',
          outline: 'none',
        }}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type="text"
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
      placeholder={placeholder}
      style={{
        background: 'transparent',
        border: '1px solid #ddd',
        borderRadius: 4,
        padding: '2px 4px',
        width: '100%',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        color: 'inherit',
        lineHeight: 'inherit',
        outline: 'none',
      }}
    />
  );
}
