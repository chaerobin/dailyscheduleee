import React, { useState } from 'react';

interface SurveyForm {
  date: string;
  meetings: string;
  errands: string;
  tasks: string;
  workout: string;
  workStart: string;
  bedtime: string;
  flex: string;
  other: string;
}

const EMPTY: SurveyForm = {
  date: '', meetings: '', errands: '', tasks: '',
  workout: '', workStart: '', bedtime: '', flex: '', other: '',
};

function todayValue() {
  return new Date().toISOString().split('T')[0];
}

function formatDateLabel(val: string) {
  if (!val) return 'Not specified';
  const [y, m, d] = val.split('-');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  return `${days[dt.getDay()]}, ${months[Number(m)-1]} ${parseInt(d)}, ${y}`;
}

function buildPrompt(f: SurveyForm) {
  return [
    `📅 Schedule Request — ${formatDateLabel(f.date)}`,
    ``,
    `Work meetings: ${f.meetings || 'None'}`,
    `Errands / Appointments: ${f.errands || 'None'}`,
    `Tasks today: ${f.tasks || 'None'}`,
    `Workout: ${f.workout || 'Not specified'}`,
    `Work start: ${f.workStart || '9am (default)'}`,
    `Going to sleep tonight (night before ${formatDateLabel(f.date)}): ${f.bedtime || 'Not specified'}`,
    `Flexible today: ${f.flex || 'Nothing noted'}`,
    `Other notes: ${f.other || 'None'}`,
  ].join('\n');
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function SurveyPage() {
  const [form, setForm] = useState<SurveyForm>({ ...EMPTY, date: todayValue() });
  const set = (field: keyof SurveyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleReset = () => {
    setForm({ ...EMPTY, date: todayValue() });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: '1px solid #ddd8ce', fontFamily: 'DM Sans, sans-serif',
    fontSize: 13, color: '#3a3228', padding: '4px 0 6px', outline: 'none',
  };

  if (status === 'sent') {
    return (
      <div style={{
        background: '#f5f0e8', minHeight: '100vh', maxWidth: 393, margin: '0 auto',
        padding: '48px 20px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>✓</div>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: 18, color: '#3a3228', marginBottom: 8 }}>
          Submitted
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#7a6f62', lineHeight: 1.6, marginBottom: 32 }}>
          Your schedule request has been saved. Head to your chat with your AI assistant and ask it to check your survey to build today's schedule.
        </p>
        <button
          onClick={handleReset}
          style={{
            padding: '11px 28px', background: '#3a3228', color: '#f5f0e8',
            border: 'none', borderRadius: 8, fontFamily: 'DM Sans, sans-serif',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          New Request
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#f5f0e8', minHeight: '100vh', maxWidth: 393, margin: '0 auto',
      padding: '16px 14px 100px',
    }}>
      <h1 style={{
        fontFamily: 'Lora, serif', fontSize: 18, color: '#3a3228',
        textAlign: 'center', marginBottom: 20,
      }}>
        Plan My Day
      </h1>

      <form onSubmit={e => e.preventDefault()}>
        <Field label="Date" hint={undefined}>
          <input type="date" value={form.date} onChange={set('date')} style={inputStyle} />
        </Field>

        <Field label="Work Meetings" hint="Include name, start time, and end time for each">
          <input
            type="text" value={form.meetings} onChange={set('meetings')}
            placeholder="e.g. 9:35–10am Jeff & Chantel Touchpoint, 2:45–3:30pm DFS Migrations"
            style={inputStyle}
          />
        </Field>

        <Field label="Errands / Appointments / Outside Commitments" hint="Include location, duration, and whether you can multi-task during">
          <input
            type="text" value={form.errands} onChange={set('errands')}
            placeholder="e.g. Gold's Gym recovery 40 min (can multi-task), grocery run"
            style={inputStyle}
          />
        </Field>

        <Field label="Tasks to Get Done Today" hint="Include carry-overs from yesterday & estimated times for completion">
          <input
            type="text" value={form.tasks} onChange={set('tasks')}
            placeholder="e.g. Wedding planning 2–3 hrs, taxes (carry-over)"
            style={inputStyle}
          />
        </Field>

        <Field label="Workout" hint="Include type, duration, and location information">
          <input
            type="text" value={form.workout} onChange={set('workout')}
            placeholder="e.g. Ladder 40 min, Barry's 7am, rest day"
            style={inputStyle}
          />
        </Field>

        <Field label="Work Start Time" hint="Leave blank if 9am. Note if you want an early start.">
          <input
            type="text" value={form.workStart} onChange={set('workStart')}
            placeholder="e.g. 7:15am (offsetting midday workout)"
            style={inputStyle}
          />
        </Field>

        <Field label="Going to Sleep At" hint="The time you're closing your eyes right now — I'll use this to calculate your wake-up time">
          <input
            type="text" value={form.bedtime} onChange={set('bedtime')}
            placeholder="e.g. 11pm, 12:30am"
            style={inputStyle}
          />
        </Field>

        <Field label="Anything Flexible Today?" hint={undefined}>
          <input
            type="text" value={form.flex} onChange={set('flex')}
            placeholder="e.g. Work start can shift, evening is open"
            style={inputStyle}
          />
        </Field>

        <Field label="Anything Else Your AI Assistant Should Know" hint="Low energy, skip outdoor walk, guests, early commitments, etc.">
          <input
            type="text" value={form.other} onChange={set('other')}
            placeholder="e.g. Low energy day, skipping outdoor walk"
            style={inputStyle}
          />
        </Field>

        <div style={{ display: 'flex', gap: 0, marginTop: 8 }}>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(buildPrompt(form)).catch(() => {});
            }}
            style={{
              flex: 1, padding: 10, background: 'transparent', color: '#b0a898',
              border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 11, cursor: 'pointer',
            }}
          >
            Copy
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              flex: 1, padding: 10, background: 'transparent', color: '#b0a898',
              border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 11, cursor: 'pointer',
            }}
          >
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#faf7f2', border: '1px solid #ddd8ce', borderRadius: 8,
      padding: '10px 12px', marginBottom: 8,
    }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 500, color: '#7a6f62',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: hint ? 4 : 6,
      }}>
        {label}
      </label>
      {hint && (
        <p style={{
          fontSize: 10, color: '#b0a898', fontWeight: 300, marginBottom: 6, lineHeight: 1.4,
        }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}
