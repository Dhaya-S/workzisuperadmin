import { useState } from 'react'
import { Plug, CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react'
import { PageHeader, Tabs, StatusBadge, SearchInput, Toast } from '../components/ui'
import { INTEGRATIONS } from '../lib/data'

const CATEGORIES = ['All', 'Communication', 'Identity', 'Accounting', 'Payroll', 'Storage', 'HR']

export default function Integrations() {
  const [tab, setTab] = useState('Directory')
  const [category, setCategory] = useState('All')
  const [toast, setToast] = useState<string | null>(null)

  const filtered = INTEGRATIONS.filter(i => category === 'All' || i.category === category)

  return (
    <div>
      <PageHeader title="Integrations" description="Manage third-party integrations connected to the Attendance HRMS platform." />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={['Directory', 'Active Integrations', 'Webhooks', 'API Connections', 'Logs']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Directory' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: category === c ? 'var(--primary)' : 'var(--surface)', color: category === c ? '#fff' : 'var(--text-secondary)', border: `1px solid ${category === c ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer' }}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {filtered.map(integ => (
              <div key={integ.name} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{integ.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{integ.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{integ.category}</div>
                    </div>
                  </div>
                  <StatusBadge status={integ.status} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Connected orgs<br /><span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{integ.orgs}</span></div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last sync<br /><span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{integ.lastSync}</span></div>
                </div>
                {integ.errors > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--warning)', marginBottom: 10 }}>
                    <AlertTriangle size={13} /> {integ.errors} sync error{integ.errors > 1 ? 's' : ''}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  {integ.status === 'active' ? (
                    <>
                      <button className="btn-secondary" style={{ flex: 1, fontSize: 12, height: 32, justifyContent: 'center' }} onClick={() => setToast(`${integ.name} configured`)}>Configure</button>
                      <button className="icon-btn" style={{ height: 32, width: 32 }} onClick={() => setToast(`${integ.name} synced`)}><RefreshCw size={14} /></button>
                    </>
                  ) : (
                    <button className="btn-primary" style={{ flex: 1, fontSize: 12, height: 32, justifyContent: 'center' }} onClick={() => setToast(`${integ.name} connection initiated`)}><Plug size={14} /> Connect</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'Active Integrations' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="table-header">
                {['Integration', 'Category', 'Status', 'Orgs Connected', 'Last Sync', 'Errors', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INTEGRATIONS.filter(i => i.status === 'active').map(i => (
                <tr key={i.name} className="table-row">
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{i.name[0]}</div>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{i.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13 }}>{i.category}</td>
                  <td style={{ padding: '14px 20px' }}><StatusBadge status={i.status} /></td>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 500 }}>{i.orgs}</td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{i.lastSync}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {i.errors > 0 ? <span style={{ fontSize: 12, color: 'var(--error)', fontWeight: 500 }}>{i.errors} errors</span> : <CheckCircle size={15} color="var(--success)" />}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-secondary" style={{ height: 30, fontSize: 12, padding: '0 10px' }} onClick={() => setToast(`${i.name} configuration opened`)}>Configure</button>
                      <button className="btn-secondary" style={{ height: 30, fontSize: 12, padding: '0 10px' }} onClick={() => setToast(`${i.name} synced`)}>Sync</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {['Webhooks', 'API Connections', 'Logs'].includes(tab) && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Plug size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{tab}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage platform {tab.toLowerCase()}</div>
        </div>
      )}

      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
