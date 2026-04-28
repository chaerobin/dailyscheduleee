import React, { useState } from 'react';
import { useSchedule } from './useSchedule';
import { Header } from './components/Header';
import { Legend } from './components/Legend';
import { Timeline } from './components/Timeline';
import { AddBlockModal } from './components/AddBlockModal';
import { DayActionsMenu } from './components/DayActionsMenu';
import { SurveyPage } from './components/SurveyPage';

type Tab = 'schedule' | 'plan';

export function SchedulePage() {
  const {
    blocks, currentDate, canGoPrev, goToday, goNext, goPrev,
    addBlock, updateBlock, deleteBlock, reorderBlocks,
    clearDay, resetDay, duplicateDay, datesWithSchedules,
  } = useSchedule();

  const [editMode, setEditMode] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState<Tab>('schedule');

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh' }}>
      {/* Both tabs stay mounted so Survey form state is preserved across tab switches */}
      <div style={{ display: tab === 'schedule' ? 'block' : 'none' }}>
        <div style={{
          maxWidth: 393, margin: '0 auto',
          padding: `16px 12px calc(44px + env(safe-area-inset-bottom))`, animation: 'fadeIn 0.25s ease',
        }}>
          <Header
            currentDate={currentDate}
            canGoPrev={canGoPrev}
            onPrev={goPrev}
            onNext={goNext}
            onToday={goToday}
            editMode={editMode}
            onToggleEdit={() => setEditMode(e => !e)}
            onAdd={() => setShowAdd(true)}
            dayActions={
              <DayActionsMenu
                currentDate={currentDate}
                onClear={clearDay}
                onReset={resetDay}
                onDuplicateFrom={duplicateDay}
                datesWithSchedules={datesWithSchedules}
              />
            }
          />
          <Legend />
          <Timeline
            blocks={blocks}
            editMode={editMode}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
            onMoveUp={idx => reorderBlocks(idx, idx - 1)}
            onMoveDown={idx => reorderBlocks(idx, idx + 1)}
          />
          {showAdd && (
            <AddBlockModal
              onAdd={addBlock}
              onClose={() => setShowAdd(false)}
            />
          )}
        </div>
      </div>
      <div style={{ display: tab === 'plan' ? 'block' : 'none' }}>
        <SurveyPage />
      </div>

      {/* Bottom nav — kept minimal to maximise schedule real estate */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#faf7f2', borderTop: '1px solid #ddd8ce',
        display: 'flex', justifyContent: 'center',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
      }}>
        <NavTab
          label="Schedule"
          active={tab === 'schedule'}
          onClick={() => setTab('schedule')}
        />
        <NavTab
          label="Plan Day"
          active={tab === 'plan'}
          onClick={() => setTab('plan')}
        />
      </div>
    </div>
  );
}

function NavTab({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, maxWidth: 140, padding: '6px 0 5pt',
        background: 'transparent', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      }}
    >
      <span style={{
        fontSize: 10, fontFamily: 'DM Sans, sans-serif',
        color: active ? '#3a3228' : '#b0a898',
        fontWeight: active ? 500 : 400,
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {label}
      </span>
      {active && (
        <div style={{ width: 16, height: 1.5, borderRadius: 1, background: '#3a3228' }} />
      )}
    </button>
  );
}
