// muvaz-auth-pages.jsx — Sign in, Sign up, Phone collection
// Depends on muvaz-ui.jsx

// ── SignInPage ────────────────────────────────────────────────
function SignInPage({ onNavigate }) {
  return (
    <div style={{ minHeight:'100vh', background:'#fff' }}>
      <div style={{ borderBottom:`1px solid ${mBorder}`, padding:'0 20px', height:56, display:'flex', alignItems:'center' }}>
        <span style={{ fontFamily:mFont, fontWeight:800, fontSize:22, letterSpacing:'-0.5px', color:mText }}>
          muvaz<span style={{ color:mAccent }}>.</span>
        </span>
      </div>

      <div style={{ padding:'36px 24px' }}>
        <h1 style={{ fontFamily:mFont, fontSize:28, fontWeight:900, color:mText, letterSpacing:'-0.5px', margin:'0 0 6px' }}>Welcome back</h1>
        <p style={{ fontFamily:mFont, fontSize:14, color:mMuted, margin:'0 0 30px' }}>Sign in to continue shopping and selling.</p>

        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:8 }}>
          <div>
            <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Email address</label>
            <div style={{ display:'flex', alignItems:'center', height:44, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
              <input type="email" placeholder="you@email.com"
                style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
            </div>
          </div>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <label style={{ fontFamily:mFont, fontSize:13, fontWeight:500, color:mText }}>Password</label>
              <span style={{ fontFamily:mFont, fontSize:13, color:mAccent, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3 }}>Forgot?</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', height:44, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
              <input type="password" placeholder="••••••••"
                style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
              <span style={{ fontFamily:mFont, fontSize:11, fontWeight:500, color:mMuted, cursor:'pointer' }}>Show</span>
            </div>
          </div>
        </div>

        <MButton variant="default" full style={{ height:48, marginTop:20, marginBottom:0 }}>Sign in</MButton>

        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'22px 0' }}>
          <MSeparator style={{ flex:1 }} />
          <span style={{ fontFamily:mFont, fontSize:12, color:mMuted }}>or continue with</span>
          <MSeparator style={{ flex:1 }} />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
          <MButton variant="outline" full icon={<MGoogle />} onClick={() => onNavigate('phone-collect')}>Google</MButton>
          <MButton variant="outline" full icon={<span style={{ fontFamily:mFont, fontWeight:700, fontSize:15 }}></span>}>Apple</MButton>
        </div>

        <p style={{ fontFamily:mFont, fontSize:14, color:mSubtext, textAlign:'center' }}>
          No account?{' '}
          <span onClick={() => onNavigate('signup')} style={{ color:mAccent, fontWeight:600, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3 }}>Create one</span>
        </p>
      </div>
    </div>
  );
}

// ── SignUpPage ────────────────────────────────────────────────
function SignUpPage({ onNavigate }) {
  const [showPass, setShowPass] = React.useState(false);
  return (
    <div style={{ minHeight:'100vh', background:'#fff' }}>
      <div style={{ borderBottom:`1px solid ${mBorder}`, padding:'0 16px', height:56, display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={() => onNavigate('signin')} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
          <MChevLeft size={20} stroke={mText} />
        </button>
        <span style={{ fontFamily:mFont, fontWeight:800, fontSize:22, letterSpacing:'-0.5px', color:mText }}>
          muvaz<span style={{ color:mAccent }}>.</span>
        </span>
      </div>

      <div style={{ padding:'36px 24px' }}>
        <h1 style={{ fontFamily:mFont, fontSize:28, fontWeight:900, color:mText, letterSpacing:'-0.5px', margin:'0 0 6px' }}>Create account</h1>
        <p style={{ fontFamily:mFont, fontSize:14, color:mMuted, margin:'0 0 30px' }}>Join thousands decluttering with muvaz.</p>

        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
          {/* Full name */}
          <div>
            <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Full name</label>
            <div style={{ display:'flex', alignItems:'center', height:44, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
              <input type="text" placeholder="Sarah Miller"
                style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Email address</label>
            <div style={{ display:'flex', alignItems:'center', height:44, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
              <input type="email" placeholder="sarah@email.com"
                style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Phone number</label>
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, height:44, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff', minWidth:80, cursor:'pointer' }}>
                <span style={{ fontSize:16 }}>🇩🇪</span>
                <span style={{ fontFamily:mFont, fontSize:13, color:mSubtext }}>+49</span>
                <MChevDown size={12} stroke={mMuted} />
              </div>
              <div style={{ flex:1, display:'flex', alignItems:'center', height:44, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
                <input type="tel" placeholder="123 456 7890"
                  style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
              </div>
            </div>
            <p style={{ fontFamily:mFont, fontSize:11, color:mMuted, margin:'4px 0 0', lineHeight:1.5 }}>
              Used for delivery coordination only. Never shared with buyers or sellers.
            </p>
          </div>

          {/* Password */}
          <div>
            <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Password</label>
            <div style={{ display:'flex', alignItems:'center', height:44, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
              <input type={showPass?'text':'password'} placeholder="At least 8 characters"
                style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
              <span onClick={() => setShowPass(s=>!s)} style={{ fontFamily:mFont, fontSize:11, fontWeight:500, color:mMuted, cursor:'pointer', flexShrink:0 }}>{showPass?'Hide':'Show'}</span>
            </div>
          </div>
        </div>

        <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, lineHeight:1.65, margin:'0 0 20px' }}>
          By creating an account you agree to our{' '}
          <span style={{ color:mAccent, textDecoration:'underline', textUnderlineOffset:2, cursor:'pointer' }}>Terms of Service</span>
          {' '}and{' '}
          <span style={{ color:mAccent, textDecoration:'underline', textUnderlineOffset:2, cursor:'pointer' }}>Privacy Policy</span>.
        </p>

        <MButton full style={{ height:48, background:mAccent, color:'#fff', border:'none', fontWeight:600, marginBottom:0 }}>Create account</MButton>

        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'22px 0' }}>
          <MSeparator style={{ flex:1 }} />
          <span style={{ fontFamily:mFont, fontSize:12, color:mMuted }}>or sign up with</span>
          <MSeparator style={{ flex:1 }} />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
          <MButton variant="outline" full icon={<MGoogle />} onClick={() => onNavigate('phone-collect')}>Google</MButton>
          <MButton variant="outline" full icon={<span style={{ fontFamily:mFont, fontWeight:700, fontSize:15 }}></span>}>Apple</MButton>
        </div>

        <p style={{ fontFamily:mFont, fontSize:14, color:mSubtext, textAlign:'center' }}>
          Already have an account?{' '}
          <span onClick={() => onNavigate('signin')} style={{ color:mAccent, fontWeight:600, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3 }}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

// ── PhoneCollectPage — after Google sign-in ───────────────────
function PhoneCollectPage({ onNavigate }) {
  const [phone, setPhone] = React.useState('');
  return (
    <div style={{ minHeight:'100vh', background:'#fff' }}>
      <div style={{ borderBottom:`1px solid ${mBorder}`, padding:'0 20px', height:56, display:'flex', alignItems:'center' }}>
        <span style={{ fontFamily:mFont, fontWeight:800, fontSize:22, letterSpacing:'-0.5px', color:mText }}>
          muvaz<span style={{ color:mAccent }}>.</span>
        </span>
      </div>

      <div style={{ padding:'40px 24px 32px' }}>
        {/* Google account tile */}
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderRadius:mRadius, background:mMutedBg, border:`1px solid ${mBorder}`, marginBottom:36 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#4285F4,#34A853)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:mFont, fontWeight:700, fontSize:18, flexShrink:0 }}>S</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:mFont, fontSize:14, fontWeight:600, color:mText, margin:0 }}>Sarah Miller</p>
            <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, margin:'2px 0 0' }}>sarah.miller@gmail.com</p>
          </div>
          <MBadge variant="brand">Google</MBadge>
        </div>

        <h1 style={{ fontFamily:mFont, fontSize:26, fontWeight:900, color:mText, letterSpacing:'-0.5px', margin:'0 0 10px', lineHeight:1.2 }}>One last step</h1>
        <p style={{ fontFamily:mFont, fontSize:14, color:mSubtext, margin:'0 0 30px', lineHeight:1.6 }}>
          We need your phone number to coordinate pickup and delivery. It's never shared with buyers or sellers.
        </p>

        <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:8 }}>Phone number</label>
        <div style={{ display:'flex', gap:8, marginBottom:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, height:50, padding:'0 14px', borderRadius:mRadius, border:`1px solid ${mBorder}`, background:'#fff', minWidth:92, cursor:'pointer' }}>
            <span style={{ fontSize:18 }}>🇩🇪</span>
            <span style={{ fontFamily:mFont, fontSize:14, color:mSubtext }}>+49</span>
            <MChevDown size={13} stroke={mMuted} />
          </div>
          <div style={{ flex:1, display:'flex', alignItems:'center', height:50, padding:'0 14px', borderRadius:mRadius, border:`1.5px solid ${phone?mText:mBorder}`, background:'#fff', transition:'border-color .15s' }}>
            <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="123 456 7890"
              style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:16, color:mText, background:'transparent' }} />
          </div>
        </div>
        <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, margin:'0 0 36px', lineHeight:1.5 }}>
          We may send a one-time SMS to verify. Standard rates apply.
        </p>

        <MButton full style={{ height:50, background:mAccent, color:'#fff', border:'none', fontSize:16, fontWeight:700, marginBottom:12 }} onClick={() => onNavigate('home')}>
          Continue
        </MButton>
        <MButton variant="ghost" full onClick={() => onNavigate('home')}>
          Skip for now
        </MButton>
      </div>
    </div>
  );
}

Object.assign(window, { SignInPage, SignUpPage, PhoneCollectPage });
