import { useState } from 'react'
import { Shield, AlertTriangle, Lock, Eye, UserX } from 'lucide-react'
import { PageHeader, Tabs, StatusBadge, StatCard, Toast, ConfirmDialog } from '../components/ui'
import { SECURITY_EVENTS } from '../lib/data'

export default function Security() {
  const [tab, setTab] = useState('Overview')
  const [toast, setToast] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ id: string; action: string } | null>(null)
  const [riskFilter, setRiskFilter] = useState('All risks')
  const [eventSearch, setEventSearch] = useState('')

  const SCORE = 82

  return (
    <div>
      <PageHeader title="Security & Compliance" description="Monitor security events, manage risks, and ensure platform compliance." />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={['Overview', 'Security Events', 'Risk Alerts', 'Compliance', 'Blocked Accounts']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Security Score */}
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 }}>
              <div style={{ position: 'relative', width: 120, height: 120 }}>
                <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, transform: 'rotate(-90deg)' }}>
                  <circle cx={60} cy={60} r={50} fill="none" stroke="var(--bg)" strokeWidth={12} />
                  <circle cx={60} cy={60} r={50} fill="none" stroke={SCORE > 80 ? 'var(--success)' : SCORE > 60 ? 'var(--warning)' : 'var(--error)'} strokeWidth={12} strokeDasharray={`${(SCORE / 100) * 314} 314`} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)' }}>{SCORE}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ 100</div>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Security Score</div>
              <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>Good</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>2FA adoption at 78%. Recommend enforcing for all admins.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <StatCard label="Active Alerts" value="3" accent="var(--error)" />
              <StatCard label="Failed Logins (24h)" value="47" trend="+12" sub="vs yesterday" accent="var(--warning)" />
              <StatCard label="Suspicious Sessions" value="2" accent="var(--warning)" />
              <StatCard label="Blocked Accounts" value="5" />
              <StatCard label="Critical Events" value="1" accent="var(--error)" />
              <StatCard label="2FA Adoption" value="78%" trend="+4%" sub="this month" accent="var(--success)" />
            </div>
          </div>

          {/* Recent Events */}
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Recent Security Events</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="table-header">
                  {['Event', 'User', 'Organization', 'IP', 'Risk Level', 'Time', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SECURITY_EVENTS.map(e => (
                  <tr key={e.id} className="table-row">
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 500 }}>{e.type}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{e.user}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13 }}>{e.org}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{e.ip}</td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={e.risk} /></td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{e.time}</td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={e.status} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-secondary" style={{ height: 28, fontSize: 11, padding: '0 8px' }} onClick={() => setToast(`Investigation opened for ${e.id}`)}><Eye size={12} /> Investigate</button>
                        {e.status !== 'blocked' && <button className="btn-secondary" style={{ height: 28, fontSize: 11, padding: '0 8px', color: 'var(--error)' }} onClick={() => setConfirm({ id: e.id, action: 'block' })}><UserX size={12} /> Block</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Security Events' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="input" style={{ width: 240 }} placeholder="Search events..." value={eventSearch} onChange={e => setEventSearch(e.target.value)} />
            {['All risks', 'Critical', 'High', 'Medium', 'Low'].map(r => (
              <button key={r} onClick={() => setRiskFilter(r)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 13, background: r === riskFilter ? 'var(--primary)' : 'var(--surface)', color: r === riskFilter ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>{r}</button>
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="table-header">
                {['ID', 'Event Type', 'User', 'Organization', 'IP', 'Risk', 'Time', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SECURITY_EVENTS.filter(e => (riskFilter === 'All risks' || e.risk === riskFilter.toLowerCase()) && (eventSearch === '' || `${e.type} ${e.user} ${e.org}`.toLowerCase().includes(eventSearch.toLowerCase()))).map(e => (
                <tr key={e.id} className="table-row" style={{ background: e.risk === 'critical' ? 'rgba(220,38,38,0.02)' : undefined }}>
                  <td style={{ padding: '12px 20px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{e.id}</td>
                  <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 500 }}>{e.type}</td>
                  <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{e.user}</td>
                  <td style={{ padding: '12px 20px', fontSize: 13 }}>{e.org}</td>
                  <td style={{ padding: '12px 20px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{e.ip}</td>
                  <td style={{ padding: '12px 20px' }}><StatusBadge status={e.risk} /></td>
                  <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{e.time}</td>
                  <td style={{ padding: '12px 20px' }}><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Compliance' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { title: 'Data Retention', items: [['Policy', 'Active'], ['Retention period', '36 months'], ['Auto-deletion', 'Enabled'], ['Last audit', '1 Sep 2026']] },
            { title: 'Privacy Controls', items: [['GDPR compliance', 'Compliant'], ['Data minimization', 'Enabled'], ['Consent tracking', 'Active'], ['Data portability', 'Available']] },
            { title: 'Access Control', items: [['Least privilege', 'Enforced'], ['Privileged access', 'Monitored'], ['Access reviews', 'Quarterly'], ['Last review', '15 Aug 2026']] },
            { title: 'Audit Readiness', items: [['Audit trail', 'Complete'], ['Log integrity', 'Verified'], ['Export capability', 'Available'], ['Retention', '7 years']] },
          ].map(c => (
            <div key={c.title} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Shield size={16} color="var(--success)" />
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.title}</div>
              </div>
              {c.items.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 500, color: ['Compliant', 'Enabled', 'Active', 'Enforced', 'Monitored', 'Complete', 'Verified', 'Available'].includes(v) ? 'var(--success)' : 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {['Risk Alerts', 'Blocked Accounts'].includes(tab) && (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <Lock size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{tab}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage platform {tab.toLowerCase()}</div>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          title="Block this account?"
          message="This will immediately block the user and terminate all active sessions. This action is reversible but should be used with care."
          confirmLabel="Block account"
          danger
          onConfirm={() => { setToast('Account blocked and sessions terminated'); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
