# Attendance HRMS — Brand Guidelines & Design System
## Figma Make Implementation Guide

> **Purpose:** This document defines the visual language, UI patterns, layout rules, components, interaction behavior, and implementation constraints for Attendance HRMS.
>
> **Primary reference:** The supplied Attendance HRMS dashboard screenshot.
>
> **Important:** When creating or modifying screens, Figma Make should treat this document as the source of truth for the **visual style**. Do not introduce a different visual language, excessive gradients, oversized typography, heavy shadows, dark cards, or decorative UI unless explicitly requested.

---

# 1. Brand Direction

## 1.1 Product personality

Attendance HRMS should feel:

- Professional
- Clean
- Calm
- Reliable
- Modern
- Efficient
- Enterprise-ready
- Easy to scan
- Lightweight rather than visually heavy

The product is an HR/workforce management SaaS product. The interface should communicate trust and clarity rather than visual excitement.

## 1.2 Visual principle

**Clarity first. Data second. Decoration last.**

The UI should make operational information easy to understand at a glance.

Use:
- White surfaces
- Very light neutral page backgrounds
- Purple/indigo primary actions
- Thin borders
- Small, controlled shadows
- Compact but comfortable spacing
- Clear hierarchy
- Restrained color coding

Avoid:
- Glassmorphism
- Large gradients
- Strong drop shadows
- Excessive rounded cards
- Huge headings
- Neon colors
- Dense dark UI
- Decorative illustrations that compete with HR data
- Random component styles

---

# 2. Color System

## 2.1 Primary brand color

### Primary Purple
- **HEX:** `#5C5CFF`
- RGB: `92, 92, 255`
- Use for:
  - Primary buttons
  - Active navigation
  - Active tabs
  - Important links
  - Selected states
  - Primary icons
  - Progress indicators
  - Key dashboard metrics

### Primary Hover / Pressed
- **HEX:** `#5151E6`
- Use for hover/pressed states when a darker primary tone is required.

### Primary Soft Background
- **HEX:** `#EEF2FF`
- Use for:
  - Active sidebar item background
  - Selected navigation states
  - Soft primary badges
  - Highlight containers

---

# 3. Neutral Color Palette

## 3.1 Page background

### Background
- **HEX:** `#F7F8FA`
- Use as the main application content background.

The screenshot uses a very subtle cool-gray background behind cards.

## 3.2 Surfaces

### Surface / Card
- **HEX:** `#FFFFFF`

### Elevated Surface
- **HEX:** `#FFFFFF`

Cards should generally be white against the light gray page background.

## 3.3 Borders

### Border
- **HEX:** `#E5E7EB`

### Divider
- **HEX:** `#ECEEF2`

Borders should be subtle and approximately 1px.

## 3.4 Text

### Primary Text
- **HEX:** `#101828`

Use for:
- Page titles
- Card titles
- Important values
- Primary navigation text

### Secondary Text
- **HEX:** `#4A5565`

Use for:
- Labels
- Secondary navigation
- Supporting descriptions

### Tertiary / Muted Text
- **HEX:** `#8B8F98`

Use for:
- Helper text
- Metadata
- Dates
- Disabled-looking secondary information

### Placeholder
- **HEX:** `#98A2B3`

---

# 4. Semantic Colors

Semantic colors should be used sparingly and consistently.

## Success
- Main: `#16A34A`
- Soft background: `#DCFCE7`
- Use for:
  - Present
  - Approved
  - Active
  - Completed
  - Successful actions

## Warning
- Main: `#F59E0B`
- Soft background: `#FEF3C7`
- Use for:
  - Late
  - Pending
  - Attention required

## Error
- Main: `#DC2626`
- Soft background: `#FEE2E2`
- Use for:
  - Failed
  - Rejected
  - Errors
  - Destructive states

## Info
- Main: `#3B82F6`
- Soft background: `#DBEAFE`
- Use for:
  - WFH
  - Informational states

## Leave / Accent Purple
- Main: `#8B5CF6`
- Soft background: `#F3E8FF`
- Use for:
  - Leave
  - Secondary purple status

## Neutral / Offline
- Main: `#9CA3AF`
- Soft background: `#F3F4F6`
- Use for:
  - Offline
  - Inactive
  - No activity

---

# 5. Color Usage Rules

Use approximately:

- 70–80% neutrals
- 10–15% primary purple
- 5–10% semantic/status colors

The interface should **not** become a rainbow dashboard.

Status colors exist to communicate meaning, not decoration.

---

# 6. Typography

## 6.1 Font family

Use:

**Inter**

Fallback:
`Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Inter should be used consistently throughout the application.

---

# 7. Typography Scale

## Display / Large Metric
- 28–32px
- Weight: 600–700
- Line height: 36–40px

Use only for major dashboard numbers.

## Page Title
- 20–24px
- Weight: 600
- Line height: 28–32px

Example:
`My Space`

## Section / Card Title
- 14–16px
- Weight: 600
- Line height: 20–24px

Example:
`Today's Attendance`

## Body
- 14px
- Weight: 400
- Line height: 20px

## Navigation
- 14px
- Weight: 500

Active navigation:
- 500–600

## Small Label
- 11–12px
- Weight: 500
- Uppercase only where useful

Example:
`PRESENT`

## Helper / Metadata
- 11–12px
- Weight: 400

---

# 8. Font Weight Rules

Use only these weights:

- 400 — Regular
- 500 — Medium
- 600 — Semibold
- 700 — Bold

Avoid excessive bold text.

Most UI labels should be 400 or 500.

---

# 9. Layout System

## 9.1 Overall application shell

Desktop layout:

```text
┌──────────────────────────────────────────────────────────┐
│ Sidebar │ Top Header                                     │
│         ├───────────────────────────────────────────────┤
│         │ Secondary Navigation / Tabs                    │
│         ├───────────────────────────────────────────────┤
│         │                                               │
│         │ Main Content                                  │
│         │                                               │
│         │                                               │
└──────────────────────────────────────────────────────────┘
```

## 9.2 Sidebar

Desktop sidebar:
- Width: approximately 248px
- Full viewport height
- White background
- Right border: 1px `#E5E7EB`

Sidebar contains:
1. Product logo/name
2. Primary navigation
3. Divider
4. Settings/support items
5. Bottom user profile area

Do not make the sidebar visually heavy.

---

# 10. Sidebar Navigation

## Navigation item

Height:
- 40–44px

Horizontal padding:
- 16px

Border radius:
- 0–6px depending on placement

Icon:
- 18–20px

Text:
- 14px

## Active item

Active background:
`#EEF2FF`

Active text:
`#5C5CFF`

Active icon:
`#5C5CFF`

A subtle left active indicator may be used.

## Inactive item

Text:
`#4A5565`

Icon:
`#667085`

Hover:
- Background: `#F7F8FA`
- Text: `#101828`

---

# 11. Top Header

Height:
- Approximately 64–72px

Background:
- `#FFFFFF`

Bottom border:
- `#E5E7EB`

Layout:

```text
Page title                         Actions       User
```

Typical actions:
- Add
- Search
- Notifications
- Settings
- User profile

Icon buttons:
- 40px × 40px
- White background
- 1px neutral border
- Radius: 10–12px

---

# 12. Secondary Navigation / Tabs

The dashboard uses a horizontal tab navigation below the top header.

Example:

```text
Dashboard    Attendance    Leave    Approvals    Calendar
```

Tab:
- Font: 14px
- Weight: 500
- Text: `#4A5565`
- Horizontal padding: 8–12px

Active tab:
- Text: `#5C5CFF`
- Bottom indicator: `#5C5CFF`
- Indicator height: 1–2px

Avoid pill-shaped tabs unless explicitly requested.

---

# 13. Main Content Container

Recommended desktop content width:
- Flexible
- Maximum readable width around 1100–1200px
- Centered or aligned consistently with the product shell

Page padding:
- 32px desktop
- 24px tablet
- 16px mobile

Vertical spacing:
- 24px between major sections

---

# 14. Grid System

Use an 8px spacing system.

Base unit:
**8px**

Common values:

| Token | Value |
|---|---:|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 40px |
| 4xl | 48px |

Prefer multiples of 8 whenever possible.

---

# 15. Border Radius

Use restrained rounding.

## Small
- 6px

## Medium
- 8px

## Card
- 12–14px

## Large containers
- 16px

## Pills
- 999px

Do not make every element extremely rounded.

The screenshot's visual language is soft but professional, not bubbly.

---

# 16. Shadows

The interface primarily relies on borders rather than strong shadows.

Default card shadow:
```css
0 1px 2px rgba(16, 24, 40, 0.03)
```

Elevated shadow:
```css
0 4px 12px rgba(16, 24, 40, 0.06)
```

Use shadows only when elevation needs to be communicated.

Avoid:
- Large blurry shadows
- Dark shadows
- Multiple layered shadows

---

# 17. Cards

## Standard Card

Properties:
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Radius: 12–14px
- Shadow: minimal
- Padding: 16–20px

Structure:

```text
Card
├── Header
│   ├── Title
│   └── Action
├── Divider (optional)
└── Content
```

Card titles should be compact.

---

# 18. Dashboard Metric Cards

The screenshot uses compact metric cards for:

- Present
- WFH
- Leave
- Late
- Offline

Recommended structure:

```text
┌───────────────────────┐
│ LABEL             ●   │
│                       │
│ 0                     │
│ Click to view →       │
└───────────────────────┘
```

Rules:
- Label: 11–12px
- Metric: 20–24px, 600–700
- Supporting CTA: 11–12px
- Status dot: 6–8px
- White background
- Thin border
- 12–14px radius

Each metric card may use a semantic border/accent, but keep the accent subtle.

---

# 19. Buttons

## Primary Button

Background:
`#5C5CFF`

Text:
`#FFFFFF`

Height:
- 40px standard
- 44px large

Radius:
- 8–10px

Font:
- 14px
- 500–600

Hover:
`#5151E6`

Pressed:
Slightly darker primary color.

## Secondary Button

Background:
`#FFFFFF`

Border:
`#D0D5DD`

Text:
`#344054`

## Tertiary Button

No visible border.

Text:
`#5C5CFF`

Use for:
- View details
- View all
- Full report

## Destructive Button

Background:
`#DC2626`

Text:
`#FFFFFF`

Use only for irreversible/destructive actions.

---

# 20. Icon Buttons

Size:
- 40 × 40px

Icon:
- 18–20px

Border:
`#E5E7EB`

Radius:
- 10–12px

Default:
White background.

Hover:
`#F7F8FA`

Icons should be outline-based and visually lightweight.

Recommended icon style:
- Lucide-style
- 1.75–2px stroke
- Rounded line endings

Do not mix filled icons with outline icons without a strong reason.

---

# 21. Forms

## Input

Height:
- 40–44px

Border:
`#D0D5DD`

Radius:
- 8px

Background:
`#FFFFFF`

Text:
14px

Placeholder:
`#98A2B3`

Focus:
- Border: `#5C5CFF`
- Optional subtle focus ring using a low-opacity primary color

Example focus ring:
```css
box-shadow: 0 0 0 3px rgba(92, 92, 255, 0.12);
```

---

# 22. Labels

Form label:
- 13–14px
- Weight: 500
- Color: `#344054`

Spacing:
- 6–8px between label and field

Helper text:
- 12px
- `#667085`

Error:
- 12px
- `#DC2626`

---

# 23. Dropdowns / Selects

Use the same visual language as inputs.

Height:
40–44px

Radius:
8px

Border:
`#D0D5DD`

Dropdown menu:
- White
- 1px border
- 8px radius
- Minimal shadow
- 4–6px vertical padding

Option height:
36–40px

Selected option:
- Soft primary background `#EEF2FF`
- Primary text

---

# 24. Tables

Tables should be highly readable and restrained.

Header:
- Background: `#F9FAFB`
- Text: 12px, 500
- Color: `#667085`

Rows:
- White
- Border-bottom: `#EAECF0`

Cell text:
- 13–14px

Row height:
- 52–60px

Hover:
- `#F9FAFB`

Avoid heavy grid lines around every cell.

---

# 25. Status Badges

Use compact status badges.

Height:
- 24–28px

Padding:
- 6px 10px

Radius:
- 999px

Font:
- 11–12px
- Weight: 500

Examples:

### Present
Background: `#DCFCE7`
Text: `#15803D`

### WFH
Background: `#DBEAFE`
Text: `#2563EB`

### Leave
Background: `#F3E8FF`
Text: `#7C3AED`

### Late
Background: `#FEF3C7`
Text: `#B45309`

### Offline
Background: `#F3F4F6`
Text: `#6B7280`

---

# 26. Charts

Charts should remain minimal.

Use:
- Thin grid lines
- Small axis labels
- Subtle data lines/bars
- Semantic colors only where meaning is required

Chart background:
- White

Grid:
- `#EEF0F3`

Axis labels:
- 11–12px
- `#98A2B3`

Do not use 3D charts.

Do not use gradients inside charts unless explicitly requested.

---

# 27. Dashboard Information Hierarchy

A typical dashboard should follow:

1. Greeting / page context
2. Date or time context
3. Key metrics
4. Immediate action / today's attendance
5. Trend / monthly summary
6. Pending actions / approvals
7. Additional secondary information

The most important information should appear above the fold.

---

# 28. Empty States

Empty states should be calm and useful.

Structure:

```text
Icon / subtle illustration

No attendance records yet

Supporting explanation

[Primary action]
```

Do not use giant illustrations.

Keep empty-state content compact.

---

# 29. Loading States

Use:
- Skeleton loaders
- Subtle shimmer
- Placeholder blocks

Avoid full-screen spinners unless the entire application is loading.

Skeletons should match the actual component dimensions.

---

# 30. Toasts / Notifications

Position:
- Top-right or bottom-right

Style:
- White
- Border
- Small shadow
- 10–12px radius

Structure:
```text
Icon  Title
      Description
```

Auto-dismiss for non-critical notifications.

---

# 31. Modal / Dialog

Overlay:
- Black with approximately 20–30% opacity

Modal:
- White
- 16px radius
- Minimal shadow
- Width based on content, generally 400–600px

Structure:

```text
Title                         ×

Description

Form / Content

              Cancel   Primary Action
```

Do not make modals full-screen unless the task requires a complex workflow.

---

# 32. Confirmation Dialogs

For destructive actions:

**Title**
`Delete department?`

**Explanation**
Clearly explain what will happen.

Actions:
`Cancel`
`Delete`

The destructive action must be visually distinct.

---

# 33. Tooltips

Use for:
- Icon-only buttons
- Unfamiliar controls
- Truncated information

Tooltip:
- Dark neutral background
- White text
- 12px
- 6px radius

Keep tooltip text short.

---

# 34. Navigation Behavior

Navigation should preserve context.

When navigating:
- Active sidebar item updates
- Page title updates
- Secondary tabs update when applicable
- Breadcrumbs may be used for deep pages

Do not create unnecessary navigation layers.

---

# 35. Responsive Design

## Desktop

Primary layout:
- Fixed sidebar
- Full top header
- Content area

## Tablet

- Sidebar may collapse
- Content becomes fluid
- Dashboard cards wrap

## Mobile

- Sidebar becomes a drawer or bottom navigation depending on flow
- Cards stack vertically
- Tables become horizontally scrollable or transform into list cards
- Top actions should remain accessible
- Maintain 16px page padding

Never simply shrink the desktop UI.

Responsive behavior should preserve hierarchy.

---

# 36. Accessibility

Minimum requirements:

- Text contrast should be readable
- Never communicate status through color alone
- Buttons need clear labels or accessible tooltips
- Focus states must be visible
- Interactive controls should have adequate touch targets
- Avoid tiny text for important information
- Forms must have visible labels

Recommended touch target:
**44 × 44px**

---

# 37. Iconography

Use one consistent icon family.

Recommended:
**Lucide / Lucide React style**

Visual characteristics:
- Outline
- Rounded ends
- Approximately 1.75–2px stroke
- 18–20px standard size

Common icons:

| Meaning | Icon |
|---|---|
| Dashboard | LayoutDashboard / Grid |
| Team | Users |
| Organization | Building2 |
| Attendance | Clock |
| Leave | CalendarDays |
| Tasks | ClipboardList |
| Documents | FileText |
| Settings | Settings |
| Search | Search |
| Notifications | Bell |
| Add | Plus |
| User | User |
| Approvals | ClipboardCheck |
| Calendar | Calendar |
| Edit | Pencil |
| Delete | Trash2 |
| More | MoreHorizontal |
| Back | ChevronLeft |
| Forward | ChevronRight |

---

# 38. Avatar

Default avatar:
- Circular
- 32–40px

Example:
`DS`

Use primary purple background when no profile image is available.

Text:
- White
- 12–14px
- Semibold

---

# 39. User Profile Area

The screenshot uses:

```text
[DS]  username
      Super Admin
```

Keep this structure.

Username:
- 14px
- 500–600
- Primary text

Role:
- 12px
- Muted/brand-associated text

Dropdown chevron:
- 16px

---

# 40. Data Visualization Status Language

Use consistent status terminology:

- Present
- WFH
- Leave
- Late
- Offline
- Pending
- Approved
- Rejected
- Active
- Inactive

Do not invent multiple names for the same state.

Example:
Use `WFH`, not alternating between `Remote`, `Work From Home`, and `WFH` inside the same product unless context requires the full wording.

---

# 41. Content / Microcopy Style

Tone:
- Professional
- Direct
- Human
- Short

Good:
`Here's what needs your attention today.`

Good:
`Today's Attendance`

Good:
`View details →`

Avoid:
`Welcome to your amazing attendance management experience!`

Avoid unnecessary explanatory paragraphs.

Use sentence case for most UI text.

---

# 42. Dashboard Greeting

Preferred structure:

```text
Good morning, [Name] 👋
Here's what needs your attention today.
```

Greeting:
- 18–20px
- 600

Supporting line:
- 13–14px
- Muted

---

# 43. Date Selector

Compact date pill:

- White background
- Thin border
- 8–10px radius
- 12–13px text
- Muted text

Example:
`Wed, Sep 2, 2026`

It should look like a contextual control rather than a large button.

---

# 44. Section Headers

Structure:

```text
Section title                         View all →
```

Title:
- 14–16px
- 600

Action:
- 13px
- Primary purple

Use arrows sparingly.

Preferred:
`View details →`

---

# 45. Design Tokens

Use these tokens when implementing the system.

```css
:root {
  --color-primary: #5C5CFF;
  --color-primary-hover: #5151E6;
  --color-primary-soft: #EEF2FF;

  --color-background: #F7F8FA;
  --color-surface: #FFFFFF;

  --color-border: #E5E7EB;
  --color-divider: #ECEEF2;

  --color-text-primary: #101828;
  --color-text-secondary: #4A5565;
  --color-text-muted: #8B8F98;
  --color-text-placeholder: #98A2B3;

  --color-success: #16A34A;
  --color-success-soft: #DCFCE7;

  --color-warning: #F59E0B;
  --color-warning-soft: #FEF3C7;

  --color-error: #DC2626;
  --color-error-soft: #FEE2E2;

  --color-info: #3B82F6;
  --color-info-soft: #DBEAFE;

  --color-leave: #8B5CF6;
  --color-leave-soft: #F3E8FF;

  --color-neutral: #9CA3AF;
  --color-neutral-soft: #F3F4F6;

  --font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-card: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;
  --space-8: 48px;
}
```

---

# 46. Component Library

Figma Make should reuse components rather than recreating visual styles independently.

Required component families:

### Navigation
- Sidebar
- SidebarItem
- TopHeader
- TabNavigation
- Breadcrumb

### Actions
- PrimaryButton
- SecondaryButton
- TertiaryButton
- IconButton
- ButtonWithIcon

### Data
- MetricCard
- DataTable
- TableRow
- StatusBadge
- Stat
- ChartCard

### Forms
- TextInput
- SearchInput
- Select
- MultiSelect
- DatePicker
- TimePicker
- Checkbox
- Radio
- Toggle
- Textarea

### Feedback
- Toast
- Alert
- EmptyState
- Skeleton
- ErrorState

### Overlays
- Modal
- ConfirmationDialog
- Dropdown
- Tooltip

### Identity
- Avatar
- UserMenu

---

# 47. Component Consistency Rules

If a component already exists:

**Reuse it.**

Do not create:
- Button version A
- Button version B
- Button version C

unless they represent a genuinely different semantic purpose.

The same action should look the same throughout the application.

---

# 48. Figma Make Rules

When generating new screens:

### MUST

1. Use Inter.
2. Use `#5C5CFF` as the primary brand color.
3. Use white cards over a subtle cool-gray background.
4. Use thin neutral borders.
5. Use restrained shadows.
6. Use 8px spacing increments wherever practical.
7. Maintain the same sidebar and top-header language.
8. Maintain the same icon style.
9. Reuse existing component patterns.
10. Keep typography compact and professional.
11. Preserve the established visual hierarchy.
12. Use semantic colors consistently.
13. Make layouts responsive.
14. Keep controls functional and visually clear.

### MUST NOT

1. Change the brand color without explicit instruction.
2. Introduce gradients by default.
3. Introduce dark mode unless requested.
4. Use glassmorphism.
5. Use oversized cards.
6. Use giant headings.
7. Use excessive rounded corners.
8. Use heavy shadows.
9. Mix multiple icon styles.
10. Randomly change spacing.
11. Create a completely new navigation style.
12. Replace the clean enterprise SaaS style with a trendy marketing UI.
13. Add decorative elements that reduce information density.
14. Modify existing screens unnecessarily when adding a new feature.

---

# 49. When Adding New Modules

Every new module must inherit:

- Application shell
- Sidebar
- Top header
- Typography
- Color tokens
- Button system
- Form system
- Card system
- Table system
- Status system
- Spacing system
- Responsive behavior

Only the **information architecture and module-specific content** should change.

The visual language should remain recognizable across every module.

---

# 50. When Modifying Existing Screens

Follow this order:

1. Preserve the existing layout unless the requested change requires restructuring.
2. Preserve existing component dimensions.
3. Preserve existing typography.
4. Preserve existing colors.
5. Preserve existing navigation.
6. Add the requested functionality.
7. Improve hierarchy only when necessary.
8. Avoid redesigning unrelated areas.

**Do not interpret a feature request as permission to redesign the whole interface.**

---

# 51. Super Admin Extension

The Super Admin interface can use this same design system.

The Super Admin is a platform-level control environment, so information density may increase, but the visual language must remain consistent.

Use:
- Same primary purple
- Same typography
- Same cards
- Same tables
- Same form controls
- Same status system
- Same sidebar principles

For Super Admin-specific data, prioritize:
- Company status
- User counts
- Subscription status
- Platform activity
- System health
- Alerts
- Audit activity

Do not turn Super Admin into a visually unrelated application.

---

# 52. Visual Reference Summary

The supplied reference screenshot establishes these key characteristics:

```text
Overall:
Clean enterprise SaaS

Background:
Very light cool gray

Surfaces:
White

Primary:
Bright indigo/purple #5C5CFF

Typography:
Inter, compact hierarchy

Borders:
Thin, subtle gray

Corners:
Soft 8–14px rounding

Shadows:
Very light

Icons:
Minimal outline icons

Navigation:
White sidebar + purple active state

Cards:
White, bordered, compact

Buttons:
Purple primary + white secondary

Data:
Highly scannable, restrained semantic colors

Spacing:
8px-based system

Tone:
Professional + friendly + operational
```

---

# 53. Final Instruction to Figma Make

> **Build every Attendance HRMS screen using this design system. Treat the supplied dashboard reference and this document as the visual source of truth. Preserve the existing product's clean enterprise SaaS aesthetic. Use Inter typography, #5C5CFF as the primary brand color, white surfaces, subtle cool-gray backgrounds, thin borders, restrained shadows, compact spacing, outline icons, and clear information hierarchy. Reuse established components and patterns. Do not introduce gradients, glassmorphism, oversized typography, excessive rounding, heavy shadows, or unrelated visual styles. When a new feature is requested, change only what is necessary to support that feature while keeping the rest of the interface visually consistent.**
