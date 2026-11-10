import type { Org, Admin, Ticket, Incident, Invoice, SecurityEvent, AuditLog } from './types'

export const ORGS: Org[] = [
  { id: 'ORG-001', name: 'Acme Technologies', plan: 'Business', status: 'active', users: 482, admins: 5, usage: 87, subscription: '₹48,200/mo', created: '12 Jan 2024', lastActivity: '2 min ago', industry: 'Technology', region: 'Mumbai', mrr: 48200 },
  { id: 'ORG-002', name: 'Nova Systems', plan: 'Professional', status: 'active', users: 234, admins: 3, usage: 72, subscription: '₹23,400/mo', created: '3 Mar 2024', lastActivity: '15 min ago', industry: 'IT Services', region: 'Bangalore', mrr: 23400 },
  { id: 'ORG-003', name: 'Vertex Labs', plan: 'Enterprise', status: 'active', users: 1240, admins: 12, usage: 94, subscription: '₹1,24,000/mo', created: '5 Nov 2023', lastActivity: '1 hr ago', industry: 'R&D', region: 'Hyderabad', mrr: 124000 },
  { id: 'ORG-004', name: 'BlueOrbit', plan: 'Starter', status: 'trial', users: 45, admins: 2, usage: 34, subscription: 'Trial', created: '28 Aug 2026', lastActivity: '3 hr ago', industry: 'Startup', region: 'Pune', mrr: 0 },
  { id: 'ORG-005', name: 'Crest Digital', plan: 'Business', status: 'active', users: 310, admins: 4, usage: 65, subscription: '₹31,000/mo', created: '17 Feb 2024', lastActivity: '30 min ago', industry: 'Digital Media', region: 'Delhi', mrr: 31000 },
  { id: 'ORG-006', name: 'Apex Solutions', plan: 'Professional', status: 'suspended', users: 128, admins: 2, usage: 0, subscription: '₹12,800/mo', created: '9 May 2024', lastActivity: '14 days ago', industry: 'Consulting', region: 'Chennai', mrr: 12800 },
  { id: 'ORG-007', name: 'OrbitWorks', plan: 'Business', status: 'active', users: 567, admins: 6, usage: 78, subscription: '₹56,700/mo', created: '22 Dec 2023', lastActivity: '5 min ago', industry: 'Manufacturing', region: 'Ahmedabad', mrr: 56700 },
  { id: 'ORG-008', name: 'Zeta Fintech', plan: 'Enterprise', status: 'active', users: 890, admins: 9, usage: 91, subscription: '₹89,000/mo', created: '1 Oct 2023', lastActivity: '10 min ago', industry: 'Finance', region: 'Mumbai', mrr: 89000 },
  { id: 'ORG-009', name: 'PrimeCare Health', plan: 'Professional', status: 'trial', users: 72, admins: 3, usage: 48, subscription: 'Trial', created: '25 Aug 2026', lastActivity: '2 hr ago', industry: 'Healthcare', region: 'Kolkata', mrr: 0 },
  { id: 'ORG-010', name: 'SkyBridge Logistics', plan: 'Business', status: 'active', users: 423, admins: 5, usage: 82, subscription: '₹42,300/mo', created: '14 Apr 2024', lastActivity: '45 min ago', industry: 'Logistics', region: 'Surat', mrr: 42300 },
  { id: 'ORG-011', name: 'InnovateTech', plan: 'Starter', status: 'pending', users: 0, admins: 1, usage: 0, subscription: 'Pending', created: '1 Sep 2026', lastActivity: 'Never', industry: 'Technology', region: 'Noida', mrr: 0 },
  { id: 'ORG-012', name: 'Meridian Analytics', plan: 'Professional', status: 'active', users: 156, admins: 2, usage: 59, subscription: '₹15,600/mo', created: '7 Jun 2024', lastActivity: '1 hr ago', industry: 'Analytics', region: 'Bangalore', mrr: 15600 },
]

export const ADMINS: Admin[] = [
  { id: 'ADM-001', name: 'Rajesh Kumar', org: 'Acme Technologies', email: 'rajesh@acmetech.in', role: 'HR Admin', status: 'active', lastLogin: '2 min ago', twoFa: true, created: '12 Jan 2024' },
  { id: 'ADM-002', name: 'Priya Sharma', org: 'Nova Systems', email: 'priya@novasys.in', role: 'Super Admin', status: 'active', lastLogin: '1 hr ago', twoFa: true, created: '3 Mar 2024' },
  { id: 'ADM-003', name: 'Amit Patel', org: 'Vertex Labs', email: 'amit@vertexlabs.io', role: 'HR Admin', status: 'active', lastLogin: '30 min ago', twoFa: false, created: '5 Nov 2023' },
  { id: 'ADM-004', name: 'Sunita Reddy', org: 'Crest Digital', email: 'sunita@crestdigital.in', role: 'Finance Admin', status: 'active', lastLogin: '3 hr ago', twoFa: true, created: '17 Feb 2024' },
  { id: 'ADM-005', name: 'Vikram Singh', org: 'Apex Solutions', email: 'vikram@apexsol.in', role: 'HR Admin', status: 'suspended', lastLogin: '14 days ago', twoFa: false, created: '9 May 2024' },
  { id: 'ADM-006', name: 'Kavya Nair', org: 'OrbitWorks', email: 'kavya@orbitworks.in', role: 'Super Admin', status: 'active', lastLogin: '5 min ago', twoFa: true, created: '22 Dec 2023' },
  { id: 'ADM-007', name: 'Deepak Joshi', org: 'Zeta Fintech', email: 'deepak@zetafintech.in', role: 'HR Admin', status: 'active', lastLogin: '10 min ago', twoFa: true, created: '1 Oct 2023' },
  { id: 'ADM-008', name: 'Meera Iyer', org: 'BlueOrbit', email: 'meera@blueorbit.in', role: 'HR Admin', status: 'pending', lastLogin: 'Never', twoFa: false, created: '28 Aug 2026' },
]

export const TICKETS: Ticket[] = [
  { id: 'TK-10293', org: 'Acme Technologies', requester: 'Rajesh Kumar', category: 'Billing', priority: 'high', status: 'open', agent: 'Sanjay R.', created: '1 Sep 2026', updated: '2 Sep 2026' },
  { id: 'TK-10291', org: 'Vertex Labs', requester: 'Amit Patel', category: 'Technical', priority: 'critical', status: 'in-progress', agent: 'Pooja M.', created: '31 Aug 2026', updated: '2 Sep 2026' },
  { id: 'TK-10289', org: 'Nova Systems', requester: 'Priya Sharma', category: 'Integration', priority: 'medium', status: 'open', agent: 'Unassigned', created: '30 Aug 2026', updated: '1 Sep 2026' },
  { id: 'TK-10286', org: 'OrbitWorks', requester: 'Kavya Nair', category: 'Access', priority: 'high', status: 'in-progress', agent: 'Sanjay R.', created: '29 Aug 2026', updated: '2 Sep 2026' },
  { id: 'TK-10284', org: 'Crest Digital', requester: 'Sunita Reddy', category: 'Billing', priority: 'low', status: 'resolved', agent: 'Pooja M.', created: '28 Aug 2026', updated: '30 Aug 2026' },
  { id: 'TK-10280', org: 'Zeta Fintech', requester: 'Deepak Joshi', category: 'Technical', priority: 'medium', status: 'open', agent: 'Unassigned', created: '27 Aug 2026', updated: '28 Aug 2026' },
]

export const INCIDENTS: Incident[] = [
  { id: 'INC-0042', title: 'Attendance API elevated latency', service: 'Attendance', severity: 'high', status: 'monitoring', orgsAffected: 34, created: '2 Sep 2026, 08:14 IST', updated: '2 Sep 2026, 09:45 IST' },
  { id: 'INC-0041', title: 'Email notification delays', service: 'Notifications', severity: 'medium', status: 'identified', orgsAffected: 120, created: '1 Sep 2026, 22:30 IST', updated: '2 Sep 2026, 07:00 IST' },
  { id: 'INC-0039', title: 'Report generation timeout', service: 'Reports', severity: 'low', status: 'resolved', orgsAffected: 8, created: '31 Aug 2026, 14:00 IST', updated: '31 Aug 2026, 16:30 IST' },
]

export const INVOICES: Invoice[] = [
  { id: 'INV-20391', org: 'Vertex Labs', amount: 124000, status: 'paid', period: 'Aug 2026', due: '1 Sep 2026', issued: '25 Aug 2026' },
  { id: 'INV-20389', org: 'OrbitWorks', amount: 56700, status: 'paid', period: 'Aug 2026', due: '1 Sep 2026', issued: '25 Aug 2026' },
  { id: 'INV-20387', org: 'Acme Technologies', amount: 48200, status: 'pending', period: 'Sep 2026', due: '1 Oct 2026', issued: '2 Sep 2026' },
  { id: 'INV-20385', org: 'Zeta Fintech', amount: 89000, status: 'failed', period: 'Sep 2026', due: '1 Oct 2026', issued: '2 Sep 2026' },
  { id: 'INV-20383', org: 'Apex Solutions', amount: 12800, status: 'overdue', period: 'Aug 2026', due: '1 Sep 2026', issued: '25 Aug 2026' },
  { id: 'INV-20381', org: 'Crest Digital', amount: 31000, status: 'paid', period: 'Aug 2026', due: '1 Sep 2026', issued: '25 Aug 2026' },
]

export const SECURITY_EVENTS: SecurityEvent[] = [
  { id: 'SEC-4821', type: 'Failed login', user: 'admin@apexsol.in', org: 'Apex Solutions', ip: '103.21.45.12', risk: 'high', time: '2 Sep 2026, 09:32 IST', status: 'investigating' },
  { id: 'SEC-4820', type: 'Suspicious session', user: 'deepak@zetafintech.in', org: 'Zeta Fintech', ip: '198.51.100.24', risk: 'medium', time: '2 Sep 2026, 08:15 IST', status: 'investigating' },
  { id: 'SEC-4819', type: 'Password change', user: 'rajesh@acmetech.in', org: 'Acme Technologies', ip: '10.0.1.45', risk: 'low', time: '1 Sep 2026, 18:40 IST', status: 'resolved' },
  { id: 'SEC-4818', type: 'Data export', user: 'kavya@orbitworks.in', org: 'OrbitWorks', ip: '192.168.1.102', risk: 'medium', time: '1 Sep 2026, 15:20 IST', status: 'resolved' },
  { id: 'SEC-4817', type: 'Account locked', user: 'unknown@attacker.com', org: 'Nova Systems', ip: '45.33.21.78', risk: 'critical', time: '1 Sep 2026, 12:05 IST', status: 'blocked' },
]

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'AUD-9901', timestamp: '2 Sep 2026, 09:45:12 IST', actor: 'Dhruv Sharma', actorType: 'Super Admin', action: 'SUSPEND_ORG', resource: 'Apex Solutions', org: 'Apex Solutions', ip: '10.0.0.1', result: 'success' },
  { id: 'AUD-9900', timestamp: '2 Sep 2026, 09:30:05 IST', actor: 'Dhruv Sharma', actorType: 'Super Admin', action: 'UPDATE_PLAN', resource: 'Acme Technologies', org: 'Acme Technologies', ip: '10.0.0.1', result: 'success' },
  { id: 'AUD-9898', timestamp: '2 Sep 2026, 08:22:44 IST', actor: 'Pooja Mehta', actorType: 'Support Admin', action: 'VIEW_ORG_DATA', resource: 'Vertex Labs', org: 'Vertex Labs', ip: '10.0.0.5', result: 'success' },
  { id: 'AUD-9897', timestamp: '1 Sep 2026, 22:10:33 IST', actor: 'System', actorType: 'Automation', action: 'SEND_INVOICE', resource: 'INV-20387', org: 'Acme Technologies', ip: '—', result: 'success' },
  { id: 'AUD-9895', timestamp: '1 Sep 2026, 18:55:01 IST', actor: 'Sanjay Rao', actorType: 'Billing Admin', action: 'REFUND_PAYMENT', resource: 'INV-20381', org: 'Crest Digital', ip: '10.0.0.3', result: 'failed' },
  { id: 'AUD-9893', timestamp: '1 Sep 2026, 15:32:18 IST', actor: 'Dhruv Sharma', actorType: 'Super Admin', action: 'UPDATE_FEATURE_FLAG', resource: 'AI Assistant', org: '—', ip: '10.0.0.1', result: 'success' },
]

export const SERVICES = [
  { name: 'Attendance', status: 'operational', orgs: 1198, usage: 94, version: '3.2.1', errors: 2, uptime: 99.94 },
  { name: 'Leave Management', status: 'operational', orgs: 1180, usage: 91, version: '2.8.4', errors: 0, uptime: 99.99 },
  { name: 'Employee Management', status: 'operational', orgs: 1248, usage: 100, version: '4.1.0', errors: 1, uptime: 99.97 },
  { name: 'Payroll', status: 'degraded', orgs: 823, usage: 66, version: '1.9.3', errors: 12, uptime: 98.20 },
  { name: 'Documents', status: 'operational', orgs: 1100, usage: 88, version: '2.4.7', errors: 0, uptime: 100 },
  { name: 'Reports', status: 'operational', orgs: 1050, usage: 84, version: '3.0.2', errors: 3, uptime: 99.85 },
  { name: 'Notifications', status: 'degraded', orgs: 1248, usage: 100, version: '2.1.5', errors: 45, uptime: 97.40 },
  { name: 'AI Services', status: 'operational', orgs: 640, usage: 51, version: '1.2.0', errors: 0, uptime: 99.98 },
  { name: 'Calendar', status: 'operational', orgs: 980, usage: 78, version: '2.0.1', errors: 0, uptime: 100 },
  { name: 'Tasks', status: 'operational', orgs: 756, usage: 61, version: '1.5.2', errors: 1, uptime: 99.90 },
]

export const INTEGRATIONS = [
  { name: 'Slack', category: 'Communication', status: 'active', orgs: 284, lastSync: '5 min ago', errors: 0 },
  { name: 'Google Workspace', category: 'Identity', status: 'active', orgs: 521, lastSync: '12 min ago', errors: 2 },
  { name: 'Microsoft 365', category: 'Identity', status: 'active', orgs: 412, lastSync: '8 min ago', errors: 0 },
  { name: 'QuickBooks', category: 'Accounting', status: 'active', orgs: 143, lastSync: '1 hr ago', errors: 0 },
  { name: 'Tally', category: 'Accounting', status: 'active', orgs: 334, lastSync: '2 hr ago', errors: 5 },
  { name: 'Razorpay', category: 'Payroll', status: 'active', orgs: 210, lastSync: '30 min ago', errors: 0 },
  { name: 'Jira', category: 'HR', status: 'inactive', orgs: 0, lastSync: 'Never', errors: 0 },
  { name: 'AWS S3', category: 'Storage', status: 'active', orgs: 890, lastSync: '2 min ago', errors: 0 },
]

export const PLANS = [
  { name: 'Free', price: 0, users: 10, orgs: 0, color: '#9CA3AF' },
  { name: 'Starter', price: 999, users: 50, orgs: 78, color: '#3B82F6' },
  { name: 'Professional', price: 3499, users: 250, orgs: 342, color: '#8B5CF6' },
  { name: 'Business', price: 8999, users: 1000, orgs: 587, color: '#5C5CFF' },
  { name: 'Enterprise', price: 0, users: -1, orgs: 241, color: '#101828' },
]

export const METRIC_CARDS = {
  totalOrgs: 1248,
  activeOrgs: 1182,
  trialOrgs: 48,
  suspendedOrgs: 18,
  totalUsers: 48420,
  activeUsers: 41230,
  newUsers: 842,
  mrr: 8420000,
  arr: 101040000,
  pendingPayments: 312400,
  uptime: 99.87,
  activeIncidents: 2,
  apiHealth: 99.4,
  aiUsage: 78,
  storageUsage: 64,
  apiUsage: 71,
}

export const GROWTH_DATA = {
  weekly: [210, 224, 218, 231, 244, 239, 248],
  monthly: [980, 1020, 1065, 1090, 1120, 1158, 1182, 1200, 1220, 1234, 1241, 1248],
  labels: { weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], monthly: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] }
}

export const REVENUE_DATA = [420000, 480000, 510000, 550000, 620000, 680000, 720000, 780000, 810000, 840000, 820000, 842000]
