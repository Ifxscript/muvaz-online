import { useState, useEffect } from 'react'
import { ArrowLeft, Eye, EyeOff, ChevronDown, Mail } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'
import { MGoogle } from '../components/ui.jsx'
import { cn } from '../lib/utils.js'
import { authApi, setToken } from '../lib/api.js'

const OAUTH_URL = `${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/oauth2/authorization/google`

export default function Auth({ onBack, onSuccess, pendingGoogleUser, verifiedNotice }) {
  const [tab,      setTab]      = useState('signin')
  const [notice,   setNotice]   = useState(verifiedNotice ?? null)
  const [step,     setStep]     = useState('form')   // 'form' | 'verify-email' | 'phone'
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  // form fields
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [phone,    setPhone]    = useState('')
  const [country,  setCountry]  = useState('+234')

  // google user stored after oauth callback
  const [googleUser, setGoogleUser] = useState(null)

  // Auto-advance to phone step when coming back from Google OAuth with incomplete profile
  useEffect(() => {
    if (pendingGoogleUser) {
      setGoogleUser(pendingGoogleUser)
      setStep('phone')
    }
  }, [pendingGoogleUser])

  const switchTab = t => { setTab(t); setStep('form'); setError(''); setNotice(null) }
  const fullPhone = () => `${country}${phone.replace(/^0/, '')}`

  // ── Sign in ───────────────────────────────────────────────────────────────

  const handleSignIn = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    try {
      const data = await authApi.login({ email, password })
      setToken(data.token)
      if (!data.user.emailVerified) { setStep('verify-email'); return }
      if (!data.user.profileComplete) { setGoogleUser(data.user); setStep('phone'); return }
      onSuccess(data.user)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Sign up ───────────────────────────────────────────────────────────────

  const handleSignUp = async () => {
    if (!name || !email || !password || !phone) { setError('Please fill in all fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (phone.length < 7) { setError('Enter a valid WhatsApp number.'); return }
    setLoading(true); setError('')
    try {
      const data = await authApi.register({ name, email, password, phone: fullPhone() })
      if (data.token) {
        // Verification disabled — backend auto-verified and issued a token
        setToken(data.token)
        onSuccess(data.user)
      } else {
        // Verification required — NO token issued. User must verify via email, then sign in.
        setStep('verify-email')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Complete profile (Google users) ───────────────────────────────────────

  const handleCompleteProfile = async () => {
    if (phone.length < 7) { setError('Enter a valid WhatsApp number.'); return }
    setLoading(true); setError('')
    try {
      const data = await authApi.completeProfile({ phone: fullPhone(), name: googleUser?.name ?? name })
      onSuccess(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Email verification screen ─────────────────────────────────────────────

  if (step === 'verify-email') {
    return (
      <div className="min-h-screen bg-[#faf9f5] font-sans flex flex-col items-center justify-center px-5 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-6">
          <Mail size={26} className="text-zinc-700" />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">Check your email</h1>
        <p className="text-sm text-zinc-500 leading-relaxed mb-1 max-w-xs">
          We sent a verification link to <strong className="text-zinc-900">{email}</strong>.
        </p>
        <p className="text-xs text-zinc-400 mb-8">Click the link to activate your account, then sign in. It may take a minute to arrive.</p>
        <Button variant="outline" className="w-full max-w-xs h-12" onClick={() => switchTab('signin')}>
          Back to sign in
        </Button>
      </div>
    )
  }

  // ── Phone collection screen (Google users with profileComplete: false) ────

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-[#faf9f5] font-sans flex flex-col">
        <div className="px-5 pt-5">
          {onBack && (
            <button onClick={() => setStep('form')}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors mb-8">
              <ArrowLeft size={18} className="text-zinc-700" />
            </button>
          )}
        </div>

        <div className="flex-1 px-5 max-w-sm mx-auto w-full">
          {googleUser && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200 mb-8">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ background: 'linear-gradient(135deg,#4285F4,#34A853)' }}>
                {googleUser.name?.[0] ?? 'G'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 leading-none">{googleUser.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5 truncate">{googleUser.email}</p>
              </div>
              <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-200 rounded-full px-2.5 py-1 shrink-0">Google</span>
            </div>
          )}

          <h1 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">One last step</h1>
          <p className="text-sm text-zinc-500 leading-relaxed mb-8">
            Enter your current WhatsApp number — this is how we communicate with you.
          </p>

          <label className="block text-sm font-semibold text-zinc-900 mb-2">WhatsApp number</label>
          <PhoneInput country={country} setCountry={setCountry} phone={phone} setPhone={setPhone} />

          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

          <div className="flex flex-col gap-3 mt-8">
            <Button className="w-full h-12 text-base bg-[#D97757] hover:bg-[#c96848] text-white border-0" disabled={loading || phone.length < 7} onClick={handleCompleteProfile}>
              {loading ? 'Saving…' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main form ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#faf9f5] font-sans flex flex-col">

      <div className="px-5 pt-5">
        <button onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors">
          <ArrowLeft size={18} className="text-zinc-700" />
        </button>
      </div>

      <div className="flex-1 px-5 pt-8 pb-10 max-w-sm mx-auto w-full">

        <p className="text-2xl font-black tracking-tight text-zinc-900 mb-8 select-none">
          muvaz<span className="text-zinc-300">.</span>
        </p>

        {/* Email-verification result banner */}
        {notice === 'success' && (
          <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
            <p className="text-sm font-semibold text-zinc-900">Email verified ✓</p>
            <p className="text-xs text-zinc-500 mt-0.5">You can now sign in to your account.</p>
          </div>
        )}
        {notice === 'error' && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-red-700">Verification link invalid or expired</p>
            <p className="text-xs text-red-500 mt-0.5">Try signing in — if it still fails, register again.</p>
          </div>
        )}

        {/* Tab toggle */}
        <div className="flex bg-zinc-100 rounded-full p-1 mb-8">
          {['signin', 'signup'].map(t => (
            <button key={t} onClick={() => switchTab(t)}
              className={cn(
                'flex-1 py-2 rounded-full text-sm font-semibold transition-all',
                tab === t ? 'bg-[#faf9f5] shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
              )}>
              {t === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        {/* ── Sign in ── */}
        {tab === 'signin' && (
          <div className="flex flex-col gap-4">
            <Field label="Email address">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com" onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400" />
            </Field>

            <Field label="Password" right={
              <span className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-600 transition-colors shrink-0">Forgot?</span>
            }>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400 w-0" />
              <button onClick={() => setShowPass(s => !s)} className="shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </Field>

            {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}

            <Button className="w-full h-12 text-base bg-[#D97757] hover:bg-[#c96848] text-white border-0 mt-1" disabled={loading} onClick={handleSignIn}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>

            <Divider />

            <GoogleButton label="Continue with Google" onClick={() => { window.location.href = OAUTH_URL }} />
          </div>
        )}

        {/* ── Sign up ── */}
        {tab === 'signup' && (
          <div className="flex flex-col gap-4">
            <Field label="Full name">
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Sarah Miller"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400" />
            </Field>

            <Field label="Email address">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400" />
            </Field>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">WhatsApp number</label>
              <PhoneInput country={country} setCountry={setCountry} phone={phone} setPhone={setPhone} />
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Enter your current WhatsApp number — this is how we communicate with you.
              </p>
            </div>

            <Field label="Password">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400 w-0" />
              <button onClick={() => setShowPass(s => !s)} className="shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </Field>

            <p className="text-xs text-zinc-400 leading-relaxed -mt-1">
              By creating an account you agree to our{' '}
              <span className="text-zinc-600 underline underline-offset-2 cursor-pointer">Terms</span>
              {' '}and{' '}
              <span className="text-zinc-600 underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
            </p>

            {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}

            <Button className="w-full h-12 text-base bg-[#D97757] hover:bg-[#c96848] text-white border-0 mt-1" disabled={loading} onClick={handleSignUp}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>

            <Divider />

            <GoogleButton label="Continue with Google" onClick={() => { window.location.href = OAUTH_URL }} />
          </div>
        )}

        <p className="text-sm text-zinc-400 text-center mt-6">
          {tab === 'signin' ? (
            <>No account?{' '}
              <button onClick={() => switchTab('signup')} className="text-zinc-900 font-semibold underline underline-offset-2">Create one</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => switchTab('signin')} className="text-zinc-900 font-semibold underline underline-offset-2">Sign in</button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Field({ label, right, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-zinc-900">{label}</label>
        {right}
      </div>
      <div className="flex items-center gap-2 h-12 px-3 rounded-md border border-zinc-200 bg-[#f0efe9] focus-within:border-zinc-900 transition-colors">
        {children}
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-zinc-200" />
      <span className="text-xs text-zinc-400 font-medium">or</span>
      <div className="flex-1 h-px bg-zinc-200" />
    </div>
  )
}

function GoogleButton({ onClick, label }) {
  return (
    <button onClick={onClick}
      className="w-full h-12 rounded-md border border-zinc-200 bg-[#faf9f5] flex items-center justify-center gap-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
      <MGoogle />
      {label}
    </button>
  )
}

const COUNTRY_CODES = [
  { flag: '🇳🇬', code: '+234' },
  { flag: '🇬🇧', code: '+44' },
  { flag: '🇺🇸', code: '+1' },
  { flag: '🇩🇪', code: '+49' },
  { flag: '🇫🇷', code: '+33' },
]

function PhoneInput({ country, setCountry, phone, setPhone }) {
  return (
    <div className="flex gap-2">
      <select value={country} onChange={e => setCountry(e.target.value)}
        className="h-12 px-3 rounded-md border border-zinc-200 bg-[#f0efe9] text-sm font-medium text-zinc-700 cursor-pointer outline-none shrink-0">
        {COUNTRY_CODES.map(c => (
          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
        ))}
      </select>
      <div className="flex-1 flex items-center h-12 px-3 rounded-md border border-zinc-200 bg-[#f0efe9] focus-within:border-zinc-900 transition-colors">
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="803 123 4567"
          className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400" />
      </div>
    </div>
  )
}
