import { useState } from 'react'
import { Store, Star, CheckCircle, XCircle, Plus } from 'lucide-react'
import { PageHeader, Tabs, StatusBadge, Toast, ConfirmDialog } from '../components/ui'

const APPS = [
  { name: 'PaySlip Pro', developer: 'Finly Technologies', category: 'Payroll', status: 'active', orgs: 284, installs: 412, rating: 4.8, revenue: 84200 },
  { name: 'HRBuddy AI', developer: 'NeuralHR Inc.', category: 'AI/HR', status: 'active', orgs: 156, installs: 198, rating: 4.6, revenue: 46800 },
  { name: 'AttendBot', developer: 'BotWorks Labs', category: 'Attendance', status: 'pending', orgs: 0, installs: 0, rating: 0, revenue: 0 },
  { name: 'LeaveCalendar Plus', developer: 'Calendify', category: 'Leave', status: 'active', orgs: 321, installs: 450, rating: 4.3, revenue: 32100 },
  { name: 'DocuFlow', developer: 'Paperless Systems', category: 'Documents', status: 'suspended', orgs: 0, installs: 89, rating: 3.8, revenue: 0 },
  { name: 'ReportMaster', developer: 'DataViz Pro', category: 'Reports', status: 'pending', orgs: 0, installs: 0, rating: 0, revenue: 0 },
]

export default function Marketplace() {
  const [tab, setTab] = useState('Apps')
  const [confirm, setConfirm] = useState<{ name: string; action: string } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  return (
    <div>
      <PageHeader title="Marketplace" description="Manage the Attendance HRMS app ecosystem and partner integrations." />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={['Apps', 'Add-ons', 'Partners', 'App Approvals', 'Analytics']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Apps' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {APPS.map(app => (
            <div key={app.name} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{app.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{app.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{app.developer}</div>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{app.category}</div>
              {app.rating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                  <Star size={13} fill="var(--warning)" color="var(--warning)" />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{app.rating}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {app.installs} installs</span>
                </div>
              )}
              {app.orgs > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Orgs<br /><span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{app.orgs}</span></div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Revenue<br /><span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>₹{(app.revenue / 1000).toFixed(0)}K</span></div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                {app.status === 'pending' ? (
                  <>
                    <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12, height: 32 }} onClick={() => { setConfirm({ name: app.name, action: 'approve' }) }}><CheckCircle size={13} /> Approve</button>
                    <button className="btn-danger" style={{ flex: 1, justifyContent: 'center', fontSize: 12, height: 32 }} onClick={() => setConfirm({ name: app.name, action: 'reject' })}><XCircle size={13} /> Reject</button>
                  </>
                ) : (
                  <>
                    <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12, height: 32 }} onClick={() => setToast(`${app.name} details opened`)}>View</button>
                    {app.status === 'active' && <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12, height: 32, color: 'var(--warning)' }} onClick={() => setConfirm({ name: app.name, action: 'suspend' })}>Suspend</button>}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'App Approvals' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Pending App Reviews</div>
            <span style={{ fontSize: 12, padding: '2px 10px', background: 'var(--warning-soft)', color: 'var(--warning)', borderRadius: 999, fontWeight: 500 }}>2 pending</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="table-header">
                {['App', 'Developer', 'Category', 'Submitted', 'API Permissions', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPS.filter(a => a.status === 'pending').map(app => (
                <tr key={app.name} className="table-row">
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500 }}>{app.name}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13 }}>{app.developer}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13 }}>{app.category}</td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>1 Sep 2026</td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>Read attendance, Read employees</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-primary" style={{ height: 30, fontSize: 12, padding: '0 12px' }} onClick={() => setToast(`${app.name} approved`)}>Approve</button>
                      <button className="btn-danger" style={{ height: 30, fontSize: 12, padding: '0 12px' }} onClick={() => setToast(`${app.name} rejected`)}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {['Add-ons', 'Partners', 'Analytics'].includes(tab) && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Store size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{tab}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage marketplace {tab.toLowerCase()}</div>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          title={`${confirm.action.charAt(0).toUpperCase() + confirm.action.slice(1)} ${confirm.name}?`}
          message={confirm.action === 'approve' ? `Approving ${confirm.name} will make it available to all organizations in the marketplace.` : confirm.action === 'reject' ? `Rejecting ${confirm.name} will notify the developer with your decision.` : `Suspending ${confirm.name} will remove it from all organization installations.`}
          confirmLabel={`${confirm.action.charAt(0).toUpperCase() + confirm.action.slice(1)} app`}
          danger={['reject', 'suspend'].includes(confirm.action)}
          onConfirm={() => { setToast(`${confirm.name} ${confirm.action}d successfully`); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
