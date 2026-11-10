import { useState, useEffect, type ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// ─── Badge ───────────────────────────────────────────────────────────────────
type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'purple' | 'neutral' | 'primary'
export function Badge({ variant = 'neutral', children }: { variant?: BadgeVariant; children: ReactNode }) {
  return <span className={`badge badge-${variant}`}>{children}</span>
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    active: 'success', operational: 'success', paid: 'success', resolved: 'success', accepted: 'success',
    trial: 'info', pending: 'warning', 'in-progress': 'info', degraded: 'warning', failed: 'error',
    suspended: 'error', 'partial outage': 'error', 'major outage': 'error', blocked: 'error', overdue: 'error',
    critical: 'error', high: 'error', medium: 'warning', low: 'neutral',
    investigating: 'warning', identified: 'info', monitoring: 'primary', inactive: 'neutral',
    open: 'info', closed: 'neutral', escalated: 'error',
    expired: 'neutral', revoked: 'error',
  }
  return <Badge variant={map[status.toLowerCase()] || 'neutral'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info' | 'warning'
interface ToastProps { type?: ToastType; title: string; message?: string; onClose: () => void }

export function Toast({ type = 'success', title, message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])
  const icons = { success: <CheckCircle size={18} color="var(--success)" />, error: <AlertCircle size={18} color="var(--error)" />, warning: <AlertTriangle size={18} color="var(--warning)" />, info: <Info size={18} color="var(--info)" /> }
  return (
    <div className="toast">
      {icons[type]}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{title}</div>
        {message && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{message}</div>}
      </div>
      <button onClick={onClose} className="icon-btn" style={{ border: 'none', width: 24, height: 24 }}><X size={14} /></button>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps { title: string; onClose: () => void; children: ReactNode; size?: 'sm' | 'md' | 'lg' }
export function Modal({ title, onClose, children, size = 'md' }: ModalProps) {
  const widths = { sm: 420, md: 560, lg: 720 }
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: widths[size] }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
          <button onClick={onClose} className="icon-btn" style={{ border: 'none' }}><X size={16} /></button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
interface ConfirmProps { title: string; message: string; confirmLabel?: string; onConfirm: () => void; onCancel: () => void; danger?: boolean }
export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger = false }: ConfirmProps) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div style={{ padding: '24px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: '1.6' }}>{message}</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Search Input ─────────────────────────────────────────────────────────────
import { Search } from 'lucide-react'
export function SearchInput({ placeholder = 'Search...', value, onChange }: { placeholder?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: 'relative', minWidth: 240 }}>
      <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
      <input
        className="input"
        style={{ paddingLeft: 38 }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: 12, textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, background: 'var(--bg)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
      {description && <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 320 }}>{description}</div>}
      {action && <div style={{ marginTop: 4 }}>{action}</div>}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ width, height = 16 }: { width?: string | number; height?: number }) {
  return <div className="skeleton" style={{ width: width || '100%', height }} />
}

// ─── Pagination ───────────────────────────────────────────────────────────────
import { ChevronLeft, ChevronRight } from 'lucide-react'
export function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Showing {start}–{end} of {total}</div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="icon-btn" onClick={() => onChange(page - 1)} disabled={page === 1} style={{ opacity: page === 1 ? 0.4 : 1 }}><ChevronLeft size={16} /></button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)} style={{ width: 32, height: 32, border: `1px solid ${p === page ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 6, background: p === page ? 'var(--primary-soft)' : 'var(--surface)', color: p === page ? 'var(--primary)' : 'var(--text-secondary)', fontSize: 13, fontWeight: p === page ? 600 : 400, cursor: 'pointer' }}>{p}</button>
        ))}
        <button className="icon-btn" onClick={() => onChange(page + 1)} disabled={page === pages} style={{ opacity: page === pages ? 0.4 : 1 }}><ChevronRight size={16} /></button>
      </div>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
      {action}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, trend, onClick, accent }: { label: string; value: string | number; sub?: string; trend?: string; onClick?: () => void; accent?: string }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', borderTop: accent ? `3px solid ${accent}` : undefined, transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,24,40,0.08)')}
      onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = '')}
    >
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 4 }}>{value}</div>
      {(sub || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {trend && <span style={{ fontSize: 12, fontWeight: 500, color: trend.startsWith('+') ? 'var(--success)' : 'var(--error)' }}>{trend}</span>}
          {sub && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</span>}
        </div>
      )}
    </div>
  )
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
export function MiniBarChart({ data, color = 'var(--primary)', height = 60 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((v, i) => (
        <div key={i} className="chart-bar" style={{ flex: 1, height: `${(v / max) * 100}%`, background: color, borderRadius: '3px 3px 0 0', minHeight: 4 }} />
      ))}
    </div>
  )
}

// ─── Line Chart ───────────────────────────────────────────────────────────────
export function LineChart({ data, labels, color = 'var(--primary)', height = 140, valueFormatter }: { data: number[]; labels: string[]; color?: string; height?: number; valueFormatter?: (value: number) => string }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 400, h = height - 32
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: h - ((v - min) / range) * h }))
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const area = `${path} L ${pts[pts.length - 1].x} ${h} L 0 ${h} Z`
  return (
    <div style={{ width: '100%', position: 'relative' }} onMouseLeave={() => setHovered(null)}>
      {hovered !== null && (
        <div style={{
          position: 'absolute',
          left: `${(hovered / Math.max(data.length - 1, 1)) * 100}%`,
          top: Math.max(0, pts[hovered].y - 8),
          transform: 'translate(-50%, -100%)',
          background: 'var(--text-primary)',
          color: 'var(--surface)',
          borderRadius: 7,
          padding: '6px 9px',
          fontSize: 11,
          fontWeight: 600,
          zIndex: 2,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ color: 'var(--neutral)' }}>{labels[hovered]} · </span>
          {valueFormatter ? valueFormatter(data[hovered]) : data[hovered].toLocaleString('en-IN')}
        </div>
      )}
      <svg viewBox={`0 0 ${w} ${h + 32}`} style={{ width: '100%', height: height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={0} y1={h - t * h} x2={w} y2={h - t * h} stroke="#EEF0F3" strokeWidth={1} />
        ))}
        <path d={area} fill={`url(#grad-${color.replace(/[^a-z]/gi, '')})`} />
        <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            {hovered === i && <line x1={p.x} y1={0} x2={p.x} y2={h} stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />}
            <circle cx={p.x} cy={p.y} r={hovered === i ? 4 : 2.5} fill="var(--surface)" stroke={color} strokeWidth={2} />
            <rect
              x={Math.max(0, p.x - w / data.length / 2)}
              y={0}
              width={w / data.length}
              height={h}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHovered(i)}
            />
          </g>
        ))}
        {labels.filter((_, i) => i % Math.ceil(labels.length / 6) === 0).map((label, i) => {
          const idx = i * Math.ceil(labels.length / 6)
          if (idx >= pts.length) return null
          return <text key={i} x={pts[idx].x} y={h + 20} textAnchor="middle" fontSize={10} fill="var(--text-muted)">{label}</text>
        })}
      </svg>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'var(--primary)' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ height: 6, background: 'var(--bg)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.3s' }} />
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const colors = ['#5C5CFF', '#8B5CF6', '#3B82F6', '#16A34A', '#F59E0B', '#DC2626']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
      {initials}
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)' }}>
      {tabs.map(t => (
        <button key={t} className={`tab ${active === t ? 'active' : ''}`} onClick={() => onChange(t)} style={{ background: 'none', border: 'none', fontFamily: 'inherit', paddingBottom: 12 }}>{t}</button>
      ))}
    </div>
  )
}

// ─── Filter Select ────────────────────────────────────────────────────────────
export function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select className="input" style={{ width: 'auto', cursor: 'pointer' }} value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{label}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

// ─── Page Header ─────────────────────────────────────────────────────────────
export function PageHeader({ title, description, actions, breadcrumb }: { title: string; description?: string; actions?: ReactNode; breadcrumb?: string[] }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {breadcrumb && breadcrumb.length > 0 && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>
          {breadcrumb.map((b, i) => (
            <span key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {i > 0 && <span>/</span>}
              <span style={{ color: i === breadcrumb.length - 1 ? 'var(--text-primary)' : 'var(--primary)', cursor: i < breadcrumb.length - 1 ? 'pointer' : 'default' }}>{b}</span>
            </span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{title}</h1>
          {description && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{description}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{actions}</div>}
      </div>
    </div>
  )
}

// ─── Alert ────────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', title, message }: { type?: 'info' | 'warning' | 'error' | 'success'; title: string; message?: string }) {
  const styles = {
    info: { bg: 'var(--info-soft)', border: 'var(--info)', icon: <Info size={16} color="var(--info)" /> },
    warning: { bg: 'var(--warning-soft)', border: 'var(--warning)', icon: <AlertTriangle size={16} color="var(--warning)" /> },
    error: { bg: 'var(--error-soft)', border: 'var(--error)', icon: <AlertCircle size={16} color="var(--error)" /> },
    success: { bg: 'var(--success-soft)', border: 'var(--success)', icon: <CheckCircle size={16} color="var(--success)" /> },
  }
  const s = styles[type]
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      {s.icon}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        {message && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{message}</div>}
      </div>
    </div>
  )
}
