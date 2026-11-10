import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ArrowRight, AlertTriangle, Users, Building2, CreditCard, Activity, Bot, HardDrive, Zap, LifeBuoy, Eye } from 'lucide-react'
import { StatCard, LineChart, MiniBarChart, StatusBadge, SectionHeader, ProgressBar } from '../components/ui'
import { METRIC_CARDS, ORGS, TICKETS, INCIDENTS, SECURITY_EVENTS, GROWTH_DATA, REVENUE_DATA, SERVICES } from '../lib/data'
import type { Page, Org, Admin } from '../lib/types'
import { subscribeOrganizations, subscribeUsers } from '../lib/superadmin-service'
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext'

interface DashboardProps { setPage: (p: Page) => void; setSelectedOrg: (id: string) => void }

export default function Dashboard({ setPage, setSelectedOrg }: DashboardProps) {
  const { adminProfile, user } = useSuperAdminAuth()
  const [growthPeriod, setGrowthPeriod] = useState<'weekly' | 'monthly'>('monthly')
  const [liveOrgs, setLiveOrgs] = useState<Org[]>([])
  const [liveUsers, setLiveUsers] = useState<Admin[]>([])
  const m = METRIC_CARDS

  useEffect(() => {
    const unsubOrgs = subscribeOrganizations(orgs => setLiveOrgs(orgs))
    const unsubUsers = subscribeUsers(users => setLiveUsers(users))
    return () => {
      unsubOrgs()
      unsubUsers()
    }
  }, [])

  const displayOrgs = liveOrgs
  const totalOrgsCount = liveOrgs.length
  const activeOrgsCount = liveOrgs.filter(o => o.status === 'active').length
  const trialOrgsCount = liveOrgs.filter(o => o.status === 'trial').length
  const suspendedOrgsCount = liveOrgs.filter(o => o.status === 'suspended').length

  const totalUsersCount = liveUsers.length
  const activeUsersCount = liveUsers.filter(u => u.status === 'active').length

  const calculatedMrr = liveOrgs.reduce((acc, o) => acc + (o.mrr || 0), 0)
  const calculatedArr = calculatedMrr * 12

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const mrrDisplay = formatCurrency(calculatedMrr)
  const arrDisplay = formatCurrency(calculatedArr)

  const adminName = adminProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'Super Admin'

  const PENDING_ACTIONS = [
    { label: `${liveOrgs.filter(o => o.status === 'pending').length} organizations pending approval`, action: 'Review', page: 'organizations' as Page, color: 'var(--warning)' },
    { label: `${liveUsers.filter(u => u.status === 'pending').length} administrator invitations pending`, action: 'View', page: 'administrators' as Page, color: 'var(--info)' },
    { label: '2 open incidents', action: 'Manage', page: 'monitoring' as Page, color: 'var(--error)' },
    { label: '1 failed payment needs attention', action: 'Resolve', page: 'billing' as Page, color: 'var(--error)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Greeting */}
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Good day, {adminName}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Here's the real-time operational overview across the Workzi HRMS platform.</div>
      </div>

      {/* Primary Metrics — Row 1: Organizations */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Organizations</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <StatCard label="Total Organizations" value={totalOrgsCount.toLocaleString('en-IN')} trend="+12.4%" sub="vs last month" onClick={() => setPage('organizations')} accent="var(--primary)" />
          <StatCard label="Active Organizations" value={activeOrgsCount.toLocaleString('en-IN')} trend="+8.4%" sub="vs last month" onClick={() => setPage('organizations')} accent="var(--success)" />
          <StatCard label="Trial Organizations" value={trialOrgsCount} trend="+3" sub="this week" onClick={() => setPage('organizations')} accent="var(--info)" />
          <StatCard label="Suspended" value={suspendedOrgsCount} sub="requires attention" onClick={() => setPage('organizations')} accent="var(--error)" />
        </div>
      </div>

      {/* Primary Metrics — Row 2: Users + Revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Users</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="Total Users" value={totalUsersCount.toLocaleString('en-IN')} onClick={() => setPage('identity')} />
            <StatCard label="Active Users" value={activeUsersCount.toLocaleString('en-IN')} trend="+2.1%" />
            <StatCard label="New This Week" value={m.newUsers} trend="+842" sub="users" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Revenue</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="MRR" value={mrrDisplay} trend="+6.2%" onClick={() => setPage('billing')} />
            <StatCard label="ARR" value={arrDisplay} trend="+6.2%" onClick={() => setPage('billing')} />
            <StatCard label="Pending Payments" value={`₹${(m.pendingPayments / 1000).toFixed(0)}K`} sub="2 invoices" onClick={() => setPage('billing')} accent="var(--warning)" />
          </div>
        </div>
      </div>

      {/* System Health + Usage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => setPage('monitoring')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Platform Uptime</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)' }}>{m.uptime}%</div>
            </div>
            <Activity size={20} color="var(--success)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.activeIncidents > 0 ? 'var(--warning)' : 'var(--success)', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.activeIncidents} active incident{m.activeIncidents !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => setPage('analytics')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Platform Usage</div>
            <HardDrive size={18} color="var(--text-muted)" />
          </div>
          {[
            { label: 'AI Usage', value: m.aiUsage, color: 'var(--leave)' },
            { label: 'Storage', value: m.storageUsage, color: 'var(--primary)' },
            { label: 'API', value: m.apiUsage, color: 'var(--info)' },
          ].map(u => (
            <div key={u.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{u.label}</span>
                <span style={{ fontWeight: 600 }}>{u.value}%</span>
              </div>
              <ProgressBar value={u.value} color={u.color} />
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Service Health</div>
            <Activity size={18} color="var(--text-muted)" />
          </div>
          {SERVICES.slice(0, 5).map(s => (
            <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.name}</span>
              <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 999, background: s.status === 'operational' ? 'var(--success-soft)' : 'var(--warning-soft)', color: s.status === 'operational' ? 'var(--success)' : 'var(--warning)' }}>{s.status}</span>
            </div>
          ))}
          <button className="btn-ghost" style={{ marginTop: 4 }} onClick={() => setPage('monitoring')}>View all services <ArrowRight size={12} /></button>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>

        {/* Revenue Chart */}
        <div className="card">
          <SectionHeader
            title="Revenue Overview"
            action={
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                  {[{ k: 'MRR', v: mrrDisplay, c: 'var(--primary)' }, { k: 'ARR', v: arrDisplay, c: 'var(--text-muted)' }].map(r => (
                    <span key={r.k} style={{ color: r.c, fontWeight: 600 }}>{r.k}: <span style={{ color: 'var(--text-primary)' }}>{r.v}</span></span>
                  ))}
                </div>
                <button className="btn-ghost" onClick={() => setPage('billing')}>View billing <ArrowRight size={12} /></button>
              </div>
            }
          />
          <LineChart
            data={REVENUE_DATA}
            labels={GROWTH_DATA.labels.monthly}
            height={160}
            valueFormatter={value => `₹${(value / 100000).toFixed(1)}L`}
          />
          <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
            {[{ label: 'New subs', val: '+24', up: true }, { label: 'Upgrades', val: '+11', up: true }, { label: 'Downgrades', val: '-3', up: false }, { label: 'Churn', val: '-2', up: false }].map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                {m.up ? <TrendingUp size={12} color="var(--success)" /> : <TrendingDown size={12} color="var(--error)" />}
                <span style={{ color: 'var(--text-muted)' }}>{m.label}:</span>
                <span style={{ fontWeight: 600, color: m.up ? 'var(--success)' : 'var(--error)' }}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Organization Growth */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Org Growth</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['weekly', 'monthly'] as const).map(p => (
                <button key={p} onClick={() => setGrowthPeriod(p)} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, background: growthPeriod === p ? 'var(--primary-soft)' : 'transparent', color: growthPeriod === p ? 'var(--primary)' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <MiniBarChart data={GROWTH_DATA[growthPeriod]} height={100} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            {GROWTH_DATA.labels[growthPeriod].filter((_, i) => i % 2 === 0).map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

        {/* Pending Actions */}
        <div className="card">
          <SectionHeader title="Pending Actions" action={<span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: 'var(--error-soft)', color: 'var(--error)', fontWeight: 600 }}>{PENDING_ACTIONS.length}</span>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PENDING_ACTIONS.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)' }}>{a.label}</div>
                <button className="btn-ghost" style={{ fontSize: 12, color: 'var(--primary)' }} onClick={() => setPage(a.page)}>{a.action}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <SectionHeader title="Recent Organizations" action={<button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setPage('organizations')}>View all</button>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayOrgs.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No organizations found</div>
            ) : (
              displayOrgs.slice(0, 5).map(org => (
                <div key={org.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--divider)', cursor: 'pointer' }} onClick={() => { setSelectedOrg(org.id); setPage('org-detail') }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                    {org.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{org.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{org.plan} · {org.users} users</div>
                  </div>
                  <StatusBadge status={org.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Open Tickets + Incidents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ flex: 1 }}>
            <SectionHeader title="Active Incidents" action={<button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setPage('monitoring')}>View all</button>} />
            {INCIDENTS.filter(i => i.status !== 'resolved').length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No active incidents</div>
            ) : (
              INCIDENTS.filter(i => i.status !== 'resolved').map(inc => (
                <div key={inc.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--divider)' }}>
                  <AlertTriangle size={15} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{inc.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{inc.orgsAffected} orgs affected · <StatusBadge status={inc.status} /></div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="card" style={{ flex: 1 }}>
            <SectionHeader title="Open Tickets" action={<button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setPage('support')}>View all</button>} />
            {TICKETS.filter(t => t.status === 'open').slice(0, 3).map(t => (
              <div key={t.id} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--divider)', alignItems: 'center' }}>
                <LifeBuoy size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{t.id} — {t.org}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.category} · <span style={{ color: t.priority === 'critical' ? 'var(--error)' : t.priority === 'high' ? 'var(--warning)' : 'var(--text-muted)' }}>{t.priority}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Security Events */}
      <div className="card">
        <SectionHeader title="Recent Security Events" action={<button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setPage('security')}>View all</button>} />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="table-header">
                {['Event', 'User', 'Organization', 'IP Address', 'Risk', 'Time', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SECURITY_EVENTS.slice(0, 4).map(e => (
                <tr key={e.id} className="table-row">
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 500 }}>{e.type}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>{e.user}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13 }}>{e.org}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{e.ip}</td>
                  <td style={{ padding: '12px 14px' }}><StatusBadge status={e.risk} /></td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{e.time}</td>
                  <td style={{ padding: '12px 14px' }}><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
