import type { ScheduleBlock } from './types';
import { todayStr } from './storage';

function b(
  date: string,
  time: string,
  title: string,
  subtitle: string,
  category: ScheduleBlock['category'],
  section?: string,
  badge?: ScheduleBlock['badge'],
): ScheduleBlock {
  return { id: crypto.randomUUID(), date, section, time, title, subtitle, category, badge };
}

function getApr11Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '7:00 – 7:15 AM', 'Morning routine', '15 min · brush teeth, wash face', 'home', 'Morning'),
    b(date, '9:00 – 9:30 AM', 'Wedding planning meeting', '30 min', 'home'),
    b(date, '~10:30 – 11:00 AM', 'Tattoo removal', '30 min appointment', 'errand'),
    b(date, '11:45 AM – 12:15 PM', 'Apple Store', 'Tysons Corner Center · ~45 min drive from tattoo removal', 'errand', 'Afternoon'),
    b(date, '12:15 – 12:45 PM', 'Mango', 'Tysons Corner Center', 'errand'),
    b(date, '12:45 – 1:15 PM', 'Sephora', 'Tysons Corner Center', 'errand'),
    b(date, '1:40 – 1:55 PM', 'Firebirds', 'Gift card · ~25 min south on I-495', 'errand', undefined, { text: '7027A Manchester Blvd, Franconia, VA 22310', color: 'amber' }),
    b(date, '2:25 – 3:25 PM', 'Costco', '~30 min north on I-395 from Firebirds', 'errand', undefined, { text: '1200 S Fern St, Arlington, VA 22202', color: 'amber' }),
    b(date, '3:45 – 4:10 PM', 'Whole Foods', 'Last stop before home · ~10 min from Costco', 'errand', undefined, { text: '520 12th St S, Arlington, VA 22202', color: 'amber' }),
    b(date, '4:15 – 4:50 PM', 'Lunch + unpack groceries', 'At home', 'home'),
    b(date, '4:50 – 5:05 PM', 'Outdoor walk', '~15 min mental reset', 'fitness'),
    b(date, '5:05 – 7:05 PM', 'Tax prep', '2 hours', 'work'),
    b(date, '7:05 – 7:35 PM', 'Dinner', '30 min', 'home', 'Evening'),
    b(date, '8:00 – 9:30 PM', 'Meal prep', '1.5 hours', 'home'),
    b(date, '9:30 – 10:00 PM', 'Shower + exfoliate', '30 min', 'home'),
    b(date, '10:00 – 10:20 PM', 'ZIIP Halo', '20 min · bare face · paired with bedtime', 'fitness'),
    b(date, '10:20 – 10:30 PM', 'Bedtime routine', '10 min', 'home'),
    b(date, '11:00 PM', 'Lights out', '8 hours sleep target', 'key'),
  ];
}

function getApr13Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '9:00 AM – 12:30 PM', 'Work Block', 'Morning work session', 'work', 'Work'),
    b(date, '12:30 – 3:30 PM', 'Work Block', 'Afternoon work session', 'work'),
    b(date, '3:30 – 3:45 PM', 'Morning Routine', 'Brush teeth, wash face — start heating food at the same time', 'home'),
    b(date, '3:45 – 4:15 PM', 'Late Lunch + Calls', 'Call Dr. Rodney\'s office + Chase — offices close at 5, do this now; eat while you talk', 'home'),
    b(date, '4:15 – 4:30 PM', 'Outdoor Walk', 'Mental break #1 — 15 min reset before taxes', 'fitness'),
    b(date, '4:30 – 6:30 PM', 'Taxes', '2-hr focus block — deadline is tomorrow, guard this window; walk on your walking pad while you work', 'home'),
    b(date, '6:30 – 6:45 PM', 'Outdoor Walk', 'Mental break #2 — decompress after taxes', 'fitness', 'Evening'),
    b(date, '6:45 – 7:30 PM', 'Dinner', 'Heat + eat', 'home'),
    b(date, '7:30 – 8:00 PM', 'StretchIt', '30 min stretch session', 'fitness'),
    b(date, '8:00 – 8:30 PM', 'Shower', '30 min post-stretch', 'home'),
    b(date, '8:30 – 8:35 PM', 'Daily Review + Gratitude', '5 min — find something to appreciate about today', 'home'),
    b(date, '8:35 – 8:50 PM', 'Bedtime Routine', 'Wind down', 'home'),
    b(date, '8:50 – 9:00 PM', 'Lights Out', '', 'key'),
  ];
}

function getGenericSchedule(date: string): ScheduleBlock[] {
  return [
    b(date, '7:00 – 7:15 AM', 'Morning routine', '15 min · brush teeth, wash face', 'home', 'Morning'),
    b(date, '7:15 – 7:35 AM', 'Red light therapy + ZIIP Halo', '20 min · bare face required', 'fitness'),
    b(date, '9:00 AM', 'Work starts', 'Walking pad on during work blocks', 'work', 'Work'),
    b(date, '10:00 AM', 'Outdoor walk', '~10 min mental break', 'fitness'),
    b(date, '12:30 – 1:00 PM', 'Lunch', '10–15 min prep · 30 min to eat · goal finish by 6pm for dinner', 'home'),
    b(date, '2:00 PM', 'Outdoor walk', '~10 min mental break', 'fitness'),
    b(date, '4:00 – 5:00 PM', 'Ladder app workout', '1 hour · building gym', 'fitness'),
    b(date, '5:00 – 5:40 PM', "Gold's Gym — recovery room", '40 min · up the street', 'fitness', 'Evening'),
    b(date, '5:40 – 6:15 PM', 'Shower + get ready', '35 min · exfoliation · at home', 'home'),
    b(date, '6:30 – 7:00 PM', 'Dinner', '30 min · goal finish by 7pm', 'home'),
    b(date, '~8:00 PM', 'Outdoor walk', '~10 min mental break · 3rd of the day', 'fitness'),
    b(date, '~9:30 PM', 'Day review + gratitude journal', '5 min · end of day ritual', 'home'),
    b(date, '~10:00 PM', 'Electronics off', '1 hour before bed target', 'key'),
    b(date, '10:15 – 10:30 PM', 'Bedtime routine', '15 min', 'home'),
    b(date, '11:00 PM', 'Lights out', '8 hours sleep target', 'key'),
  ];
}

function getApr14Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '8:30 – 8:45 AM', 'Morning Routine', 'Brush teeth, wash face', 'home', 'Morning'),
    b(date, '8:45 – 9:00 AM', 'Breakfast', 'Heat + eat at your desk once work starts', 'home'),
    b(date, '9:00 – 10:35 AM', 'Work Block', 'Walking pad for steps', 'work', 'Work'),
    b(date, '10:35 – 11:05 AM', 'Touchpoint — Paul', 'Weekly sync', 'work'),
    b(date, '11:05 – 11:20 AM', 'Outdoor Walk', 'Mental break #1 — perfect gap before Jennifer', 'fitness'),
    b(date, '11:20 – 11:35 AM', 'Work Block', 'Walking pad', 'work'),
    b(date, '11:35 AM – 12:05 PM', 'Touchpoint — Jennifer', 'Weekly sync', 'work'),
    b(date, '12:05 – 12:45 PM', 'Lunch', 'Heat + eat', 'home'),
    b(date, '12:45 – 1:00 PM', 'Outdoor Walk', 'Mental break #2', 'fitness'),
    b(date, '1:00 – 3:35 PM', 'Work Block', 'Walking pad for steps', 'work'),
    b(date, '3:35 – 4:05 PM', 'Business/Tech Touchpoint', 'Weekly sync', 'work'),
    b(date, '4:05 – 4:20 PM', 'Outdoor Walk', 'Mental break #3', 'fitness'),
    b(date, '4:20 – 5:00 PM', 'Work Wrap-Up', 'EOD', 'work'),
    b(date, '5:00 – 5:10 PM', 'Refill Pill Case', 'Quick 10 min', 'home', 'Evening'),
    b(date, '5:10 – 6:10 PM', 'Tax Review', '1-hr review — while your brain is still fresh', 'home'),
    b(date, '6:10 – 7:00 PM', 'Ladder', '50 min', 'fitness'),
    b(date, '7:00 – 7:45 PM', 'Shower', '45 min post-workout', 'home'),
    b(date, '7:45 – 8:15 PM', 'StretchIt', '30 min stretch session', 'fitness'),
    b(date, '8:15 – 10:15 PM', 'Cook + Dinner', '2 hrs — eat as you go', 'home'),
    b(date, '10:15 – 10:20 PM', 'Day Review + Gratitude', '5 min', 'home'),
    b(date, '10:20 – 10:55 PM', 'Bedtime Routine + Red Light + ZIIP', '15 min routine + 20 min skincare — bare face for ZIIP', 'home'),
    b(date, '10:55 – 11:00 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr15Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '7:45 – 8:00 AM', 'Morning Routine', 'Brush teeth, wash face', 'home', 'Morning'),
    b(date, '8:00 – 8:25 AM', 'Makeup Practice', 'Post-face-wash — shower is tonight', 'home'),
    b(date, '8:25 – 9:00 AM', 'Breakfast', 'Heat + eat at your desk once work starts', 'home'),
    b(date, '9:00 – 9:35 AM', 'Work Block', 'Walking pad for steps', 'work', 'Work'),
    b(date, '9:35 – 10:00 AM', 'Chantel/Jeff Weekly', '10/10', 'work'),
    b(date, '10:05 – 10:30 AM', 'EY/SAT Card Recurring Touchpoint', '', 'work'),
    b(date, '10:30 – 10:45 AM', 'Outdoor Walk', 'Mental break #1', 'fitness'),
    b(date, '10:45 – 11:05 AM', 'Work Block', 'Walking pad', 'work'),
    b(date, '11:05 – 11:30 AM', 'Monthly FRM/Network Accounting', '', 'work'),
    b(date, '11:30 AM – 12:05 PM', 'Work Block', 'Walking pad for steps', 'work'),
    b(date, '12:05 – 12:30 PM', 'Jennifer/Chantel Weekly', '10/10', 'work'),
    b(date, '12:30 – 1:15 PM', 'Lunch', 'Heat + eat', 'home'),
    b(date, '1:15 – 1:30 PM', 'Outdoor Walk', 'Mental break #2', 'fitness'),
    b(date, '1:30 – 2:00 PM', 'Weekly Card/GPN SOX Team Meeting', '', 'work'),
    b(date, '2:00 – 3:00 PM', 'Work Block', 'Walking pad for steps', 'work'),
    b(date, '3:00 – 3:15 PM', 'Outdoor Walk', 'Mental break #3', 'fitness'),
    b(date, '3:15 – 4:05 PM', 'Work Block', 'Walking pad for steps', 'work'),
    b(date, '4:05 – 4:30 PM', 'CRB Meeting', '', 'work'),
    b(date, '4:30 – 5:00 PM', 'Work Wrap-Up', 'EOD', 'work'),
    b(date, '5:00 – 6:00 PM', 'Tax Review + Submit', 'Hard deadline today — do this first', 'home', 'Evening'),
    b(date, '6:00 – 7:00 PM', 'Ladder', '60 min', 'fitness'),
    b(date, '7:00 – 7:45 PM', 'Shower + Exfoliate', '45 min post-workout — exfoliate in shower', 'home'),
    b(date, '7:45 – 8:45 PM', 'Weekly Reset', '1 hr', 'home'),
    b(date, '8:45 – 10:15 PM', 'Respond to Texts', '1.5 hrs', 'home'),
    b(date, '10:15 – 10:20 PM', 'Day Review + Gratitude', '5 min', 'home'),
    b(date, '10:20 – 10:35 PM', 'Bedtime Routine', 'Wind down', 'home'),
    b(date, '10:35 – 10:40 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr16Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '7:00 – 8:00 AM', 'Ladder + Stretch', '50 min Ladder + 10 min stretch', 'fitness', 'Morning'),
    b(date, '8:00 – 8:30 AM', 'Shower + Morning Routine', '30 min post-workout', 'home'),
    b(date, '8:30 – 8:50 AM', 'Red Light + ZIIP', '20 min — bare face, no multitasking', 'home'),
    b(date, '8:50 – 9:00 AM', 'Breakfast', 'Heat + eat at your desk once work starts', 'home'),
    b(date, '9:00 – 10:05 AM', 'Work Block', 'Walking pad for steps', 'work', 'Work'),
    b(date, '10:05 – 10:35 AM', 'SOX FCM Open Forum', '', 'work'),
    b(date, '10:35 – 10:50 AM', 'Outdoor Walk', 'Mental break #1 — respond to messages', 'fitness'),
    b(date, '10:50 – 11:35 AM', 'Work Block', 'Walking pad', 'work'),
    b(date, '11:35 AM – 12:05 PM', 'Card Tech/Business Weekly Sync', '', 'work'),
    b(date, '12:05 – 1:05 PM', 'BLOCK', 'Focus block', 'work'),
    b(date, '1:05 – 1:35 PM', 'Allowance KDEs', '', 'work'),
    b(date, '1:35 – 2:05 PM', 'Card KDEs', '', 'work'),
    b(date, '2:05 – 2:20 PM', 'Outdoor Walk', 'Mental break #2 — respond to messages', 'fitness'),
    b(date, '2:20 – 3:30 PM', 'Work Block', 'Walking pad for steps', 'work'),
    b(date, '3:30 – 3:45 PM', 'Outdoor Walk', 'Mental break #3 — respond to messages', 'fitness'),
    b(date, '3:45 – 4:30 PM', 'Work Wrap-Up', 'EOD', 'work'),
    b(date, '4:30 – 5:15 PM', 'Weekly Reset', '45 min', 'home', 'Evening'),
    b(date, '5:15 – 6:00 PM', 'Shower', '45 min pre-dinner', 'home'),
    b(date, '6:00 – 6:45 PM', 'Makeup', '45 min for dinner', 'home'),
    b(date, '6:45 – 7:30 PM', 'Drive to Earl\'s Kitchen + Bar', '', 'drive', undefined, { text: '1961 Chain Bridge Rd, McLean, VA 22102', color: 'amber' }),
    b(date, '7:30 – 9:30 PM', 'Dinner — Earl\'s Kitchen + Bar', 'Dreanna\'s birthday!', 'errand', undefined, { text: '1961 Chain Bridge Rd, McLean, VA 22102', color: 'amber' }),
    b(date, '9:30 – 10:15 PM', 'Drive Home', '', 'drive'),
    b(date, '10:15 – 10:20 PM', 'Day Review + Gratitude', '5 min', 'home'),
    b(date, '10:20 – 10:35 PM', 'Bedtime Routine', 'Wind down', 'home'),
    b(date, '10:35 – 10:40 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr17Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '10:05 – 10:20 AM', 'Morning Routine + Heat Breakfast', 'Start food heating, brush teeth + wash face — eat at desk once work starts', 'home', 'Work'),
    b(date, '10:20 – 11:35 AM', 'Work Block', 'Settle in — walking pad for steps', 'work'),
    b(date, '11:35 AM – 12:05 PM', 'SOX Control Test — ITAC Bedrock', '30 min', 'work'),
    b(date, '12:05 – 12:20 PM', 'Outdoor Walk', 'Mental break #1 — call Curtis + respond to messages', 'fitness'),
    b(date, '12:20 – 1:15 PM', 'Work Block', 'Walking pad for steps', 'work'),
    b(date, '1:15 – 2:00 PM', 'Lunch', 'Heat + eat', 'home'),
    b(date, '2:00 – 2:15 PM', 'Outdoor Walk', 'Mental break #2 — respond to messages', 'fitness'),
    b(date, '2:15 – 3:15 PM', 'Work Block', 'Walking pad for steps', 'work'),
    b(date, '3:15 – 3:30 PM', 'Outdoor Walk', 'Mental break #3 — respond to messages', 'fitness'),
    b(date, '3:30 – 4:05 PM', 'Work Block', 'Walking pad for steps', 'work'),
    b(date, '4:05 – 4:30 PM', 'Q1 SOX Cert Prep', '25 min', 'work'),
    b(date, '4:30 – 5:00 PM', 'Golden Hour', '', 'key'),
    b(date, '5:00 – 6:00 PM', 'Ladder + StretchIt', '50 min Ladder + 10 min StretchIt', 'fitness', 'Evening'),
    b(date, '6:00 – 6:45 PM', 'Shower', '45 min post-workout', 'home'),
    b(date, '6:45 – 7:30 PM', 'Dinner', 'Heat + eat', 'home'),
    b(date, '7:30 – 9:00 PM', 'Personal Curriculum', '1.5 hrs', 'home'),
    b(date, '9:00 – 9:30 PM', 'Grocery List Update', '30 min', 'home'),
    b(date, '9:30 – 10:15 PM', 'Sneaker Ball — Outfit + Ticket', '45 min', 'home'),
    b(date, '10:15 – 11:15 PM', 'Makeup Practice', '1 hr', 'home'),
    b(date, '11:15 – 11:20 PM', 'Day Review + Gratitude', '5 min', 'home'),
    b(date, '11:20 – 11:35 PM', 'Bedtime Routine', 'Wind down', 'home'),
    b(date, '11:35 – 11:40 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr20Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '6:00 – 6:15 AM', 'Morning Routine', 'Brush teeth + wash face', 'home', 'Morning'),
    b(date, '6:15 – 7:15 AM', 'Ladder', '', 'fitness'),
    b(date, '7:15 – 7:45 AM', 'StretchIt', '', 'fitness'),
    b(date, '7:45 – 8:30 AM', 'Shower + Get Ready', '', 'home'),
    b(date, '8:30 – 8:45 AM', 'Floater', '', 'home'),
    b(date, '8:45 – 9:00 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:00 – 10:35 AM', 'Work', '', 'work', 'Work'),
    b(date, '10:35 – 11:00 AM', 'Meeting: Partnership Accounting/SOX Updates', '', 'work'),
    b(date, '11:00 – 11:15 AM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '11:15 AM – 12:15 PM', 'Work', '', 'work'),
    b(date, '12:15 – 12:45 PM', 'Lunch', '', 'home'),
    b(date, '12:45 – 1:00 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '1:00 – 1:05 PM', 'Work', '', 'work'),
    b(date, '1:05 – 1:30 PM', 'Meeting: FRM/Card Accounting Monthly Check In', '', 'work'),
    b(date, '1:30 – 3:00 PM', 'Work', '', 'work'),
    b(date, '3:00 – 3:15 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '3:15 – 5:00 PM', 'Work', '', 'work'),
    b(date, '5:00 – 5:30 PM', 'Psychiatry', '', 'home', 'Evening'),
    b(date, '5:30 – 6:00 PM', 'Dinner', '', 'home'),
    b(date, '6:00 – 7:15 PM', 'High Priority: Sovereign Work & Money', '', 'home'),
    b(date, '7:15 – 7:45 PM', 'Do It Scared: Emergency Fund (Monarch)', '', 'home'),
    b(date, '7:45 – 8:15 PM', 'Carry-Forward: FSA Item', '', 'home'),
    b(date, '8:15 – 8:20 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '8:20 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '8:20 – 8:35 PM', 'Bedtime Routine', '', 'home'),
    b(date, '8:35 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr21Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '6:00 – 6:15 AM', 'Morning Routine', 'Brush teeth + wash face', 'home', 'Morning'),
    b(date, '6:15 – 6:35 AM', 'RLT + ZIIP', 'Bare face', 'home'),
    b(date, '6:35 – 7:35 AM', 'Ladder', '', 'fitness'),
    b(date, '7:35 – 8:05 AM', 'StretchIt', '', 'fitness'),
    b(date, '8:05 – 8:50 AM', 'Shower + Get Ready', '', 'home'),
    b(date, '8:50 – 9:00 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:00 – 9:35 AM', 'Work', '', 'work', 'Work'),
    b(date, '9:35 – 10:00 AM', 'Meeting: Card Tech/Business Weekly Sync', '', 'work'),
    b(date, '10:05 – 10:30 AM', 'Meeting: Paul/Chantel Weekly 10/10', '', 'work'),
    b(date, '10:30 – 11:15 AM', 'Work', '', 'work'),
    b(date, '11:15 – 11:30 AM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '11:30 AM – 12:30 PM', 'Work', '', 'work'),
    b(date, '12:30 – 1:00 PM', 'Lunch', '', 'home'),
    b(date, '1:00 – 2:30 PM', 'Work', '', 'work'),
    b(date, '2:30 – 2:45 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '2:45 – 4:00 PM', 'Work', '', 'work'),
    b(date, '4:00 – 4:15 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '4:15 – 5:00 PM', 'Work', '', 'work'),
    b(date, '5:00 – 6:15 PM', 'High Priority: Shop Xenia\'s Bach', '', 'home', 'Evening'),
    b(date, '6:15 – 6:45 PM', 'Do It Scared: Monetize Sentence', '', 'home'),
    b(date, '6:45 – 7:15 PM', 'Dinner', '', 'home'),
    b(date, '7:15 – 7:45 PM', 'Do It Scared: Wardrobe Audit Plan', '', 'home'),
    b(date, '7:45 – 8:15 PM', 'Do It Scared: Emergency Fund (Monarch)', '', 'home'),
    b(date, '8:15 – 9:00 PM', 'Create TikTok', '', 'home'),
    b(date, '9:15 – 9:30 PM', 'Dermaplane', '', 'home'),
    b(date, '9:45 – 10:05 PM', 'Home Wax', '', 'home'),
    b(date, '10:05 – 10:10 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '10:10 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '10:10 – 10:25 PM', 'Bedtime Routine', '', 'home'),
    b(date, '10:25 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr22Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '7:05 – 8:05 AM', 'Ladder', '', 'fitness', 'Morning'),
    b(date, '8:05 – 8:15 AM', 'StretchIt', '', 'fitness'),
    b(date, '8:15 – 8:45 AM', 'Shower + Get Ready (exfoliate)', '', 'home'),
    b(date, '8:45 – 9:00 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:00 – 9:35 AM', 'Work', '', 'work', 'Work'),
    b(date, '9:35 – 10:00 AM', 'Meeting: Chantel/Jeff Weekly 10/10', '', 'work'),
    b(date, '10:05 – 10:30 AM', 'Meeting: EY/SAT Card Recurring Touchpoint', '', 'work'),
    b(date, '10:35 – 11:00 AM', 'Meeting: CRB Meeting', '', 'work'),
    b(date, '11:05 – 11:30 AM', 'Meeting: Jennifer/Chantel Weekly 10/10', '', 'work'),
    b(date, '11:30 – 11:45 AM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '11:45 AM – 12:30 PM', 'Work', '', 'work'),
    b(date, '12:30 – 1:00 PM', 'Lunch', '', 'home'),
    b(date, '1:00 – 1:15 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '1:15 – 1:35 PM', 'Work', '', 'work'),
    b(date, '1:35 – 2:00 PM', 'Meeting: Weekly Card/GPN SOX Team Meeting', '', 'work'),
    b(date, '2:00 – 3:30 PM', 'Work', '', 'work'),
    b(date, '3:30 – 3:45 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '3:45 – 4:05 PM', 'Work', '', 'work'),
    b(date, '4:05 – 4:30 PM', 'Meeting: SOX Controls x Batch Onboarding: Weekly', '', 'work'),
    b(date, '4:30 – 5:40 PM', 'Put That Shit On', '', 'home', 'Evening'),
    b(date, '5:40 – 5:55 PM', 'Drive to Toyota Spring Party', '', 'drive', undefined, { text: '225 Seventh St SE, Washington, DC 20003', color: 'amber' }),
    b(date, '6:00 – 8:30 PM', 'Toyota Spring Party 2026', '', 'key', undefined, { text: '225 Seventh St SE, Washington, DC 20003', color: 'amber' }),
    b(date, '8:30 – 8:45 PM', 'Drive Home', '', 'drive'),
    b(date, '8:45 – 8:50 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '8:50 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '8:50 – 9:05 PM', 'Bedtime Routine', '', 'home'),
    b(date, '9:05 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr23Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '5:30 – 5:45 AM', 'Morning Routine', 'Brush teeth + wash face', 'home', 'Morning'),
    b(date, '5:45 – 6:05 AM', 'RLT + ZIIP', 'Bare face', 'home'),
    b(date, '6:05 – 7:05 AM', 'Ladder', '', 'fitness'),
    b(date, '7:05 – 7:35 AM', 'StretchIt', '', 'fitness'),
    b(date, '7:35 – 8:20 AM', 'Shower + Get Ready', '', 'home'),
    b(date, '8:20 – 8:50 AM', 'Makeup Practice', '', 'home'),
    b(date, '8:50 – 9:00 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:00 – 10:05 AM', 'Work', '', 'work', 'Work'),
    b(date, '10:05 – 10:30 AM', 'Meeting: SOX FCM Open Forum', '', 'work'),
    b(date, '10:35 – 11:00 AM', 'Meeting: Card Tech/Business Weekly Sync', '', 'work'),
    b(date, '11:00 – 11:15 AM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '11:15 AM – 12:00 PM', 'Work', '', 'work'),
    b(date, '12:00 – 1:00 PM', 'Therapy', '', 'home'),
    b(date, '1:00 – 1:30 PM', 'Lunch', '', 'home'),
    b(date, '1:30 – 2:30 PM', 'Work', '', 'work'),
    b(date, '2:30 – 2:45 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '2:45 – 4:15 PM', 'Work', '', 'work'),
    b(date, '4:15 – 4:30 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '4:30 – 5:00 PM', 'Work', '', 'work'),
    b(date, '5:00 – 6:00 PM', 'Money 101: Teacher Get-Together', '', 'home', 'Evening'),
    b(date, '6:00 – 6:45 PM', 'Dinner', '', 'home'),
    b(date, '6:45 – 7:45 PM', 'Golden Hour', '', 'key'),
    b(date, '7:45 – 8:15 PM', 'Do It Scared: Visibility Cadence', '', 'home'),
    b(date, '8:15 – 8:45 PM', 'Carry-Forward: Subscriptions (ChatGPT + Netlify)', '', 'home'),
    b(date, '8:45 – 9:00 PM', 'Rest + Recovery', '', 'home'),
    b(date, '9:00 – 9:45 PM', 'Create TikTok', '', 'home'),
    b(date, '9:45 – 9:50 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '9:50 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '9:50 – 10:05 PM', 'Bedtime Routine', '', 'home'),
    b(date, '10:05 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr24Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '6:00 – 6:15 AM', 'Morning Routine', 'Brush teeth + wash face', 'home', 'Morning'),
    b(date, '6:15 – 7:15 AM', 'Ladder', '', 'fitness'),
    b(date, '7:15 – 7:45 AM', 'StretchIt', '', 'fitness'),
    b(date, '7:45 – 8:30 AM', 'Shower + Get Ready', '', 'home'),
    b(date, '8:30 – 8:45 AM', 'Floater', '', 'home'),
    b(date, '8:45 – 9:00 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:00 – 9:05 AM', 'Work', '', 'work', 'Work'),
    b(date, '9:05 – 9:55 AM', 'Meeting: Submit Budget & Takeaways', '', 'work'),
    b(date, '9:55 – 10:05 AM', 'Work', '', 'work'),
    b(date, '10:05 – 10:30 AM', 'Meeting: Review Next Week\'s Calendar', '', 'work'),
    b(date, '10:30 – 11:00 AM', 'Meeting: Virtual Coffee Catch-Up', '', 'work'),
    b(date, '11:00 – 11:15 AM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '11:15 AM – 12:00 PM', 'Work', '', 'work'),
    b(date, '12:00 – 12:30 PM', 'Lunch', '', 'home'),
    b(date, '12:30 – 12:35 PM', 'Work', '', 'work'),
    b(date, '12:35 – 1:00 PM', 'Meeting: FOLLOW UP - COMM-044/COMM-045', '', 'work'),
    b(date, '1:00 – 1:05 PM', 'Work', '', 'work'),
    b(date, '1:05 – 1:20 PM', 'Freshen Up', '', 'home'),
    b(date, '1:20 – 1:50 PM', 'Drive to Urology', '', 'drive', undefined, { text: '11800 N Beauregard St, Unit 300, Alexandria, VA 22311', color: 'amber' }),
    b(date, '1:50 – 2:50 PM', 'Urology', '', 'errand', undefined, { text: '11800 N Beauregard St, Unit 300, Alexandria, VA 22311', color: 'amber' }),
    b(date, '2:50 – 3:20 PM', 'Drive Home', '', 'drive'),
    b(date, '3:20 – 4:00 PM', 'Work', '', 'work'),
    b(date, '4:00 – 4:15 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '4:15 – 5:00 PM', 'Work', '', 'work'),
    b(date, '5:00 – 7:00 PM', 'Practice Choreography', '', 'fitness', 'Evening'),
    b(date, '7:00 – 7:30 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '7:30 – 8:00 PM', 'Dinner', '', 'home'),
    b(date, '8:00 – 8:30 PM', 'Carry-Forward: Netlify Subscription', '', 'home'),
    b(date, '8:30 – 9:00 PM', 'Do It Scared: Wardrobe Audit Plan', '', 'home'),
    b(date, '9:00 – 9:30 PM', 'Golden Hour', '', 'key'),
    b(date, '9:30 – 9:35 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '9:35 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '9:35 – 9:50 PM', 'Bedtime Routine', '', 'home'),
    b(date, '9:50 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr25Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '9:10 – 10:00 AM', 'Ladder', '', 'fitness', 'Morning'),
    b(date, '10:00 – 10:10 AM', 'StretchIt', '', 'fitness'),
    b(date, '10:10 – 10:45 AM', 'Shower + Get Ready', '', 'home'),
    b(date, '10:45 – 11:25 AM', 'Hair Wash', '', 'home'),
    b(date, '11:25 AM – 12:10 PM', 'Makeup Practice', '', 'home'),
    b(date, '12:10 – 2:10 PM', 'Wardrobe Audit', '', 'home'),
    b(date, '2:10 – 2:55 PM', 'Create TikTok', '', 'home', 'Afternoon'),
    b(date, '2:55 – 4:10 PM', 'High Priority: Shop Xenia\'s Bach', '', 'home'),
    b(date, '4:10 – 4:40 PM', 'Golden Hour', '', 'key'),
    b(date, '4:40 – 5:10 PM', 'Plan Grocery Pickup', '', 'home'),
    b(date, '5:10 – 9:35 PM', 'DND / Rest + Recovery', 'Lunch inside', 'home'),
    b(date, '9:35 – 10:05 PM', 'Dinner', '', 'home', 'Evening'),
    b(date, '10:05 – 10:20 PM', 'Dermaplane', '', 'home'),
    b(date, '10:20 – 10:40 PM', 'Home Wax', '', 'home'),
    b(date, '10:40 – 10:45 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '10:45 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '10:45 – 11:00 PM', 'Bedtime Routine', '', 'home'),
    b(date, '11:00 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr26Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '6:30 – 7:30 AM', 'Ladder', '', 'fitness', 'Morning'),
    b(date, '7:30 – 8:00 AM', 'StretchIt', '', 'fitness'),
    b(date, '8:00 – 8:15 AM', 'Morning Routine', 'Brush teeth + wash face', 'home'),
    b(date, '8:15 – 8:30 AM', 'House Check-In', '', 'home'),
    b(date, '8:30 – 8:50 AM', 'RLT + ZIIP', 'Bare face', 'home'),
    b(date, '8:50 – 9:00 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:00 – 9:45 AM', 'Makeup Practice', '', 'home'),
    b(date, '9:45 AM – 12:45 PM', 'Meal Prep with Ashley', '', 'home'),
    b(date, '12:45 – 4:45 PM', 'Lex Link', '', 'key', 'Afternoon'),
    b(date, '4:45 – 6:15 PM', 'Grocery Shop', '', 'errand', 'Evening'),
    b(date, '6:15 – 7:00 PM', 'Create TikTok', '', 'home'),
    b(date, '7:00 – 8:00 PM', 'High Priority: Sunday Weekly Reset', '', 'home'),
    b(date, '8:00 – 8:30 PM', 'Do It Scared: Emergency Fund (Monarch)', '', 'home'),
    b(date, '8:30 – 9:00 PM', 'Dinner', '', 'home'),
    b(date, '9:00 – 9:05 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '9:05 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '9:05 – 9:20 PM', 'Bedtime Routine', '', 'home'),
    b(date, '9:20 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr27Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '10:38 – 10:53 AM', 'Morning Routine', 'Brush teeth, wash face', 'home', 'Morning'),
    b(date, '10:53 – 11:15 AM', 'Shower + Get Ready', '', 'home'),
    b(date, '11:15 AM – 12:00 PM', 'Work', '', 'work', 'Work'),
    b(date, '12:00 – 12:15 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '12:15 – 12:30 PM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '12:30 – 1:00 PM', 'Work', '', 'work'),
    b(date, '1:00 – 1:30 PM', 'Lunch', '', 'home'),
    b(date, '1:30 – 2:05 PM', 'Work', '', 'work'),
    b(date, '2:05 – 2:55 PM', 'Meeting: SOX/RRQA Monthly Business Review', '', 'work'),
    b(date, '2:55 – 3:30 PM', 'Work', '', 'work'),
    b(date, '3:30 – 3:45 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '3:45 – 5:00 PM', 'Work', '', 'work'),
    b(date, '5:00 – 5:30 PM', 'Schedule OBGYN Appt + Personal + Self Care Check-Ins', '~15–20 min each — batch together', 'home', 'Evening'),
    b(date, '5:30 – 6:15 PM', 'TikTok Recording', 'Record + post', 'home'),
    b(date, '6:15 – 8:15 PM', 'Meal Prep with Ashley', '2 hours — priority evening block', 'home'),
    b(date, '8:15 – 9:00 PM', 'Xenia\'s Bach Trip Shopping', 'Browse + purchase online', 'home'),
    b(date, '9:00 – 9:25 PM', 'Write Monetization + Half Marathon Sentences + Schedule Wardrobe Audit', 'DIS next moves — 3 quick tasks', 'home'),
    b(date, '9:25 – 9:30 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '9:30 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '10:15 – 10:30 PM', 'Bedtime Routine', '', 'home'),
    b(date, '10:30 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr28Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '6:30 – 6:45 AM', 'Morning Routine', 'Brush teeth + wash face', 'home', 'Morning'),
    b(date, '6:45 – 7:45 AM', 'Ladder', '', 'fitness'),
    b(date, '7:45 – 8:15 AM', 'StretchIt', '', 'fitness'),
    b(date, '8:15 – 9:00 AM', 'Shower + Get Ready', '', 'home'),
    b(date, '9:00 – 9:15 AM', 'Floater', 'Chores or catch-up buffer', 'home'),
    b(date, '9:15 – 9:35 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:35 – 10:00 AM', 'Meeting: Card Tech/Business Weekly Sync', '', 'work', 'Work'),
    b(date, '10:00 – 10:05 AM', 'Work', '', 'work'),
    b(date, '10:05 – 10:30 AM', 'Meeting: Paul/Chantel Weekly 10/10', '', 'work'),
    b(date, '10:30 – 10:45 AM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '10:45 AM – 12:30 PM', 'Complete Shaunese\'s Travel Questionnaire', 'HP — 75–105 min', 'work'),
    b(date, '12:30 – 1:00 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '1:00 – 1:30 PM', 'Lunch', '', 'home'),
    b(date, '1:30 – 2:30 PM', 'Calculate 12-Mo Emergency Fund in Monarch Money', 'DIS next move — 30–60 min', 'home'),
    b(date, '2:30 – 3:00 PM', 'Review Cole\'s Wedding Photos + Respond', 'Overdue since 4/15', 'home'),
    b(date, '3:00 – 3:15 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '3:15 – 4:35 PM', 'Work', '', 'work'),
    b(date, '4:35 – 5:00 PM', 'Meeting: Real Time Rewards Data Sets', '', 'work'),
    b(date, '5:00 – 5:45 PM', 'TikTok Recording', 'Record + post', 'home', 'Evening'),
    b(date, '5:45 – 6:15 PM', 'Kaftan + Alicia Getty Black House Dress Browse', '30 min combined', 'home'),
    b(date, '6:15 – 6:30 PM', 'House Check-In', '', 'home'),
    b(date, '6:30 – 7:00 PM', 'Pick Bebop & Ma\'s Vacation Locations', '', 'home'),
    b(date, '7:00 – 7:35 PM', 'Chase Bonuses Check + Transfer $355 to USAA + Allocate Paycheck', 'Chase 5 min; budget + transfer 30 min', 'home'),
    b(date, '7:35 – 9:00 PM', 'Rest + Recovery', '', 'home'),
    b(date, '9:00 – 9:25 PM', 'Free', '', 'home'),
    b(date, '9:25 – 9:30 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '9:30 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '10:15 – 10:30 PM', 'Bedtime Routine', 'RLT + ZIIP (20 min — bare face)', 'home'),
    b(date, '10:30 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr29Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '6:30 – 6:45 AM', 'Morning Routine', 'Brush teeth + wash face', 'home', 'Morning'),
    b(date, '6:45 – 7:45 AM', 'Ladder', '', 'fitness'),
    b(date, '7:45 – 8:15 AM', 'StretchIt', '', 'fitness'),
    b(date, '8:15 – 9:00 AM', 'Shower + Get Ready', 'Exfoliate in shower (Wed skincare)', 'home'),
    b(date, '9:00 – 9:25 AM', 'Makeup Practice', '', 'home'),
    b(date, '9:25 – 9:35 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:35 – 10:00 AM', 'Meeting: Chantel/Jeff Weekly 10/10', '', 'work', 'Work'),
    b(date, '10:00 – 10:05 AM', 'Work', '', 'work'),
    b(date, '10:05 – 10:30 AM', 'Meeting: EY/SAT Card Recurring Touchpoint', '', 'work'),
    b(date, '10:30 – 10:35 AM', 'Work', '', 'work'),
    b(date, '10:35 – 11:00 AM', 'Meeting: CRB Meeting', '', 'work'),
    b(date, '11:00 – 11:05 AM', 'Work', '', 'work'),
    b(date, '11:05 – 11:30 AM', 'Meeting: GitHub Change Monitoring Touchpoint', '', 'work'),
    b(date, '11:30 AM – 12:00 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '12:00 – 12:30 PM', 'Decide Social Media Platform, Topic + Cadence', 'DIS next move — 30 min', 'home'),
    b(date, '12:30 – 1:00 PM', 'Lunch', '', 'home'),
    b(date, '1:00 – 1:30 PM', 'Meeting: Virtual Coffee Catch-Up', '', 'work'),
    b(date, '1:30 – 1:35 PM', 'Work', '', 'work'),
    b(date, '1:35 – 2:00 PM', 'Meeting: Weekly Card/GPN SOX Team Meeting', '', 'work'),
    b(date, '2:00 – 2:30 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '2:30 – 3:30 PM', 'Reply to BRAVA / Soraia', 'Confirm photography direction, DJ specs, acknowledge all answers', 'home'),
    b(date, '3:30 – 4:05 PM', 'Book Return Flights — Selves + Parents', 'Due 5/3', 'home'),
    b(date, '4:05 – 4:30 PM', 'Meeting: SOX Controls x Batch Onboarding: Weekly', '', 'work'),
    b(date, '4:30 – 5:00 PM', 'Work', '', 'work'),
    b(date, '5:00 – 5:30 PM', 'Research Dancing Class', 'Commutable + affordable hip hop / heels / pole dancing', 'home', 'Evening'),
    b(date, '5:30 – 5:35 PM', 'Use DoorDash $10 Credit', '', 'home'),
    b(date, '5:35 – 6:20 PM', 'TikTok Recording', 'Record + post', 'home'),
    b(date, '6:20 – 6:30 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '6:30 – 8:30 PM', 'TNP Book Meeting', 'FaceTime', 'home'),
    b(date, '8:30 – 9:00 PM', 'April Group Coaching Call (partial)', 'Join remainder after book club — Zoom', 'home'),
    b(date, '9:00 – 9:25 PM', 'Free', '', 'home'),
    b(date, '9:25 – 9:30 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '9:30 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '10:15 – 10:30 PM', 'Bedtime Routine', '', 'home'),
    b(date, '10:30 PM', 'Lights Out', '', 'key'),
  ];
}

function getApr30Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '6:30 – 6:45 AM', 'Morning Routine', 'Brush teeth + wash face', 'home', 'Morning'),
    b(date, '6:45 – 7:45 AM', 'Ladder', '', 'fitness'),
    b(date, '7:45 – 8:15 AM', 'StretchIt', '', 'fitness'),
    b(date, '8:15 – 9:00 AM', 'Shower + Get Ready', '', 'home'),
    b(date, '9:00 – 9:20 AM', 'Makeup Practice', '', 'home'),
    b(date, '9:20 – 9:35 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:35 – 10:00 AM', 'Meeting: Jennifer/Chantel Weekly 10/10', '', 'work', 'Work'),
    b(date, '10:00 – 10:05 AM', 'Work', '', 'work'),
    b(date, '10:05 – 10:30 AM', 'Meeting: SOX FCM Open Forum', '', 'work'),
    b(date, '10:30 – 10:35 AM', 'Work', '', 'work'),
    b(date, '10:35 – 11:00 AM', 'Meeting: Card Tech/Business Weekly Sync', '', 'work'),
    b(date, '11:00 AM – 12:30 PM', 'Meeting: Revolutionizing Internal Controls', '', 'work'),
    b(date, '12:30 – 1:00 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '1:00 – 1:30 PM', 'Lunch', '', 'home'),
    b(date, '1:30 – 3:00 PM', 'Research Next Month\'s Tiny Experiment', 'HP — 90 min', 'home'),
    b(date, '3:00 – 3:05 PM', 'Work', '', 'work'),
    b(date, '3:05 – 3:30 PM', 'Meeting: GitHub Change Monitoring Follow-Up', '', 'work'),
    b(date, '3:30 – 3:45 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '3:45 – 4:30 PM', 'Work', '', 'work'),
    b(date, '4:30 – 5:30 PM', 'Dietitian Appt — Abby Penamonte, RD', '', 'errand'),
    b(date, '5:30 – 6:00 PM', 'Schedule Appt with Dreanna\'s Holistic Doctor', '', 'home', 'Evening'),
    b(date, '6:00 – 6:45 PM', 'Golden Hour', 'Weekly planning session', 'key'),
    b(date, '6:45 – 7:30 PM', 'TikTok Recording', 'Record + post', 'home'),
    b(date, '7:30 – 7:45 PM', 'Assess Promotability / Job Search', '15 min focused reflection', 'home'),
    b(date, '7:45 – 8:15 PM', 'Reminders Catch-Up', 'Any remaining 4/27 due items', 'home'),
    b(date, '8:15 – 9:00 PM', 'Rest + Recovery', '', 'home'),
    b(date, '9:00 – 9:25 PM', 'Free', '', 'home'),
    b(date, '9:25 – 9:30 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '9:30 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '10:15 – 10:30 PM', 'Bedtime Routine', 'RLT + ZIIP (20 min — bare face)', 'home'),
    b(date, '10:30 PM', 'Lights Out', '', 'key'),
  ];
}

function getMay1Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '6:30 – 6:45 AM', 'Morning Routine', 'Brush teeth + wash face', 'home', 'Morning'),
    b(date, '6:45 – 7:45 AM', 'Ladder', '', 'fitness'),
    b(date, '7:45 – 8:15 AM', 'StretchIt', '', 'fitness'),
    b(date, '8:15 – 9:00 AM', 'Shower + Get Ready', '', 'home'),
    b(date, '9:00 – 9:15 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:15 – 9:30 AM', 'Work', '', 'work', 'Work'),
    b(date, '9:30 – 10:00 AM', 'Meeting: Virtual Coffee Catch-Up', '', 'work'),
    b(date, '10:00 – 10:05 AM', 'Work', '', 'work'),
    b(date, '10:05 – 10:30 AM', 'Meeting: Review Next Week\'s Calendar', '', 'work'),
    b(date, '10:30 – 10:45 AM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '10:45 AM – 12:00 PM', 'Work', '', 'work'),
    b(date, '12:00 – 12:30 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '12:30 – 12:35 PM', 'Work', '', 'work'),
    b(date, '12:35 – 1:00 PM', 'Lunch', '', 'home'),
    b(date, '1:00 – 2:00 PM', 'Work', '', 'work'),
    b(date, '2:00 – 4:00 PM', 'Purchase 1–2 Items for Wedding Wardrobe', 'HP — 120 min during Meeting Free block', 'home'),
    b(date, '4:00 – 4:15 PM', 'Outdoor Walk', 'Mental break', 'fitness'),
    b(date, '4:15 – 5:00 PM', 'Work / Meeting Free', '', 'work'),
    b(date, '5:00 – 7:00 PM', 'Practice Choreography', '', 'fitness', 'Evening'),
    b(date, '7:00 – 7:45 PM', 'TikTok Recording', 'Record + post', 'home'),
    b(date, '7:45 – 8:00 PM', 'Check RSVP Count', 'Deadline closes today — note count, flag any pending guests', 'home'),
    b(date, '8:00 – 8:30 PM', 'Write Personal Note to Xenia', 'Re: wedding decline', 'home'),
    b(date, '8:30 – 9:00 PM', 'Start Money 101 Training', 'Due today', 'home'),
    b(date, '9:00 – 9:25 PM', 'Free', '', 'home'),
    b(date, '9:25 – 9:30 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '9:30 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '10:15 – 10:30 PM', 'Bedtime Routine', '', 'home'),
    b(date, '10:30 PM', 'Lights Out', '', 'key'),
  ];
}

function getMay2Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '6:30 – 6:45 AM', 'Morning Routine', 'Brush teeth + wash face', 'home', 'Morning'),
    b(date, '6:45 – 7:45 AM', 'Ladder', 'Make-up from Monday', 'fitness'),
    b(date, '7:45 – 8:15 AM', 'StretchIt', 'Make-up from Monday', 'fitness'),
    b(date, '8:15 – 8:55 AM', 'Shower + Get Ready', 'Exfoliate in shower (Sat skincare)', 'home'),
    b(date, '8:55 – 9:00 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:00 – 9:30 AM', 'Drive to DST Recess Challenge', '', 'drive', undefined, { text: '1500 Anacostia Ave NE, Washington, DC 20002', color: 'amber' }),
    b(date, '9:30 – 10:00 AM', 'Arrive + Check-In', '', 'home'),
    b(date, '10:00 AM – 12:00 PM', 'DST Program: Recess Challenge', '', 'errand', undefined, { text: '1500 Anacostia Ave NE, Washington, DC 20002', color: 'amber' }),
    b(date, '12:00 – 12:15 PM', 'Drive to JC Lofton Tailors', 'En route to Costco', 'drive', undefined, { text: '1003 U St NW, Washington, DC 20001', color: 'amber' }),
    b(date, '12:15 – 12:30 PM', 'OddMuse Dress Drop-Off', '', 'errand', undefined, { text: '1003 U St NW, Washington, DC 20001', color: 'amber' }),
    b(date, '12:30 – 12:50 PM', 'Drive to Costco', '', 'drive', undefined, { text: '1200 S Fern St, Arlington, VA 22202', color: 'amber' }),
    b(date, '12:50 – 2:50 PM', 'Grocery Shop', '', 'errand', undefined, { text: '1200 S Fern St, Arlington, VA 22202', color: 'amber' }),
    b(date, '2:50 – 3:20 PM', 'Drive Home', '', 'drive'),
    b(date, '3:20 – 4:50 PM', 'Wardrobe Audit — Part 1 of 2', '90 min — continues Sunday', 'home', 'Afternoon'),
    b(date, '4:50 – 6:00 PM', 'Put That Shit On', 'Prep for Date Night — 70 min', 'home'),
    b(date, '6:00 – 6:30 PM', 'Drive to Date Night', '', 'drive', undefined, { text: 'TBD', color: 'amber' }),
    b(date, '6:30 – 8:30 PM', 'Biweekly Date Night', '', 'key', undefined, { text: 'TBD', color: 'amber' }),
    b(date, '8:30 – 9:00 PM', 'Drive Home', '', 'drive'),
    b(date, '9:00 – 9:25 PM', 'TikTok Recording', 'Record + post', 'home', 'Evening'),
    b(date, '9:25 – 9:30 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '9:30 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '10:15 – 10:30 PM', 'Bedtime Routine', '', 'home'),
    b(date, '10:30 PM', 'Lights Out', '', 'key'),
  ];
}

function getMay3Schedule(date: string): ScheduleBlock[] {
  return [
    b(date, '6:30 – 6:45 AM', 'Morning Routine', 'Brush teeth + wash face', 'home', 'Morning'),
    b(date, '6:45 – 7:30 AM', 'Shower + Get Ready', '', 'home'),
    b(date, '7:30 – 8:30 AM', 'Hair Wash', '~60 min', 'home'),
    b(date, '8:30 – 9:00 AM', 'Breakfast', 'Take supplements', 'home'),
    b(date, '9:00 – 10:30 AM', 'Wardrobe Audit — Part 2 of 2', '90 min — completes audit', 'home'),
    b(date, '10:30 – 11:00 AM', 'Finalize Guest List + Draft Thank You Email to Non-Responders', 'Due today 5/3', 'home'),
    b(date, '11:00 AM – 12:00 PM', 'Free / Rest', '', 'home'),
    b(date, '12:00 – 12:30 PM', 'Reminders Catch-Up', 'Any remaining items from the week', 'home', 'Afternoon'),
    b(date, '12:30 – 1:00 PM', 'Lunch', '', 'home'),
    b(date, '1:00 – 4:00 PM', 'Meal Prep with Ashley', 'Max 3 hours — batch cook for the week', 'home'),
    b(date, '4:00 – 7:00 PM', 'Free / Recovery', '', 'home', 'Evening'),
    b(date, '7:00 – 7:30 PM', 'House Meeting', '', 'home'),
    b(date, '7:30 – 9:25 PM', 'Free', '', 'home'),
    b(date, '9:25 – 9:30 PM', 'Review Day + Gratitude', '', 'home'),
    b(date, '9:30 PM', 'Electronics Off', '1 hour before bed', 'key'),
    b(date, '10:15 – 10:30 PM', 'Bedtime Routine', 'RLT + ZIIP (20 min — bare face)', 'home'),
    b(date, '10:30 PM', 'Lights Out', '', 'key'),
  ];
}

export const CUSTOM_SCHEDULE_DATES = [
  '2026-04-11', '2026-04-13', '2026-04-14', '2026-04-15', '2026-04-16', '2026-04-17',
  '2026-04-20', '2026-04-21', '2026-04-22', '2026-04-23', '2026-04-24', '2026-04-25', '2026-04-26',
  '2026-04-27', '2026-04-28', '2026-04-29', '2026-04-30', '2026-05-01', '2026-05-02', '2026-05-03',
];

export function getDefaultSchedule(date: string): ScheduleBlock[] {
  if (date === '2026-04-11') return getApr11Schedule(date);
  if (date === '2026-04-13') return getApr13Schedule(date);
  if (date === '2026-04-14') return getApr14Schedule(date);
  if (date === '2026-04-15') return getApr15Schedule(date);
  if (date === '2026-04-16') return getApr16Schedule(date);
  if (date === '2026-04-17') return getApr17Schedule(date);
  if (date === '2026-04-20') return getApr20Schedule(date);
  if (date === '2026-04-21') return getApr21Schedule(date);
  if (date === '2026-04-22') return getApr22Schedule(date);
  if (date === '2026-04-23') return getApr23Schedule(date);
  if (date === '2026-04-24') return getApr24Schedule(date);
  if (date === '2026-04-25') return getApr25Schedule(date);
  if (date === '2026-04-26') return getApr26Schedule(date);
  if (date === '2026-04-27') return getApr27Schedule(date);
  if (date === '2026-04-28') return getApr28Schedule(date);
  if (date === '2026-04-29') return getApr29Schedule(date);
  if (date === '2026-04-30') return getApr30Schedule(date);
  if (date === '2026-05-01') return getMay1Schedule(date);
  if (date === '2026-05-02') return getMay2Schedule(date);
  if (date === '2026-05-03') return getMay3Schedule(date);
  const today = todayStr();
  if (date !== today && date !== '2026-04-10') return [];
  return getGenericSchedule(date);
}
