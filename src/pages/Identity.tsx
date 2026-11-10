import { useState, useEffect } from 'react'
import { Plus, Shield, Key, Lock, Users, CheckCircle, XCircle } from 'lucide-react'
import { PageHeader, Tabs, SearchInput, Avatar, StatusBadge, Toast, Modal } from '../components/ui'
import { subscribeUsers } from '../lib/superadmin-service'
import type { Admin } from '../lib/types'

const ROLES = [
  { name: 'Super Admin', description: 'Full platform access. Cannot be restricted.', users: 2, color: '#DC2626' },
  { name: 'Platform Admin', description: 'Manage organizations, users, and services.', users: 3, color: '#5C5CFF' },
  { name: 'Support Admin', description: 'Access org data for support purposes only.', users: 5, color: '#3B82F6' },
  { name: 'Billing Admin', description: 'Manage billing, invoices, and subscriptions.', users: 2, color: '#16A34A' },
  { name: 'Security Admin', description: 'Access security events and compliance tools.', users: 2, color: '#F59E0B' },
  { name: 'Analyst', description: 'Read-only access to platform analytics.', users: 4, color: '#8B5CF6' },
]

const PERMISSIONS = ['Organizations', 'Users', 'Billing', 'Security', 'Analytics', 'Support', 'Settings', 'Platform Services', 'AI', 'Audit Logs']
const PERM_LEVELS = ['View', 'Create', 'Edit', 'Delete', 'Manage', 'Export']

const PERMISSION_MATRIX: Record<string, Record<string, boolean[]>> = {
  'Super Admin': Object.fromEntries(PERMISSIONS.map(p => [p, PERM_LEVELS.map(() => true)])),
  'Platform Admin': Object.fromEntries(PERMISSIONS.map(p => [p, [true, true, true, false, true, true]])),
  'Support Admin': Object.fromEntries(PERMISSIONS.map(p => [p, [true, false, false, false, false, false]])),
  'Billing Admin': Object.fromEntries(PERMISSIONS.map(p => [p, p === 'Billing' ? [true, true, true, false, true, true] : [true, false, false, false, false, false]])),
  'Security Admin': Object.fromEntries(PERMISSIONS.map(p => [p, p === 'Security' ? [true, false, true, false, true, true] : [true, false, false, false, false, false]])),
  'Analyst': Object.fromEntries(PERMISSIONS.map(p => [p, [true, false, false, false, false, true]])),
}

const USERS_DATA = [
  { name: 'Dhruv Sharma', email: 'dhruv@attendancehrms.in', role: 'Super Admin', status: 'active', lastLogin: '2 min ago', sessions: 1 },
  { name: 'Pooja Mehta', email: 'pooja@attendancehrms.in', role: 'Support Admin', status: 'active', lastLogin: '1 hr ago', sessions: 2 },
  { name: 'Sanjay Rao', email: 'sanjay@attendancehrms.in', role: 'Billing Admin', status: 'active', lastLogin: '30 min ago', sessions: 1 },
  { name: 'Ananya Singh', email: 'ananya@attendancehrms.in', role: 'Analyst', status: 'active', lastLogin: '3 hr ago', sessions: 1 },
  { name: 'Kiran Joshi', email: 'kiran@attendancehrms.in', role: 'Security Admin', status: 'active', lastLogin: 'Yesterday', sessions: 0 },
]

export default function Identity() {
  const [liveUsers, setLiveUsers] = useState<Admin[]>([])
  const [tab, setTab] = useState('Users')
  const [selectedRole, setSelectedRole] = useState('Super Admin')
  const [toast, setToast] = useState<string | null>(null)
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [userSearch, setUserSearch] = useState('')

  useEffect(() => {
    const unsub = subscribeUsers(users => setLiveUsers(users))
    return () => unsub()
  }, [])

  const displayUsers = liveUsers.map(u => ({
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    lastLogin: u.lastLogin,
    sessions: 1
  }))

  return (
    <div>
      <PageHeader title="Identity & Access" description="Manage platform users, roles, permissions, and access policies." actions={
        <div style={{ display: 'flex', gap: 8 }}>
          {tab === 'Roles & Permissions' && <button className="btn-primary" onClick={() => setShowCreateRole(true)}><Plus size={15} /> Create Role</button>}
          {tab === 'Users' && <button className="btn-primary" onClick={() => setShowAddUser(true)}><Plus size={15} /> Add User</button>}
        </div>
      } />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={['Users', 'Roles & Permissions', 'Access Policies', 'Sessions', 'API Access']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Users' && (
        <div>
          <div className="card" style={{ padding: '14px 20px', marginBottom: 16 }}>
            <SearchInput placeholder="Search platform users..." value={userSearch} onChange={setUserSearch} />
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="table-header">
                  {['User', 'Role', 'Status', 'Active Sessions', 'Last Login', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayUsers.filter(u => userSearch === '' || `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(userSearch.toLowerCase())).length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No users found</td></tr>
                ) : displayUsers.filter(u => userSearch === '' || `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                  <tr key={u.name} className="table-row">
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={u.name} size={34} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{u.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 13, padding: '3px 10px', borderRadius: 999, background: 'var(--primary-soft)', color: 'var(--primary)', fontWeight: 500 }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}><StatusBadge status={u.status} /></td>
                    <td style={{ padding: '14px 20px', fontSize: 13 }}>{u.sessions} session{u.sessions !== 1 ? 's' : ''}</td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{u.lastLogin}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-secondary" style={{ height: 30, fontSize: 12, padding: '0 10px' }} onClick={() => setEditingUser(u.name)}>Edit</button>
                        <button className="btn-secondary" style={{ height: 30, fontSize: 12, padding: '0 10px' }} onClick={() => setToast('Sessions revoked for ' + u.name)}>Force logout</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Roles & Permissions' && (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>
          {/* Role List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ROLES.map(r => (
              <div key={r.name} onClick={() => setSelectedRole(r.name)} className="card" style={{ padding: '12px 14px', cursor: 'pointer', borderColor: selectedRole === r.name ? 'var(--primary)' : 'var(--border)', background: selectedRole === r.name ? 'var(--primary-soft)' : 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: selectedRole === r.name ? 'var(--primary)' : 'var(--text-primary)' }}>{r.name}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 16 }}>{r.users} users</div>
              </div>
            ))}
          </div>

          {/* Permission Matrix */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{selectedRole}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{ROLES.find(r => r.name === selectedRole)?.description}</div>
              </div>
              {selectedRole !== 'Super Admin' && <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setToast('Role permissions saved')}>Save changes</button>}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="table-header">
                    <th style={{ padding: '12px 20px', textAlign: 'left' }}>Resource</th>
                    {PERM_LEVELS.map(p => <th key={p} style={{ padding: '12px 14px', textAlign: 'center' }}>{p}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS.map(resource => (
                    <tr key={resource} className="table-row">
                      <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 500 }}>{resource}</td>
                      {PERM_LEVELS.map((level, i) => (
                        <td key={level} style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={PERMISSION_MATRIX[selectedRole]?.[resource]?.[i] || false}
                            disabled={selectedRole === 'Super Admin'}
                            style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                            onChange={() => setToast(`${resource} ${level} permission updated`)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Access Policies' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { title: 'Password Policy', items: [['Minimum length', '12 characters'], ['Require uppercase', 'Yes'], ['Require numbers', 'Yes'], ['Require symbols', 'Yes'], ['Expiry', '90 days'], ['History', '10 passwords']] },
            { title: 'Session Policy', items: [['Max session duration', '8 hours'], ['Idle timeout', '30 minutes'], ['Concurrent sessions', '3 max'], ['Remember device', '30 days'], ['Force re-auth on sensitive actions', 'Yes']] },
            { title: '2FA Requirements', items: [['Super Admin', 'Required'], ['Platform Admin', 'Required'], ['Support Admin', 'Required'], ['Billing Admin', 'Required'], ['Analyst', 'Optional']] },
            { title: 'IP & Device Restrictions', items: [['IP allowlist', 'Configured (3 ranges)'], ['Geo-blocking', 'Enabled'], ['Unknown device prompt', 'Yes'], ['Device trust', '30 days']] },
          ].map(policy => (
            <div key={policy.title} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{policy.title}</div>
                <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setToast('Policy saved')}>Edit</button>
              </div>
              {policy.items.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {['Sessions', 'API Access'].includes(tab) && (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <Key size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{tab}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage platform {tab.toLowerCase()} and tokens</div>
        </div>
      )}

      {showCreateRole && (
        <Modal title="Create Custom Role" onClose={() => setShowCreateRole(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Role name</label><input className="input" placeholder="e.g. Compliance Officer" /></div>
            <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Description</label><textarea className="input" style={{ height: 80, resize: 'none', paddingTop: 8 }} placeholder="What does this role do?" /></div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8 }}>
              <button className="btn-secondary" onClick={() => setShowCreateRole(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { setShowCreateRole(false); setToast('Role created successfully') }}>Create Role</button>
            </div>
          </div>
        </Modal>
      )}
      {(showAddUser || editingUser) && (
        <Modal title={editingUser ? `Edit ${editingUser}` : 'Add Platform User'} onClose={() => { setShowAddUser(false); setEditingUser(null) }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input className="input" placeholder="Full name" defaultValue={editingUser || ''} />
            <input className="input" type="email" placeholder="user@attendancehrms.in" />
            <select className="input">{ROLES.map(role => <option key={role.name}>{role.name}</option>)}</select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-secondary" onClick={() => { setShowAddUser(false); setEditingUser(null) }}>Cancel</button>
              <button className="btn-primary" onClick={() => { setShowAddUser(false); setEditingUser(null); setToast(editingUser ? 'User updated successfully' : 'Platform user added successfully') }}>{editingUser ? 'Save changes' : 'Add user'}</button>
            </div>
          </div>
        </Modal>
      )}
      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
