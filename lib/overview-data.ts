// Mock data for the Overview dashboard

export const kpiData = {
  visitorsToday: {
    value: 3847,
    label: "Visitors Today",
    trend: 12.5,
    icon: "users",
  },
  occupancy: {
    value: 68,
    unit: "%",
    label: "Current Occupancy",
    trend: 3.2,
    icon: "activity",
  },
  peakOccupancy: {
    value: 92,
    unit: "%",
    label: "Peak Occupancy",
    subtext: "2:45 PM",
    icon: "zap",
  },
  dwellTime: {
    value: 18,
    unit: "min",
    label: "Average Dwell Time",
    trend: -2.1,
    icon: "clock",
  },
  queueLength: {
    value: 4,
    label: "Current Queue Length",
    trend: 8.7,
    icon: "list",
  },
  activeCameras: {
    value: 4,
    total: 5,
    label: "Active Cameras",
    icon: "camera",
  },
};

// Realistic hourly visitor data (peaks midday/evening)
export const visitorsByHourData = [
  { hour: "12 AM", visitors: 124 },
  { hour: "1 AM", visitors: 87 },
  { hour: "2 AM", visitors: 52 },
  { hour: "3 AM", visitors: 38 },
  { hour: "4 AM", visitors: 45 },
  { hour: "5 AM", visitors: 62 },
  { hour: "6 AM", visitors: 128 },
  { hour: "7 AM", visitors: 241 },
  { hour: "8 AM", visitors: 389 },
  { hour: "9 AM", visitors: 512 },
  { hour: "10 AM", visitors: 634 },
  { hour: "11 AM", visitors: 687 },
  { hour: "12 PM", visitors: 724 },
  { hour: "1 PM", visitors: 712 },
  { hour: "2 PM", visitors: 689 },
  { hour: "3 PM", visitors: 758 },
  { hour: "4 PM", visitors: 823 },
  { hour: "5 PM", visitors: 891 },
  { hour: "6 PM", visitors: 934 },
  { hour: "7 PM", visitors: 856 },
  { hour: "8 PM", visitors: 742 },
  { hour: "9 PM", visitors: 521 },
  { hour: "10 PM", visitors: 347 },
  { hour: "11 PM", visitors: 203 },
];

// Entries vs Exits throughout the day
export const entriesExitsData = [
  { hour: "12 AM", entries: 124, exits: 118 },
  { hour: "2 AM", entries: 52, exits: 48 },
  { hour: "4 AM", entries: 45, exits: 42 },
  { hour: "6 AM", entries: 128, exits: 102 },
  { hour: "8 AM", entries: 389, exits: 245 },
  { hour: "10 AM", entries: 634, exits: 412 },
  { hour: "12 PM", entries: 724, exits: 651 },
  { hour: "2 PM", entries: 689, exits: 704 },
  { hour: "4 PM", entries: 823, exits: 756 },
  { hour: "6 PM", entries: 934, exits: 687 },
  { hour: "8 PM", entries: 742, exits: 821 },
  { hour: "10 PM", entries: 347, exits: 412 },
];

// 7-day occupancy trend
export const occupancyTrendData = [
  { day: "Mon", occupancy: 61 },
  { day: "Tue", occupancy: 64 },
  { day: "Wed", occupancy: 58 },
  { day: "Thu", occupancy: 72 },
  { day: "Fri", occupancy: 78 },
  { day: "Sat", occupancy: 85 },
  { day: "Today", occupancy: 68 },
];
