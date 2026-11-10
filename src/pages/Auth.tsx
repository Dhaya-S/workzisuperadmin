import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck, ArrowLeft, Mail, Lock, User, CheckCircle } from 'lucide-react'
import type { AuthStep } from '../lib/types'
import { Alert } from '../components/ui'
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext'

interface AuthProps {
  step: AuthStep
  setStep: (s: AuthStep) => void
  onAuth: () => void
}

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(92, 92, 255, 0.25)' }}>
              <ShieldCheck size={22} color="#fff" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Workzi HRMS</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Super Admin Platform</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 32, boxShadow: '0 12px 32px rgba(16, 24, 40, 0.08)', borderRadius: 16 }}>
          {children}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          Workzi Platform Master Governance · Secure Cloud Authentication
        </div>
      </div>
    </div>
  )
}

// ─── Sign In View ─────────────────────────────────────────────────────────────
function SignInView({ onSwitchToSignup, onForgotPassword, onAuth }: {
  onSwitchToSignup: () => void
  onForgotPassword: () => void
  onAuth: () => void
}) {
  const { login } = useSuperAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email.trim()) { setError('Please enter your administrator email.'); return }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return }
    if (!password) { setError('Please enter your password.'); return }

    setError('')
    setLoading(true)

    const res = await login(email, password)
    setLoading(false)

    if (res.success) {
      onAuth()
    } else {
      setError(res.error || 'Invalid email or password.')
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Admin Sign In</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Sign in to manage all organizations and platform operations.</p>
      </div>

      {error && <div style={{ marginBottom: 16 }}><Alert type="error" title={error} /></div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Email address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 38 }}
              placeholder="admin@workzi.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 38, paddingRight: 40 }}
              placeholder="Enter your password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: 'var(--primary)', width: 15, height: 15 }} />
            Remember me
          </label>
          <button type="button" className="btn-ghost" style={{ fontSize: 13, padding: 0 }} onClick={onForgotPassword}>
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15, marginTop: 8 }}
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Need an admin account? </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: 0 }}
        >
          Create Admin Account
        </button>
      </div>
    </div>
  )
}

// ─── Sign Up / Create Account View ───────────────────────────────────────────
function SignUpView({ onSwitchToSignin, onAuth }: {
  onSwitchToSignin: () => void
  onAuth: () => void
}) {
  const { signup } = useSuperAdminAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!fullName.trim()) { setError('Please enter your full name.'); return }
    if (!email.trim()) { setError('Please enter your administrator email.'); return }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return }
    if (!password) { setError('Please choose a password.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }

    setError('')
    setLoading(true)

    const res = await signup(fullName, email, password)
    setLoading(false)

    if (res.success) {
      onAuth()
    } else {
      setError(res.error || 'Failed to create admin account.')
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Create Admin Account</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Register as a Workzi Platform Super Admin.</p>
      </div>

      {error && <div style={{ marginBottom: 16 }}><Alert type="error" title={error} /></div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 38 }}
              placeholder="e.g. Platform Administrator"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Work Email</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 38 }}
              placeholder="admin@workzi.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 38, paddingRight: 40 }}
              placeholder="At least 6 characters"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 38 }}
              placeholder="Repeat password"
              type={showPw ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15, marginTop: 8 }}
          disabled={loading}
        >
          {loading ? 'Creating account & database profile…' : 'Create Admin Account'}
        </button>
      </form>

      <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Already have an admin account? </span>
        <button
          type="button"
          onClick={onSwitchToSignin}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: 0 }}
        >
          Sign In
        </button>
      </div>
    </div>
  )
}

// ─── Forgot Password View ─────────────────────────────────────────────────────
function ForgotPasswordView({ onBackToSignin }: { onBackToSignin: () => void }) {
  const { sendResetEmail } = useSuperAdminAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const success = await sendResetEmail(email)
    setLoading(false)
    if (success) {
      setSent(true)
    } else {
      setError('Could not send reset email. Ensure the email is registered.')
    }
  }

  return (
    <div>
      <button
        onClick={onBackToSignin}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, marginBottom: 20, padding: 0 }}
      >
        <ArrowLeft size={14} /> Back to Sign In
      </button>

      {sent ? (
        <div style={{ textAlign: 'center' }}>
          <CheckCircle size={44} color="var(--success)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Reset link sent</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 24px 0' }}>
            We've sent a password reset link to <strong>{email}</strong>. Check your inbox to choose a new password.
          </p>
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onBackToSignin}>
            Back to Sign In
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Reset Password</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Enter your registered email and we'll send you a password reset link.</p>
          </div>

          {error && <div style={{ marginBottom: 16 }}><Alert type="error" title={error} /></div>}

          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input"
                  style={{ paddingLeft: 38 }}
                  type="email"
                  placeholder="admin@workzi.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15, marginTop: 4 }}
              disabled={!email || loading}
            >
              {loading ? 'Sending link…' : 'Send Reset Link'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

// ─── Main Auth Component ──────────────────────────────────────────────────────
export default function Auth({ step, setStep, onAuth }: AuthProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(step === 'signup' ? 'signup' : step === 'forgot' ? 'forgot' : 'signin')

  return (
    <AuthCard>
      {mode === 'signin' && (
        <SignInView
          onSwitchToSignup={() => setMode('signup')}
          onForgotPassword={() => setMode('forgot')}
          onAuth={onAuth}
        />
      )}

      {mode === 'signup' && (
        <SignUpView
          onSwitchToSignin={() => setMode('signin')}
          onAuth={onAuth}
        />
      )}

      {mode === 'forgot' && (
        <ForgotPasswordView
          onBackToSignin={() => setMode('signin')}
        />
      )}
    </AuthCard>
  )
}
