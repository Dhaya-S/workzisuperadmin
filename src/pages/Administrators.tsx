import { useState } from 'react'
import { Plus, MoreHorizontal, Mail, CheckCircle, XCircle, KeyRound, LogOut, Shield } from 'lucide-react'
import { PageHeader, SearchInput, FilterSelect, StatusBadge, Pagination, Avatar, ConfirmDialog, Toast, Modal } from '../components/ui'
import { ADMINS } from '../lib/data'
import type { Admin } from '../lib/types'

export default function Administrators() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [showInvite, setShowInvite] = useState(false)
  const [selected, setSelected] = useState<Admin | null>(null)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ name: string; action: string } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('All')
  const perPage = 8

  const filtered = ADMINS.filter(a =>
    (search === '' || a.name.toLowerCase().includes(search.toLowerCase()) || a.org.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === '' || a.status === statusFilter) &&
    (roleFilter === '' || a.role === roleFilter) &&
    (activeTab === 'All' || a.status === activeTab.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="Administrators" description="Manage organization administrators across the platform." actions={<button className="btn-primary" onClick={() => setShowInvite(true)}><Plus size={16} /> Invite Administrator</button>} />
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg)', borderRadius: 8, padding: 4, width: 'fit-content', border: '1px solid var(--border)' }}>
        {['All', 'Active', 'Pending', 'Suspended'].map(t => <button key={t} onClick={() => { setActiveTab(t); setPage(1) }} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500, background: activeTab === t ? 'var(--surface)' : 'transparent', color: activeTab === t ? 'var(--text-primary)' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>{t}</button>)}
      </div>
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchInput placeholder="Search administrators..." value={search} onChange={setSearch} />
          <FilterSelect label="All statuses" value={statusFilter} options={['active', 'suspended', 'pending']} onChange={setStatusFilter} />
          <FilterSelect label="All roles" value={roleFilter} options={['HR Admin', 'Finance Admin', 'Super Admin', 'IT Admin']} onChange={setRoleFilter} />
          {(search || statusFilter || roleFilter) && <button className="btn-ghost" onClick={() => { setSearch(''); setStatusFilter(''); setRoleFilter('') }}>Clear</button>}
          <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>{filtered.length} administrators</div>
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'visible' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr className="table-header">{['Administrator', 'Organization', 'Role', 'Status', 'Last Login', '2FA', 'Created', 'Actions'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left' }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.slice((page - 1) * perPage, page * perPage).map(a => (
            <tr key={a.id} className="table-row">
              <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={a.name} size={34} /><div><div style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.email}</div></div></div></td>
              <td style={{ padding: '14px 16px', fontSize: 13 }}>{a.org}</td><td style={{ padding: '14px 16px', fontSize: 13 }}>{a.role}</td><td style={{ padding: '14px 16px' }}><StatusBadge status={a.status} /></td><td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{a.lastLogin}</td>
              <td style={{ padding: '14px 16px' }}>{a.twoFa ? <CheckCircle size={16} color="var(--success)" /> : <XCircle size={16} color="var(--error)" />}</td><td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{a.created}</td>
              <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', gap: 6, position: 'relative' }}><button className="btn-secondary" style={{ height: 30, fontSize: 12 }} onClick={() => setSelected(a)}>View</button><button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => setActionMenu(actionMenu === a.id ? null : a.id)}><MoreHorizontal size={14} /></button>{actionMenu === a.id && <div style={{ position: 'absolute', right: 0, top: 34, width: 178, padding: 6, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, zIndex: 20 }}><div className="sidebar-item" onClick={() => { setSelected(a); setActionMenu(null) }}><Shield size={13} /> View permissions</div><div className="sidebar-item" onClick={() => { setToast(`Password reset sent to ${a.email}`); setActionMenu(null) }}><KeyRound size={13} /> Reset password</div><div className="sidebar-item" onClick={() => { setToast(`${a.name}'s sessions revoked`); setActionMenu(null) }}><LogOut size={13} /> Force logout</div><div className="sidebar-item" style={{ color: a.status === 'suspended' ? 'var(--success)' : 'var(--error)' }} onClick={() => { setConfirm({ name: a.name, action: a.status === 'suspended' ? 'reactivate' : 'suspend' }); setActionMenu(null) }}>{a.status === 'suspended' ? 'Reactivate' : 'Suspend'}</div></div>}</div></td>
            </tr>
          ))}</tbody>
        </table>
        <div style={{ padding: '0 16px' }}><Pagination page={page} total={filtered.length} perPage={perPage} onChange={setPage} /></div>
      </div>

      {selected && <AdminDetail admin={selected} onClose={() => setSelected(null)} onAction={message => { setSelected(null); setToast(message) }} />}
      {showInvite && <InviteAdmin onClose={() => setShowInvite(false)} onSave={() => { setShowInvite(false); setToast('Administrator invitation sent successfully') }} />}
      {confirm && <ConfirmDialog title={`${confirm.action === 'suspend' ? 'Suspend' : 'Reactivate'} ${confirm.name}?`} message={confirm.action === 'suspend' ? `${confirm.name} will immediately lose admin access and active sessions will end.` : `${confirm.name}'s account will be restored with its previous permissions.`} confirmLabel={confirm.action === 'suspend' ? 'Suspend administrator' : 'Reactivate'} danger={confirm.action === 'suspend'} onConfirm={() => { setToast(`${confirm.name} ${confirm.action}d successfully`); setConfirm(null) }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

function AdminDetail({ admin, onClose, onAction }: { admin: Admin; onClose: () => void; onAction: (message: string) => void }) {
  return <Modal title="Administrator details" onClose={onClose}><div><div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}><Avatar name={admin.name} size={44} /><div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 600 }}>{admin.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{admin.email}</div></div><StatusBadge status={admin.status} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '16px 0' }}>{[['Organization', admin.org], ['Role', admin.role], ['Last login', admin.lastLogin], ['Created', admin.created], ['Two-factor auth', admin.twoFa ? 'Enabled' : 'Not enabled'], ['Administrator ID', admin.id]].map(([label, value]) => <div key={label}><div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div><div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div></div>)}</div><div style={{ marginBottom: 16 }}><div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Permissions</div><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{['Employees', 'Attendance', 'Leave', 'Reports', 'Settings'].map(p => <span key={p} className="badge badge-primary">{p}</span>)}</div></div><div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><button className="btn-secondary" onClick={() => onAction(`Password reset sent to ${admin.email}`)}><KeyRound size={13} /> Reset password</button><button className="btn-primary" onClick={() => onAction(`${admin.name}'s profile editor opened`)}>Edit administrator</button></div></div></Modal>
}

function InviteAdmin({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [org, setOrg] = useState('')
  return <Modal title="Invite Administrator" onClose={onClose}><div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}><input className="input" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} /><input className="input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} /><select className="input" value={org} onChange={e => setOrg(e.target.value)}><option value="">Select organization</option>{Array.from(new Set(ADMINS.map(a => a.org))).map(o => <option key={o}>{o}</option>)}</select><select className="input"><option>HR Admin</option><option>Finance Admin</option><option>Super Admin</option><option>IT Admin</option></select><div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!name || !email || !org} onClick={onSave}><Mail size={14} /> Send invitation</button></div></div></Modal>
}
