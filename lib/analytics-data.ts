// ─── Shared types ────────────────────────────────────────────────────────────

export type DateRangeKey = "hour" | "day" | "week" | "month" | "custom";

export type ComparisonKey =
  | "today-yesterday"
  | "week-last-week"
  | "month-last-month"
  | "none";

export type SortDirection = "asc" | "desc";

export interface DataRow {
  label: string;
  current: number;
  prior?: number;
}

export interface StatSummary {
  label: string;
  value: string;
  subtext?: string;
}

// ─── Traffic mock data ────────────────────────────────────────────────────────

/** 24-hour data for a single weekday (Tuesday). */
const HOURLY_WEEKDAY: DataRow[] = [
  { label: "12 AM", current: 124, prior: 98 },
  { label: "1 AM",  current: 87,  prior: 72 },
  { label: "2 AM",  current: 52,  prior: 43 },
  { label: "3 AM",  current: 38,  prior: 31 },
  { label: "4 AM",  current: 45,  prior: 37 },
  { label: "5 AM",  current: 62,  prior: 55 },
  { label: "6 AM",  current: 128, prior: 111 },
  { label: "7 AM",  current: 241, prior: 219 },
  { label: "8 AM",  current: 389, prior: 356 },
  { label: "9 AM",  current: 512, prior: 487 },
  { label: "10 AM", current: 634, prior: 601 },
  { label: "11 AM", current: 687, prior: 662 },
  { label: "12 PM", current: 724, prior: 698 },
  { label: "1 PM",  current: 712, prior: 689 },
  { label: "2 PM",  current: 689, prior: 671 },
  { label: "3 PM",  current: 758, prior: 712 },
  { label: "4 PM",  current: 823, prior: 789 },
  { label: "5 PM",  current: 891, prior: 847 },
  { label: "6 PM",  current: 934, prior: 901 },
  { label: "7 PM",  current: 856, prior: 821 },
  { label: "8 PM",  current: 742, prior: 709 },
  { label: "9 PM",  current: 521, prior: 498 },
  { label: "10 PM", current: 347, prior: 312 },
  { label: "11 PM", current: 203, prior: 187 },
];

/** 7-day data for this week vs last week. */
const DAILY_WEEK: DataRow[] = [
  { label: "Mon", current: 4312, prior: 4187 },
  { label: "Tue", current: 3847, prior: 3712 },
  { label: "Wed", current: 4108, prior: 3987 },
  { label: "Thu", current: 4523, prior: 4312 },
  { label: "Fri", current: 5214, prior: 5087 },
  { label: "Sat", current: 6341, prior: 6108 },
  { label: "Sun", current: 5187, prior: 4923 },
];

/** ~30-day data for this month vs last month (showing weeks for brevity). */
const DAILY_MONTH: DataRow[] = [
  { label: "Jul 1",  current: 4123, prior: 3987 },
  { label: "Jul 2",  current: 4387, prior: 4201 },
  { label: "Jul 3",  current: 4512, prior: 4389 },
  { label: "Jul 4",  current: 5021, prior: 4876 },
  { label: "Jul 5",  current: 6234, prior: 6012 },
  { label: "Jul 6",  current: 5891, prior: 5734 },
  { label: "Jul 7",  current: 5123, prior: 4987 },
  { label: "Jul 8",  current: 4234, prior: 4098 },
  { label: "Jul 9",  current: 4456, prior: 4312 },
  { label: "Jul 10", current: 4678, prior: 4523 },
  { label: "Jul 11", current: 4912, prior: 4756 },
  { label: "Jul 12", current: 5234, prior: 5089 },
  { label: "Jul 13", current: 6123, prior: 5978 },
  { label: "Jul 14", current: 5678, prior: 5512 },
  { label: "Jul 15", current: 4389, prior: 4234 },
  { label: "Jul 16", current: 4512, prior: 4367 },
  { label: "Jul 17", current: 4823, prior: 4689 },
  { label: "Jul 18", current: 5123, prior: 4978 },
  { label: "Jul 19", current: 5456, prior: 5312 },
  { label: "Jul 20", current: 6278, prior: 6134 },
  { label: "Jul 21", current: 5934, prior: 5789 },
  { label: "Jul 22", current: 3847, prior: 3712 },
];

/** Last-hour data (5-minute buckets). */
const LAST_HOUR: DataRow[] = [
  { label: "6:00", current: 48,  prior: 41 },
  { label: "6:05", current: 52,  prior: 45 },
  { label: "6:10", current: 61,  prior: 53 },
  { label: "6:15", current: 57,  prior: 49 },
  { label: "6:20", current: 63,  prior: 55 },
  { label: "6:25", current: 71,  prior: 62 },
  { label: "6:30", current: 78,  prior: 68 },
  { label: "6:35", current: 84,  prior: 73 },
  { label: "6:40", current: 91,  prior: 79 },
  { label: "6:45", current: 87,  prior: 76 },
  { label: "6:50", current: 93,  prior: 82 },
  { label: "6:55", current: 98,  prior: 87 },
];

// ─── Public helpers ───────────────────────────────────────────────────────────

export function getTrafficData(range: DateRangeKey): DataRow[] {
  switch (range) {
    case "hour":  return LAST_HOUR;
    case "day":   return HOURLY_WEEKDAY;
    case "week":  return DAILY_WEEK;
    case "month": return DAILY_MONTH;
    default:      return HOURLY_WEEKDAY;
  }
}

export function getTrafficStats(range: DateRangeKey): StatSummary[] {
  const data = getTrafficData(range);
  const total = data.reduce((s, r) => s + r.current, 0);
  const peak  = data.reduce((m, r) => (r.current > m.current ? r : m), data[0]);
  const avg   = Math.round(total / data.length);

  return [
    { label: "Total Visitors",        value: total.toLocaleString() },
    { label: "Peak Hour",             value: peak.current.toLocaleString(), subtext: peak.label },
    { label: "Average Per Interval",  value: avg.toLocaleString() },
  ];
}

// Column label helpers used by the data table
export function getIntervalLabel(range: DateRangeKey): string {
  switch (range) {
    case "hour":  return "5-min window";
    case "day":   return "Hour";
    case "week":
    case "month": return "Day";
    default:      return "Period";
  }
}

// ─── Occupancy mock data ──────────────────────────────────────────────────────

const OCCUPANCY_HOURLY_WEEKDAY: DataRow[] = [
  { label: "12 AM", current: 12, prior: 10 },
  { label: "1 AM",  current: 8,  prior: 7 },
  { label: "2 AM",  current: 5,  prior: 4 },
  { label: "3 AM",  current: 3,  prior: 3 },
  { label: "4 AM",  current: 4,  prior: 3 },
  { label: "5 AM",  current: 6,  prior: 5 },
  { label: "6 AM",  current: 13, prior: 11 },
  { label: "7 AM",  current: 24, prior: 22 },
  { label: "8 AM",  current: 39, prior: 36 },
  { label: "9 AM",  current: 51, prior: 49 },
  { label: "10 AM", current: 63, prior: 60 },
  { label: "11 AM", current: 69, prior: 66 },
  { label: "12 PM", current: 72, prior: 70 },
  { label: "1 PM",  current: 71, prior: 69 },
  { label: "2 PM",  current: 69, prior: 67 },
  { label: "3 PM",  current: 76, prior: 71 },
  { label: "4 PM",  current: 82, prior: 79 },
  { label: "5 PM",  current: 89, prior: 85 },
  { label: "6 PM",  current: 93, prior: 90 },
  { label: "7 PM",  current: 86, prior: 82 },
  { label: "8 PM",  current: 74, prior: 71 },
  { label: "9 PM",  current: 52, prior: 50 },
  { label: "10 PM", current: 35, prior: 31 },
  { label: "11 PM", current: 20, prior: 19 },
];

const OCCUPANCY_DAILY_WEEK: DataRow[] = [
  { label: "Mon", current: 45, prior: 42 },
  { label: "Tue", current: 38, prior: 37 },
  { label: "Wed", current: 41, prior: 40 },
  { label: "Thu", current: 45, prior: 43 },
  { label: "Fri", current: 52, prior: 51 },
  { label: "Sat", current: 63, prior: 61 },
  { label: "Sun", current: 52, prior: 49 },
];

const OCCUPANCY_DAILY_MONTH: DataRow[] = [
  { label: "Jul 1",  current: 41, prior: 40 },
  { label: "Jul 2",  current: 44, prior: 42 },
  { label: "Jul 3",  current: 45, prior: 44 },
  { label: "Jul 4",  current: 50, prior: 49 },
  { label: "Jul 5",  current: 62, prior: 60 },
  { label: "Jul 6",  current: 59, prior: 57 },
  { label: "Jul 7",  current: 51, prior: 50 },
  { label: "Jul 8",  current: 42, prior: 41 },
  { label: "Jul 9",  current: 45, prior: 43 },
  { label: "Jul 10", current: 47, prior: 45 },
  { label: "Jul 11", current: 49, prior: 48 },
  { label: "Jul 12", current: 52, prior: 51 },
  { label: "Jul 13", current: 61, prior: 60 },
  { label: "Jul 14", current: 57, prior: 55 },
  { label: "Jul 15", current: 44, prior: 42 },
  { label: "Jul 16", current: 45, prior: 44 },
  { label: "Jul 17", current: 48, prior: 47 },
  { label: "Jul 18", current: 51, prior: 50 },
  { label: "Jul 19", current: 55, prior: 53 },
  { label: "Jul 20", current: 63, prior: 61 },
  { label: "Jul 21", current: 59, prior: 58 },
  { label: "Jul 22", current: 38, prior: 37 },
];

const OCCUPANCY_LAST_HOUR: DataRow[] = [
  { label: "6:00", current: 48,  prior: 41 },
  { label: "6:05", current: 52,  prior: 45 },
  { label: "6:10", current: 61,  prior: 53 },
  { label: "6:15", current: 57,  prior: 49 },
  { label: "6:20", current: 63,  prior: 55 },
  { label: "6:25", current: 71,  prior: 62 },
  { label: "6:30", current: 78,  prior: 68 },
  { label: "6:35", current: 84,  prior: 73 },
  { label: "6:40", current: 91,  prior: 79 },
  { label: "6:45", current: 87,  prior: 76 },
  { label: "6:50", current: 93,  prior: 82 },
  { label: "6:55", current: 98,  prior: 87 },
];

export function getOccupancyData(range: DateRangeKey): DataRow[] {
  switch (range) {
    case "hour":  return OCCUPANCY_LAST_HOUR;
    case "day":   return OCCUPANCY_HOURLY_WEEKDAY;
    case "week":  return OCCUPANCY_DAILY_WEEK;
    case "month": return OCCUPANCY_DAILY_MONTH;
    default:      return OCCUPANCY_HOURLY_WEEKDAY;
  }
}

export function getOccupancyStats(range: DateRangeKey): StatSummary[] {
  const data = getOccupancyData(range);
  const total = data.reduce((s, r) => s + r.current, 0);
  const peak  = data.reduce((m, r) => (r.current > m.current ? r : m), data[0]);
  const avg   = Math.round(total / data.length);

  return [
    { label: "Average Occupancy", value: `${avg}%` },
    { label: "Peak Occupancy",    value: `${peak.current}%`, subtext: peak.label },
    { label: "Total Capacity",    value: "100%" },
  ];
}

// ─── Zones mock data ──────────────────────────────────────────────────────────

const ZONES_DATA: DataRow[] = [
  { label: "Zone A (Entrance)",   current: 145, prior: 132 },
  { label: "Zone B (Retail)",     current: 287, prior: 263 },
  { label: "Zone C (Food Court)", current: 412, prior: 387 },
  { label: "Zone D (Parking)",    current: 198, prior: 176 },
  { label: "Zone E (VIP Lounge)", current: 87,  prior: 79 },
];

export function getZonesData(_range: DateRangeKey): DataRow[] {
  // Zones don't vary by time range in this mock
  return ZONES_DATA;
}

export function getZonesStats(_range: DateRangeKey): StatSummary[] {
  const total = ZONES_DATA.reduce((s, r) => s + r.current, 0);
  const busiest = ZONES_DATA.reduce((m, r) => (r.current > m.current ? r : m), ZONES_DATA[0]);
  const avg = Math.round(total / ZONES_DATA.length);

  return [
    { label: "Total Visitors",    value: total.toLocaleString() },
    { label: "Busiest Zone",      value: busiest.current.toLocaleString(), subtext: busiest.label },
    { label: "Average Per Zone",  value: avg.toLocaleString() },
  ];
}

// ─── Dwell Time mock data ─────────────────────────────────────────────────────

const DWELL_TIME_BUCKETS: DataRow[] = [
  { label: "0-30s",    current: 234, prior: 198 },
  { label: "30-60s",   current: 156, prior: 142 },
  { label: "1-3 min",  current: 289, prior: 267 },
  { label: "3-10 min", current: 412, prior: 387 },
  { label: "10+ min",  current: 187, prior: 168 },
];

export function getDwellTimeData(_range: DateRangeKey): DataRow[] {
  // Dwell time buckets are fixed regardless of range
  return DWELL_TIME_BUCKETS;
}

export function getDwellTimeStats(_range: DateRangeKey): StatSummary[] {
  const total = DWELL_TIME_BUCKETS.reduce((s, r) => s + r.current, 0);
  const longest = DWELL_TIME_BUCKETS[DWELL_TIME_BUCKETS.length - 1];
  const avg = Math.round(total / DWELL_TIME_BUCKETS.length);

  return [
    { label: "Total Visits",          value: total.toLocaleString() },
    { label: "Most Common Duration",  value: "3-10 min" },
    { label: "Extended Stays (10+)",  value: longest.current.toLocaleString() },
  ];
}

// ─── Queues mock data ─────────────────────────────────────────────────────────

const QUEUES_HOURLY_WEEKDAY: DataRow[] = [
  { label: "12 AM", current: 2,  prior: 1 },
  { label: "1 AM",  current: 1,  prior: 1 },
  { label: "2 AM",  current: 0,  prior: 0 },
  { label: "3 AM",  current: 0,  prior: 0 },
  { label: "4 AM",  current: 0,  prior: 0 },
  { label: "5 AM",  current: 1,  prior: 1 },
  { label: "6 AM",  current: 4,  prior: 3 },
  { label: "7 AM",  current: 8,  prior: 7 },
  { label: "8 AM",  current: 15, prior: 13 },
  { label: "9 AM",  current: 21, prior: 19 },
  { label: "10 AM", current: 28, prior: 26 },
  { label: "11 AM", current: 32, prior: 31 },
  { label: "12 PM", current: 35, prior: 33 },
  { label: "1 PM",  current: 34, prior: 32 },
  { label: "2 PM",  current: 30, prior: 28 },
  { label: "3 PM",  current: 36, prior: 33 },
  { label: "4 PM",  current: 42, prior: 40 },
  { label: "5 PM",  current: 48, prior: 45 },
  { label: "6 PM",  current: 51, prior: 49 },
  { label: "7 PM",  current: 43, prior: 40 },
  { label: "8 PM",  current: 32, prior: 30 },
  { label: "9 PM",  current: 18, prior: 16 },
  { label: "10 PM", current: 11, prior: 9 },
  { label: "11 PM", current: 5,  prior: 4 },
];

const QUEUES_DAILY_WEEK: DataRow[] = [
  { label: "Mon", current: 18, prior: 16 },
  { label: "Tue", current: 15, prior: 14 },
  { label: "Wed", current: 16, prior: 15 },
  { label: "Thu", current: 19, prior: 17 },
  { label: "Fri", current: 24, prior: 22 },
  { label: "Sat", current: 31, prior: 29 },
  { label: "Sun", current: 27, prior: 25 },
];

const QUEUES_DAILY_MONTH: DataRow[] = [
  { label: "Jul 1",  current: 16, prior: 15 },
  { label: "Jul 2",  current: 18, prior: 16 },
  { label: "Jul 3",  current: 19, prior: 17 },
  { label: "Jul 4",  current: 22, prior: 20 },
  { label: "Jul 5",  current: 28, prior: 26 },
  { label: "Jul 6",  current: 26, prior: 24 },
  { label: "Jul 7",  current: 24, prior: 22 },
  { label: "Jul 8",  current: 17, prior: 16 },
  { label: "Jul 9",  current: 18, prior: 17 },
  { label: "Jul 10", current: 20, prior: 19 },
  { label: "Jul 11", current: 21, prior: 20 },
  { label: "Jul 12", current: 23, prior: 22 },
  { label: "Jul 13", current: 29, prior: 27 },
  { label: "Jul 14", current: 25, prior: 23 },
  { label: "Jul 15", current: 17, prior: 16 },
  { label: "Jul 16", current: 18, prior: 17 },
  { label: "Jul 17", current: 21, prior: 19 },
  { label: "Jul 18", current: 23, prior: 22 },
  { label: "Jul 19", current: 25, prior: 24 },
  { label: "Jul 20", current: 32, prior: 30 },
  { label: "Jul 21", current: 28, prior: 26 },
  { label: "Jul 22", current: 15, prior: 14 },
];

const QUEUES_LAST_HOUR: DataRow[] = [
  { label: "6:00", current: 18, prior: 15 },
  { label: "6:05", current: 21, prior: 18 },
  { label: "6:10", current: 25, prior: 22 },
  { label: "6:15", current: 23, prior: 20 },
  { label: "6:20", current: 27, prior: 24 },
  { label: "6:25", current: 31, prior: 28 },
  { label: "6:30", current: 34, prior: 31 },
  { label: "6:35", current: 36, prior: 33 },
  { label: "6:40", current: 39, prior: 36 },
  { label: "6:45", current: 37, prior: 34 },
  { label: "6:50", current: 41, prior: 38 },
  { label: "6:55", current: 43, prior: 40 },
];

export function getQueuesData(range: DateRangeKey): DataRow[] {
  switch (range) {
    case "hour":  return QUEUES_LAST_HOUR;
    case "day":   return QUEUES_HOURLY_WEEKDAY;
    case "week":  return QUEUES_DAILY_WEEK;
    case "month": return QUEUES_DAILY_MONTH;
    default:      return QUEUES_HOURLY_WEEKDAY;
  }
}

export function getQueuesStats(range: DateRangeKey): StatSummary[] {
  const data = getQueuesData(range);
  const total = data.reduce((s, r) => s + r.current, 0);
  const peak  = data.reduce((m, r) => (r.current > m.current ? r : m), data[0]);
  const avg   = Math.round(total / data.length);

  return [
    { label: "Total Queue Minutes",   value: total.toLocaleString() },
    { label: "Peak Queue Length",     value: peak.current.toLocaleString(), subtext: peak.label },
    { label: "Average Queue Length",  value: avg.toLocaleString() },
  ];
}
