import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck, ArrowLeft, RefreshCw, Mail, Lock, CheckCircle } from 'lucide-react'
import type { AuthStep } from '../lib/types'
import { Alert } from '../components/ui'

interface AuthProps {
  step: AuthStep
  setStep: (s: AuthStep) => void
  onAuth: () => void
}

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Attendance HRMS</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>Super Admin Portal</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 32 }}>
          {children}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
          Secured by enterprise-grade encryption · <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Privacy Policy</span>
        </div>
      </div>
    </div>
  )
}

function LoginStep({ setStep, onAuth }: { setStep: (s: AuthStep) => void; onAuth: () => void }) {
  const [email, setEmail] = useState('dhruv@attendancehrms.in')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (!email) { setError('Please enter your email address.'); return }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return }
    if (!password) { setError('Please enter your password.'); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (password === 'wrong') { setError('Incorrect password. Please try again.'); return }
      setStep('2fa')
    }, 800)
  }

  return (
    <>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Sign in to Super Admin</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Enter your credentials to access the platform control center.</div>

      {error && <div style={{ marginBottom: 16 }}><Alert type="error" title={error} /></div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#344054', marginBottom: 6 }}>Email address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" style={{ paddingLeft: 38 }} placeholder="you@company.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#344054', marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" style={{ paddingLeft: 38, paddingRight: 44 }} placeholder="Enter your password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: 'var(--primary)', width: 15, height: 15 }} />
            Remember me
          </label>
          <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => setStep('forgot')}>Forgot password?</button>
        </div>

        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15, marginTop: 4 }} onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => setStep('setup')}>First time? Set up Super Admin account</button>
        </div>
      </div>

      <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Demo credentials</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Email: dhruv@attendancehrms.in</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Password: any value (enter "wrong" to see error)</div>
      </div>
    </>
  )
}

function TwoFAStep({ setStep, onAuth }: { setStep: (s: AuthStep) => void; onAuth: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)

  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const next = [...otp]
    next[i] = v
    setOtp(next)
    if (v && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`)
      el?.focus()
    }
  }

  const handleVerify = () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter the complete 6-digit code.'); return }
    if (code === '000000') { setError('Incorrect code. Please try again.'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); onAuth() }, 800)
  }

  return (
    <>
      <button onClick={() => setStep('login')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={14} /> Back to sign in
      </button>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 52, height: 52, background: 'var(--primary-soft)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <ShieldCheck size={26} color="var(--primary)" />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Two-factor authentication</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>Enter the 6-digit code from your authenticator app or sent to <strong>dhruv@attendancehrms.in</strong></div>
      </div>

      {error && <div style={{ marginBottom: 16 }}><Alert type="error" title={error} /></div>}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
        {otp.map((d, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            className="input"
            style={{ width: 48, height: 52, textAlign: 'center', fontSize: 22, fontWeight: 700, padding: 0 }}
            value={d}
            maxLength={1}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => e.key === 'Backspace' && !otp[i] && i > 0 && document.getElementById(`otp-${i - 1}`)?.focus()}
          />
        ))}
      </div>

      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15, marginBottom: 16 }} onClick={handleVerify} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify code'}
      </button>

      <div style={{ textAlign: 'center' }}>
        {resent ? (
          <span style={{ fontSize: 13, color: 'var(--success)' }}>Code resent successfully</span>
        ) : (
          <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => setResent(true)}>
            <RefreshCw size={13} /> Resend code
          </button>
        )}
      </div>

      <div style={{ marginTop: 16, padding: '10px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Demo: enter any 6-digit code (except 000000)</div>
      </div>
    </>
  )
}

function ForgotStep({ setStep }: { setStep: (s: AuthStep) => void }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <>
      <button onClick={() => setStep('login')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={14} /> Back to sign in
      </button>

      {sent ? (
        <div style={{ textAlign: 'center' }}>
          <CheckCircle size={40} color="var(--success)" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Check your email</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>We've sent a password reset link to <strong>{email}</strong>. The link expires in 30 minutes.</div>
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep('login')}>Back to sign in</button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Forgot your password?</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Enter your email and we'll send a reset link.</div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#344054', marginBottom: 6 }}>Email address</label>
            <input className="input" type="email" placeholder="you@attendancehrms.in" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15 }} onClick={() => setSent(true)} disabled={!email}>
            Send reset link
          </button>
        </>
      )}
    </>
  )
}

function SetupStep({ setStep }: { setStep: (s: AuthStep) => void }) {
  const [substep, setSubstep] = useState(0)
  const steps = ['Create account', 'Verify email', 'Set password', 'Setup 2FA', 'Accept terms']

  return (
    <>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Set up Super Admin account</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Step {substep + 1} of {steps.length}: {steps[substep]}</div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= substep ? 'var(--primary)' : 'var(--border)' }} />)}
      </div>

      {substep === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Full name</label><input className="input" placeholder="Your full name" /></div>
          <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label><input className="input" type="email" placeholder="admin@attendancehrms.in" /></div>
          <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Phone</label><input className="input" placeholder="+91 98765 43210" /></div>
        </div>
      )}
      {substep === 1 && (
        <div style={{ textAlign: 'center' }}>
          <Mail size={40} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>We sent a verification code to your email. Enter it below.</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {[0,1,2,3,4,5].map(i => <input key={i} className="input" style={{ width: 44, height: 48, textAlign: 'center', fontSize: 20, fontWeight: 700, padding: 0 }} maxLength={1} />)}
          </div>
        </div>
      )}
      {substep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>New password</label><input className="input" type="password" placeholder="Min. 12 characters" /></div>
          <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Confirm password</label><input className="input" type="password" placeholder="Repeat password" /></div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Password must be at least 12 characters, include uppercase, lowercase, number, and special character.</div>
        </div>
      )}
      {substep === 3 && (
        <div style={{ textAlign: 'center' }}>
          <ShieldCheck size={40} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>Scan this QR code with your authenticator app</div>
          <div style={{ width: 140, height: 140, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-muted)' }}>QR Code</div>
          <div><input className="input" placeholder="Enter 6-digit code to confirm" style={{ textAlign: 'center', letterSpacing: 8, fontSize: 18 }} /></div>
        </div>
      )}
      {substep === 4 && (
        <div>
          <div style={{ height: 120, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.7 }}>
            By continuing, you agree to the Attendance HRMS Super Admin Terms of Service. As a Super Admin, you acknowledge your responsibilities for platform governance, data security, compliance, and ethical use of administrative privileges. You agree to maintain the confidentiality of your credentials and report any unauthorized access immediately.
          </div>
          <label style={{ display: 'flex', gap: 10, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
            <input type="checkbox" style={{ accentColor: 'var(--primary)', marginTop: 2 }} />
            I have read and accept the Super Admin Terms of Service and Privacy Policy
          </label>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        {substep > 0 && <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSubstep(s => s - 1)}>Back</button>}
        <button className="btn-primary" style={{ flex: 2, justifyContent: 'center', height: 44 }} onClick={() => substep < 4 ? setSubstep(s => s + 1) : setStep('2fa')}>
          {substep === 4 ? 'Complete setup' : 'Continue'}
        </button>
      </div>
    </>
  )
}

export default function Auth({ step, setStep, onAuth }: AuthProps) {
  return (
    <AuthCard>
      {step === 'login' && <LoginStep setStep={setStep} onAuth={onAuth} />}
      {step === '2fa' && <TwoFAStep setStep={setStep} onAuth={onAuth} />}
      {step === 'forgot' && <ForgotStep setStep={setStep} />}
      {step === 'setup' && <SetupStep setStep={setStep} />}
    </AuthCard>
  )
}
