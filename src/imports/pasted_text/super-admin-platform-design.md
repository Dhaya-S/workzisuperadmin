You are a Senior Product Designer, Senior Product Manager, UX Architect, and SaaS Platform Designer.

Your task is to design and generate the COMPLETE SUPER ADMIN PLATFORM for the existing Attendance HRMS product.

IMPORTANT:
This is NOT the HR/Admin dashboard of an individual company.

The Super Admin is the PLATFORM OWNER / SaaS OPERATOR.

The companies using Attendance HRMS are customers/organizations/tenants of our platform.

The Super Admin manages the entire Attendance HRMS ecosystem:
- Customer organizations
- Organization subscriptions
- Organization administrators
- Platform users
- Roles and permissions
- Platform services
- Integrations
- Billing and licensing
- Security
- Compliance
- Platform analytics
- System monitoring
- Automation
- AI capabilities
- Global settings
- Support
- Audit logs
- Platform-wide configuration

The customer organization's HR/Admin/Employee flows already exist separately.

Do not merge customer HR operations into Super Admin.

==================================================
1. DESIGN SOURCE OF TRUTH
==================================================

A Brand Guidelines + Design System document has already been created for Attendance HRMS.

Use the attached/provided:

"Attendance_HRMS_Brand_Guidelines_Design_System.md"

as the PRIMARY visual source of truth.

Do not invent a completely different visual language.

Preserve the existing Attendance HRMS visual identity.

The Super Admin should feel like the same product ecosystem, but more powerful, operational, and data-oriented.

Use:

Primary brand color:
#5C5CFF

Typography:
Roboto

Overall visual direction:
- Modern SaaS
- Minimal
- Premium
- Professional
- Clean
- Enterprise-ready
- Atlassian-inspired simplicity
- High information clarity
- Strong hierarchy
- Spacious layouts
- Subtle borders
- Soft neutral backgrounds
- Clean cards
- Compact but readable data tables

DO NOT USE:
- Gradients
- Glassmorphism
- Neumorphism
- Excessive shadows
- Decorative illustrations that reduce usability
- Overly colorful dashboards
- Excessive rounded cards
- Random colors
- Random typography
- Unnecessary animations

Follow the existing design tokens, spacing, typography, components, buttons, cards, tables, forms, navigation and interaction patterns defined in the design system.

==================================================
2. CORE PRODUCT PRINCIPLE
==================================================

Design this as a REAL SaaS PLATFORM CONTROL CENTER.

The Super Admin should be able to understand:

"What is happening across my entire Attendance HRMS platform?"

and then:

"Which organization, user, service, integration, billing account, security event or system issue needs my attention?"

The interface should prioritize:
1. Platform health
2. Customer organizations
3. Revenue and subscriptions
4. Users and administrators
5. Security
6. System operations
7. Integrations
8. Platform configuration
9. Support
10. Auditability

Every major module must feel operational and actionable.

Avoid making the dashboard merely a collection of statistics.

Every important metric should lead to a relevant detailed view.

==================================================
3. SUPER ADMIN AUTHENTICATION FLOW
==================================================

Create the complete authentication journey before entering the Super Admin dashboard.

FLOW:

Landing / Super Admin Sign In
↓
Email
↓
Password
↓
Show / Hide Password
↓
Remember Me
↓
Forgot Password
↓
Password Reset
↓
Email Verification
↓
Two-Factor Authentication
↓
Verification Success
↓
Super Admin Dashboard

Also design:

First-time Super Admin setup
↓
Create account
↓
Verify email
↓
Set password
↓
Configure 2FA
↓
Accept platform terms
↓
Complete setup
↓
Dashboard

Create realistic states for:

- Invalid email
- Invalid password
- Account locked
- Incorrect OTP
- Expired OTP
- Resend OTP
- Password reset success
- Session expired
- Unauthorized access
- Suspicious login
- Logout confirmation

Security should feel enterprise-grade.

==================================================
4. GLOBAL SUPER ADMIN SHELL
==================================================

Create a dedicated Super Admin application shell.

LEFT SIDEBAR:

Attendance HRMS
Super Admin

Navigation:

1. Dashboard

2. Organizations
   - All Organizations
   - Pending Organizations
   - Active Organizations
   - Suspended Organizations
   - Trial Organizations
   - Organization Details

3. Administrators
   - All Administrators
   - Invitations
   - Active Administrators
   - Suspended Administrators
   - Administrator Activity

4. Identity & Access
   - Users
   - Roles & Permissions
   - Access Policies
   - Authentication
   - Sessions
   - API Access

5. Platform Services
   - Attendance
   - Leave
   - Payroll
   - Employee Management
   - Documents
   - Tasks
   - Notifications
   - Calendar
   - Reports
   - AI Services

6. Integrations
   - Integration Directory
   - Active Integrations
   - API Connections
   - Webhooks
   - Integration Logs

7. Marketplace
   - Apps
   - Add-ons
   - Partners
   - App Approvals
   - Marketplace Analytics

8. Billing & Licensing
   - Overview
   - Plans
   - Subscriptions
   - Invoices
   - Payments
   - Usage
   - Credits
   - Discounts

9. Security & Compliance
   - Security Overview
   - Security Events
   - Risk Alerts
   - Compliance
   - Data Access
   - Login Activity
   - Blocked Accounts

10. Analytics
   - Platform Analytics
   - Organization Analytics
   - User Analytics
   - Feature Usage
   - Revenue Analytics
   - Retention
   - Growth

11. Monitoring
   - System Health
   - Service Status
   - Performance
   - Errors
   - API Monitoring
   - Infrastructure
   - Incidents

12. Automation
   - Automation Rules
   - Scheduled Jobs
   - Notifications
   - Workflows
   - Automation Logs

13. AI Management
   - AI Usage
   - AI Models
   - AI Features
   - AI Limits
   - AI Costs
   - AI Activity

14. Support
   - Support Overview
   - Tickets
   - Organizations Needing Help
   - Escalations
   - Knowledge Base
   - Announcements

15. Audit Logs
   - All Activity
   - Admin Activity
   - Security Logs
   - Configuration Changes
   - Data Access Logs
   - Export Logs

16. Global Settings
   - Platform Settings
   - Branding
   - Localization
   - Currency
   - Time Zones
   - Email
   - Notifications
   - Security Policies
   - Data Retention
   - Feature Flags

BOTTOM SIDEBAR:

- Help & Support
- Super Admin Profile
- Account Settings
- Logout

==================================================
5. SUPER ADMIN DASHBOARD
==================================================

Create a powerful platform overview.

Header:

"Good morning, [Super Admin Name]"

Supporting text:

"Here's what's happening across Attendance HRMS today."

Top-right:
- Date
- Global search
- Quick actions
- Notifications
- Settings
- Super Admin profile

PRIMARY METRICS:

Total Organizations
Active Organizations
Trial Organizations
Suspended Organizations

Total Users
Active Users
New Users

Monthly Recurring Revenue
Subscription Revenue
Pending Payments

Platform Uptime
Active Incidents
API Health

AI Usage
Storage Usage
API Usage

Use cards with clear hierarchy.

Each card must be clickable.

Example:

Active Organizations
1,248
+8.4%
View organizations →

Do not make every card visually identical.

==================================================
6. DASHBOARD SECTIONS
==================================================

Create:

Organization Growth
- Weekly
- Monthly
- Quarterly
- Yearly

Revenue Overview
- MRR
- ARR
- New subscriptions
- Upgrades
- Downgrades
- Cancellations

User Growth

Platform Usage

Feature Adoption

System Health

Recent Security Events

Recent Organization Activity

Pending Actions

Open Support Tickets

Active Incidents

AI Usage

Use charts carefully.

Charts should communicate decisions, not decoration.

==================================================
7. ORGANIZATIONS
==================================================

This is one of the MOST IMPORTANT modules.

Create:

Organizations list

Columns:
- Organization
- Organization ID
- Plan
- Status
- Users
- Admins
- Usage
- Subscription
- Created
- Last Activity
- Actions

Filters:
- Status
- Plan
- Industry
- Size
- Region
- Created date
- Subscription
- Usage
- Risk

Search organizations.

Actions:
- View
- Edit
- Suspend
- Activate
- Delete
- Impersonate / Access as support
- Change plan
- Contact admin

Organization detail page:

Overview
Users
Administrators
Subscription
Usage
Attendance
Leave
Documents
Integrations
Security
Activity
Billing
Support
Settings

Show organization health.

==================================================
8. ORGANIZATION DETAIL
==================================================

Create a full organization profile.

Header:

Organization Logo
Organization Name
Organization ID
Plan
Status

Actions:
- Edit
- Suspend
- Change Plan
- Contact Admin
- Access Organization
- More

Summary:

Employees
Admins
Monthly Usage
Storage
API Usage
Subscription Value
Last Activity

Tabs:

Overview
People
Subscription
Usage
Services
Integrations
Security
Billing
Activity

Include realistic charts and tables.

==================================================
9. ADMINISTRATORS
==================================================

Super Admin should manage the administrators of customer organizations.

Create:

All Administrators

Columns:
- Name
- Organization
- Email
- Role
- Status
- Last Login
- 2FA
- Created
- Actions

Actions:
- Invite administrator
- Edit
- Suspend
- Reactivate
- Reset password
- Force logout
- Revoke sessions
- View activity

Invitation flow:

Invite Administrator
↓
Name
↓
Email
↓
Organization
↓
Role
↓
Permissions
↓
Send Invitation

Show invitation status:
- Pending
- Accepted
- Expired
- Revoked

==================================================
10. IDENTITY & ACCESS
==================================================

Create a professional enterprise IAM system.

Users:
- Search
- Filter
- View
- Suspend
- Activate
- Force logout
- Reset authentication
- View sessions

Roles & Permissions:

System roles:
- Super Admin
- Platform Admin
- Support Admin
- Billing Admin
- Security Admin
- Analyst

Create custom roles.

Permission matrix:

Organizations
Users
Billing
Security
Analytics
Support
Settings
Platform Services
AI
Audit Logs

Allow:
View
Create
Edit
Delete
Manage
Export

Access Policies:

- Password policies
- Session policies
- 2FA requirements
- IP restrictions
- Login restrictions
- Device policies

==================================================
11. PLATFORM SERVICES
==================================================

Create a centralized control center for all HRMS modules.

Services:

Attendance
Leave
Employee Management
Documents
Tasks
Calendar
Reports
Notifications
Payroll
AI

Each service should have:

Status
Version
Usage
Organizations using it
Performance
Errors
Availability
Configuration
Feature controls

Allow Super Admin to:

Enable
Disable
Configure
Set limits
View usage
View incidents

Create service detail pages.

==================================================
12. INTEGRATIONS
==================================================

Create:

Integration Directory
Active Integrations
API Connections
Webhooks
Integration Logs

Integration categories:

HR
Payroll
Accounting
Communication
Identity
Storage
Analytics

Integration detail:

Status
Connected organizations
API usage
Last sync
Errors
Credentials status
Webhook status

Actions:
Connect
Disconnect
Configure
Test connection
View logs

==================================================
13. MARKETPLACE
==================================================

Create an ecosystem marketplace.

Modules:

Apps
Add-ons
Partners
Approvals
Analytics

App detail:

Name
Developer
Category
Status
Organizations using it
Installs
Rating
API permissions
Revenue

Admin actions:

Approve
Reject
Suspend
Feature
Review

==================================================
14. BILLING & LICENSING
==================================================

Create a complete SaaS billing control center.

Overview:
- MRR
- ARR
- Active subscriptions
- Trials
- Churn
- Failed payments
- Outstanding invoices

Plans:

Free
Starter
Professional
Business
Enterprise

Allow Super Admin to:

Create plan
Edit plan
Archive plan
Set pricing
Set user limits
Set feature limits
Set AI limits
Set storage limits

Subscription detail:

Organization
Plan
Billing cycle
Seats
Usage
Amount
Renewal date
Payment status

Invoices:
- Paid
- Pending
- Failed
- Overdue

Actions:
View
Download
Refund
Adjust
Send reminder

==================================================
15. SECURITY & COMPLIANCE
==================================================

Create a security command center.

Overview:

Security score
Active alerts
Failed login attempts
Suspicious sessions
Blocked accounts
Critical events

Security events:

- Login
- Logout
- Password change
- Permission change
- Data export
- Configuration change
- API access
- Admin action

Risk levels:

Low
Medium
High
Critical

Actions:

Investigate
Block
Resolve
Assign
Export

Compliance:

Data retention
Privacy
Access control
Audit readiness
Data export
Deletion requests

==================================================
16. PLATFORM ANALYTICS
==================================================

Create advanced analytics.

Analytics sections:

Platform Growth
Organization Growth
User Growth
Feature Adoption
Revenue
Retention
Churn
Engagement
Usage

Filters:

Date
Organization
Plan
Region
Feature
User type

Allow:

Export
Save report
Schedule report

==================================================
17. MONITORING
==================================================

Create a system operations center.

System Health:

Overall status
API status
Database
Authentication
Notifications
File storage
AI services
Integrations

Service status:

Operational
Degraded
Partial outage
Major outage

Performance:

Response time
Error rate
Request volume
Latency

Errors:

Error ID
Service
Severity
Time
Status
Occurrences

Incidents:

Create incident
Assign owner
Update status
Add notes
Resolve incident

Incident statuses:

Investigating
Identified
Monitoring
Resolved

==================================================
18. AUTOMATION
==================================================

Create a platform automation engine.

Automation Rules:

Trigger
Condition
Action

Example:

IF organization subscription expires
THEN send notification
AND restrict selected services

Allow:

Create automation
Edit
Pause
Resume
Duplicate
Delete

Automation logs:

Rule
Trigger
Result
Time
Status

==================================================
19. AI MANAGEMENT
==================================================

Create centralized AI governance.

AI Usage:
- Total requests
- Requests by organization
- Cost
- Tokens
- Most-used AI feature

AI Features:

AI assistant
AI report generation
AI insights
AI automation
AI support

AI Models:

Model
Provider
Version
Cost
Status

AI limits:

Per organization
Per plan
Per user

AI activity:

Organization
User
Feature
Requests
Cost
Timestamp

==================================================
20. SUPPORT
==================================================

Create support operations center.

Overview:

Open tickets
High priority
Unassigned
SLA breaches
Resolved today

Ticket list:

Ticket ID
Organization
Requester
Category
Priority
Status
Assigned agent
Created
Updated

Ticket detail:

Conversation
Organization information
Related incidents
Related billing
Activity

Actions:

Assign
Escalate
Change priority
Reply
Resolve
Close

Also create:

Announcements
Knowledge Base

==================================================
21. AUDIT LOGS
==================================================

Create a comprehensive audit system.

Every sensitive action should be traceable.

Table:

Timestamp
Actor
Actor type
Action
Resource
Organization
IP
Device
Result

Filters:

Actor
Organization
Action
Resource
Date
Risk
Result

Actions:

View details
Export

Audit detail:

Who
What
When
Where
Before
After
Reason

==================================================
22. GLOBAL SETTINGS
==================================================

Create platform-wide settings.

Sections:

Platform Settings
Branding
Localization
Currency
Time Zones
Email
Notifications
Security
Data Retention
Feature Flags

Important:

These are GLOBAL PLATFORM settings.

Do not confuse them with organization-level settings.

Feature Flags:

Feature
Status
Rollout
Organizations
Percentage
Environment

Allow:

Enable
Disable
Gradual rollout
Target organizations

==================================================
23. SUPER ADMIN PROFILE
==================================================

Create:

Profile
Personal information
Email
Phone
Profile photo
Password
2FA
Active sessions
Login history
Notification preferences

Security actions:

Change password
Enable/disable 2FA
Logout all devices
Revoke sessions

==================================================
24. GLOBAL SEARCH
==================================================

Create a powerful global search.

Search across:

Organizations
Users
Administrators
Subscriptions
Invoices
Tickets
Audit logs
Incidents
Integrations

Search results should be categorized.

Example:

Organizations
Acme Technologies

Users
John Smith

Tickets
#TK-10293

Invoices
INV-20391

==================================================
25. NOTIFICATION CENTER
==================================================

Create notifications for:

Security alerts
System incidents
Failed payments
Subscription events
Organization events
Support escalations
Platform issues
AI usage alerts

Notification states:

Unread
Read
Critical

Allow:

Mark as read
Mark all as read
View all

==================================================
26. QUICK ACTIONS
==================================================

Global "+" button should provide:

Create Organization
Invite Administrator
Create Plan
Create Role
Create Automation
Create Announcement
Create Support Ticket
Create Incident

==================================================
27. IMPORTANT EMPTY / ERROR / LOADING STATES
==================================================

Do NOT design only successful states.

Create:

Loading
Empty
No results
No organizations
No integrations
No tickets
No incidents
Error
Permission denied
Session expired
Network error
Service unavailable

Every state must provide useful next actions.

==================================================
28. CONFIRMATION & DESTRUCTIVE ACTIONS
==================================================

For dangerous actions create confirmation dialogs.

Examples:

Suspend organization
Delete organization
Delete role
Disable service
Disconnect integration
Cancel subscription
Delete automation

Explain consequences clearly.

Use destructive actions carefully.

==================================================
29. RESPONSIVE DESIGN
==================================================

Design responsive behavior for:

Desktop
Laptop
Tablet

Desktop is the primary experience.

Sidebar should collapse intelligently.

Tables should become horizontally scrollable or transform into useful responsive cards where appropriate.

Do not simply shrink the desktop interface.

Maintain hierarchy and usability.

==================================================
30. INTERACTION DESIGN
==================================================

This must be a FUNCTIONAL HIGH-FIDELITY PROTOTYPE.

Create interactions between screens.

Examples:

Dashboard card
→ Organization list

Organization
→ Organization detail

Organization detail
→ Subscription

Administrator
→ Administrator detail

Security alert
→ Security event detail

Incident
→ Incident detail

Invoice
→ Invoice detail

Support ticket
→ Ticket detail

Global search
→ Search results

Notifications
→ Notification detail

Quick action
→ Creation flow

Use:

- Hover states
- Active states
- Focus states
- Selected states
- Dropdowns
- Tabs
- Filters
- Search
- Pagination
- Modals
- Drawers
- Toast notifications
- Confirmation dialogs
- Tooltips
- Loading states

==================================================
31. REALISTIC DATA
==================================================

Do NOT use repetitive placeholder data.

Create realistic SaaS data.

Example organizations:

Acme Technologies
Nova Systems
Vertex Labs
BlueOrbit
Crest Digital
Apex Solutions
OrbitWorks

Use realistic:

Users
Plans
Revenue
Dates
Usage
Invoices
Tickets
Security events
Incidents

Use Indian context where appropriate:

₹ currency
IST
Indian company names
Indian phone number formatting

But maintain a globally scalable SaaS structure.

==================================================
32. DATA TABLE DESIGN
==================================================

Tables should be enterprise-grade.

Include:

Search
Filters
Sort
Pagination
Column hierarchy
Row actions
Bulk selection

Bulk actions:

Suspend
Activate
Export
Assign
Delete where appropriate

Do not overcrowd tables.

==================================================
33. INFORMATION HIERARCHY
==================================================

Every page should clearly answer:

1. Where am I?
2. What is happening?
3. What needs attention?
4. What can I do?
5. What happens next?

Use:

Page title
Description
Primary action
Secondary actions
Summary metrics
Main content
Supporting information

==================================================
34. DESIGN SYSTEM CONSISTENCY
==================================================

Reuse the existing components.

Do not create a new button style for every page.

Use consistent:

Buttons
Inputs
Dropdowns
Cards
Tables
Badges
Tabs
Modals
Drawers
Alerts
Toasts
Charts
Pagination
Navigation

Use the existing #5C5CFF brand language.

Use semantic colors only when necessary:

Success
Warning
Error
Information
Neutral

Do not introduce random accent colors.

==================================================
35. UX QUALITY BAR
==================================================

Think like a senior product designer.

Do not simply create screens based on the navigation list.

Design the actual EXPERIENCE.

Ask for every screen:

Why does this screen exist?

What decision does the user need to make?

What action should they take?

What information do they need?

What happens after the action?

What happens if something goes wrong?

Reduce unnecessary navigation.

Use progressive disclosure for complex functionality.

Keep high-frequency actions easy to reach.

Keep dangerous actions deliberate.

==================================================
36. PRODUCT MANAGEMENT THINKING
==================================================

Think like a Senior Product Manager.

Prioritize:

Critical platform operations
Customer management
Revenue
Security
System reliability
Support

Create sensible relationships between modules.

For example:

Organization
→ Subscription
→ Usage
→ Billing
→ Support
→ Security
→ Activity

Incident
→ Service
→ Organizations affected
→ Users affected
→ Support tickets

Security event
→ User
→ Organization
→ Session
→ Audit log

Do not treat every module as isolated.

==================================================
37. PLATFORM VS ORGANIZATION BOUNDARY
==================================================

THIS IS CRITICAL.

The customer organization's HR Admin manages:

Employees
Attendance
Leave
Departments
Designations
Branches
Holiday
Shifts
Leave policies
Employee onboarding
Organization settings

The Super Admin manages the PLATFORM itself.

Do not duplicate the customer's HR administration experience inside Super Admin.

Instead, Super Admin should see platform-level information about these services.

Example:

Super Admin:
"Attendance Service"
→ 1,200 organizations enabled
→ 94.2% usage
→ 2 incidents

Customer HR Admin:
"Attendance"
→ Employees
→ Check-in
→ Check-out
→ Attendance policies

Keep these experiences separate.

==================================================
38. NAVIGATION BEHAVIOR
==================================================

Sidebar navigation should support:

- Active state
- Hover state
- Collapsed state
- Expandable submenus
- Current location indicator

Use breadcrumbs where necessary.

Example:

Organizations
→ Acme Technologies
→ Subscription

==================================================
39. PAGE TRANSITIONS
==================================================

Use subtle transitions.

Avoid flashy animations.

Interactions should feel:

Fast
Professional
Predictable
Enterprise-grade

==================================================
40. FINAL GENERATION REQUIREMENT
==================================================

Generate the ENTIRE SUPER ADMIN EXPERIENCE.

Do NOT stop after generating the dashboard.

Do NOT create only the sidebar.

Do NOT create only high-level screens.

Generate the complete connected flow:

SIGN IN
↓
AUTHENTICATION
↓
2FA
↓
DASHBOARD
↓
ORGANIZATIONS
↓
ORGANIZATION DETAILS
↓
ADMINISTRATORS
↓
IDENTITY & ACCESS
↓
PLATFORM SERVICES
↓
INTEGRATIONS
↓
MARKETPLACE
↓
BILLING & LICENSING
↓
SECURITY & COMPLIANCE
↓
ANALYTICS
↓
MONITORING
↓
AUTOMATION
↓
AI MANAGEMENT
↓
SUPPORT
↓
AUDIT LOGS
↓
GLOBAL SETTINGS
↓
PROFILE
↓
LOGOUT

Every major section must contain its own:

List
Detail
Create
Edit
Delete/Deactivate where appropriate
Search
Filter
Empty state
Error state
Confirmation
Success state

==================================================
41. DO NOT MODIFY THE EXISTING CUSTOMER HRMS FLOW
==================================================

The existing employee / HR / organization-side Attendance HRMS product already exists.

Do not redesign or replace it.

Build the Super Admin platform as a separate privileged layer.

The Super Admin should be visually consistent with the existing Attendance HRMS product.

==================================================
42. VISUAL REFERENCE
==================================================

The existing Attendance HRMS interface shown in the project is the visual reference.

Maintain its:

- Sidebar structure
- Header structure
- Typography
- Card language
- Border treatment
- Spacing
- Table language
- Button language
- Purple/indigo primary CTA
- Light neutral page background
- Minimal visual style

However, adapt the information density appropriately for a Super Admin platform.

Super Admin can be more data-rich than the employee/HR dashboard.

==================================================
43. FINAL QUALITY CHECK
==================================================

Before considering the work complete, verify:

[ ] Authentication flow exists
[ ] 2FA exists
[ ] Dashboard exists
[ ] Organizations exists
[ ] Organization detail exists
[ ] Administrators exists
[ ] Identity & Access exists
[ ] Platform Services exists
[ ] Integrations exists
[ ] Marketplace exists
[ ] Billing exists
[ ] Security exists
[ ] Analytics exists
[ ] Monitoring exists
[ ] Automation exists
[ ] AI Management exists
[ ] Support exists
[ ] Audit Logs exists
[ ] Global Settings exists
[ ] Profile exists
[ ] Notifications exists
[ ] Global Search exists
[ ] Quick Actions exist
[ ] Empty states exist
[ ] Error states exist
[ ] Loading states exist
[ ] Confirmation dialogs exist
[ ] Success states exist
[ ] Responsive layouts exist
[ ] Navigation is connected
[ ] Buttons perform meaningful actions
[ ] Tables have realistic data
[ ] Filters work
[ ] Search works
[ ] Tabs work
[ ] Modals work
[ ] Drawers work
[ ] Toasts work
[ ] Design system is consistent
[ ] No gradients
[ ] No glassmorphism
[ ] No unnecessary decorative UI
[ ] Accessibility AA principles are followed

==================================================
44. MOST IMPORTANT INSTRUCTION
==================================================

DO NOT INTERPRET THIS AS A REQUEST TO MAKE A FEW SAMPLE SCREENS.

Build this as a COMPLETE PRODUCT EXPERIENCE.

You are simultaneously acting as:

Senior Product Designer
+
Senior Product Manager
+
UX Architect
+
SaaS Platform Designer

Therefore, make reasonable product decisions wherever the specification does not explicitly define a screen.

Think about:

User goals
Business goals
Platform governance
Security
Scalability
Information architecture
User permissions
Data relationships
Operational workflows
Edge cases
Empty states
Error states
Confirmation states
Success states

The result should look like a real production-ready SaaS Super Admin platform, not a concept dashboard.

Use the existing Attendance HRMS design system as the visual source of truth.

Prioritize clarity, hierarchy, usability, consistency and operational control.

Generate the COMPLETE CONNECTED SUPER ADMIN FLOW.