import { useState } from 'react'
import { User, Shield, Bell, Monitor, Key, LogOut, Upload } from 'lucide-react'
import { PageHeader, Tabs, Avatar, Toast, ConfirmDialog } from '../components/ui'
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext'

export default function Profile() {
  const { adminProfile, user } = useSuperAdminAuth()
  const displayName = adminProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'Super Admin'
  const displayEmail = adminProfile?.email || user?.email || 'admin@workzi.com'
  const nameParts = displayName.split(' ')
  const firstName = nameParts[0] || 'Super'
  const lastName = nameParts.slice(1).join(' ') || 'Admin'

  const [tab, setTab] = useState('Personal Info')
  const [toast, setToast] = useState<string | null>(null)
  const [confirmLogout, setConfirmLogout] = useState(false)

  const SESSIONS = [
    { device: 'Chrome on macOS', ip: '10.0.0.1', location: 'Mumbai, IN', current: true, time: 'Active now' },
    { device: 'Safari on iPhone', ip: '192.168.1.105', location: 'Mumbai, IN', current: false, time: '2 hr ago' },
  ]

  const LOGIN_HISTORY = [
    { device: 'Chrome on macOS', ip: '10.0.0.1', location: 'Mumbai, IN', time: '2 Sep 2026, 09:15 IST', result: 'success' },
    { device: 'Chrome on macOS', ip: '10.0.0.1', location: 'Mumbai, IN', time: '1 Sep 2026, 08:30 IST', result: 'success' },
    { device: 'Unknown device', ip: '45.33.21.78', location: 'Unknown', time: '31 Aug 2026, 23:44 IST', result: 'failed' },
  ]

  return (
    <div>
      <PageHeader title="Profile & Settings" description="Manage your Super Admin account, security, and preferences." />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={['Personal Info', 'Security', 'Sessions', 'Notifications', 'Login History']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Personal Info' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32, gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <Avatar name={displayName} size={80} />
              <button onClick={() => setToast('Profile photo picker opened')} style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Upload size={12} color="#fff" />
              </button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{displayName}</div>
              <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>Super Admin</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{displayEmail}</div>
            </div>
            <div style={{ width: '100%', padding: '10px 0', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
              Member since Jan 2024
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Personal Information</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>First name</label><input className="input" defaultValue={firstName} /></div>
              <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Last name</label><input className="input" defaultValue={lastName} /></div>
              <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label><input className="input" type="email" defaultValue={displayEmail} /></div>
              <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Phone</label><input className="input" defaultValue="+91 98765 43210" /></div>
              <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Role</label><input className="input" defaultValue="Super Admin" disabled style={{ background: 'var(--bg)', cursor: 'not-allowed' }} /></div>
              <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Timezone</label><select className="input"><option>IST (UTC+5:30)</option><option>UTC</option></select></div>
            </div>
            <button className="btn-primary" onClick={() => setToast('Profile updated successfully')}>Save changes</button>
          </div>
        </div>
      )}

      {tab === 'Security' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Change Password</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Current password</label><input className="input" type="password" placeholder="Current password" /></div>
              <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>New password</label><input className="input" type="password" placeholder="Min. 12 characters" /></div>
              <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Confirm new password</label><input className="input" type="password" placeholder="Repeat password" /></div>
            </div>
            <button className="btn-primary" onClick={() => setToast('Password changed successfully')}>Update password</button>
          </div>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Two-Factor Authentication</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--success-soft)', borderRadius: 10, marginBottom: 16 }}>
              <Shield size={18} color="var(--success)" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>2FA is enabled</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Authenticator app configured</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13 }} onClick={() => setToast('Recovery codes downloaded')}>Download recovery codes</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13 }} onClick={() => setToast('Authenticator app reset initiated')}>Reset authenticator app</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13, color: 'var(--error)' }} onClick={() => setToast('2FA disabled — not recommended')}>Disable 2FA</button>
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Device & Session Security</div>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 8, color: 'var(--error)' }} onClick={() => setConfirmLogout(true)}><LogOut size={15} /> Logout all devices</button>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>This will terminate all active sessions except the current one.</div>
          </div>
        </div>
      )}

      {tab === 'Sessions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SESSIONS.map(s => (
            <div key={s.device} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Monitor size={18} color="var(--text-muted)" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{s.device}</span>
                      {s.current && <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--success-soft)', color: 'var(--success)', borderRadius: 999, fontWeight: 500 }}>Current</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.ip} · {s.location} · {s.time}</div>
                  </div>
                </div>
                {!s.current && (
                  <button className="btn-secondary" style={{ fontSize: 13, color: 'var(--error)' }} onClick={() => setToast('Session revoked')}>Revoke</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Notifications' && (
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Notification Preferences</div>
          {[
            { label: 'Security alerts', desc: 'Get notified about security events on your account', enabled: true },
            { label: 'System incidents', desc: 'Notifications when platform incidents are detected', enabled: true },
            { label: 'Failed payments', desc: 'Alert when organization payments fail', enabled: true },
            { label: 'New organization signups', desc: 'Notify when a new org joins the platform', enabled: false },
            { label: 'Support escalations', desc: 'Alert when tickets are escalated to Super Admin', enabled: true },
            { label: 'Weekly digest', desc: 'Weekly summary of platform activity', enabled: false },
          ].map(n => (
            <div key={n.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--divider)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.desc}</div>
              </div>
              <div style={{ position: 'relative', width: 36, height: 20, cursor: 'pointer', flexShrink: 0 }} onClick={() => setToast('Notification preference updated')}>
                <div style={{ position: 'absolute', inset: 0, background: n.enabled ? 'var(--primary)' : 'var(--border)', borderRadius: 999 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', margin: '2px', marginLeft: n.enabled ? 18 : 2, transition: 'margin 0.15s' }} />
                </div>
              </div>
            </div>
          ))}
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setToast('Preferences saved')}>Save preferences</button>
        </div>
      )}

      {tab === 'Login History' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="table-header">
                {['Device', 'IP Address', 'Location', 'Time', 'Result'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOGIN_HISTORY.map((l, i) => (
                <tr key={i} className="table-row" style={{ background: l.result === 'failed' ? 'rgba(220,38,38,0.02)' : undefined }}>
                  <td style={{ padding: '14px 20px', fontSize: 13 }}>{l.device}</td>
                  <td style={{ padding: '14px 20px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{l.ip}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13 }}>{l.location}</td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{l.time}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: l.result === 'success' ? 'var(--success)' : 'var(--error)' }}>{l.result.charAt(0).toUpperCase() + l.result.slice(1)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmLogout && (
        <ConfirmDialog
          title="Logout all devices?"
          message="This will immediately terminate all active sessions on all devices except the current one. You will need to sign in again on other devices."
          confirmLabel="Logout all devices"
          danger
          onConfirm={() => { setToast('All other sessions terminated'); setConfirmLogout(false) }}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
