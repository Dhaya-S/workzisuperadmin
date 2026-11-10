import { useState } from 'react'
import { Plus, AlertTriangle, CheckCircle, Clock, XCircle, Activity } from 'lucide-react'
import { PageHeader, Tabs, StatusBadge, StatCard, Toast, Modal, ProgressBar } from '../components/ui'
import { INCIDENTS, SERVICES } from '../lib/data'
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext'

const STATUS_COLORS: Record<string, string> = {
  operational: 'var(--success)',
  degraded: 'var(--warning)',
  'partial outage': 'var(--error)',
  'major outage': 'var(--error)',
}

export default function Monitoring() {
  const { adminProfile, user } = useSuperAdminAuth()
  const displayName = adminProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'Super Admin'
  const [tab, setTab] = useState('System Health')
  const [toast, setToast] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedInc, setSelectedInc] = useState<string | null>(null)

  const SYSTEM_STATUS = [
    { name: 'API Gateway', status: 'operational', latency: '48ms', uptime: 99.94 },
    { name: 'Database', status: 'operational', latency: '12ms', uptime: 99.99 },
    { name: 'Authentication', status: 'operational', latency: '35ms', uptime: 99.97 },
    { name: 'File Storage', status: 'operational', latency: '120ms', uptime: 99.92 },
    { name: 'Notification Service', status: 'degraded', latency: '850ms', uptime: 97.40 },
    { name: 'AI Service', status: 'operational', latency: '240ms', uptime: 99.98 },
    { name: 'Background Jobs', status: 'operational', latency: '—', uptime: 99.85 },
    { name: 'CDN', status: 'operational', latency: '18ms', uptime: 100 },
  ]

  const degraded = SYSTEM_STATUS.filter(s => s.status !== 'operational')

  const selectedIncident = INCIDENTS.find(i => i.id === selectedInc)

  if (selectedIncident) {
    return (
      <div>
        <button className="btn-ghost" style={{ color: 'var(--text-muted)', marginBottom: 20 }} onClick={() => setSelectedInc(null)}>← Monitoring</button>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{selectedIncident.title}</h2>
                <StatusBadge status={selectedIncident.status} />
                <StatusBadge status={selectedIncident.severity} />
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selectedIncident.id} · {selectedIncident.service} · {selectedIncident.orgsAffected} organizations affected</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setToast('Incident status update form opened')}>Update status</button>
              <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setToast('Incident resolved')}>Resolve incident</button>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Incident Timeline</div>
            {[
              { time: selectedIncident.updated, status: selectedIncident.status, msg: 'Monitoring recovery. Latency returning to normal.' },
              { time: selectedIncident.created, status: 'investigating', msg: 'Incident detected. Engineering team notified and investigating.' },
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: i < 1 ? '1px solid var(--divider)' : 'none' }}>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', marginTop: 3 }} />
                  {i === 0 && <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 4 }} />}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    <StatusBadge status={e.status} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{e.msg}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <textarea className="input" style={{ height: 80, resize: 'none', paddingTop: 8 }} placeholder="Add update note..." />
              <button className="btn-primary" style={{ marginTop: 8, fontSize: 13 }} onClick={() => setToast('Update posted')}>Post update</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Incident Details</div>
              {[['ID', selectedIncident.id], ['Service', selectedIncident.service], ['Severity', selectedIncident.severity], ['Status', selectedIncident.status], ['Orgs affected', selectedIncident.orgsAffected], ['Detected', selectedIncident.created], ['Last updated', selectedIncident.updated]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--divider)', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Assign Owner</div>
              <select className="input" style={{ marginBottom: 10 }}>
                <option>{displayName}</option><option>Support Admin</option><option>Operations Lead</option>
              </select>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={() => setToast('Owner assigned')}>Assign</button>
            </div>
          </div>
        </div>
        {toast && <Toast title={toast} onClose={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Monitoring" description="System health, performance, incidents, and infrastructure status." actions={
        <button className="btn-primary" onClick={() => setShowCreate(true)}><Plus size={15} /> Create Incident</button>
      } />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={['System Health', 'Incidents', 'Performance', 'Errors']} active={tab} onChange={setTab} />
      </div>

      {tab === 'System Health' && (
        <div>
          {/* Overall Status Banner */}
          <div style={{ marginBottom: 20, padding: '14px 20px', borderRadius: 10, background: degraded.length > 0 ? 'var(--warning-soft)' : 'var(--success-soft)', border: `1px solid ${degraded.length > 0 ? 'var(--warning)' : 'var(--success)'}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            {degraded.length > 0 ? <AlertTriangle size={18} color="var(--warning)" /> : <CheckCircle size={18} color="var(--success)" />}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: degraded.length > 0 ? '#B45309' : '#15803D' }}>
                {degraded.length > 0 ? `${degraded.length} service${degraded.length > 1 ? 's' : ''} experiencing issues` : 'All systems operational'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last checked: 2 Sep 2026, 09:50 IST</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            <StatCard label="Overall Uptime" value="99.87%" accent="var(--success)" />
            <StatCard label="Avg. Response Time" value="89ms" trend="+12ms" sub="vs baseline" />
            <StatCard label="Active Incidents" value="2" accent="var(--warning)" />
            <StatCard label="Error Rate" value="0.08%" accent="var(--success)" />
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 14, fontWeight: 600 }}>Service Status</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="table-header">
                  {['Service', 'Status', 'Latency', 'Uptime (30d)', 'Organizations', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SYSTEM_STATUS.map(s => (
                  <tr key={s.name} className="table-row">
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[s.status] || 'var(--neutral)', flexShrink: 0 }} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px' }}><StatusBadge status={s.status} /></td>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontFamily: 'monospace' }}>{s.latency}</td>
                    <td style={{ padding: '12px 20px', minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}><ProgressBar value={s.uptime} color={s.uptime > 99 ? 'var(--success)' : 'var(--warning)'} /></div>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{s.uptime}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--text-muted)' }}>{SERVICES.find(sv => sv.name.includes(s.name.split(' ')[0]))?.orgs || '—'}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <button className="btn-secondary" style={{ height: 28, fontSize: 12, padding: '0 10px' }} onClick={() => setToast(`${s.name} logs opened`)}>View logs</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Incidents' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            <StatCard label="Active Incidents" value="2" accent="var(--warning)" />
            <StatCard label="Resolved Today" value="1" accent="var(--success)" />
            <StatCard label="Avg. Resolution Time" value="2h 14m" />
            <StatCard label="SLA Compliance" value="98.2%" accent="var(--success)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {INCIDENTS.map(inc => (
              <div key={inc.id} className="card" style={{ cursor: 'pointer', borderLeft: `4px solid ${inc.severity === 'critical' ? 'var(--error)' : inc.severity === 'high' ? 'var(--warning)' : 'var(--info)'}` }}
                onClick={() => setSelectedInc(inc.id)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,24,40,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{inc.title}</span>
                      <StatusBadge status={inc.status} />
                      <StatusBadge status={inc.severity} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{inc.id} · {inc.service} · {inc.orgsAffected} orgs affected · Started {inc.created}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Updated {inc.updated}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {['Performance', 'Errors'].includes(tab) && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Activity size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{tab}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Monitor platform {tab.toLowerCase()} metrics</div>
        </div>
      )}

      {showCreate && (
        <Modal title="Create Incident" onClose={() => setShowCreate(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Incident title</label><input className="input" placeholder="Brief description of the issue" /></div>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Affected service</label><select className="input"><option>Select service...</option>{SERVICES.map(s => <option key={s.name}>{s.name}</option>)}</select></div>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Severity</label><select className="input"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Description</label><textarea className="input" style={{ height: 80, resize: 'none', paddingTop: 8 }} placeholder="Describe what's happening..." /></div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { setShowCreate(false); setToast('Incident created and team notified') }}>Create Incident</button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
