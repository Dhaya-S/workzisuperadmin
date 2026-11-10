 **Fonts**, **Layout Architecture**, and **Font Sizes** used throughout the codebase:

---

### 1. Fonts & Typography System

**Primary Font Stack**: Uses modern system UI font stack (defined by Tailwind CSS v4 and the base layer in [theme.css](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/styles/theme.css)):
 
css
  ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
 
**Monospace Font Stack**: font-mono (used for keyboard shortcuts e.g., ⌥E, ⌥D in [AppHeader.tsx](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/app/AppHeader.tsx#L505)).
**Font Weights**:
  * **Regular / Normal (400)**: --font-weight-normal (input placeholders, secondary descriptions, body text).
  * **Medium (500)**: --font-weight-medium (interactive buttons, tabs, input values, table cells, form labels).
  * **Semi-Bold (600)**: font-semibold (page headers, card titles, section headers, active navigation items).
  * **Bold (700)**: font-bold (metric values, KPI cards, modal titles).

---

### 2. Layout Structure

The layout is built on a responsive, flexible shell structure ([app-shell.tsx](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/app/layouts/app-shell.tsx)):
┌────────────────────────────────────────────────────────────────────────┐
│                        AppShell (h-screen)                             │
├────────────────┬───────────────────────────────────────────────────────┤
│                │  AppHeader (Sticky / Fixed Top)                       │
│                │   ├─ Row 1: Title, Search, Quick Actions, Profile     │
│                │   ├─ Row 2: Context Navigation Tabs (h-[52px])        │
│  Resizable     │   └─ Row 3: Context Toolbar & Filters (h-[60px])      │
│  Sidebar       ├───────────────────────────────────────────────────────┤
│  (72px-340px)  │  Main Content Area (<main class="flex-1">)            │
│                │   ├─ PageHeader (Breadcrumbs, Title, Actions)         │
│                │   └─ Module Grid / Table / Kanban View                │
├────────────────┴───────────────────────────────────────────────────────┤
│  Overlays: AIPanel Drawer (380px), NotificationsPanel, Modal Dialogs   │
└────────────────────────────────────────────────────────────────────────┘#### Key Layout Specifications:
1. **Sidebar ([sidebar.tsx](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/app/layouts/sidebar.tsx) & [ResizableSidebar.tsx](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/shared/layout/sidebar/ResizableSidebar.tsx))**:
   * **Default Width**: 250px
   * **Collapsed Width**: 72px (icon-only mode)
   * **Resize Bounds**: Min 72px to Max 340px (via pointer drag handle)
   * **Mobile (< 768px)**: Slide-in overlay drawer with backdrop blur (fixed left-0 top-0 bottom-0 z-50).
   * **Desktop (>= 1024px)**: Split pane with resizable drag handle.

2. **App Header ([AppHeader.tsx](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/app/AppHeader.tsx))**:
   * **Row 1 (Top Bar)**: h-[70px], contains workspace title, search trigger (38x38px), quick create popover, notification bell with badge, and user profile pill.
   * **Row 2 (Tabs)**: h-[52px], horizontal scrollable tab strip with active border indicator.
   * **Row 3 (Toolbar)**: h-[60px], dynamic actions, search inputs, segmented controls (h-[38px]).

3. **Main Content Container**:
   * Background: #F7F8FA
   * Overflow: flex-1 overflow-auto

4. **Slide-in Drawers & Overlays**:
   * **AI Panel Drawer**: Slide-over drawer with w-[380px] / w-[400px] ([ai-panel.tsx](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/app/layouts/ai-panel.tsx)).
   * **Modals**: Centered dialogs (max-w-md, max-w-lg, max-w-2xl) with backdrop blur ([modal.tsx](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/shared/components/modal/modal.tsx)).

---

### 3. Font Size Scale & Hierarchy

Configured via [theme.css](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/styles/theme.css) (with root --font-size: 16px):

| Size | Class / Value | Usage & Components |
| :--- | :--- | :--- |
| **10px** | text-[10px] | Keyboard shortcuts (⌥E), notification badge count, avatar xs, micro timestamps |
| **11px** | text-[11px] | Avatar sm, uppercase section labels / caption tags (tracking-wider) |
| **12px** | text-xs (0.75rem) | Secondary text/subtitles, breadcrumbs, status badges, dropdown options, avatar md |
| **13px** | text-[13px] | Segmented control buttons ([SegmentedControl](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/app/AppHeader.tsx#L28)), profile name/role in header |
| **14px** | text-sm (0.875rem) | **Primary base UI size**: Sidebar navigation items, table cells, form inputs, buttons, tab items, modal titles |
| **16px** | text-base (1rem) | Page header titles ([PageHeader](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/shared/components/page-header/page-header.tsx#L14)), form section titles, base <h4> / <label> / <button> |
| **18px** | text-[18px] / text-lg | Main app header title (AppHeader), section header titles (<h3>) |
| **20px** | text-xl (1.25rem) | KPI & metric values in cards ([card.tsx](file:///d:/Zuntra/Attendance/Attendance%20web%20code%20file/src/shared/components/card/card.tsx#L16)), sub-headings (<h2>) |
| **24px** | text-2xl (1.5rem) | Top-level section headings (<h1>), auth/getting-started hero headers |