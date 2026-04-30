import React, { useState } from 'react';
import type { ScheduleBlock as ScheduleBlockType, Category } from '../types';
import { CATEGORY_CONFIG } from '../categoryConfig';
import { EditableField } from './EditableField';

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

export function ScheduleBlockItem({
  block, isLast, editMode, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isCurrent,
}: ScheduleBlockProps) {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const cfg = CATEGORY_CONFIG[block.category];

  const handleUpdate = (field: keyof ScheduleBlockType, val: string) => {
    onUpdate(block.id, { [field]: val });
  };

  // Current time: use a deeper/darker variant of the row's own color
  const borderColor = isCurrent && !editMode ? cfg.currentBorder : cfg.rowBorder;
  const rowBg = isCurrent && !editMode ? cfg.currentBg : cfg.rowBg;

  const isActive = isCurrent && !editMode;

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'stretch',
        background: rowBg,
        borderTop: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        borderLeft: isActive ? `3px solid ${cfg.currentBorder}` : `1px solid ${borderColor}`,
        borderRadius: 8,
        marginBottom: 4,
        minHeight: 44,
        overflow: 'hidden',
        transition: 'background 0.2s, border-color 0.2s',
      }}>
        {/* Time column */}
        <div
          style={{
            width: 88, minWidth: 88,
            fontSize: 10.5, color: cfg.timeColor,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 400,
            padding: '8px 8px 8px 10px',
            display: 'flex', alignItems: 'center', lineHeight: 1.3,
            borderRight: `1px solid ${borderColor}`,
            flexShrink: 0,
            cursor: editMode ? 'pointer' : 'default',
          }}
          onClick={editMode ? () => setShowCategoryPicker(true) : undefined}
          title={editMode ? 'Tap time to change category' : undefined}
        >
          {editMode ? (
            <EditableField
              value={block.time}
              onSave={v => handleUpdate('time', v)}
              placeholder="Time"
              editMode={editMode}
              className=""
            />
          ) : (
            block.time
          )}
        </div>

        {/* Task column */}
        <div style={{
          flex: 1, padding: '8px 10px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 500, color: cfg.titleColor,
            lineHeight: 1.3, fontFamily: 'DM Sans, sans-serif',
          }}>
            {editMode ? (
              <EditableField
                value={block.title}
                onSave={v => handleUpdate('title', v)}
                placeholder="Title"
                editMode={editMode}
                className=""
              />
            ) : (
              block.title
            )}
          </div>

          {(block.subtitle || editMode) && (
            <div style={{
              fontSize: 10.5, color: cfg.subtitleColor,
              marginTop: 2, lineHeight: 1.35, fontFamily: 'DM Sans, sans-serif', fontWeight: 300,
            }}>
              {editMode ? (
                <EditableField
                  value={block.subtitle}
                  onSave={v => handleUpdate('subtitle', v)}
                  placeholder="Details (optional)"
                  editMode={editMode}
                  className=""
                  multiline
                />
              ) : (
                block.subtitle
              )}
            </div>
          )}

          {block.badge && (
            <div style={{ marginTop: 4 }}>
              <span style={{
                display: 'inline-block', fontSize: 9.5, fontWeight: 500,
                padding: '2px 7px', borderRadius: 20,
                background: '#f0dfc0', color: '#7a4a10',
                letterSpacing: '0.01em',
              }}>
                {editMode ? (
                  <EditableField
                    value={block.badge.text}
                    onSave={v => onUpdate(block.id, { badge: { ...block.badge!, text: v } })}
                    editMode={editMode}
                    className=""
                    placeholder="Badge text"
                  />
                ) : (
                  block.badge.text
                )}
              </span>
              {editMode && (
                <button
                  onClick={() => onUpdate(block.id, { badge: null })}
                  style={{ marginLeft: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#9a5a5a' }}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {editMode && !block.badge && (
            <button
              onClick={() => onUpdate(block.id, { badge: { text: 'note', color: 'amber' } })}
              style={{
                marginTop: 4, background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 10, color: '#9a8f82', fontFamily: 'DM Sans, sans-serif', padding: 0, textAlign: 'left',
              }}
            >
              + badge
            </button>
          )}
        </div>

        {/* Edit controls */}
        {editMode && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 6px 6px 0',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              style={{
                background: 'rgba(255,255,255,0.6)', border: `1px solid ${cfg.rowBorder}`,
                borderRadius: 4, padding: '2px 5px', cursor: isFirst ? 'not-allowed' : 'pointer',
                fontSize: 10, color: cfg.timeColor, opacity: isFirst ? 0.35 : 0.8,
              }}
            >↑</button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              style={{
                background: 'rgba(255,255,255,0.6)', border: `1px solid ${cfg.rowBorder}`,
                borderRadius: 4, padding: '2px 5px', cursor: isLast ? 'not-allowed' : 'pointer',
                fontSize: 10, color: cfg.timeColor, opacity: isLast ? 0.35 : 0.8,
              }}
            >↓</button>
            <button
              onClick={() => { if (confirm('Delete this block?')) onDelete(block.id); }}
              style={{
                background: 'rgba(255,255,255,0.6)', border: '1px solid #d4bfc8',
                borderRadius: 4, padding: '2px 5px', cursor: 'pointer', fontSize: 10, color: '#9a3a4a',
              }}
            >✕</button>
          </div>
        )}
      </div>

      {/* Category picker sheet */}
      {showCategoryPicker && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(58,50,40,0.45)', zIndex: 1000,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }} onClick={() => setShowCategoryPicker(false)}>
          <div
            style={{
              background: '#faf7f2', borderRadius: '16px 16px 0 0',
              padding: '20px 20px 44px', width: '100%', maxWidth: 480,
              border: '1px solid #ddd8ce',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{
              fontFamily: 'Lora, serif', fontSize: 16, fontWeight: 600,
              color: '#3a3228', marginBottom: 14,
            }}>
              Category
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PICKER_CATEGORIES.map(cat => {
                const c = CATEGORY_CONFIG[cat];
                const isSelected = cat === block.category;
                return (
                  <button
                    key={cat}
                    onClick={() => { onUpdate(block.id, { category: cat }); setShowCategoryPicker(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px',
                      border: isSelected ? `1.5px solid ${c.rowBorder}` : `1px solid ${c.rowBorder}`,
                      borderRadius: 8,
                      background: isSelected ? c.currentBg : c.rowBg,
                      cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif',
                      color: c.titleColor,
                      fontWeight: isSelected ? 500 : 400,
                    }}
                  >
                    <span style={{
                      width: 10, height: 10, borderRadius: 2,
                      background: c.rowBg, border: `1.5px solid ${c.rowBorder}`,
                      display: 'inline-block', flexShrink: 0,
                    }} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
