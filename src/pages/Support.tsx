import { useMemo, useState } from 'react'
import { Plus, Mail, BookOpen, AlertTriangle, Megaphone, Send, Edit3 } from 'lucide-react'
import { PageHeader, StatusBadge, StatCard, SearchInput, Toast, Modal, Avatar, Tabs, ConfirmDialog } from '../components/ui'
import { TICKETS } from '../lib/data'
import type { Ticket } from '../lib/types'

const PRIORITY_COLOR = { low: 'var(--success)', medium: 'var(--warning)', high: 'var(--error)', critical: 'var(--error)' } as Record<string, string>

export default function Support() {
  const [tab, setTab] = useState('Tickets')
  const [selected, setSelected] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [tickets, setTickets] = useState(TICKETS)
  const [createTicket, setCreateTicket] = useState(false)
  const [priorityModal, setPriorityModal] = useState(false)
  const [confirmResolve, setConfirmResolve] = useState(false)
  const [reply, setReply] = useState('')
  const [noteMode, setNoteMode] = useState(false)
  const [agent, setAgent] = useState('Sanjay R.')
  const [composer, setComposer] = useState<'announcement' | 'article' | null>(null)

  const selectedTicket = tickets.find(t => t.id === selected)
  const filtered = useMemo(() => tickets.filter(t =>
    (search === '' || t.org.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())) &&
    (status === 'All' || t.status === status.toLowerCase().replace(' ', '-'))
  ), [tickets, search, status])

  const updateTicket = (id: string, changes: Partial<Ticket>) => setTickets(items => items.map(t => t.id === id ? { ...t, ...changes } : t))

  if (selectedTicket) {
    return (
      <div>
        <button className="btn-ghost" style={{ color: 'var(--text-muted)', marginBottom: 20 }} onClick={() => setSelected(null)}>← Support</button>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}><span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{selectedTicket.id}</span><StatusBadge status={selectedTicket.status} /><StatusBadge status={selectedTicket.priority} /></div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{selectedTicket.org} — {selectedTicket.category} Issue</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Opened by {selectedTicket.requester} · {selectedTicket.created}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setPriorityModal(true)}>Change priority</button>
                {selectedTicket.status !== 'resolved' && <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setConfirmResolve(true)}>Resolve</button>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
              {[
                [selectedTicket.requester, 'We are experiencing an issue and need your help resolving it as soon as possible.', selectedTicket.created, true],
                ['Sanjay R.', 'Thanks for reporting this. I reviewed the account and I am working on the next steps now.', selectedTicket.updated, false],
              ].map(([author, msg, time, isUser], i) => (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <Avatar name={String(author)} size={32} /><div style={{ flex: 1 }}><div style={{ display: 'flex', gap: 8, marginBottom: 4 }}><strong style={{ fontSize: 13 }}>{author}</strong><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{time}</span>{!isUser && <span className="badge badge-primary">Agent</span>}</div><div style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '10px 12px', background: 'var(--bg)', borderRadius: 8 }}>{msg}</div></div>
                </div>
              ))}
            </div>
            <textarea className="input" value={reply} onChange={e => setReply(e.target.value)} style={{ height: 80, resize: 'none', paddingTop: 8, marginBottom: 8 }} placeholder={noteMode ? 'Write an internal note...' : 'Write a reply...'} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className={noteMode ? 'btn-primary' : 'btn-secondary'} style={{ fontSize: 13 }} onClick={() => setNoteMode(!noteMode)}><Edit3 size={13} /> Internal note</button>
              <button className="btn-primary" style={{ fontSize: 13 }} disabled={!reply.trim()} onClick={() => { setToast(noteMode ? 'Internal note added' : 'Reply sent'); setReply(''); setNoteMode(false) }}><Send size={13} /> {noteMode ? 'Add note' : 'Send reply'}</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Ticket Details</div>
              {[['ID', selectedTicket.id], ['Organization', selectedTicket.org], ['Requester', selectedTicket.requester], ['Category', selectedTicket.category], ['Priority', selectedTicket.priority], ['Assigned', selectedTicket.agent], ['Created', selectedTicket.created], ['Updated', selectedTicket.updated]].map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--divider)', fontSize: 12 }}><span style={{ color: 'var(--text-muted)' }}>{k}</span><strong>{v}</strong></div>)}
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Assign Agent</div>
              <select className="input" value={agent} onChange={e => setAgent(e.target.value)} style={{ marginBottom: 8 }}><option>Sanjay R.</option><option>Pooja M.</option><option>Unassigned</option></select>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={() => { updateTicket(selectedTicket.id, { agent }); setToast(`Ticket assigned to ${agent}`) }}>Assign</button>
            </div>
          </div>
        </div>
        {priorityModal && <PriorityModal priority={selectedTicket.priority} onClose={() => setPriorityModal(false)} onSave={priority => { updateTicket(selectedTicket.id, { priority: priority as Ticket['priority'] }); setPriorityModal(false); setToast(`Priority changed to ${priority}`) }} />}
        {confirmResolve && <ConfirmDialog title={`Resolve ${selectedTicket.id}?`} message="The requester will be notified and this ticket will move to resolved. It can be reopened later if needed." confirmLabel="Resolve ticket" onConfirm={() => { updateTicket(selectedTicket.id, { status: 'resolved' }); setConfirmResolve(false); setToast('Ticket resolved') }} onCancel={() => setConfirmResolve(false)} />}
        {toast && <Toast title={toast} onClose={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Support" description="Manage support tickets, escalations, and organization help requests." actions={<button className="btn-primary" onClick={() => setCreateTicket(true)}><Plus size={15} /> Create Ticket</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Open Tickets" value={tickets.filter(t => t.status === 'open').length} accent="var(--error)" onClick={() => { setTab('Tickets'); setStatus('Open') }} />
        <StatCard label="High Priority" value={tickets.filter(t => ['high', 'critical'].includes(t.priority)).length} accent="var(--warning)" onClick={() => { setTab('Tickets'); setStatus('All') }} />
        <StatCard label="Unassigned" value={tickets.filter(t => t.agent === 'Unassigned').length} accent="var(--info)" onClick={() => { setTab('Tickets'); setStatus('All') }} />
        <StatCard label="SLA Breaches" value="0" accent="var(--success)" onClick={() => setToast('No SLA breaches')} />
        <StatCard label="Resolved Today" value={tickets.filter(t => t.status === 'resolved').length} accent="var(--success)" onClick={() => { setTab('Tickets'); setStatus('Resolved') }} />
      </div>
      <div style={{ marginBottom: 20 }}><Tabs tabs={['Tickets', 'Escalations', 'Announcements', 'Knowledge Base']} active={tab} onChange={setTab} /></div>

      {tab === 'Tickets' && (
        <div>
          <div className="card" style={{ padding: '14px 20px', marginBottom: 16 }}><div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}><SearchInput placeholder="Search tickets..." value={search} onChange={setSearch} />{['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(s => <button key={s} onClick={() => setStatus(s)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 13, background: s === status ? 'var(--primary)' : 'var(--surface)', color: s === status ? 'var(--surface)' : 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>{s}</button>)}</div></div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr className="table-header">{['Ticket ID', 'Organization', 'Requester', 'Category', 'Priority', 'Status', 'Agent', 'Updated', 'Actions'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left' }}>{h}</th>)}</tr></thead><tbody>{filtered.map(t => <tr key={t.id} className="table-row"><td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }} onClick={() => setSelected(t.id)}>{t.id}</td><td style={{ padding: '12px 16px' }}>{t.org}</td><td style={{ padding: '12px 16px' }}>{t.requester}</td><td style={{ padding: '12px 16px' }}>{t.category}</td><td style={{ padding: '12px 16px', color: PRIORITY_COLOR[t.priority], fontWeight: 600 }}>{t.priority.toUpperCase()}</td><td style={{ padding: '12px 16px' }}><StatusBadge status={t.status} /></td><td style={{ padding: '12px 16px' }}>{t.agent}</td><td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{t.updated}</td><td style={{ padding: '12px 16px' }}><button className="btn-secondary" style={{ height: 28, fontSize: 12 }} onClick={() => setSelected(t.id)}>Open</button></td></tr>)}</tbody></table></div>
        </div>
      )}

      {tab === 'Escalations' && <Escalations onOpen={id => setSelected(id)} onAction={setToast} tickets={tickets} />}
      {tab === 'Announcements' && <ResourceList icon={<Megaphone size={16} />} title="Support announcements" actionLabel="New announcement" onAction={() => setComposer('announcement')} items={['Scheduled maintenance — 6 Sep', 'Payroll processing delay resolved', 'New support response-time policy']} />}
      {tab === 'Knowledge Base' && <ResourceList icon={<BookOpen size={16} />} title="Knowledge base" actionLabel="New article" onAction={() => setComposer('article')} items={['Configure attendance policies', 'Resolve payroll sync issues', 'Set up Google Workspace SSO', 'Manage subscription and invoices']} />}

      {createTicket && <CreateTicketModal onClose={() => setCreateTicket(false)} onCreate={ticket => { setTickets(items => [ticket, ...items]); setCreateTicket(false); setToast(`${ticket.id} created successfully`) }} />}
      {composer && <ComposerModal type={composer} onClose={() => setComposer(null)} onSave={title => { setComposer(null); setToast(`${composer === 'article' ? 'Article' : 'Announcement'} "${title}" published`) }} />}
      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

function PriorityModal({ priority, onClose, onSave }: { priority: string; onClose: () => void; onSave: (p: string) => void }) {
  const [value, setValue] = useState(priority)
  return <Modal title="Change ticket priority" onClose={onClose}><div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}><select className="input" value={value} onChange={e => setValue(e.target.value)}>{['low', 'medium', 'high', 'critical'].map(p => <option key={p}>{p}</option>)}</select><div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={() => onSave(value)}>Save priority</button></div></div></Modal>
}

function CreateTicketModal({ onClose, onCreate }: { onClose: () => void; onCreate: (ticket: Ticket) => void }) {
  const [form, setForm] = useState({ org: '', requester: '', category: 'Technical', priority: 'medium', subject: '', description: '' })
  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))
  return <Modal title="Create support ticket" onClose={onClose}><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><input className="input" placeholder="Organization" value={form.org} onChange={e => set('org', e.target.value)} /><input className="input" placeholder="Requester name" value={form.requester} onChange={e => set('requester', e.target.value)} /><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><select className="input" value={form.category} onChange={e => set('category', e.target.value)}>{['Technical', 'Billing', 'Integration', 'Access'].map(v => <option key={v}>{v}</option>)}</select><select className="input" value={form.priority} onChange={e => set('priority', e.target.value)}>{['low', 'medium', 'high', 'critical'].map(v => <option key={v}>{v}</option>)}</select></div><input className="input" placeholder="Subject" value={form.subject} onChange={e => set('subject', e.target.value)} /><textarea className="input" style={{ height: 90, paddingTop: 9 }} placeholder="Describe the issue" value={form.description} onChange={e => set('description', e.target.value)} /><div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!form.org || !form.requester || !form.subject || !form.description} onClick={() => onCreate({ id: `TK-${10300 + Math.floor(Math.random() * 90)}`, org: form.org, requester: form.requester, category: form.category, priority: form.priority as Ticket['priority'], status: 'open', agent: 'Unassigned', created: 'Today', updated: 'Just now' })}>Create ticket</button></div></div></Modal>
}

function Escalations({ tickets, onOpen, onAction }: { tickets: Ticket[]; onOpen: (id: string) => void; onAction: (v: string) => void }) {
  const escalated = tickets.filter(t => ['high', 'critical'].includes(t.priority))
  return <div className="card" style={{ padding: 0, overflow: 'hidden' }}><div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 600 }}>Priority escalations</div>{escalated.map(t => <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr auto auto', gap: 12, alignItems: 'center', padding: '13px 20px', borderBottom: '1px solid var(--divider)' }}><AlertTriangle size={15} color="var(--error)" /><div><strong style={{ fontSize: 13 }}>{t.id} · {t.org}</strong><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.category} · {t.updated}</div></div><StatusBadge status={t.priority} /><button className="btn-secondary" style={{ height: 28, fontSize: 12 }} onClick={() => onAction(`${t.id} escalation owner notified`)}>Notify owner</button><button className="btn-primary" style={{ height: 28, fontSize: 12 }} onClick={() => onOpen(t.id)}>Review</button></div>)}</div>
}

function ResourceList({ icon, title, actionLabel, onAction, items }: { icon: React.ReactNode; title: string; actionLabel: string; onAction: () => void; items: string[] }) {
  return <div className="card" style={{ padding: 0, overflow: 'hidden' }}><div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div><button className="btn-primary" style={{ fontSize: 12 }} onClick={onAction}><Plus size={13} /> {actionLabel}</button></div>{items.map((item, i) => <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: '1px solid var(--divider)' }}><div style={{ color: 'var(--primary)' }}>{icon}</div><div style={{ flex: 1 }}><strong style={{ fontSize: 13 }}>{item}</strong><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Updated {i + 1} day{i ? 's' : ''} ago</div></div><StatusBadge status={i === 0 ? 'active' : 'published'} /><button className="btn-secondary" style={{ height: 28, fontSize: 12 }} onClick={onAction}>Edit</button></div>)}</div>
}

function ComposerModal({ type, onClose, onSave }: { type: 'announcement' | 'article'; onClose: () => void; onSave: (title: string) => void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  return <Modal title={type === 'article' ? 'Create knowledge base article' : 'Create announcement'} onClose={onClose}><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /><textarea className="input" style={{ height: 120, paddingTop: 9 }} placeholder="Write content..." value={body} onChange={e => setBody(e.target.value)} />{type === 'announcement' && <select className="input"><option>All organizations</option><option>Selected organizations</option><option>Administrators only</option></select>}<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!title || !body} onClick={() => onSave(title)}><Mail size={13} /> Publish</button></div></div></Modal>
}
