# Retail Analytics Platform - Complete Project Context

## Project Summary
A professional retail analytics dashboard built with Next.js 16, TypeScript, and Tailwind CSS. This is a comprehensive SPA for retail store managers to monitor foot traffic, analyze customer behavior, manage staff, and configure store sensors.

**Tech Stack:**
- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **UI Components:** Base-UI (@base-ui/react)

**Repository:** sheezahhumayun/test-frontend (main branch → retail-analytics-platform head branch)

---

## Application Architecture

### Navigation & Routing

**Main Navigation (NAV_ITEMS):**
```
├── Overview (/)
├── Live Cameras (/live-cameras)
├── Analytics (submenu)
│   ├── Traffic (/analytics/traffic)
│   ├── Occupancy (/analytics/occupancy)
│   ├── Zones (/analytics/zones)
│   ├── Dwell Time (/analytics/dwell-time)
│   └── Queues (/analytics/queues)
├── Visual Analytics (submenu)
│   ├── Store Heatmap (/visual-analytics/heatmap)
│   ├── Zone Performance (/visual-analytics/zone-performance)
│   └── Customer Flow (/visual-analytics/customer-flow) [NEW - MVP]
├── Reports (/reports)
├── Alerts (/alerts)
└── Admin (submenu)
    ├── Cameras (/admin/cameras)
    ├── Zones & Lines (/admin/zones-lines) [NEW - MVP]
    └── Users (/admin/users) [NEW - MVP]
```

### Dashboard Layout Structure

**DashboardShell Component** (`components/dashboard/dashboard-shell.tsx`)
- Top navigation bar with theme toggle, alerts badge, and user menu
- Left sidebar with collapsible navigation
- Main content area
- Footer

**Key Dashboard Components:**
- `top-nav.tsx`: Header with alerts, user menu, scope selector
- `user-menu.tsx`: User dropdown (name, role, logout) - **UPDATED for auth session**
- `nav-dropdown.tsx`: Collapsible navigation
- `scope-selector.tsx`: Store/location selector
- `theme-toggle.tsx`: Light/dark mode switcher
- `alert-badge.tsx`: Alert count indicator

---

## Implemented Features (MVP Phase)

### 1. Login System (NEW - Complete)

**Page:** `/login`

**Features:**
- Centered card layout with professional styling
- Email and password input fields
- Client-side validation (required fields, valid email format)
- Mock authentication: password "demo" succeeds, others fail
- Clear error messages for invalid credentials
- Dev-only role selector dropdown ("Demo: select role")
  - Allows testers to pre-select role and auto-fill matching user email
  - Shows 4 roles: Store Manager, Operations Manager, Retail Analyst, System Administrator
- Session management via localStorage (auth-data.ts utilities)
- Successful login redirects directly to Overview page
- Logout clears session and redirects to login

**Auth Data Structure** (`lib/auth-data.ts`):
```typescript
interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// 4 mock users pre-configured
- Sarah Chen (sarah.chen@retailco.com) - Store Manager
- Marcus Johnson (marcus.johnson@retailco.com) - Operations Manager
- Elena Rodriguez (elena.rodriguez@retailco.com) - Retail Analyst
- David Kim (david.kim@retailco.com) - System Administrator
```

**Auth Functions:**
- `getAuthSession()`: Retrieve current user from localStorage
- `saveAuthSession(user)`: Save user session
- `clearAuthSession()`: Clear session on logout

**Updated Components:**
- `user-menu.tsx`: Now displays actual logged-in user instead of hardcoded CURRENT_USER

---

### 2. Customer Flow Page (NEW - MVP)

**Page:** `/visual-analytics/customer-flow`

**Purpose:** Lightweight placeholder for future customer flow analytics

**Features:**
- Camera/date selector at top (reuses AnalyticsPageLayout pattern)
- Reference store image (placeholder gray background) with canvas overlay
- Mock trajectory visualization: 4 curved path lines in different colors showing common walking routes
  - Entrance → Electronics → Checkout
  - Entrance → General → Checkout
  - Entrance → Checkout (direct)
  - General → Checkout
- Each path has small colored dots and legend labels
- Informational callout banner explaining this is MVP
- "Full customer flow analysis (path sequencing, common route identification, drop-off points) is planned for a future release"

**Components:**
- `customer-flow/customer-flow-controls.tsx`: Camera selector, date picker
- `customer-flow/customer-flow-viz.tsx`: Canvas-based trajectory visualization
- `customer-flow/future-feature-callout.tsx`: Info banner for future feature

**Styling:** Matches other analytics pages (consistent fonts, spacing, card treatment)

---

### 3. Admin — Zones & Lines Page (NEW - Complete)

**Page:** `/admin/zones-lines`

**Purpose:** Canvas-based polygon and counting line editor for defining store zones and traffic counting lines

**Features:**

**Canvas Editor:**
- Large reference store floor plan image (placeholder gray)
- HTML5 canvas overlay for drawing
- Distinct colors per zone for visual distinction

**Drawing Modes (toggled via toolbar buttons):**
1. **Select Mode:** Interact with existing shapes
2. **Draw Zone Mode:**
   - Click multiple points to build polygon
   - Shows live outline as user clicks points
   - Double-click or "Finish" button closes polygon
   - Displays vertex dots and snap-to-close indicator
   - After closing, prompts for zone name and type
3. **Draw Line Mode:**
   - Click exactly two points to define counting line
   - After placing line, prompts for name and direction (left/right side = "inside")
   - Shows arrow indicator for direction

**Zone Type Options:**
- Entrance (blue #3b82f6)
- Checkout/Queue (green #10b981)
- General (purple #8b5cf6)

**Sidebar List:**
- Shows all zones/lines for current camera
- Displays: name, type/direction, color swatch
- Delete button per row
- Updates in real-time as new shapes drawn

**Camera Selector:**
- Dropdown to switch between CAM-001, CAM-002, CAM-003
- Each camera has independent set of zones/lines

**Save Button:**
- Logs coordinates to console (mock implementation)
- Shows spinner feedback + success toast

**Components:**
- `zones-lines/zones-lines-canvas.tsx`: Main canvas editor
- `zones-lines/editor-toolbar.tsx`: Mode toggle buttons
- `zones-lines/shapes-sidebar.tsx`: List of defined zones/lines
- `zones-lines/zone-name-form.tsx`: Inline form after polygon closed
- `zones-lines/line-side-form.tsx`: Inline form after line drawn

**Mock Data:** Pre-configured shapes for 3 cameras (CAM-001, CAM-002, CAM-003)

---

### 4. Admin — Users Page (NEW - Complete)

**Page:** `/admin/users`

**Purpose:** Standard admin CRUD interface for managing user accounts and roles

**Features:**

**User Table:**
- Columns: Name, Email, Role (colored badge), Assigned Store, Status
- 6 mock users across 4 roles
- Hover effects and clean styling

**Role Badges (Color-coded):**
- Store Manager: Blue (#3b82f6)
- Operations Manager: Green (#10b981)
- Retail Analyst: Purple (#8b5cf6)
- System Administrator: Orange (#f97316)

**Status Field:**
- Active: Green badge
- Disabled: Gray badge

**Summary Cards:**
- Total Users count
- Active count
- Disabled count

**Add User Modal:**
- Form fields: Name, Email, Role (dropdown), Store (dropdown), Password, Confirm Password
- Password field includes helper note: "Share this password with the user directly (e.g. Slack, in person)."
- Client-side validation:
  - Required fields: Name, Email, Password, Confirm Password
  - Valid email format check
  - Password minimum 8 characters
  - Passwords must match
  - Error messages in red below each field
  - Errors clear on input change

**Edit User Modal:**
- Pre-filled form with existing user data
- Fields: Name, Email, Role, Store, Status
- NO password fields (separate Reset Password action)

**Reset Password Action:**
- Key icon button per row
- Opens dedicated modal with: New Password, Confirm Password
- Same validation as Add User

**Delete Action:**
- Trash icon button per row
- Confirmation prompt before deletion

**Components:**
- `admin/user-table.tsx`: Main table with action buttons
- `admin/user-modal.tsx`: Add/Edit user form
- `admin/reset-password-modal.tsx`: Password reset form
- `app/admin/users/page.tsx`: Main page with state management

**Stores Available:**
- Downtown Mall
- Riverside Shopping Center
- Westfield Plaza
- Tech Hub District

---

## Existing Features (Pre-MVP)

### Analytics Pages
- **Overview** (`/`): KPI cards, real-time charts
- **Traffic Analytics** (`/analytics/traffic`): Traffic trends and comparisons
- **Occupancy Analytics** (`/analytics/occupancy`): Capacity monitoring
- **Zones Analytics** (`/analytics/zones`): Per-zone distribution
- **Dwell Time Analytics** (`/analytics/dwell-time`): Time spent analysis
- **Queues Analytics** (`/analytics/queues`): Queue monitoring

### Visual Analytics
- **Store Heatmap** (`/visual-analytics/heatmap`): Density visualization
- **Zone Performance** (`/visual-analytics/zone-performance`): Zone metrics

### Other Pages
- **Live Cameras** (`/live-cameras`): Camera feeds with overlays
- **Reports** (`/reports`): Customizable reporting
- **Alerts** (`/alerts`): Alert management
- **Admin Cameras** (`/admin/cameras`): Camera configuration CRUD

---

## Authentication Flow (Current)

**Login:**
1. User navigates to `/login`
2. Optionally selects role from "Demo: select role" dropdown
3. Enters email and password ("demo" to succeed)
4. On success: auth session saved to localStorage
5. Redirected to Overview (`/`)
6. UserMenu displays logged-in user info

**Session Management:**
- `getAuthSession()`: Retrieves user from localStorage
- `saveAuthSession(user)`: Saves user object
- `clearAuthSession()`: Clears on logout

**Note:** No auth middleware. Routes are publicly accessible for MVP testing.

---

## Development Patterns

### State Management
- React hooks (useState, useEffect) for component-level state
- No global state management

### Data Flow
- Mock data files provide initial data
- Component state modifications update UI
- Console logs track actions

### Form Handling
- React controlled inputs
- Real-time validation
- Clear error messaging

---

## Summary

This retail analytics platform provides a comprehensive dashboard for store managers to monitor operations and configure store sensors. The MVP phase includes a complete login system, user management, canvas-based zone/line editor, and customer flow visualization placeholder. All features are fully functional and tested.

**3 Major Features Added in MVP Phase:**
1. **Login System** - Authentication with role selection
2. **Admin — Users** - Complete user CRUD with password management
3. **Admin — Zones & Lines** - Canvas-based polygon/line editor
4. **Customer Flow** - Lightweight visualization placeholder

All implemented with professional styling, client-side validation, and consistent design patterns.
