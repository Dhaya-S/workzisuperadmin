export type Page =
  | 'dashboard'
  | 'organizations'
  | 'org-detail'
  | 'administrators'
  | 'identity'
  | 'platform-services'
  | 'integrations'
  | 'marketplace'
  | 'billing'
  | 'security'
  | 'analytics'
  | 'monitoring'
  | 'automation'
  | 'ai'
  | 'support'
  | 'audit'
  | 'settings'
  | 'profile'

export type AuthStep = 'login' | 'password' | '2fa' | 'forgot' | 'reset' | 'setup' | 'setup-2fa' | 'terms'

export interface Org {
  id: string
  name: string
  plan: string
  status: 'active' | 'trial' | 'suspended' | 'pending'
  users: number
  admins: number
  usage: number
  subscription: string
  created: string
  lastActivity: string
  industry: string
  region: string
  mrr: number
}

export interface Admin {
  id: string
  name: string
  org: string
  email: string
  role: string
  status: 'active' | 'suspended' | 'pending'
  lastLogin: string
  twoFa: boolean
  created: string
}

export interface Ticket {
  id: string
  org: string
  requester: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  agent: string
  created: string
  updated: string
}

export interface Incident {
  id: string
  title: string
  service: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  orgsAffected: number
  created: string
  updated: string
}

export interface Invoice {
  id: string
  org: string
  amount: number
  status: 'paid' | 'pending' | 'failed' | 'overdue'
  period: string
  due: string
  issued: string
}

export interface SecurityEvent {
  id: string
  type: string
  user: string
  org: string
  ip: string
  risk: 'low' | 'medium' | 'high' | 'critical'
  time: string
  status: 'resolved' | 'investigating' | 'blocked'
}

export interface AuditLog {
  id: string
  timestamp: string
  actor: string
  actorType: string
  action: string
  resource: string
  org: string
  ip: string
  result: 'success' | 'failed'
}
