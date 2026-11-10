import { useState } from 'react'
import { Bot, Cpu, TrendingUp, AlertTriangle } from 'lucide-react'
import { PageHeader, Tabs, StatCard, LineChart, Toast, ProgressBar } from '../components/ui'
import { GROWTH_DATA } from '../lib/data'

const AI_MODELS = [
  { name: 'GPT-4o', provider: 'OpenAI', version: '2024-11', cost: '₹2.4/1K tokens', status: 'active', usage: 62 },
  { name: 'Claude Sonnet 5', provider: 'Anthropic', version: '2025-10', cost: '₹1.8/1K tokens', status: 'active', usage: 28 },
  { name: 'Gemini Pro', provider: 'Google', version: '2.0', cost: '₹0.9/1K tokens', status: 'inactive', usage: 10 },
]

const AI_FEATURES = [
  { name: 'AI Assistant', description: 'Conversational HR assistant for employees', enabled: true, orgs: 640, requests: 48200, cost: 18500 },
  { name: 'AI Report Generation', description: 'Auto-generate HR reports from data', enabled: true, orgs: 412, requests: 12400, cost: 9200 },
  { name: 'AI Insights', description: 'Predictive attendance and leave analytics', enabled: true, orgs: 284, requests: 8900, cost: 5400 },
  { name: 'AI Automation', description: 'Smart workflow suggestions', enabled: false, orgs: 0, requests: 0, cost: 0 },
  { name: 'AI Support', description: 'Automated first-response support', enabled: true, orgs: 156, requests: 3200, cost: 1800 },
]

const AI_USAGE_BY_ORG = [
  { org: 'Vertex Labs', requests: 14200, cost: 10800, feature: 'AI Assistant' },
  { org: 'Zeta Fintech', requests: 9800, cost: 7400, feature: 'AI Report Generation' },
  { org: 'Acme Technologies', requests: 8400, cost: 6200, feature: 'AI Assistant' },
  { org: 'OrbitWorks', requests: 6200, cost: 4800, feature: 'AI Insights' },
  { org: 'Crest Digital', requests: 4100, cost: 3200, feature: 'AI Assistant' },
]

export default function AIManagement() {
  const [tab, setTab] = useState('Overview')
  const [toast, setToast] = useState<string | null>(null)

  const AI_DATA = [12000, 18000, 22000, 28000, 32000, 38000, 42000, 48000, 52000, 58000, 68000, 72700]

  return (
    <div>
      <PageHeader title="AI Management" description="Govern AI usage, models, costs, and feature availability across the platform." />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={['Overview', 'AI Features', 'AI Models', 'Usage by Org', 'Limits & Costs']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard label="Total AI Requests" value="72,700" trend="+18%" sub="this month" accent="var(--primary)" />
            <StatCard label="AI Cost (MTD)" value="₹35,100" trend="+14%" />
            <StatCard label="Active AI Orgs" value="640" trend="+12" />
            <StatCard label="Tokens Used" value="48.2M" trend="+16%" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>AI Requests Trend</div>
              <LineChart data={AI_DATA} labels={GROWTH_DATA.labels.monthly} height={160} color="var(--leave)" />
            </div>
            <div className="card">
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Usage by Feature</div>
              {AI_FEATURES.filter(f => f.enabled).map(f => (
                <div key={f.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{f.name}</span>
                    <span style={{ fontWeight: 600 }}>{f.requests.toLocaleString()}</span>
                  </div>
                  <ProgressBar value={f.requests} max={50000} color="var(--leave)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'AI Features' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {AI_FEATURES.map(f => (
            <div key={f.name} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <Bot size={16} color="var(--leave)" />
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{f.name}</span>
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: f.enabled ? 'var(--success-soft)' : 'var(--neutral-soft)', color: f.enabled ? 'var(--success)' : 'var(--neutral)', fontWeight: 500 }}>{f.enabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>{f.description}</div>
                  {f.enabled && (
                    <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Organizations: <strong>{f.orgs}</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>Requests/month: <strong>{f.requests.toLocaleString()}</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>Cost/month: <strong>₹{f.cost.toLocaleString()}</strong></span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, marginLeft: 20 }}>
                  <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => { setTab('Limits & Costs'); setToast(`Configuring limits for ${f.name}`) }}>Configure limits</button>
                  <button className={f.enabled ? 'btn-secondary' : 'btn-primary'} style={{ fontSize: 13 }} onClick={() => setToast(`${f.name} ${f.enabled ? 'disabled' : 'enabled'}`)}>
                    {f.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'AI Models' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {AI_MODELS.map(m => (
            <div key={m.name} className="card" style={{ borderTop: `3px solid ${m.status === 'active' ? 'var(--success)' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{m.name}</div>
                <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: m.status === 'active' ? 'var(--success-soft)' : 'var(--neutral-soft)', color: m.status === 'active' ? 'var(--success)' : 'var(--neutral)', fontWeight: 500 }}>{m.status}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{m.provider} · {m.version}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)', marginBottom: 14 }}>{m.cost}</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Usage share: {m.usage}%</div>
                <ProgressBar value={m.usage} color="var(--leave)" />
              </div>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={() => setToast(`${m.name} settings updated`)}>Configure</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'Usage by Org' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="table-header">
                {['Organization', 'Top Feature', 'Requests (MTD)', 'Cost (MTD)', 'Usage share'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AI_USAGE_BY_ORG.map(o => (
                <tr key={o.org} className="table-row">
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500 }}>{o.org}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13 }}>{o.feature}</td>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600 }}>{o.requests.toLocaleString()}</td>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600 }}>₹{o.cost.toLocaleString()}</td>
                  <td style={{ padding: '14px 20px', minWidth: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1 }}><ProgressBar value={o.requests} max={72700} color="var(--leave)" /></div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{Math.round(o.requests / 727)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Limits & Costs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[{ title: 'Per Plan Limits', rows: [['Free', 'N/A'], ['Starter', '1,000 req/month'], ['Professional', '10,000 req/month'], ['Business', '50,000 req/month'], ['Enterprise', 'Custom']] }, { title: 'Per Organization Limits', rows: [['Default limit', '10,000 req/month'], ['Enterprise override', 'Configurable'], ['Burst limit', '2x for 24h'], ['Hard cap', 'Yes']] }].map(c => (
            <div key={c.title} className="card">
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>{c.title}</div>
              {c.rows.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--divider)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <button className="btn-secondary" style={{ marginTop: 14, fontSize: 13 }} onClick={() => setToast('Limits saved')}>Edit limits</button>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
