import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, ChevronDown, Check } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'
import { Separator } from '../components/ui/separator.jsx'
import { MGoogle } from '../components/ui.jsx'
import { cn } from '../lib/utils.js'

// ── Google account mock (would come from OAuth in production) ──
const MOCK_GOOGLE = { name: 'Sarah Miller', email: 'sarah.miller@gmail.com', initial: 'S' }

export default function Auth({ onBack, onSuccess }) {
  const [tab,       setTab]       = useState('signin')  // 'signin' | 'signup'
  const [step,      setStep]      = useState('form')    // 'form' | 'phone'
  const [showPass,  setShowPass]  = useState(false)
  const [phone,     setPhone]     = useState('')

  const switchTab = t => { setTab(t); setStep('form') }

  // ── Phone collection step (after Google sign-up) ──────────────
  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">

        <div className="px-5 pt-5">
          <button
            onClick={() => setStep('form')}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors mb-8"
          >
            <ArrowLeft size={18} className="text-zinc-700" />
          </button>
        </div>

        <div className="flex-1 px-5">
          {/* Google account tile */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200 mb-8">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ background: 'linear-gradient(135deg,#4285F4,#34A853)' }}>
              {MOCK_GOOGLE.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 leading-none">{MOCK_GOOGLE.name}</p>
              <p className="text-xs text-zinc-400 mt-0.5 truncate">{MOCK_GOOGLE.email}</p>
            </div>
            <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-200 rounded-full px-2.5 py-1 shrink-0">Google</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">One last step</h1>
          <p className="text-sm text-zinc-500 leading-relaxed mb-8">
            Add your WhatsApp number — this is how we coordinate pickup and delivery.{' '}
            <span className="text-zinc-400">We never share it with buyers or sellers.</span>
          </p>

          {/* Phone input */}
          <label className="block text-sm font-semibold text-zinc-900 mb-2">
            WhatsApp number
          </label>
          <div className="flex gap-2 mb-2">
            <button className="flex items-center gap-1.5 h-12 px-3 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-700 shrink-0 hover:bg-zinc-50 transition-colors">
              <span className="text-base">🇩🇪</span>
              <span>+49</span>
              <ChevronDown size={13} className="text-zinc-400" />
            </button>
            <div className="flex-1 flex items-center h-12 px-3 rounded-md border border-zinc-200 bg-white focus-within:border-zinc-900 transition-colors">
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="123 456 7890"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
          </div>
          <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
            We may send a one-time SMS to verify. Standard rates apply.
          </p>

          <Button className="w-full h-12 text-base mb-3" onClick={onSuccess}>
            Continue
          </Button>
          <Button variant="ghost" className="w-full h-11 text-zinc-400" onClick={onSuccess}>
            Skip for now
          </Button>
        </div>
      </div>
    )
  }

  // ── Main form ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">

      {/* Back */}
      <div className="px-5 pt-5">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft size={18} className="text-zinc-700" />
        </button>
      </div>

      <div className="flex-1 px-5 pt-8 pb-10 max-w-sm mx-auto w-full">

        {/* Wordmark */}
        <p className="text-2xl font-black tracking-tight text-zinc-900 mb-8 select-none">
          muvaz<span className="text-zinc-300">.</span>
        </p>

        {/* Tab toggle */}
        <div className="flex bg-zinc-100 rounded-full p-1 mb-8">
          {['signin', 'signup'].map(t => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={cn(
                'flex-1 py-2 rounded-full text-sm font-semibold transition-all',
                tab === t
                  ? 'bg-white shadow-sm text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              {t === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        {/* ── Sign in form ── */}
        {tab === 'signin' && (
          <div className="flex flex-col gap-4">
            <Field label="Email address">
              <input type="email" placeholder="you@email.com"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400" />
            </Field>

            <Field label="Password" right={
              <span className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-600 transition-colors shrink-0">
                Forgot?
              </span>
            }>
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400 w-0" />
              <button onClick={() => setShowPass(s => !s)} className="shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </Field>

            <Button className="w-full h-12 text-base mt-1">Sign in</Button>

            <Divider />

            <GoogleButton onClick={onSuccess} label="Continue with Google" />
          </div>
        )}

        {/* ── Sign up form ── */}
        {tab === 'signup' && (
          <div className="flex flex-col gap-4">
            <Field label="Full name">
              <input type="text" placeholder="Sarah Miller"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400" />
            </Field>

            <Field label="Email address">
              <input type="email" placeholder="you@email.com"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400" />
            </Field>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                WhatsApp number
              </label>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 h-12 px-3 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-700 shrink-0 hover:bg-zinc-50 transition-colors">
                  <span className="text-base">🇩🇪</span>
                  <span>+49</span>
                  <ChevronDown size={13} className="text-zinc-400" />
                </button>
                <div className="flex-1 flex items-center h-12 px-3 rounded-md border border-zinc-200 focus-within:border-zinc-900 transition-colors">
                  <input type="tel" placeholder="123 456 7890"
                    className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400" />
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                This is how we coordinate pickup and delivery — never shared with buyers or sellers.
              </p>
            </div>

            <Field label="Password">
              <input type={showPass ? 'text' : 'password'} placeholder="At least 8 characters"
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

            <Button className="w-full h-12 text-base mt-1">Create account</Button>

            <Divider />

            <GoogleButton onClick={() => setStep('phone')} label="Continue with Google" />
          </div>
        )}

        {/* Switch tab hint */}
        <p className="text-sm text-zinc-400 text-center mt-6">
          {tab === 'signin' ? (
            <>No account?{' '}
              <button onClick={() => switchTab('signup')} className="text-zinc-900 font-semibold underline underline-offset-2">
                Create one
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => switchTab('signin')} className="text-zinc-900 font-semibold underline underline-offset-2">
                Sign in
              </button>
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
      <div className="flex items-center gap-2 h-12 px-3 rounded-md border border-zinc-200 bg-white focus-within:border-zinc-900 transition-colors">
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
    <button
      onClick={onClick}
      className="w-full h-12 rounded-md border border-zinc-200 bg-white flex items-center justify-center gap-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
    >
      <MGoogle />
      {label}
    </button>
  )
}
