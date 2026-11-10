import { useState } from 'react'
import { Plus, Download, CreditCard, TrendingUp, AlertTriangle, CheckCircle, FileText, RefreshCw, X } from 'lucide-react'
import { PageHeader, Tabs, StatusBadge, StatCard, ProgressBar, Toast, ConfirmDialog, LineChart, Modal } from '../components/ui'
import { INVOICES, PLANS, REVENUE_DATA, GROWTH_DATA } from '../lib/data'
import type { Invoice } from '../lib/types'

// ─── Plan Form Modal (Create & Edit) ─────────────────────────────────────────
type PlanRecord = typeof PLANS[0]

function PlanFormModal({ plan, onClose, onSuccess }: { plan?: PlanRecord; onClose: () => void; onSuccess: (name: string) => void }) {
  const isEdit = !!plan
  const [form, setForm] = useState({
    name: plan?.name || '',
    monthlyPrice: plan?.price ? String(plan.price) : '',
    annualDiscount: '20',
    userLimit: plan?.users === -1 ? '' : plan?.users ? String(plan.users) : '',
    unlimitedUsers: plan?.users === -1,
    trialDays: '14',
    color: plan?.color || '#5C5CFF',
    description: '',
    features: {
      Attendance: true,
      'Leave Management': true,
      'Employee Management': true,
      Payroll: (plan?.name ?? '') !== 'Free' && (plan?.name ?? '') !== 'Starter',
      Documents: (plan?.name ?? '') !== 'Free',
      Reports: (plan?.name ?? '') !== 'Free',
      'AI Assistant': (plan?.name ?? '') === 'Business' || (plan?.name ?? '') === 'Enterprise',
      'API Access': (plan?.name ?? '') === 'Enterprise',
      'Custom Integrations': (plan?.name ?? '') === 'Enterprise',
      'Dedicated Support': (plan?.name ?? '') === 'Enterprise',
    } as Record<string, boolean>,
    apiCallsLimit: plan?.name === 'Enterprise' ? '' : plan?.name === 'Business' ? '50000' : '10000',
    storageLimitGB: plan?.name === 'Enterprise' ? '' : '50',
  })
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const COLORS = ['#9CA3AF', '#3B82F6', '#8B5CF6', '#5C5CFF', '#101828', '#16A34A', '#F59E0B', '#DC2626']
  const annualPrice = form.monthlyPrice ? Math.round(parseInt(form.monthlyPrice) * (1 - parseInt(form.annualDiscount) / 100)) : 0

  return (
    <Modal title={isEdit ? `Edit ${plan.name} Plan` : 'Create New Plan'} size="lg" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Basic Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Plan Name <span style={{ color: 'var(--error)' }}>*</span></label>
            <input className="input" placeholder="e.g. Growth" value={form.name} onChange={e => set('name', e.target.value)} autoFocus={!isEdit} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Plan Color</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 4 }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => set('color', c)} style={{ width: 22, height: 22, borderRadius: '50%', background: c, cursor: 'pointer', border: form.color === c ? '2px solid var(--text-primary)' : '2px solid transparent', boxSizing: 'border-box', outline: form.color === c ? `2px solid white` : 'none', outlineOffset: -3 }} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Description</label>
          <input className="input" placeholder="Brief description of what this plan includes…" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        {/* Pricing */}
        <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Pricing</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Monthly Price (₹)</label>
              <input className="input" placeholder="e.g. 3499" type="number" value={form.monthlyPrice} onChange={e => set('monthlyPrice', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Annual Discount (%)</label>
              <input className="input" type="number" value={form.annualDiscount} onChange={e => set('annualDiscount', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Annual (₹/mo equiv.)</label>
              <div className="input" style={{ background: 'var(--surface)', color: annualPrice ? 'var(--text-primary)' : 'var(--text-placeholder)', display: 'flex', alignItems: 'center' }}>
                {form.monthlyPrice ? `₹${annualPrice.toLocaleString()}` : '—'}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Trial Period (days)</label>
              <input className="input" type="number" value={form.trialDays} onChange={e => set('trialDays', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Limits */}
        <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Limits</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>User Limit</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="input" placeholder="e.g. 250" type="number" value={form.userLimit} onChange={e => set('userLimit', e.target.value)} disabled={form.unlimitedUsers} style={{ opacity: form.unlimitedUsers ? 0.4 : 1 }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.unlimitedUsers} onChange={e => set('unlimitedUsers', e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                Unlimited users
              </label>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>API Calls / Month</label>
              <input className="input" placeholder="e.g. 50000 or leave blank for unlimited" value={form.apiCallsLimit} onChange={e => set('apiCallsLimit', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Storage (GB)</label>
              <input className="input" placeholder="e.g. 50 or leave blank for unlimited" value={form.storageLimitGB} onChange={e => set('storageLimitGB', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Included Features</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {Object.entries(form.features).map(([feature, enabled]) => (
              <label key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: `1px solid ${enabled ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: enabled ? 'var(--primary-soft)' : 'var(--surface)', transition: 'all 0.1s' }}>
                <input type="checkbox" checked={enabled} onChange={e => setForm(f => ({ ...f, features: { ...f.features, [feature]: e.target.checked } }))} style={{ accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: 13, color: enabled ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: enabled ? 500 : 400 }}>{feature}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSuccess(form.name)} disabled={!form.name.trim()} style={{ opacity: !form.name.trim() ? 0.5 : 1 }}>
            {isEdit ? 'Save Changes' : 'Create Plan'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Manage Subscription Modal ────────────────────────────────────────────────
interface SubRow {
  org: string; plan: string; seats: number; billing: string; mrr: number; renewal: string; status: string
}

function ManageSubscriptionModal({ sub, onClose, onSuccess }: { sub: SubRow; onClose: () => void; onSuccess: (msg: string) => void }) {
  const [view, setView] = useState<'main' | 'change-plan' | 'seats'>('main')
  const [selectedPlan, setSelectedPlan] = useState(sub.plan)
  const [seats, setSeats] = useState(String(sub.seats))
  const [billing, setBilling] = useState(sub.billing)

  const planData = PLANS.find(p => p.name === sub.plan)
  const newPlanData = PLANS.find(p => p.name === selectedPlan)
  const seatDiff = parseInt(seats) - sub.seats
  const pricePerSeat = (planData?.price || 0) / Math.max(sub.seats, 1)

  return (
    <Modal title={`Manage Subscription — ${sub.org}`} size="lg" onClose={onClose}>
      {view === 'main' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'Plan', value: sub.plan, color: planData?.color },
              { label: 'Seats', value: sub.seats.toLocaleString() },
              { label: 'MRR', value: `₹${(sub.mrr / 1000).toFixed(0)}K` },
              { label: 'Renewal', value: sub.renewal },
            ].map(m => (
              <div key={m.label} style={{ padding: '12px 14px', background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: m.color || 'var(--text-primary)' }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Subscription Actions</div>
            {[
              { label: 'Change Plan', desc: `Currently on ${sub.plan}`, action: () => setView('change-plan') },
              { label: 'Add / Remove Seats', desc: `${sub.seats.toLocaleString()} seats active`, action: () => setView('seats') },
              {
                label: billing === 'Monthly' ? 'Switch to Annual Billing (Save 20%)' : 'Switch to Monthly Billing',
                desc: billing === 'Monthly' ? `Save ₹${Math.round(sub.mrr * 0.2 * 12 / 1000).toFixed(0)}K per year` : 'More flexible payment schedule',
                action: () => { setBilling(b => b === 'Monthly' ? 'Annual' : 'Monthly'); onSuccess(billing === 'Monthly' ? 'Switched to Annual billing' : 'Switched to Monthly billing') }
              },
              { label: 'Update Payment Method', desc: 'HDFC Bank · ****4521', action: () => onSuccess('Payment method update initiated') },
              { label: 'Download All Invoices', desc: 'Export billing history as PDF', action: () => onSuccess('Invoice export started') },
            ].map(item => (
              <button key={item.label} onClick={item.action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background 0.1s', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>›</span>
              </button>
            ))}
          </div>

          {/* Danger zone */}
          <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Danger Zone</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ fontSize: 12, color: 'var(--warning)' }} onClick={() => onSuccess(`${sub.org} subscription paused`)}>Pause Subscription</button>
              <button className="btn-danger" style={{ fontSize: 12 }} onClick={() => onSuccess(`${sub.org} cancellation initiated`)}>Cancel Subscription</button>
            </div>
          </div>
        </div>
      )}

      {view === 'change-plan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn-ghost" style={{ fontSize: 12, color: 'var(--text-muted)' }} onClick={() => setView('main')}>← Back</button>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Change Plan</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {PLANS.map(plan => {
              const isCurrent = plan.name === sub.plan
              const selected = plan.name === selectedPlan
              return (
                <div key={plan.name} onClick={() => setSelectedPlan(plan.name)} style={{ border: `2px solid ${selected ? plan.color : 'var(--border)'}`, borderRadius: 10, padding: 12, cursor: 'pointer', background: selected ? '#FAFAFE' : 'var(--surface)', transition: 'all 0.1s', position: 'relative' }}>
                  {isCurrent && <div style={{ position: 'absolute', top: -7, left: 8, fontSize: 9, fontWeight: 700, background: 'var(--neutral-soft)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: 4 }}>NOW</div>}
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 5, color: selected ? plan.color : 'var(--text-primary)' }}>{plan.name}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: plan.color }}>
                    {plan.price === 0 && plan.name === 'Free' ? '₹0' : plan.price === 0 ? 'Custom' : `₹${plan.price.toLocaleString()}`}
                    {plan.price > 0 && <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{plan.users === -1 ? 'Unlimited' : `≤${plan.users}`} users</div>
                </div>
              )
            })}
          </div>

          {selectedPlan !== sub.plan && newPlanData && (
            <div style={{ padding: '12px 14px', background: 'var(--info-soft)', borderRadius: 8, fontSize: 13 }}>
              <div style={{ fontWeight: 600, color: '#2563EB', marginBottom: 4 }}>Change Summary</div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {sub.plan} → <strong>{selectedPlan}</strong>.{' '}
                {(newPlanData.price || 0) > (planData?.price || 0)
                  ? 'Prorated upgrade charged immediately.'
                  : 'Credit applied to next invoice.'}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={() => setView('main')}>Cancel</button>
            <button className="btn-primary" onClick={() => onSuccess(`${sub.org} plan changed to ${selectedPlan}`)} disabled={selectedPlan === sub.plan} style={{ opacity: selectedPlan === sub.plan ? 0.5 : 1 }}>
              Change to {selectedPlan}
            </button>
          </div>
        </div>
      )}

      {view === 'seats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn-ghost" style={{ fontSize: 12, color: 'var(--text-muted)' }} onClick={() => setView('main')}>← Back</button>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Adjust Seats</span>
          </div>
          <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Current seats</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{sub.seats.toLocaleString()}</span>
            </div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>New seat count</label>
            <input className="input" type="number" min={1} value={seats} onChange={e => setSeats(e.target.value)} style={{ fontSize: 14, fontWeight: 600 }} />
            {seatDiff !== 0 && (
              <div style={{ marginTop: 12, padding: '10px 12px', background: seatDiff > 0 ? 'var(--success-soft)' : 'var(--warning-soft)', borderRadius: 8, fontSize: 13 }}>
                <div style={{ fontWeight: 600, color: seatDiff > 0 ? '#15803D' : '#B45309', marginBottom: 2 }}>
                  {seatDiff > 0 ? `+${seatDiff} seats added` : `${seatDiff} seats removed`}
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {seatDiff > 0
                    ? `Monthly cost increase: ₹${Math.round(seatDiff * pricePerSeat).toLocaleString()}`
                    : `Monthly cost reduction: ₹${Math.round(Math.abs(seatDiff) * pricePerSeat).toLocaleString()}`}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={() => setView('main')}>Cancel</button>
            <button className="btn-primary" onClick={() => onSuccess(`${sub.org} seats updated to ${seats}`)} disabled={parseInt(seats) === sub.seats} style={{ opacity: parseInt(seats) === sub.seats ? 0.5 : 1 }}>
              Update to {parseInt(seats) || 0} seats
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

// ─── View Invoice Modal ───────────────────────────────────────────────────────
function ViewInvoiceModal({ inv, onClose, onAction }: { inv: Invoice; onClose: () => void; onAction: (msg: string) => void }) {
  const subtotal = Math.round(inv.amount / 1.18)
  const gst = inv.amount - subtotal
  const statusColors: Record<string, string> = { paid: 'var(--success)', pending: 'var(--warning)', failed: 'var(--error)', overdue: 'var(--error)' }

  return (
    <Modal title="Invoice" size="lg" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{inv.id}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Issued: {inv.issued}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: statusColors[inv.status] + '18', borderRadius: 999, marginBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[inv.status] }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: statusColors[inv.status], textTransform: 'capitalize' }}>{inv.status}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Due: {inv.due}</div>
          </div>
        </div>

        {/* From / To */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 16, background: 'var(--bg)', borderRadius: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>From</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Attendance HRMS Pvt. Ltd.</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              billing@attendancehrms.in<br />
              14th Floor, One BKC, Bandra Kurla Complex<br />
              Mumbai, Maharashtra — 400 051<br />
              GST: 27AAACL1234F1Z5
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Billed To</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{inv.org}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              finance@{inv.org.toLowerCase().replace(/\s+/g, '')}.in<br />
              India<br />
              Period: {inv.period}
            </div>
          </div>
        </div>

        {/* Line items */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                {['Description', 'Period', 'Qty', 'Unit Price', 'Amount'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Qty' || h === 'Unit Price' || h === 'Amount' ? 'right' : 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 14px', fontSize: 13 }}>
                  <div style={{ fontWeight: 500 }}>Business Plan — Active Subscription</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Access to all features including Attendance, Leave, Payroll, Reports</div>
                </td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{inv.period}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, textAlign: 'right' }}>1</td>
                <td style={{ padding: '12px 14px', fontSize: 13, textAlign: 'right' }}>₹{subtotal.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, textAlign: 'right' }}>₹{subtotal.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ minWidth: 240 }}>
                {[
                  { label: 'Subtotal', value: `₹${subtotal.toLocaleString('en-IN')}` },
                  { label: 'GST (18%)', value: `₹${gst.toLocaleString('en-IN')}` },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    <span>{r.label}</span><span>{r.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', paddingTop: 8, borderTop: '1px solid var(--border)', marginTop: 4 }}>
                  <span>Total</span>
                  <span>₹{inv.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment history */}
        {inv.status === 'paid' && (
          <div style={{ padding: '10px 14px', background: 'var(--success-soft)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
            <CheckCircle size={16} color="var(--success)" />
            <div style={{ fontSize: 13, color: '#15803D' }}>
              <strong>Paid on {inv.due}</strong> · HDFC Bank · ****4521 · UPI Reference: UTR{Math.random().toString().slice(2, 14)}
            </div>
          </div>
        )}

        {inv.status === 'failed' && (
          <div style={{ padding: '10px 14px', background: 'var(--error-soft)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
            <X size={16} color="var(--error)" />
            <div style={{ fontSize: 13, color: '#B91C1C' }}>
              <strong>Payment failed on {inv.due}</strong> · Insufficient funds · HDFC Bank · ****4521
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => onAction('Invoice download started')}>
              <Download size={13} /> Download PDF
            </button>
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => onAction('Invoice sent to billing email')}>
              <FileText size={13} /> Send to Email
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {inv.status === 'failed' && (
              <button className="btn-primary" style={{ fontSize: 12 }} onClick={() => { onAction('Payment retry initiated for ' + inv.id); onClose() }}>
                <RefreshCw size={13} /> Retry Payment
              </button>
            )}
            {inv.status === 'paid' && (
              <button className="btn-secondary" style={{ fontSize: 12, color: 'var(--warning)' }} onClick={() => { onAction('Refund initiated for ' + inv.id); onClose() }}>
                Process Refund
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ─── Main Billing Page ────────────────────────────────────────────────────────
const SUBSCRIPTIONS: SubRow[] = [
  { org: 'Vertex Labs', plan: 'Enterprise', seats: 1240, billing: 'Monthly', mrr: 124000, renewal: '1 Oct 2026', status: 'active' },
  { org: 'Zeta Fintech', plan: 'Enterprise', seats: 890, billing: 'Annual', mrr: 89000, renewal: '1 Jan 2027', status: 'active' },
  { org: 'OrbitWorks', plan: 'Business', seats: 567, billing: 'Monthly', mrr: 56700, renewal: '1 Oct 2026', status: 'active' },
  { org: 'Acme Technologies', plan: 'Business', seats: 482, billing: 'Monthly', mrr: 48200, renewal: '1 Oct 2026', status: 'active' },
  { org: 'SkyBridge Logistics', plan: 'Business', seats: 423, billing: 'Monthly', mrr: 42300, renewal: '1 Oct 2026', status: 'active' },
  { org: 'Apex Solutions', plan: 'Professional', seats: 128, billing: 'Monthly', mrr: 12800, renewal: '1 Sep 2026', status: 'due' },
  { org: 'Crest Digital', plan: 'Business', seats: 310, billing: 'Annual', mrr: 31000, renewal: '17 Feb 2027', status: 'completed' },
]

export default function Billing() {
  const [tab, setTab] = useState('Overview')
  const [toast, setToast] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ id: string; action: string; name?: string } | null>(null)
  const [planModal, setPlanModal] = useState<{ mode: 'create' | 'edit'; plan?: PlanRecord } | null>(null)
  const [manageSub, setManageSub] = useState<SubRow | null>(null)
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null)
  const [subscriptionFilter, setSubscriptionFilter] = useState('all')

  return (
    <div>
      <PageHeader
        title="Billing & Licensing"
        description="Manage platform plans, subscriptions, invoices, and revenue."
        actions={tab === 'Plans' ? (
          <button className="btn-primary" onClick={() => setPlanModal({ mode: 'create' })}>
            <Plus size={15} /> Create Plan
          </button>
        ) : undefined}
      />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={['Overview', 'Plans', 'Subscriptions', 'Invoices', 'Usage', 'Credits']} active={tab} onChange={setTab} />
      </div>

      {/* ── Overview ── */}
      {tab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard label="Monthly Recurring Revenue" value="₹84.2L" trend="+6.2%" sub="vs last month" accent="var(--primary)" />
            <StatCard label="Annual Recurring Revenue" value="₹10.1Cr" trend="+6.2%" accent="var(--success)" />
            <StatCard label="Active Subscriptions" value="1,248" trend="+24" sub="this month" />
            <StatCard label="Churn Rate" value="1.4%" trend="-0.3%" sub="improved" accent="var(--warning)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Revenue Trend (12 months)</div>
              <LineChart data={REVENUE_DATA} labels={GROWTH_DATA.labels.monthly} height={160} />
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Revenue by Plan</div>
              {PLANS.map(p => (
                <div key={p.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                    <span style={{ fontWeight: 600, color: p.color }}>{p.orgs} orgs</span>
                  </div>
                  <ProgressBar value={p.orgs} max={600} color={p.color} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>New subscriptions this month</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={18} color="var(--success)" />
                <span style={{ fontSize: 18, fontWeight: 700 }}>+24</span>
                <span style={{ fontSize: 12, color: 'var(--success)' }}>↑ 8% vs last month</span>
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Plan upgrades</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={18} color="var(--success)" />
                <span style={{ fontSize: 18, fontWeight: 700 }}>+11</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>this month</span>
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Failed payments</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} color="var(--error)" />
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--error)' }}>2</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>₹3.12L outstanding</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Plans ── */}
      {tab === 'Plans' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {PLANS.map(plan => (
            <div key={plan.name} className="card" style={{ borderTop: `4px solid ${plan.color}`, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {plan.name === 'Business' && (
                <div style={{ position: 'absolute', top: -9, right: 14, background: 'var(--primary)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>POPULAR</div>
              )}
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 2, color: plan.color }}>
                {plan.price === 0 && plan.name === 'Free' ? '₹0' : plan.price === 0 ? 'Custom' : `₹${plan.price.toLocaleString()}`}
                {plan.price > 0 && <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                {plan.users === -1 ? 'Unlimited users' : `Up to ${plan.users} users`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{plan.orgs}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>organizations</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexDirection: 'column', marginTop: 'auto' }}>
                <button
                  className="btn-secondary"
                  style={{ justifyContent: 'center', fontSize: 12, height: 32 }}
                  onClick={() => setPlanModal({ mode: 'edit', plan })}
                >
                  Edit plan
                </button>
                {plan.name !== 'Free' && (
                  <button
                    className="btn-ghost"
                    style={{ fontSize: 12, justifyContent: 'center', color: 'var(--text-muted)' }}
                    onClick={() => setConfirm({ id: plan.name, action: 'archive', name: plan.name })}
                  >
                    Archive
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Subscriptions ── */}
      {tab === 'Subscriptions' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Company licensing</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['all', 'active', 'completed', 'due'].map(filter => (
                  <button key={filter} onClick={() => setSubscriptionFilter(filter)} style={{ padding: '4px 11px', borderRadius: 999, border: '1px solid var(--border)', background: subscriptionFilter === filter ? 'var(--primary)' : 'var(--surface)', color: subscriptionFilter === filter ? 'var(--surface)' : 'var(--text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{filter}</button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{SUBSCRIPTIONS.filter(s => subscriptionFilter === 'all' || s.status === subscriptionFilter).length} companies</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="table-header">
                {['Organization', 'Plan', 'Seats', 'Billing', 'MRR', 'Renewal', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 20px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUBSCRIPTIONS.filter(s => subscriptionFilter === 'all' || s.status === subscriptionFilter).map(s => (
                <tr key={s.org} className="table-row">
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>{s.org[0]}</div>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{s.org}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: PLANS.find(p => p.name === s.plan)?.color }}>{s.plan}</span>
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: 13 }}>{s.seats.toLocaleString()}</td>
                  <td style={{ padding: '12px 20px', fontSize: 13 }}>{s.billing}</td>
                  <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 600 }}>₹{(s.mrr / 1000).toFixed(0)}K</td>
                  <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{s.renewal}</td>
                  <td style={{ padding: '12px 20px' }}><StatusBadge status={s.status} /></td>
                  <td style={{ padding: '12px 20px' }}>
                    <button className="btn-secondary" style={{ height: 28, fontSize: 12, padding: '0 12px' }} onClick={() => setManageSub(s)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Invoices ── */}
      {tab === 'Invoices' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            {[
              { l: 'Paid', v: '₹3.82L', c: 'var(--success)' },
              { l: 'Pending', v: '₹48.2K', c: 'var(--warning)' },
              { l: 'Failed', v: '₹89K', c: 'var(--error)' },
              { l: 'Overdue', v: '₹12.8K', c: 'var(--error)' },
            ].map(s => (
              <div key={s.l} className="card" style={{ flex: 1, borderLeft: `4px solid ${s.c}` }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="table-header">
                  {['Invoice', 'Organization', 'Amount', 'Period', 'Due Date', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 20px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICES.map(inv => (
                  <tr key={inv.id} className="table-row">
                    <td style={{ padding: '12px 20px', fontSize: 13, fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 500, cursor: 'pointer' }} onClick={() => setViewInvoice(inv)}>{inv.id}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13 }}>{inv.org}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 600 }}>₹{inv.amount.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{inv.period}</td>
                    <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{inv.due}</td>
                    <td style={{ padding: '12px 20px' }}><StatusBadge status={inv.status} /></td>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button className="btn-secondary" style={{ height: 28, fontSize: 12, padding: '0 10px' }} onClick={() => setViewInvoice(inv)}>View</button>
                        <button className="icon-btn" style={{ width: 28, height: 28 }} title="Download" onClick={() => setToast(`Downloading ${inv.id}`)}><Download size={13} /></button>
                        {inv.status === 'failed' && (
                          <button className="btn-secondary" style={{ height: 28, fontSize: 12, padding: '0 10px', color: 'var(--warning)' }} onClick={() => setToast('Payment retry initiated')}>
                            <RefreshCw size={11} /> Retry
                          </button>
                        )}
                        {inv.status === 'paid' && (
                          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setConfirm({ id: inv.id, action: 'refund' })}>Refund</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {['Usage', 'Credits'].includes(tab) && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <CreditCard size={28} color="var(--text-muted)" style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{tab}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage {tab.toLowerCase()} and consumption data</div>
        </div>
      )}

      {/* ── Modals ── */}
      {planModal && (
        <PlanFormModal
          plan={planModal.plan}
          onClose={() => setPlanModal(null)}
          onSuccess={name => {
            setPlanModal(null)
            setToast(planModal.mode === 'create' ? `Plan "${name}" created successfully` : `${name} plan updated`)
          }}
        />
      )}

      {manageSub && (
        <ManageSubscriptionModal
          sub={manageSub}
          onClose={() => setManageSub(null)}
          onSuccess={msg => { setManageSub(null); setToast(msg) }}
        />
      )}

      {viewInvoice && (
        <ViewInvoiceModal
          inv={viewInvoice}
          onClose={() => setViewInvoice(null)}
          onAction={msg => { setViewInvoice(null); setToast(msg) }}
        />
      )}

      {confirm?.action === 'archive' && (
        <ConfirmDialog
          title={`Archive ${confirm.name} Plan?`}
          message={`Archiving the ${confirm.name} plan will prevent new organizations from subscribing to it. Existing ${PLANS.find(p => p.name === confirm.name)?.orgs || 0} organizations will remain on this plan until they manually change.`}
          confirmLabel="Archive plan"
          danger
          onConfirm={() => { setToast(`${confirm.name} plan archived`); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {confirm?.action === 'refund' && (
        <ConfirmDialog
          title={`Refund ${confirm.id}?`}
          message="This will initiate a refund to the organization's original payment method. The process may take 5–10 business days."
          confirmLabel="Process refund"
          danger
          onConfirm={() => { setToast('Refund initiated for ' + confirm.id); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
