import { useState } from 'react'
import { Download, ArrowUpRight, Users, Building2, MousePointerClick } from 'lucide-react'
import { PageHeader, Tabs, StatCard, LineChart, MiniBarChart, FilterSelect, Toast, ProgressBar, StatusBadge } from '../components/ui'
import { REVENUE_DATA, GROWTH_DATA, ORGS } from '../lib/data'

const featureData = [
  { name: 'Attendance', adoption: 94, users: '45.5K', change: '+2.4%' },
  { name: 'Leave Management', adoption: 91, users: '44.1K', change: '+1.8%' },
  { name: 'Reports', adoption: 84, users: '40.7K', change: '+4.2%' },
  { name: 'Documents', adoption: 78, users: '37.8K', change: '+3.1%' },
  { name: 'AI Assistant', adoption: 51, users: '24.7K', change: '+12.6%' },
]

export default function Analytics() {
  const [tab, setTab] = useState('Platform')
  const [period, setPeriod] = useState('Monthly')
  const [toast, setToast] = useState<string | null>(null)

  const sectionTitle = `${tab} analytics for ${period.toLowerCase()} period`

  return (
    <div>
      <PageHeader title="Analytics" description="Platform-wide growth, revenue, retention, and feature adoption analytics." actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <FilterSelect label="Period" value={period} options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} onChange={setPeriod} />
          <button className="btn-secondary" onClick={() => setToast(`${tab} analytics export started`)}><Download size={15} /> Export</button>
        </div>
      } />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={['Platform', 'Organizations', 'Revenue', 'Feature Adoption', 'Retention', 'Users']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Platform' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard label="Total Organizations" value="1,248" trend="+12.4%" />
            <StatCard label="Total Users" value="48,420" trend="+8.2%" />
            <StatCard label="Platform MRR" value="₹84.2L" trend="+6.2%" />
            <StatCard label="Net Promoter Score" value="72" trend="+4" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Platform Growth — Organizations</div>
              <LineChart data={GROWTH_DATA.monthly} labels={GROWTH_DATA.labels.monthly} height={160} />
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Growth Breakdown</div>
              {[
                ['New organizations', '+34', '+12%', 'var(--success)'],
                ['Churned', '-2', '-8%', 'var(--error)'],
                ['Reactivated', '+3', '+50%', 'var(--info)'],
                ['Upgraded plan', '+11', '+22%', 'var(--primary)'],
                ['Downgraded', '-3', '-25%', 'var(--warning)'],
              ].map(([label, value, trend, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span><strong style={{ color }}>{value}</strong> <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{trend}</span></span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>User Growth</div>
              <MiniBarChart data={[38000, 40000, 41200, 42100, 43500, 44800, 46000, 46800, 47200, 47800, 48100, 48420]} height={80} />
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Engagement by Feature</div>
              {featureData.slice(0, 5).map(f => <MetricBar key={f.name} label={f.name} value={f.adoption} />)}
            </div>
          </div>
        </div>
      )}

      {tab === 'Organizations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard label="Total Organizations" value="1,248" trend="+34" sub="this month" />
            <StatCard label="Active Rate" value="94.7%" trend="+1.2%" />
            <StatCard label="Trial Conversion" value="68.4%" trend="+4.8%" />
            <StatCard label="Avg. Org Size" value="38.8" sub="users" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Organization growth</div>
              <LineChart data={GROWTH_DATA.monthly} labels={GROWTH_DATA.labels.monthly} height={180} />
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Plan distribution</div>
              {[['Business', 47], ['Professional', 27], ['Enterprise', 19], ['Starter', 7]].map(([label, value]) => <MetricBar key={label} label={String(label)} value={Number(value)} />)}
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Fastest growing organizations</div>
            {ORGS.slice(0, 5).map((org, i) => (
              <div key={org.id} style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1fr 1fr 1fr', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--divider)', fontSize: 13 }}>
                <Building2 size={15} color="var(--primary)" /><strong>{org.name}</strong><span>{org.plan}</span><span>{org.users.toLocaleString()} users</span><span style={{ color: 'var(--success)', fontWeight: 600 }}>+{18 - i * 2}.4%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Revenue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard label="MRR" value="₹84.2L" trend="+6.2%" accent="var(--primary)" />
            <StatCard label="ARR" value="₹10.1Cr" trend="+6.2%" accent="var(--success)" />
            <StatCard label="ARPU" value="₹6,746" trend="+1.2%" />
            <StatCard label="LTV" value="₹2.4L" trend="+8.4%" />
          </div>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Monthly Revenue (₹)</div>
            <LineChart data={REVENUE_DATA} labels={GROWTH_DATA.labels.monthly} height={180} color="var(--success)" valueFormatter={value => `₹${(value / 100000).toFixed(1)}L`} />
          </div>
        </div>
      )}

      {tab === 'Feature Adoption' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard label="Top Feature" value="Attendance" sub="94% adoption" />
            <StatCard label="Fastest Growing" value="AI Assistant" trend="+12.6%" />
            <StatCard label="Avg. Features / Org" value="6.8" trend="+0.7" />
            <StatCard label="Weekly Active Usage" value="87.2%" trend="+2.1%" />
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Feature performance</div>
            {featureData.map(f => (
              <div key={f.name} style={{ display: 'grid', gridTemplateColumns: '32px 1.4fr 2fr 1fr 1fr', gap: 14, alignItems: 'center', padding: '13px 20px', borderBottom: '1px solid var(--divider)' }}>
                <MousePointerClick size={15} color="var(--primary)" /><strong style={{ fontSize: 13 }}>{f.name}</strong><ProgressBar value={f.adoption} /><span style={{ fontSize: 12 }}>{f.users} users</span><span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>{f.change}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Retention' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard label="Gross Retention" value="98.6%" trend="+0.3%" />
            <StatCard label="Net Retention" value="108.4%" trend="+2.1%" />
            <StatCard label="Logo Churn" value="1.4%" trend="-0.3%" />
            <StatCard label="Avg. Lifetime" value="31 mo" trend="+2 mo" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Retention cohorts</div>
              {['Sep 2026', 'Aug 2026', 'Jul 2026', 'Jun 2026', 'May 2026'].map((cohort, row) => (
                <div key={cohort} style={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cohort}</span>
                  {Array.from({ length: 6 - row }, (_, i) => <div key={i} style={{ background: i === 0 ? 'var(--primary)' : 'var(--primary-soft)', color: i === 0 ? 'var(--surface)' : 'var(--primary)', borderRadius: 5, padding: 7, textAlign: 'center', fontSize: 11, fontWeight: 600 }}>{Math.max(91, 100 - i * 2 - row)}%</div>)}
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Churn reasons</div>
              {[['Budget constraints', 34], ['Low adoption', 26], ['Business closed', 18], ['Moved to competitor', 14], ['Other', 8]].map(([label, value]) => <MetricBar key={label} label={String(label)} value={Number(value)} />)}
            </div>
          </div>
        </div>
      )}

      {tab === 'Users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard label="Total Users" value="48,420" trend="+8.2%" />
            <StatCard label="Monthly Active" value="41,230" sub="85.1% of total" />
            <StatCard label="New Users" value="842" sub="this week" />
            <StatCard label="Avg. Session" value="18m 24s" trend="+1m 12s" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Active user growth</div>
              <LineChart data={[31200, 32800, 34100, 35500, 36900, 37800, 38600, 39400, 40200, 40700, 41000, 41230]} labels={GROWTH_DATA.labels.monthly} height={180} />
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>User status</div>
              {[['Active', 85], ['Invited', 8], ['Inactive', 5], ['Suspended', 2]].map(([label, value]) => <MetricBar key={label} label={String(label)} value={Number(value)} />)}
            </div>
          </div>
          <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Users size={20} color="var(--primary)" /><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{sectionTitle}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>User activity is up 8.2% compared with the previous period.</div></div>
            <button className="btn-secondary" onClick={() => setToast('Detailed user report opened')}>View detailed report <ArrowUpRight size={13} /></button>
          </div>
        </div>
      )}

      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span style={{ fontWeight: 600 }}>{value}%</span></div>
      <ProgressBar value={value} />
    </div>
  )
}
