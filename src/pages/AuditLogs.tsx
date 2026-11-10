import { useState } from 'react'
import { Download, Filter, ScrollText, Eye } from 'lucide-react'
import { PageHeader, StatusBadge, SearchInput, FilterSelect, Pagination, Toast, Modal } from '../components/ui'
import { AUDIT_LOGS } from '../lib/data'

export default function AuditLogs() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<typeof AUDIT_LOGS[0] | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [actor, setActor] = useState('')
  const [action, setAction] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [result, setResult] = useState('')
  const perPage = 10

  const filtered = AUDIT_LOGS.filter(l =>
    search === '' || l.actor.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.resource.toLowerCase().includes(search.toLowerCase())
  )

  const ACTION_COLORS: Record<string, string> = {
    SUSPEND_ORG: 'var(--error)', DELETE_ORG: 'var(--error)', UPDATE_PLAN: 'var(--info)', VIEW_ORG_DATA: 'var(--text-muted)',
    SEND_INVOICE: 'var(--success)', REFUND_PAYMENT: 'var(--warning)', UPDATE_FEATURE_FLAG: 'var(--primary)',
  }

  const MORE_LOGS = [
    { id: 'AUD-9891', timestamp: '1 Sep 2026, 12:00:00 IST', actor: 'Kiran Joshi', actorType: 'Security Admin', action: 'BLOCK_USER', resource: 'unknown@attacker.com', org: 'Nova Systems', ip: '10.0.0.8', result: 'success' as const },
    { id: 'AUD-9889', timestamp: '31 Aug 2026, 20:30:15 IST', actor: 'System', actorType: 'Automation', action: 'SUBSCRIPTION_RENEWAL', resource: 'Vertex Labs', org: 'Vertex Labs', ip: '—', result: 'success' as const },
    { id: 'AUD-9887', timestamp: '31 Aug 2026, 16:00:00 IST', actor: 'Dhruv Sharma', actorType: 'Super Admin', action: 'CREATE_PLAN', resource: 'Enterprise Plus', org: '—', ip: '10.0.0.1', result: 'success' as const },
    { id: 'AUD-9885', timestamp: '30 Aug 2026, 14:22:33 IST', actor: 'Ananya Singh', actorType: 'Analyst', action: 'EXPORT_ANALYTICS', resource: 'Platform Analytics', org: '—', ip: '10.0.0.9', result: 'success' as const },
  ]

  const allLogs = [...AUDIT_LOGS, ...MORE_LOGS]
  const filteredAll = allLogs.filter(l =>
    (search === '' || l.actor.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.resource.toLowerCase().includes(search.toLowerCase())) &&
    (actor === '' || l.actor === actor) &&
    (action === '' || l.action === action) &&
    (result === '' || l.result === result)
  )

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Complete audit trail of all administrative actions on the platform."
        actions={
          <button className="btn-secondary" onClick={() => setToast('Export initiated. CSV will be emailed to you.')}><Download size={15} /> Export logs</button>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput placeholder="Search by actor, action, or resource..." value={search} onChange={setSearch} />
        <FilterSelect label="All actors" value={actor} options={['Dhruv Sharma', 'Pooja Mehta', 'Sanjay Rao', 'System', 'Kiran Joshi']} onChange={setActor} />
        <FilterSelect label="All actions" value={action} options={['SUSPEND_ORG', 'UPDATE_PLAN', 'VIEW_ORG_DATA', 'SEND_INVOICE', 'REFUND_PAYMENT', 'BLOCK_USER']} onChange={setAction} />
        <FilterSelect label="Date range" value={dateRange} options={['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom']} onChange={value => { setDateRange(value); if (value) setToast(`${value} filter applied`) }} />
        <FilterSelect label="Result" value={result} options={['success', 'failed']} onChange={setResult} />
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>{filteredAll.length} logs</div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr className="table-header">
              {['Timestamp', 'Actor', 'Type', 'Action', 'Resource', 'Organization', 'IP', 'Result', 'Details'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAll.slice((page - 1) * perPage, page * perPage).map(log => (
              <tr key={log.id} className="table-row">
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{log.actor}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{log.actorType}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600, color: ACTION_COLORS[log.action] || 'var(--text-primary)' }}>{log.action}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{log.resource}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{log.org}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.ip}</td>
                <td style={{ padding: '12px 16px' }}><StatusBadge status={log.result} /></td>
                <td style={{ padding: '12px 16px' }}>
                  <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setSelected(log)}><Eye size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '0 16px' }}>
          <Pagination page={page} total={filteredAll.length} perPage={perPage} onChange={setPage} />
        </div>
      </div>

      {selected && (
        <Modal title="Audit Log Detail" onClose={() => setSelected(null)}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                { label: 'Log ID', value: selected.id },
                { label: 'Timestamp', value: selected.timestamp },
                { label: 'Actor', value: selected.actor },
                { label: 'Actor Type', value: selected.actorType },
                { label: 'Action', value: selected.action },
                { label: 'Resource', value: selected.resource },
                { label: 'Organization', value: selected.org },
                { label: 'IP Address', value: selected.ip },
                { label: 'Result', value: selected.result },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: ['Action', 'IP Address', 'Log ID'].includes(f.label) ? 'monospace' : undefined }}>
                    {f.label === 'Result' ? <StatusBadge status={f.value} /> : f.value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {JSON.stringify({ id: selected.id, actor: selected.actor, action: selected.action, resource: selected.resource, timestamp: selected.timestamp, ip: selected.ip, result: selected.result, metadata: {} }, null, 2)}
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
