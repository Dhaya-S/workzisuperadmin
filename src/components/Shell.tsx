import { useState, type ReactNode } from 'react'
import {
  LayoutDashboard, Building2, UserCog, ShieldCheck, Cpu,
  CreditCard, Lock, BarChart3, Activity, Zap, Bot, LifeBuoy, ScrollText,
  Settings, Bell, Search, Plus, ChevronDown, ChevronRight, LogOut,
  ChevronLeft, User, HelpCircle
} from 'lucide-react'
import type { Page } from '../lib/types'
import { Avatar, Toast } from './ui'
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext'

interface NavItem {
  id: Page
  label: string
  icon: ReactNode
  subs?: { label: string; id: Page }[]
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'organizations', label: 'Organizations', icon: <Building2 size={16} /> },
  { id: 'administrators', label: 'Administrators', icon: <UserCog size={16} /> },
  { id: 'identity', label: 'Identity & Access', icon: <ShieldCheck size={16} /> },
  { id: 'platform-services', label: 'Platform Services', icon: <Cpu size={16} /> },
  { id: 'billing', label: 'Billing & Licensing', icon: <CreditCard size={16} /> },
  { id: 'security', label: 'Security & Compliance', icon: <Lock size={16} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  { id: 'monitoring', label: 'Monitoring', icon: <Activity size={16} /> },
  { id: 'automation', label: 'Automation', icon: <Zap size={16} /> },
  { id: 'ai', label: 'AI Management', icon: <Bot size={16} /> },
  { id: 'support', label: 'Support', icon: <LifeBuoy size={16} /> },
  { id: 'audit', label: 'Audit Logs', icon: <ScrollText size={16} /> },
  { id: 'settings', label: 'Global Settings', icon: <Settings size={16} /> },
]

const QUICK_ACTIONS: { label: string; page: Page }[] = [
  { label: 'Create Organization', page: 'organizations' },
  { label: 'Invite Administrator', page: 'administrators' },
  { label: 'Create Plan', page: 'billing' },
  { label: 'Create Role', page: 'identity' },
  { label: 'Create Automation', page: 'automation' },
  { label: 'Create Incident', page: 'monitoring' },
]

interface ShellProps {
  currentPage: Page
  setPage: (p: Page) => void
  onLogout: () => void
  children: ReactNode
}

export default function Shell({ currentPage, setPage, onLogout, children }: ShellProps) {
  const { adminProfile, user } = useSuperAdminAuth()
  const displayName = adminProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'Super Admin'
  const displayEmail = adminProfile?.email || user?.email || 'admin@workzi.com'
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [toast, setToast] = useState<{ title: string; message?: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsRead, setNotificationsRead] = useState(false)

  const currentNav = NAV.find(n => n.id === currentPage) || NAV[0]
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  const NOTIFICATIONS = [
    { id: 1, type: 'critical', title: 'Payment failed', body: 'Zeta Fintech — INV-20385 failed', time: '5m ago', read: false },
    { id: 2, type: 'warning', title: 'Incident detected', body: 'Attendance API elevated latency', time: '45m ago', read: false },
    { id: 3, type: 'info', title: 'New trial started', body: 'BlueOrbit started a trial', time: '2h ago', read: false },
    { id: 4, type: 'success', title: 'Invoice paid', body: 'Vertex Labs — INV-20391', time: '3h ago', read: true },
    { id: 5, type: 'warning', title: 'SLA breach risk', body: 'TK-10291 approaching SLA limit', time: '4h ago', read: true },
  ]
  const unread = notificationsRead ? 0 : NOTIFICATIONS.filter(n => !n.read).length

  const closeAll = () => {
    setShowNotifications(false)
    setShowQuickActions(false)
    setShowSearch(false)
    setShowUserMenu(false)
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg)' }} onClick={closeAll}>

      {/* ── Sidebar ── */}
      <div
        style={{ width: sidebarOpen ? 232 : 52, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', transition: 'width 0.2s ease', flexShrink: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Logo row */}
        <div style={{ padding: '0 12px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', flexShrink: 0, gap: 8 }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LayoutDashboard size={14} color="#fff" />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Workzi HRMS</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--primary)', marginTop: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Super Admin</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}
          >
            <ChevronLeft size={14} style={{ transform: sidebarOpen ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: '6px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV.map(item => (
            <div
              key={item.id}
              className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
              )}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ padding: '6px 8px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <div className="sidebar-item" onClick={() => setPage('profile')} title={!sidebarOpen ? 'Profile' : undefined}>
            <User size={14} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Profile & Settings</span>}
          </div>
          <div className="sidebar-item" style={{ color: 'var(--error)' }} onClick={onLogout} title={!sidebarOpen ? 'Logout' : undefined}>
            <LogOut size={14} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Logout</span>}
          </div>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px 4px' }}>
              <Avatar name={displayName} size={28} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Super Admin</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Top Header */}
        <div style={{ height: 56, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{currentNav.label}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 8 }}>{dateStr}</span>

            {/* Global Search */}
            <div style={{ position: 'relative' }}>
              <button className="hdr-btn" onClick={e => { e.stopPropagation(); closeAll(); setShowSearch(!showSearch) }}>
                <Search size={16} />
              </button>
              {showSearch && (
                <div style={{ position: 'absolute', right: 0, top: 40, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, width: 340, zIndex: 100, boxShadow: '0 8px 24px rgba(16,24,40,0.08)' }} onClick={e => e.stopPropagation()}>
                  <input autoFocus className="input" placeholder="Search orgs, users, invoices…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  {searchQuery && (
                    <div style={{ marginTop: 10 }}>
                      {['Organizations', 'Users', 'Invoices'].map(cat => (
                        <div key={cat}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 0 4px' }}>{cat}</div>
                          <div className="sidebar-item" style={{ borderRadius: 6, fontSize: 12 }} onClick={() => { setPage('organizations'); closeAll() }}>
                            <Building2 size={13} />
                            {cat === 'Organizations' ? 'Acme Technologies' : cat === 'Users' ? 'Rajesh Kumar' : 'INV-20391'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ position: 'relative' }}>
              <button className="hdr-btn" onClick={e => { e.stopPropagation(); closeAll(); setShowQuickActions(!showQuickActions) }}>
                <Plus size={16} />
              </button>
              {showQuickActions && (
                <div style={{ position: 'absolute', right: 0, top: 40, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 6, minWidth: 200, zIndex: 100, boxShadow: '0 8px 24px rgba(16,24,40,0.08)' }} onClick={e => e.stopPropagation()}>
                  {QUICK_ACTIONS.map(a => (
                    <div key={a.label} className="sidebar-item" style={{ fontSize: 12, height: 34, borderRadius: 6 }} onClick={() => { closeAll(); setPage(a.page); setToast({ title: a.label, message: 'Use the primary action on this page to complete the flow.' }) }}>{a.label}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button className="hdr-btn" style={{ position: 'relative' }} onClick={e => { e.stopPropagation(); closeAll(); setShowNotifications(!showNotifications) }}>
                <Bell size={16} />
                {unread > 0 && <span style={{ position: 'absolute', top: 2, right: 2, width: 7, height: 7, background: 'var(--error)', borderRadius: '50%' }} />}
              </button>
              {showNotifications && (
                <div style={{ position: 'absolute', right: 0, top: 40, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, width: 320, zIndex: 100, boxShadow: '0 8px 24px rgba(16,24,40,0.08)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                  <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Notifications</div>
                    <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => { setNotificationsRead(true); setToast({ title: 'All notifications marked as read' }) }}>Mark all read</button>
                  </div>
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} onClick={() => { setToast({ title: n.title, message: n.body }); setShowNotifications(false) }} style={{ padding: '10px 14px', borderBottom: '1px solid var(--divider)', background: n.read || notificationsRead ? 'transparent' : 'var(--primary-soft)', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{n.time}</div>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{n.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="hdr-btn" onClick={() => setPage('settings')}>
              <Settings size={16} />
            </button>

            {/* User */}
            <div style={{ position: 'relative', marginLeft: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.1s' }}
                onClick={e => { e.stopPropagation(); closeAll(); setShowUserMenu(!showUserMenu) }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Avatar name={displayName} size={28} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{displayName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Super Admin</div>
                </div>
                <ChevronDown size={12} color="var(--text-muted)" />
              </div>
              {showUserMenu && (
                <div style={{ position: 'absolute', right: 0, top: 44, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 6, minWidth: 168, zIndex: 100, boxShadow: '0 8px 24px rgba(16,24,40,0.08)' }} onClick={e => e.stopPropagation()}>
                  <div style={{ padding: '8px 10px 8px', borderBottom: '1px solid var(--divider)', marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{displayName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{displayEmail}</div>
                  </div>
                  <div className="sidebar-item" style={{ height: 32, borderRadius: 6, fontSize: 12 }} onClick={() => { setPage('profile'); closeAll() }}><User size={13} /> Profile</div>
                  <div className="sidebar-item" style={{ height: 32, borderRadius: 6, fontSize: 12 }} onClick={() => { setPage('settings'); closeAll() }}><Settings size={13} /> Settings</div>
                  <div className="sidebar-item" style={{ height: 32, borderRadius: 6, fontSize: 12, color: 'var(--error)' }} onClick={onLogout}><LogOut size={13} /> Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }} className="page-enter">
          {children}
        </div>
      </div>

      {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
