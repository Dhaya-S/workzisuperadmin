import { useState } from 'react'
import { Settings, Globe, Mail, Bell, Shield, Flag, Trash2, Palette } from 'lucide-react'
import { PageHeader, Tabs, Toast } from '../components/ui'

const FEATURE_FLAGS = [
  { name: 'AI Assistant', description: 'In-app AI assistant for all users', status: true, rollout: 100, env: 'Production' },
  { name: 'Advanced Analytics v2', description: 'New analytics dashboard with predictive insights', status: true, rollout: 75, env: 'Production' },
  { name: 'Document AI', description: 'AI-powered document processing', status: false, rollout: 0, env: 'Beta' },
  { name: 'New Payroll Engine', description: 'Rebuilt payroll calculation engine', status: false, rollout: 10, env: 'Testing' },
  { name: 'Mobile Check-in', description: 'GPS-based mobile attendance check-in', status: true, rollout: 100, env: 'Production' },
  { name: 'Biometric Integration', description: 'Hardware biometric device integration', status: false, rollout: 0, env: 'Alpha' },
]

export default function Settings() {
  const [tab, setTab] = useState('Platform')
  const [toast, setToast] = useState<string | null>(null)

  const TABS = ['Platform', 'Branding', 'Localization', 'Email', 'Security Policies', 'Feature Flags', 'Data Retention']

  return (
    <div>
      <PageHeader title="Global Settings" description="Platform-wide configuration for Attendance HRMS." />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'Platform' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Platform Identity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Platform name</label><input className="input" defaultValue="Attendance HRMS" /></div>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Platform URL</label><input className="input" defaultValue="https://app.attendancehrms.in" /></div>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Support email</label><input className="input" defaultValue="support@attendancehrms.in" /></div>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Legal entity</label><input className="input" defaultValue="Attendance HRMS Technologies Pvt. Ltd." /></div>
              </div>
              <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => setToast('Platform settings saved')}>Save changes</button>
            </div>
            <div className="card">
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Maintenance Mode</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>Enable maintenance mode to take the platform offline for scheduled maintenance. All organizations will be notified.</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" style={{ fontSize: 13, color: 'var(--warning)', borderColor: 'var(--warning-soft)' }} onClick={() => setToast('Maintenance mode enabled — organizations notified')}>Enable Maintenance Mode</button>
              </div>
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Platform Info</div>
            {[
              ['Version', '4.2.1'], ['Environment', 'Production'], ['Region', 'ap-south-1 (Mumbai)'], ['License', 'Enterprise'], ['License expiry', '31 Dec 2026'], ['Max organizations', '10,000'], ['API version', 'v3.2'], ['Last deployed', '25 Aug 2026'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Branding' && (
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Platform Branding</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Primary color</label><div style={{ display: 'flex', gap: 8 }}><input type="color" defaultValue="#5C5CFF" style={{ width: 44, height: 40, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }} /><input className="input" defaultValue="#5C5CFF" /></div></div>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Platform logo</label><div style={{ height: 40, border: '1px dashed var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>Click to upload logo</div></div>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email logo</label><div style={{ height: 40, border: '1px dashed var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>Click to upload</div></div>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Favicon</label><div style={{ height: 40, border: '1px dashed var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>Click to upload</div></div>
          </div>
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => setToast('Branding saved')}>Save branding</button>
        </div>
      )}

      {tab === 'Localization' && (
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Localization & Regionalization</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Default language', options: ['English (US)', 'English (IN)', 'Hindi', 'Tamil', 'Telugu'] },
              { label: 'Default timezone', options: ['IST (UTC+5:30)', 'UTC', 'PST (UTC-8)'] },
              { label: 'Default currency', options: ['INR (₹)', 'USD ($)', 'EUR (€)'] },
              { label: 'Date format', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{f.label}</label>
                <select className="input">{f.options.map(o => <option key={o}>{o}</option>)}</select>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => setToast('Localization settings saved')}>Save settings</button>
        </div>
      )}

      {tab === 'Feature Flags' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Feature Flags</div>
            <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setToast('Feature flag created')}>New flag</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="table-header">
                {['Feature', 'Description', 'Status', 'Rollout', 'Environment', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_FLAGS.map(f => (
                <tr key={f.name} className="table-row">
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600 }}>{f.name}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-muted)', maxWidth: 200 }}>{f.description}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <div style={{ position: 'relative', width: 36, height: 20 }}>
                        <input type="checkbox" defaultChecked={f.status} style={{ opacity: 0, width: 0 }} onChange={() => setToast(`${f.name} ${f.status ? 'disabled' : 'enabled'}`)} />
                        <div style={{ position: 'absolute', inset: 0, background: f.status ? 'var(--primary)' : 'var(--border)', borderRadius: 999, cursor: 'pointer' }}>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', margin: '2px', marginLeft: f.status ? 18 : 2, transition: 'margin 0.15s' }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: f.status ? 'var(--success)' : 'var(--text-muted)' }}>{f.status ? 'On' : 'Off'}</span>
                    </label>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: 'var(--bg)', borderRadius: 999 }}>
                        <div style={{ width: `${f.rollout}%`, height: '100%', background: 'var(--primary)', borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.rollout}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: f.env === 'Production' ? 'var(--success-soft)' : f.env === 'Beta' ? 'var(--info-soft)' : 'var(--warning-soft)', color: f.env === 'Production' ? 'var(--success)' : f.env === 'Beta' ? 'var(--info)' : 'var(--warning)', fontWeight: 500 }}>{f.env}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <button className="btn-secondary" style={{ height: 30, fontSize: 12, padding: '0 10px' }} onClick={() => setToast('Flag updated')}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {['Email', 'Security Policies', 'Data Retention'].includes(tab) && (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <Settings size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{tab}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Configure platform {tab.toLowerCase()} settings</div>
        </div>
      )}

      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
