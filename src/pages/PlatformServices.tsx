import { useState } from 'react'
import { MoreHorizontal, Cpu, AlertTriangle } from 'lucide-react'
import { PageHeader, StatusBadge, ProgressBar, Toast, ConfirmDialog, Tabs } from '../components/ui'
import { SERVICES } from '../lib/data'

export default function PlatformServices() {
  const [selected, setSelected] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ name: string } | null>(null)
  const [tab, setTab] = useState('All Services')

  const selectedService = SERVICES.find(s => s.name === selected)

  if (selected && selectedService) {
    return (
      <div>
        <button className="btn-ghost" style={{ color: 'var(--text-muted)', marginBottom: 20 }} onClick={() => setSelected(null)}>← Platform Services</button>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{selectedService.name}</h2>
                <StatusBadge status={selectedService.status} />
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Version {selectedService.version} · {selectedService.orgs} organizations</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setToast(`${selectedService.name} configuration opened`)}>Configure</button>
              <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setToast('Service disabled. Organizations will be notified.')}>Disable Service</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            {[{ l: 'Organizations', v: selectedService.orgs }, { l: 'Usage', v: `${selectedService.usage}%` }, { l: 'Uptime', v: `${selectedService.uptime}%` }, { l: 'Errors (24h)', v: selectedService.errors }, { l: 'Version', v: selectedService.version }].map((m, i) => (
              <div key={m.l} style={{ padding: '0 16px', borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{m.l}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Feature Controls</div>
            {['Core functionality', 'Advanced reporting', 'AI-powered insights', 'Mobile app access', 'API access', 'Webhook support'].map(f => (
              <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}>
                <span>{f}</span>
                <label style={{ position: 'relative', width: 40, height: 22, cursor: 'pointer', display: 'flex' }}>
                  <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} onChange={() => setToast(`${f} setting updated`)} />
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--primary)', borderRadius: 999, display: 'flex', alignItems: 'center', paddingLeft: 2 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', marginLeft: 'auto', marginRight: 2 }} />
                  </div>
                </label>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Service Limits</div>
            {[['Max users per org', '10,000'], ['API rate limit', '1,000 req/min'], ['Data retention', '36 months'], ['Storage per org', '50 GB'], ['Export limit', '100K records'], ['Concurrent connections', '500']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {toast && <Toast title={toast} onClose={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Platform Services" description="Monitor and manage all Attendance HRMS service modules." />

      <div style={{ marginBottom: 20 }}>
        <Tabs tabs={['All Services', 'Operational', 'Degraded', 'Disabled']} active={tab} onChange={setTab} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {SERVICES.filter(s => tab === 'All Services' || s.status === tab.toLowerCase()).map(service => (
          <div key={service.name} className="card" style={{ cursor: 'pointer', borderLeft: `4px solid ${service.status === 'operational' ? 'var(--success)' : 'var(--warning)'}` }}
            onClick={() => setSelected(service.name)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,24,40,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{service.name}</div>
                  {service.errors > 0 && <AlertTriangle size={14} color="var(--warning)" />}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>v{service.version} · {service.orgs} orgs</div>
              </div>
              <StatusBadge status={service.status} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
              {[{ l: 'Uptime', v: `${service.uptime}%`, c: service.uptime > 99 ? 'var(--success)' : 'var(--warning)' }, { l: 'Usage', v: `${service.usage}%`, c: 'var(--primary)' }, { l: 'Errors 24h', v: service.errors, c: service.errors > 0 ? 'var(--error)' : 'var(--text-muted)' }].map(m => (
                <div key={m.l}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{m.l}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: m.c }}>{m.v}</div>
                </div>
              ))}
            </div>
            <ProgressBar value={service.usage} color={service.status === 'operational' ? 'var(--primary)' : 'var(--warning)'} />
          </div>
        ))}
      </div>

      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
