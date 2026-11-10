import { useState, useEffect } from 'react'
import { MoreHorizontal, Plus, Building2, CheckCircle, Download, Mail, ExternalLink, AlertTriangle, ChevronRight, ShieldCheck, Activity, CreditCard, Plug, Server } from 'lucide-react'
import { StatusBadge, SearchInput, FilterSelect, Pagination, PageHeader, ConfirmDialog, Toast, Tabs, StatCard, ProgressBar, LineChart, Modal } from '../components/ui'
import { ORGS, PLANS, REVENUE_DATA, GROWTH_DATA } from '../lib/data'
import type { Org, Page } from '../lib/types'
import {
  subscribeOrganizations,
  createTenantOrganization,
  toggleOrganizationStatus,
  updateOrganizationPlan
} from '../lib/superadmin-service'
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext'

// ─── constants shared across modals ──────────────────────────────────────────
const INDUSTRIES = ['Technology', 'IT Services', 'Finance', 'Healthcare', 'Manufacturing', 'Logistics', 'Retail', 'Education', 'Media', 'Consulting', 'Startup', 'R&D']
const REGIONS = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Noida', 'Surat', 'Jaipur', 'Bhopal']
const ADMIN_ROLES = ['HR Admin']

// ─── Add Organization Modal (4-step wizard) ──────────────────────────────────
function AddOrgModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (payload: any) => Promise<void> | void }) {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '', industry: 'Technology', region: 'Mumbai', size: '50–200',
    website: '', gst: '',
    adminName: '', adminEmail: '', adminPhone: '', adminRole: 'HR Admin',
    initialPassword: 'Workzi@2026!',
    plan: 'Professional', billing: 'Monthly',
  })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const STEPS = ['Organization', 'Admin User', 'Plan', 'Review']

  const planPrice = (name: string, billing: string) => {
    const p = PLANS.find(p => p.name === name)
    if (!p) return '—'
    if (p.price === 0 && p.name === 'Free') return '₹0/mo'
    if (p.price === 0) return 'Custom pricing'
    const price = billing === 'Annual' ? Math.round(p.price * 0.8) : p.price
    return `₹${price.toLocaleString()}/mo`
  }

  return (
    <Modal title="Add Organization" size="lg" onClose={onClose}>
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, flexShrink: 0,
                background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'transparent',
                color: step >= i + 1 ? '#fff' : 'var(--text-muted)',
                border: step < i + 1 ? '1.5px solid var(--border)' : 'none',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? 'var(--success)' : 'var(--border)', margin: '0 10px' }} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Organization Info */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Organization Name <span style={{ color: 'var(--error)' }}>*</span></label>
              <input className="input" placeholder="e.g. Acme Technologies" value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Industry <span style={{ color: 'var(--error)' }}>*</span></label>
              <select className="input" value={form.industry} onChange={e => set('industry', e.target.value)}>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Region <span style={{ color: 'var(--error)' }}>*</span></label>
              <select className="input" value={form.region} onChange={e => set('region', e.target.value)}>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Company Size</label>
              <select className="input" value={form.size} onChange={e => set('size', e.target.value)}>
                {['1–10', '11–50', '50–200', '200–500', '500–1,000', '1,000+'].map(s => <option key={s}>{s} employees</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Website</label>
              <input className="input" placeholder="https://company.in" value={form.website} onChange={e => set('website', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>GST Number</label>
              <input className="input" placeholder="27AAAAA0000A1Z5" value={form.gst} onChange={e => set('gst', e.target.value)} style={{ fontFamily: 'monospace' }} />
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Admin User */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: '10px 14px', background: 'var(--primary-soft)', borderRadius: 8, fontSize: 12, color: 'var(--primary)', display: 'flex', gap: 8 }}>
            <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            The primary administrator will receive an email invitation to set up their password and access the organization.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Full Name <span style={{ color: 'var(--error)' }}>*</span></label>
              <input className="input" placeholder="e.g. Rajesh Kumar" value={form.adminName} onChange={e => set('adminName', e.target.value)} autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Work Email <span style={{ color: 'var(--error)' }}>*</span></label>
              <input className="input" placeholder="admin@company.in" type="email" value={form.adminEmail} onChange={e => set('adminEmail', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Phone Number</label>
              <input className="input" placeholder="+91 98765 43210" value={form.adminPhone} onChange={e => set('adminPhone', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Initial Password <span style={{ color: 'var(--error)' }}>*</span></label>
              <input className="input" placeholder="Workzi@2026!" value={form.initialPassword} onChange={e => set('initialPassword', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Admin Role</label>
            <input className="input" value="HR Admin (Head of Organization)" disabled />
          </div>
        </div>
      )}

      {/* Step 3 — Plan */}
      {step === 3 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Select a plan for this organization</div>
            <div style={{ display: 'flex', gap: 0, background: 'var(--bg)', padding: 3, borderRadius: 7, border: '1px solid var(--border)' }}>
              {(['Monthly', 'Annual'] as const).map(b => (
                <button key={b} onClick={() => set('billing', b)} style={{ padding: '4px 14px', borderRadius: 5, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: form.billing === b ? 'var(--surface)' : 'transparent', color: form.billing === b ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'all 0.1s' }}>
                  {b}{b === 'Annual' && <span style={{ color: 'var(--success)', marginLeft: 4, fontSize: 10 }}>−20%</span>}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {PLANS.map(plan => {
              const monthlyEq = form.billing === 'Annual' && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price
              const selected = form.plan === plan.name
              return (
                <div key={plan.name} onClick={() => set('plan', plan.name)} style={{ border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, padding: 14, cursor: 'pointer', background: selected ? 'var(--primary-soft)' : 'var(--surface)', transition: 'all 0.12s', position: 'relative' }}>
                  {selected && <div style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={10} color="#fff" /></div>}
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: selected ? 'var(--primary)' : 'var(--text-primary)' }}>{plan.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: plan.color, marginBottom: 4 }}>
                    {plan.price === 0 && plan.name === 'Free' ? '₹0' : plan.price === 0 ? 'Custom' : `₹${monthlyEq.toLocaleString()}`}
                    {plan.price > 0 && <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {plan.users === -1 ? 'Unlimited users' : `Up to ${plan.users} users`}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 4 — Review */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Organization Details</div>
            {[
              { label: 'Name', value: form.name || '—' },
              { label: 'Industry', value: form.industry },
              { label: 'Region', value: form.region },
              { label: 'GST', value: form.gst || '—' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Administrator</div>
            {[
              { label: 'Name', value: form.adminName || '—' },
              { label: 'Email', value: form.adminEmail || '—' },
              { label: 'Role', value: form.adminRole },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--primary-soft)', borderRadius: 10, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(92,92,255,0.15)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 3 }}>{form.plan} Plan · {form.billing}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Invite sent to {form.adminEmail || 'admin email'}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>{planPrice(form.plan, form.billing)}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button className="btn-secondary" onClick={step === 1 ? onClose : () => setStep(s => s - 1)} disabled={submitting}>
          {step === 1 ? 'Cancel' : '← Back'}
        </button>
        <button
          className="btn-primary"
          onClick={async () => {
            if (step === 4) {
              setSubmitting(true)
              try {
                await onSuccess(form)
              } finally {
                setSubmitting(false)
              }
            } else {
              setStep(s => s + 1)
            }
          }}
          disabled={(step === 1 && !form.name.trim()) || (step === 2 && (!form.adminName.trim() || !form.adminEmail.trim())) || submitting}
        >
          {submitting ? 'Creating...' : step === 4 ? 'Create Organization' : 'Continue →'}
        </button>
      </div>
    </Modal>
  )
}

// ─── Edit Organization Modal ──────────────────────────────────────────────────
function EditOrgModal({ org, onClose, onSuccess }: { org: Org; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: org.name,
    industry: org.industry,
    region: org.region,
    website: `https://${org.name.toLowerCase().replace(/\s/g, '')}.in`,
    gst: '27ACMTE1234A1Z5',
    size: '200–500',
  })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <Modal title={`Edit — ${org.name}`} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Organization Name</label>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Industry</label>
            <select className="input" value={form.industry} onChange={e => set('industry', e.target.value)}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Region</label>
            <select className="input" value={form.region} onChange={e => set('region', e.target.value)}>
              {REGIONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Website</label>
            <input className="input" value={form.website} onChange={e => set('website', e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Company Size</label>
            <select className="input" value={form.size} onChange={e => set('size', e.target.value)}>
              {['1–10', '11–50', '50–200', '200–500', '500–1,000', '1,000+'].map(s => <option key={s}>{s} employees</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>GST Number</label>
          <input className="input" value={form.gst} onChange={e => set('gst', e.target.value)} style={{ fontFamily: 'monospace' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)', marginTop: 4 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSuccess}>Save Changes</button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Change Plan Modal ────────────────────────────────────────────────────────
function ChangePlanModal({ org, onClose, onSuccess }: { org: Org; onClose: () => void; onSuccess: (plan: string) => void }) {
  const [selectedPlan, setSelectedPlan] = useState(org.plan)
  const [billing, setBilling] = useState('Monthly')

  const changed = selectedPlan !== org.plan
  const newPlan = PLANS.find(p => p.name === selectedPlan)
  const currentPlan = PLANS.find(p => p.name === org.plan)

  return (
    <Modal title="Change Plan" size="lg" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Current plan for <strong style={{ color: 'var(--text-primary)' }}>{org.name}</strong>:{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{org.plan}</span>
          </div>
          <div style={{ display: 'flex', gap: 0, background: 'var(--bg)', padding: 3, borderRadius: 7, border: '1px solid var(--border)' }}>
            {(['Monthly', 'Annual'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: '4px 14px', borderRadius: 5, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: billing === b ? 'var(--surface)' : 'transparent', color: billing === b ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {b}{b === 'Annual' && <span style={{ color: 'var(--success)', marginLeft: 4, fontSize: 10 }}>−20%</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {PLANS.map(plan => {
            const monthlyEq = billing === 'Annual' && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price
            const selected = selectedPlan === plan.name
            const isCurrent = org.plan === plan.name
            return (
              <div key={plan.name} onClick={() => setSelectedPlan(plan.name)} style={{ border: `2px solid ${selected ? plan.color : isCurrent ? 'var(--border)' : 'var(--border)'}`, borderRadius: 10, padding: 14, cursor: 'pointer', background: selected ? '#FAFAFE' : 'var(--surface)', transition: 'all 0.12s', position: 'relative' }}>
                {isCurrent && <div style={{ position: 'absolute', top: -8, left: 10, fontSize: 9, fontWeight: 700, background: 'var(--neutral-soft)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: 4 }}>CURRENT</div>}
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: selected ? plan.color : 'var(--text-primary)' }}>{plan.name}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: plan.color, marginBottom: 4 }}>
                  {plan.price === 0 && plan.name === 'Free' ? '₹0' : plan.price === 0 ? 'Custom' : `₹${monthlyEq.toLocaleString()}`}
                  {plan.price > 0 && <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {plan.users === -1 ? 'Unlimited' : `≤ ${plan.users}`} users
                </div>
              </div>
            )
          })}
        </div>

        {changed && newPlan && currentPlan && (
          <div style={{ padding: '12px 14px', background: 'var(--info-soft)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.2)', fontSize: 13 }}>
            <div style={{ fontWeight: 600, color: '#2563EB', marginBottom: 4 }}>Plan Change Summary</div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Changing from <strong>{org.plan}</strong> → <strong>{selectedPlan}</strong>.
              {newPlan.price > currentPlan.price
                ? ' Prorated upgrade amount will be billed immediately.'
                : newPlan.price < currentPlan.price
                  ? ' Credit for remaining days will be applied to next invoice.'
                  : ' Custom pricing — our team will contact you.'}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSuccess(selectedPlan)} disabled={!changed} style={{ opacity: !changed ? 0.5 : 1 }}>
            Change to {selectedPlan}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Access as Support Modal ──────────────────────────────────────────────────
function AccessSupportModal({ org, onClose, onSuccess }: { org: Org; onClose: () => void; onSuccess: () => void }) {
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('1 hour')
  const REASONS = ['Customer support request', 'Technical investigation', 'Billing issue resolution', 'Security audit', 'Data verification', 'Feature configuration']

  return (
    <Modal title="Access as Support" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: 'var(--warning-soft)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertTriangle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
            You are about to gain elevated access to <strong>{org.name}</strong>. All actions performed during this session will be logged in the audit trail and visible to all Super Admins.
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Reason for Access <span style={{ color: 'var(--error)' }}>*</span></label>
          <select className="input" value={reason} onChange={e => setReason(e.target.value)}>
            <option value="">Select a reason…</option>
            {REASONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Session Duration</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['1 hour', '4 hours', '8 hours', '24 hours'].map(d => (
              <button key={d} onClick={() => setDuration(d)} style={{ padding: '8px 0', fontSize: 12, fontWeight: 500, border: `1.5px solid ${duration === d ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: duration === d ? 'var(--primary-soft)' : 'var(--surface)', color: duration === d ? 'var(--primary)' : 'var(--text-secondary)' }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>What this session includes</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {[
              { label: 'Can do', items: ['View all organization data', 'Perform support actions', 'Impersonate org users', 'Configure org settings'] },
              { label: 'Gets logged', items: ['Session start & end time', 'Pages and data accessed', 'All actions performed', 'IP address and device'] },
            ].map(col => (
              <div key={col.label} style={{ padding: '12px 14px', borderRight: col.label === 'Can do' ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: col.label === 'Can do' ? 'var(--success)' : 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>{col.label}</div>
                {col.items.map(item => (
                  <div key={item} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 5, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ color: col.label === 'Can do' ? 'var(--success)' : 'var(--text-muted)', marginTop: 1, fontSize: 10 }}>•</span>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSuccess} disabled={!reason} style={{ opacity: !reason ? 0.5 : 1 }}>
            Start Support Session ({duration})
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Contact Admin Modal ──────────────────────────────────────────────────────
function ContactAdminModal({ org, onClose, onSuccess }: { org: Org; onClose: () => void; onSuccess: () => void }) {
  const adminEmail = `admin@${org.name.toLowerCase().replace(/\s+/g, '')}.in`
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [priority, setPriority] = useState('Normal')

  const TEMPLATES: Record<string, { subject: string; body: string }> = {
    'Payment overdue notice': {
      subject: 'Action Required: Outstanding Invoice for Your Attendance HRMS Account',
      body: `Dear ${org.name} Team,\n\nWe noticed that your account has an outstanding invoice that requires your attention. Please review and process the payment at the earliest to avoid any service disruption.\n\nKindly log in to your dashboard to view the invoice details.\n\nRegards,\nAttendance HRMS Billing Team`,
    },
    'Subscription renewal': {
      subject: 'Your Attendance HRMS Subscription is Renewing Soon',
      body: `Dear ${org.name} Team,\n\nThis is a friendly reminder that your Attendance HRMS subscription is due for renewal. Please ensure your payment details are up to date.\n\nRegards,\nAttendance HRMS Team`,
    },
    'Security alert': {
      subject: 'Security Alert: Unusual Activity Detected on Your Account',
      body: `Dear ${org.name} Administrator,\n\nWe have detected unusual login activity on your Attendance HRMS account. Please review your recent login history and take necessary action.\n\nIf this was you, please disregard this message.\n\nRegards,\nAttendance HRMS Security Team`,
    },
  }

  return (
    <Modal title="Contact Administrator" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
          <Mail size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>To</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{adminEmail} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>· {org.name}</span></div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Template</label>
          <select className="input" onChange={e => {
            const tpl = TEMPLATES[e.target.value]
            if (tpl) { setSubject(tpl.subject); setBody(tpl.body) }
            else { setSubject(''); setBody('') }
          }}>
            <option value="">— Custom message —</option>
            {Object.keys(TEMPLATES).map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Subject <span style={{ color: 'var(--error)' }}>*</span></label>
            <input className="input" placeholder="Message subject…" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Priority</label>
            <select className="input" style={{ width: 110 }} value={priority} onChange={e => setPriority(e.target.value)}>
              {['Low', 'Normal', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Message <span style={{ color: 'var(--error)' }}>*</span></label>
          <textarea
            className="input"
            style={{ height: 140, resize: 'vertical', paddingTop: 10, paddingBottom: 10, lineHeight: 1.6 }}
            placeholder="Type your message…"
            value={body}
            onChange={e => setBody(e.target.value)}
          />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>This message will be sent from noreply@attendancehrms.in</div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSuccess} disabled={!subject.trim() || !body.trim()} style={{ opacity: !subject.trim() || !body.trim() ? 0.5 : 1 }}>
            <Mail size={14} /> Send Message
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Org Row Actions ──────────────────────────────────────────────────────────
type OrgModalType = 'edit' | 'change-plan' | 'access-support' | 'contact-admin'

interface OrgActionsProps {
  org: Org
  onViewDetails: () => void
  onOpenModal: (type: OrgModalType) => void
  onSuspend: () => void
  onDelete: () => void
}

function OrgActions({ org, onViewDetails, onOpenModal, onSuspend, onDelete }: OrgActionsProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const ITEMS = [
    { label: 'View details', action: () => { onViewDetails(); close() }, icon: <ExternalLink size={13} /> },
    { label: 'Access as support', action: () => { onOpenModal('access-support'); close() }, icon: null },
    { label: 'Contact admin', action: () => { onOpenModal('contact-admin'); close() }, icon: <Mail size={13} /> },
  ]

  return (
    <div style={{ position: 'relative' }}>
      <button className="icon-btn" onClick={e => { e.stopPropagation(); setOpen(!open) }}><MoreHorizontal size={16} /></button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 36, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 6, minWidth: 190, zIndex: 50, boxShadow: '0 8px 24px rgba(16,24,40,0.1)' }} onClick={e => e.stopPropagation()}>
          {ITEMS.map(item => (
            <div key={item.label} className="sidebar-item" style={{ height: 34, fontSize: 13, borderRadius: 6, gap: 8 }} onClick={item.action}>
              {item.icon && <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{item.icon}</span>}
              {item.label}
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--divider)', margin: '4px 0' }} />
          <div className="sidebar-item" style={{ height: 34, fontSize: 13, borderRadius: 6, color: 'var(--warning)' }} onClick={() => { onSuspend(); close() }}>
            {org.status === 'suspended' ? 'Reactivate' : 'Suspend'}
          </div>
          <div className="sidebar-item" style={{ height: 34, fontSize: 13, borderRadius: 6, color: 'var(--error)' }} onClick={() => { onDelete(); close() }}>
            Delete organization
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Organization List ────────────────────────────────────────────────────────
function OrgList({ setPage, setSelectedOrg }: { setPage: (p: Page) => void; setSelectedOrg: (id: string) => void }) {
  const { user } = useSuperAdminAuth()
  const [liveOrgs, setLiveOrgs] = useState<Org[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [page, setPage2] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [confirm, setConfirm] = useState<{ org: Org; action: 'suspend' | 'delete' } | null>(null)
  const [modal, setModal] = useState<{ type: OrgModalType; org: Org } | null>(null)
  const [showAddOrg, setShowAddOrg] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const perPage = 8

  useEffect(() => {
    const unsub = subscribeOrganizations(orgs => {
      setLiveOrgs(orgs)
    })
    return () => unsub()
  }, [])

  const allOrgs = liveOrgs

  const filtered = allOrgs.filter(o =>
    (search === '' || o.name.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)) &&
    (statusFilter === '' || o.status === statusFilter) &&
    (planFilter === '' || o.plan === planFilter) &&
    (regionFilter === '' || o.region === regionFilter)
  )
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const totalCount = allOrgs.length
  const activeCount = allOrgs.filter(o => o.status === 'active').length
  const trialCount = allOrgs.filter(o => o.status === 'trial').length
  const suspendedCount = allOrgs.filter(o => o.status === 'suspended').length

  return (
    <div>
      <PageHeader
        title="Organizations"
        description="Manage all customer organizations on the Workzi HRMS platform."
        actions={<button className="btn-primary" onClick={() => setShowAddOrg(true)}><Plus size={15} /> Add Organization</button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total" value={totalCount.toLocaleString('en-IN')} trend="+12.4%" />
        <StatCard label="Active" value={activeCount.toLocaleString('en-IN')} accent="var(--success)" />
        <StatCard label="Trial" value={trialCount} accent="var(--info)" />
        <StatCard label="Suspended" value={suspendedCount} accent="var(--error)" />
      </div>

      <div className="card" style={{ padding: '14px 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchInput placeholder="Search by name or ID…" value={search} onChange={setSearch} />
          <FilterSelect label="All statuses" value={statusFilter} options={['active', 'trial', 'suspended', 'pending']} onChange={setStatusFilter} />
          <FilterSelect label="All plans" value={planFilter} options={['Free', 'Starter', 'Professional', 'Business', 'Enterprise']} onChange={setPlanFilter} />
          <FilterSelect label="All regions" value={regionFilter} options={['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune']} onChange={setRegionFilter} />
          {(search || statusFilter || planFilter || regionFilter) && <button className="btn-ghost" onClick={() => { setSearch(''); setStatusFilter(''); setPlanFilter(''); setRegionFilter('') }}>Clear</button>}
          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} results</div>
        </div>
        {selected.length > 0 && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--primary-soft)', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--primary)' }}>{selected.length} selected</span>
            <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setToast('Suspending selected organizations…')}>Suspend all</button>
            <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setToast('Export started')}>Export</button>
            <button className="btn-ghost" style={{ fontSize: 12, color: 'var(--error)' }} onClick={() => setToast('Action not allowed in demo')}>Delete</button>
            <button className="btn-ghost" style={{ fontSize: 12, marginLeft: 'auto' }} onClick={() => setSelected([])}>Deselect all</button>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr className="table-header">
                <th style={{ padding: '11px 16px', textAlign: 'left', width: 40 }}>
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(o => o.id) : [])} style={{ accentColor: 'var(--primary)' }} />
                </th>
                {['Organization', 'Plan', 'Status', 'Users', 'Usage', 'Subscription', 'Last Active', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Building2 size={28} style={{ margin: '0 auto 10px', opacity: 0.25 }} />
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No organizations found</div>
                  <div style={{ fontSize: 13 }}>Try adjusting your search or filters</div>
                </td></tr>
              ) : paginated.map(org => (
                <tr key={org.id} className="table-row">
                  <td style={{ padding: '12px 16px' }}>
                    <input type="checkbox" checked={selected.includes(org.id)} onChange={() => toggleSelect(org.id)} style={{ accentColor: 'var(--primary)' }} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>{org.name[0]}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--primary)', cursor: 'pointer' }} onClick={() => { setSelectedOrg(org.id); setPage('org-detail') }}>{org.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{org.id} · {org.industry}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 13, fontWeight: 500 }}>{org.plan}</span></td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={org.status} /></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{org.users.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{org.admins} admins</div>
                  </td>
                  <td style={{ padding: '12px 16px', minWidth: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1 }}><ProgressBar value={org.usage} color={org.usage > 85 ? 'var(--warning)' : 'var(--primary)'} /></div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{org.usage}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{org.subscription}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{org.lastActivity}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <OrgActions
                      org={org}
                      onViewDetails={() => { setSelectedOrg(org.id); setPage('org-detail') }}
                      onOpenModal={(type) => setModal({ type, org })}
                      onSuspend={() => setConfirm({ org, action: 'suspend' })}
                      onDelete={() => setConfirm({ org, action: 'delete' })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '0 16px' }}>
          <Pagination page={page} total={filtered.length} perPage={perPage} onChange={setPage2} />
        </div>
      </div>

      {/* Modals */}
      {showAddOrg && (
        <AddOrgModal
          onClose={() => setShowAddOrg(false)}
          onSuccess={async (payload) => {
            const res = await createTenantOrganization(payload, user?.email || 'admin@workzi.com')
            if (res.success) {
              setToast(`Organization "${payload.name}" created successfully with HR Admin ${payload.adminEmail}!`)
            } else {
              setToast(`Error: ${res.error}`)
            }
            setShowAddOrg(false)
          }}
        />
      )}
      {modal?.type === 'edit' && (
        <EditOrgModal
          org={modal.org}
          onClose={() => setModal(null)}
          onSuccess={() => { setModal(null); setToast(`${modal.org.name} updated successfully`) }}
        />
      )}
      {modal?.type === 'change-plan' && (
        <ChangePlanModal
          org={modal.org}
          onClose={() => setModal(null)}
          onSuccess={async (plan) => {
            await updateOrganizationPlan(modal.org.id, modal.org.name, plan, user?.email || 'admin@workzi.com')
            setToast(`${modal.org.name} plan changed to ${plan}`)
            setModal(null)
          }}
        />
      )}
      {modal?.type === 'access-support' && (
        <AccessSupportModal
          org={modal.org}
          onClose={() => setModal(null)}
          onSuccess={() => { setModal(null); setToast(`Support session started for ${modal.org.name}`) }}
        />
      )}
      {modal?.type === 'contact-admin' && (
        <ContactAdminModal
          org={modal.org}
          onClose={() => setModal(null)}
          onSuccess={() => { setModal(null); setToast(`Message sent to ${modal.org.name} administrator`) }}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.action === 'delete' ? `Delete ${confirm.org.name}?` : `${confirm.org.status === 'suspended' ? 'Reactivate' : 'Suspend'} ${confirm.org.name}?`}
          message={confirm.action === 'delete'
            ? `This will permanently delete ${confirm.org.name} and all associated data — ${confirm.org.users.toLocaleString()} users, attendance records, payroll data, and documents. This action cannot be undone.`
            : confirm.org.status === 'suspended'
            ? `Reactivating ${confirm.org.name} will restore login access for all users and reactivate the workspace.`
            : `Suspending ${confirm.org.name} will immediately prevent all ${confirm.org.users.toLocaleString()} users from logging in. You can reactivate at any time.`}
          confirmLabel={confirm.action === 'delete' ? 'Delete organization' : confirm.org.status === 'suspended' ? 'Reactivate organization' : 'Suspend organization'}
          danger={confirm.action === 'delete' || confirm.org.status !== 'suspended'}
          onConfirm={async () => {
            if (confirm.action === 'suspend') {
              const nextStatus = confirm.org.status === 'suspended' ? 'active' : 'suspended'
              await toggleOrganizationStatus(confirm.org.id, confirm.org.name, nextStatus, user?.email || 'admin@workzi.com')
              setToast(`${confirm.org.name} ${nextStatus === 'suspended' ? 'suspended' : 'reactivated'} successfully`)
            } else {
              setToast(`${confirm.org.name} deleted`)
            }
            setConfirm(null)
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

// ─── Organization Detail ──────────────────────────────────────────────────────
function OrgDetail({ orgId, setPage }: { orgId: string; setPage: (p: Page) => void }) {
  const [liveOrgs, setLiveOrgs] = useState<Org[]>([])
  useEffect(() => {
    const unsub = subscribeOrganizations(orgs => setLiveOrgs(orgs))
    return () => unsub()
  }, [])
  const org = liveOrgs.find(o => o.id === orgId) || liveOrgs[0] || {
    id: orgId,
    name: 'Organization',
    plan: 'Professional',
    status: 'active' as const,
    users: 0,
    admins: 1,
    usage: 0,
    subscription: '₹0/mo',
    created: '',
    lastActivity: '',
    industry: 'Technology',
    region: 'India',
    mrr: 0
  }
  const [activeTab, setActiveTab] = useState('Overview')
  const [toast, setToast] = useState<string | null>(null)
  const [modal, setModal] = useState<OrgModalType | null>(null)
  const [confirm, setConfirm] = useState<string | null>(null)

  const TABS = ['Overview', 'Subscription', 'Usage', 'Services', 'Integrations', 'Security', 'Billing', 'Activity']

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: 'var(--text-muted)' }}>
        <button className="btn-ghost" style={{ color: 'var(--text-muted)', fontSize: 13 }} onClick={() => setPage('organizations')}>Organizations</button>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{org.name}</span>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{org.name[0]}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{org.name}</h1>
                <StatusBadge status={org.status} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{org.id} · {org.industry} · {org.region}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setModal('edit')}>Edit</button>
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setModal('access-support')}>
              <ExternalLink size={13} /> Access as Support
            </button>
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setModal('change-plan')}>Change Plan</button>
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setModal('contact-admin')}>
              <Mail size={13} /> Contact Admin
            </button>
            <button className="btn-danger" style={{ fontSize: 12 }} onClick={() => setConfirm('suspend')}>
              {org.status === 'suspended' ? 'Reactivate' : 'Suspend'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          {[
            { label: 'Employees', value: org.users.toLocaleString() },
            { label: 'Admins', value: org.admins },
            { label: 'Usage', value: `${org.usage}%` },
            { label: 'Plan', value: org.plan },
            { label: 'MRR', value: `₹${(org.mrr / 1000).toFixed(0)}K` },
            { label: 'Created', value: org.created },
            { label: 'Last Active', value: org.lastActivity },
          ].map((m, i) => (
            <div key={m.label} style={{ padding: '0 14px', borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Usage Trend</div>
              <LineChart data={[60, 65, 70, 68, 72, 75, 80, 78, 82, 85, 87, 87]} labels={['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep']} height={140} />
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Active Services</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {['Attendance', 'Leave', 'Payroll', 'Documents', 'Reports', 'AI Services'].map(s => (
                  <div key={s} style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Subscription</div>
              {[
                { label: 'Plan', value: org.plan },
                { label: 'Billing', value: 'Monthly' },
                { label: 'MRR', value: `₹${(org.mrr / 1000).toFixed(0)}K` },
                { label: 'Renewal', value: '1 Oct 2026' },
                { label: 'Payment', value: 'Auto-pay enabled' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <span style={{ fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
              <button className="btn-ghost" style={{ marginTop: 10, fontSize: 12 }} onClick={() => setActiveTab('Subscription')}>Manage subscription →</button>
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Recent Activity</div>
              {['User login · 2 min ago', 'Report generated · 1 hr ago', 'Attendance marked · 3 hr ago', 'Leave approved · 5 hr ago'].map(a => (
                <div key={a} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '5px 0', borderBottom: '1px solid var(--divider)' }}>{a}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Subscription' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Current Plan</div>
            <div style={{ padding: 16, border: `2px solid var(--primary)`, borderRadius: 10, background: 'var(--primary-soft)', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>{org.plan}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                ₹{(org.mrr / 1000).toFixed(0)}K<span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>/month</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Up to {org.users > 500 ? 'unlimited' : '1,000'} users · All features</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={() => setModal('change-plan')}>Change Plan</button>
              <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setToast('Billing cycle changed to Annual')}>Switch to Annual (−20%)</button>
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Billing Details</div>
            {[
              { label: 'Billing cycle', value: 'Monthly' },
              { label: 'Current seats', value: org.users.toLocaleString() },
              { label: 'Next invoice', value: `₹${(org.mrr / 1000).toFixed(0)}K on 1 Oct 2026` },
              { label: 'Payment method', value: 'HDFC Bank · ****4521' },
              { label: 'Invoice email', value: `finance@${org.name.toLowerCase().replace(/\s/g,'')}.in` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
            <button className="btn-ghost" style={{ marginTop: 10, fontSize: 12 }} onClick={() => setToast('Payment method update form opened')}>Update payment method →</button>
          </div>
        </div>
      )}

      {activeTab === 'Usage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard label="Active seats" value={org.users.toLocaleString()} sub="of 1,000 allocated" />
            <StatCard label="Storage" value="68.4 GB" sub="of 100 GB" />
            <StatCard label="API requests" value="1.28M" sub="this month" />
            <StatCard label="AI credits" value="72%" sub="remaining" />
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Resource consumption</div>
              <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setToast('Usage report export started')}><Download size={13} /> Export report</button>
            </div>
            {[['Employee seats', org.usage], ['Storage', 68], ['API quota', 54], ['AI credits', 28]].map(([label, value]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}><span>{label}</span><span style={{ fontWeight: 600 }}>{value}%</span></div>
                <ProgressBar value={Number(value)} color={Number(value) > 85 ? 'var(--warning)' : 'var(--primary)'} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Services' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Enabled services</div>
            <button className="btn-primary" style={{ fontSize: 12 }} onClick={() => setToast('Service configuration opened')}><Server size={13} /> Configure services</button>
          </div>
          {['Attendance', 'Leave Management', 'Payroll', 'Documents', 'Reports', 'AI Services'].map((service, i) => (
            <div key={service} style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', borderBottom: '1px solid var(--divider)', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Server size={15} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{service}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{i === 2 ? 'Last used 22 min ago' : 'Operational · Used today'}</div></div>
              <StatusBadge status="active" />
              <button className="btn-secondary" style={{ height: 28, fontSize: 12 }} onClick={() => setToast(`${service} settings opened`)}>Manage</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Integrations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            ['Google Workspace', 'Directory sync · 234 users', 'active'],
            ['Slack', 'Notifications · 12 channels', 'active'],
            ['Razorpay', 'Payroll payments', 'active'],
            ['Microsoft 365', 'Not configured', 'inactive'],
          ].map(([name, detail, status]) => (
            <div className="card" key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plug size={16} color="var(--primary)" /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{detail}</div></div>
              <StatusBadge status={status} />
              <button className="btn-secondary" style={{ height: 28, fontSize: 12 }} onClick={() => setToast(`${name} configuration opened`)}>{status === 'active' ? 'Configure' : 'Connect'}</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Security' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Security posture</div>
            {[['Two-factor authentication', '92% adoption'], ['Single sign-on', 'Enabled'], ['Password policy', 'Strong'], ['Session timeout', '8 hours']].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span style={{ fontWeight: 600 }}>{value}</span></div>
            ))}
            <button className="btn-primary" style={{ marginTop: 14, fontSize: 12 }} onClick={() => setToast('Security policy editor opened')}><ShieldCheck size={13} /> Edit policies</button>
          </div>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Recent alerts</div>
            {['New device login reviewed', 'Bulk export completed', 'Password policy updated'].map((event, i) => (
              <div key={event} style={{ padding: '9px 0', borderBottom: '1px solid var(--divider)' }}><div style={{ fontSize: 13 }}>{event}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{i + 1} day{i ? 's' : ''} ago · No action required</div></div>
            ))}
            <button className="btn-secondary" style={{ marginTop: 14, fontSize: 12 }} onClick={() => setToast('Security audit initiated')}>Run security audit</button>
          </div>
        </div>
      )}

      {activeTab === 'Billing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}><div style={{ fontSize: 13, fontWeight: 600 }}>Recent invoices</div><button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setToast('All invoices opened')}>View all</button></div>
            {[['INV-20387', 'Sep 2026', org.mrr, 'pending'], ['INV-20268', 'Aug 2026', org.mrr, 'paid'], ['INV-20142', 'Jul 2026', org.mrr, 'paid']].map(([id, period, amount, status]) => (
              <div key={String(id)} style={{ display: 'flex', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}><span style={{ width: 110, color: 'var(--primary)', fontFamily: 'monospace' }}>{id}</span><span style={{ flex: 1 }}>{period}</span><span style={{ width: 100, fontWeight: 600 }}>₹{Number(amount).toLocaleString('en-IN')}</span><StatusBadge status={String(status)} /><button className="icon-btn" style={{ marginLeft: 10 }} onClick={() => setToast(`Downloading ${id}`)}><Download size={13} /></button></div>
            ))}
          </div>
          <div className="card">
            <CreditCard size={18} color="var(--primary)" />
            <div style={{ fontSize: 13, fontWeight: 600, margin: '10px 0 4px' }}>HDFC Bank · •••• 4521</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>Primary payment method · Auto-pay enabled</div>
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setToast('Payment method editor opened')}>Update payment method</button>
          </div>
        </div>
      )}

      {activeTab === 'Activity' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}><div style={{ fontSize: 13, fontWeight: 600 }}>Organization activity</div><button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setToast('Activity log export started')}><Download size={13} /> Export</button></div>
          {[
            ['Administrator signed in', 'Rajesh Kumar', '2 min ago'],
            ['Monthly report generated', 'System', '1 hr ago'],
            ['Subscription settings updated', 'Priya Mishra', 'Yesterday'],
            ['Security policy reviewed', 'Super Admin', '2 days ago'],
            ['Invoice payment received', 'System', '3 days ago'],
          ].map(([event, actor, time]) => (
            <div key={event} style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1fr 1fr', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--divider)' }}><Activity size={14} color="var(--text-muted)" /><span style={{ fontSize: 13, fontWeight: 500 }}>{event}</span><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{actor}</span><span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>{time}</span></div>
          ))}
        </div>
      )}

      {/* Org-level modals */}
      {modal === 'edit' && (
        <EditOrgModal org={org} onClose={() => setModal(null)} onSuccess={() => { setModal(null); setToast(`${org.name} updated`) }} />
      )}
      {modal === 'change-plan' && (
        <ChangePlanModal org={org} onClose={() => setModal(null)} onSuccess={plan => { setModal(null); setToast(`Plan changed to ${plan}`) }} />
      )}
      {modal === 'access-support' && (
        <AccessSupportModal org={org} onClose={() => setModal(null)} onSuccess={() => { setModal(null); setToast(`Support session started for ${org.name}`) }} />
      )}
      {modal === 'contact-admin' && (
        <ContactAdminModal org={org} onClose={() => setModal(null)} onSuccess={() => { setModal(null); setToast('Message sent to administrator') }} />
      )}
      {confirm && (
        <ConfirmDialog
          title={`Suspend ${org.name}?`}
          message={`This will immediately prevent all ${org.users.toLocaleString()} users from logging in. You can reactivate the organization at any time.`}
          confirmLabel="Suspend organization"
          danger
          onConfirm={() => { setToast(`${org.name} suspended`); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

// ─── Default Export ───────────────────────────────────────────────────────────
export default function Organizations({ setPage, selectedOrg, setSelectedOrg }: { setPage: (p: Page) => void; selectedOrg: string | null; setSelectedOrg: (id: string) => void }) {
  if (selectedOrg && setPage.toString().includes('org-detail')) {
    return <OrgDetail orgId={selectedOrg} setPage={setPage} />
  }
  return <OrgList setPage={setPage} setSelectedOrg={setSelectedOrg} />
}

export { OrgDetail }
