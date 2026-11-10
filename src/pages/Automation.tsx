import { useState } from 'react'
import { Plus, Zap, Play, Pause, Copy, Trash2 } from 'lucide-react'
import { PageHeader, Tabs, StatusBadge, Toast, Modal, ConfirmDialog } from '../components/ui'

const RULES = [
  { id: 'AUTO-001', name: 'Subscription expiry notification', trigger: 'Subscription expires in 7 days', condition: 'Plan ≠ Enterprise', action: 'Send email to org admin', status: 'active', lastRun: '1 Sep 2026', runs: 48 },
  { id: 'AUTO-002', name: 'Restrict expired organizations', trigger: 'Subscription expired', condition: 'Payment overdue > 7 days', action: 'Restrict non-essential services', status: 'active', lastRun: '25 Aug 2026', runs: 3 },
  { id: 'AUTO-003', name: 'High usage alert', trigger: 'API usage > 90%', condition: 'Plan = Starter or Professional', action: 'Notify org admin to upgrade', status: 'active', lastRun: '2 Sep 2026', runs: 12 },
  { id: 'AUTO-004', name: 'Trial ending reminder', trigger: 'Trial expires in 3 days', condition: 'No subscription', action: 'Send upgrade offer email', status: 'paused', lastRun: '20 Aug 2026', runs: 27 },
  { id: 'AUTO-005', name: 'Security alert escalation', trigger: 'Critical security event', condition: 'Status = unresolved > 30min', action: 'Page on-call engineer', status: 'active', lastRun: '31 Aug 2026', runs: 2 },
]

const LOGS = [
  { rule: 'AUTO-003', trigger: 'API usage > 90%', org: 'Acme Technologies', result: 'success', time: '2 Sep 2026, 09:30 IST' },
  { rule: 'AUTO-001', trigger: 'Subscription expires in 7 days', org: 'BlueOrbit', result: 'success', time: '1 Sep 2026, 08:00 IST' },
  { rule: 'AUTO-002', trigger: 'Subscription expired', org: 'Apex Solutions', result: 'success', time: '25 Aug 2026, 12:00 IST' },
  { rule: 'AUTO-005', trigger: 'Critical security event', org: 'Nova Systems', result: 'success', time: '31 Aug 2026, 12:05 IST' },
]

export default function Automation() {
  const [tab, setTab] = useState('Rules')
  const [showCreate, setShowCreate] = useState(false)
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  return (
    <div>
      <PageHeader title="Automation" description="Build and manage platform automation rules, scheduled jobs, and workflows." actions={
        <button className="btn-primary" onClick={() => setShowCreate(true)}><Plus size={15} /> Create Automation</button>
      } />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={['Rules', 'Scheduled Jobs', 'Workflows', 'Logs']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Rules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {RULES.map(rule => (
            <div key={rule.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <Zap size={16} color="var(--primary)" />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{rule.name}</span>
                    <StatusBadge status={rule.status} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>Trigger</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{rule.trigger}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>Condition</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{rule.condition}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>Action</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{rule.action}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>Last run: {rule.lastRun}</span>
                    <span>Total runs: {rule.runs}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
                  <button className="icon-btn" title={rule.status === 'active' ? 'Pause' : 'Resume'} onClick={() => setToast(`Rule ${rule.status === 'active' ? 'paused' : 'resumed'}`)}>
                    {rule.status === 'active' ? <Pause size={15} /> : <Play size={15} />}
                  </button>
                  <button className="icon-btn" title="Duplicate" onClick={() => setToast('Rule duplicated')}><Copy size={15} /></button>
                  <button className="icon-btn" title="Delete" style={{ color: 'var(--error)' }} onClick={() => setConfirm({ id: rule.id, name: rule.name })}><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Logs' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="table-header">
                {['Rule ID', 'Trigger', 'Organization', 'Result', 'Time'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOGS.map((l, i) => (
                <tr key={i} className="table-row">
                  <td style={{ padding: '12px 20px', fontSize: 12, fontFamily: 'monospace', color: 'var(--primary)' }}>{l.rule}</td>
                  <td style={{ padding: '12px 20px', fontSize: 13 }}>{l.trigger}</td>
                  <td style={{ padding: '12px 20px', fontSize: 13 }}>{l.org}</td>
                  <td style={{ padding: '12px 20px' }}><StatusBadge status={l.result} /></td>
                  <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {['Scheduled Jobs', 'Workflows'].includes(tab) && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Zap size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{tab}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage platform {tab.toLowerCase()}</div>
        </div>
      )}

      {showCreate && (
        <Modal title="Create Automation Rule" size="lg" onClose={() => setShowCreate(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Rule name</label><input className="input" placeholder="e.g. Trial expiry reminder" /></div>

            <div className="card" style={{ padding: 16, background: 'var(--bg)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 10 }}>TRIGGER — When this happens</div>
              <select className="input">
                <option>Subscription expires in...</option>
                <option>Subscription payment fails</option>
                <option>Organization created</option>
                <option>API usage exceeds threshold</option>
                <option>Security event detected</option>
                <option>Trial period ends</option>
              </select>
            </div>

            <div className="card" style={{ padding: 16, background: 'var(--bg)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--warning)', marginBottom: 10 }}>CONDITION — Only if</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <select className="input"><option>Plan</option><option>Usage</option><option>Status</option></select>
                <select className="input"><option>equals</option><option>not equals</option><option>greater than</option></select>
                <input className="input" placeholder="Value..." />
              </div>
            </div>

            <div className="card" style={{ padding: 16, background: 'var(--bg)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)', marginBottom: 10 }}>ACTION — Then do this</div>
              <select className="input" style={{ marginBottom: 8 }}>
                <option>Send email notification</option>
                <option>Restrict services</option>
                <option>Create support ticket</option>
                <option>Create incident</option>
                <option>Notify Slack channel</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { setShowCreate(false); setToast('Automation rule created') }}>Create Rule</button>
            </div>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          title={`Delete "${confirm.name}"?`}
          message="This automation rule will be permanently deleted. Any scheduled runs will be cancelled."
          confirmLabel="Delete rule"
          danger
          onConfirm={() => { setToast('Automation rule deleted'); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
