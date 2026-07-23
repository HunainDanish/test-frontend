export type NavLeaf = {
  label: string
  href: string
}

export type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; href?: undefined; children: NavLeaf[] }

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/" },
  { label: "Live Cameras", href: "/live-cameras" },
  {
    label: "Analytics",
    children: [
      { label: "Traffic", href: "/analytics/traffic" },
      { label: "Occupancy", href: "/analytics/occupancy" },
      { label: "Zones", href: "/analytics/zones" },
      { label: "Dwell Time", href: "/analytics/dwell-time" },
      { label: "Queues", href: "/analytics/queues" },
    ],
  },
  {
    label: "Visual Analytics",
    children: [
      { label: "Store Heatmap", href: "/visual-analytics/heatmap" },
      { label: "Zone Performance", href: "/visual-analytics/zone-performance" },
      { label: "Customer Flow", href: "/visual-analytics/customer-flow" },
    ],
  },
  { label: "Reports", href: "/reports" },
  { label: "Alerts", href: "/alerts" },
  {
    label: "Admin",
    children: [
      { label: "Cameras", href: "/admin/cameras" },
      { label: "Zones & Lines", href: "/admin/zones-lines" },
      { label: "Users", href: "/admin/users" },
    ],
  },
]

/** Mocked count of unread / open alerts shown in the nav pill. */
export const OPEN_ALERT_COUNT = 3

/** Mocked logged-in user for the role indicator. */
export const CURRENT_USER = {
  name: "Jane Doe",
  role: "Store Manager",
  initials: "JD",
}
