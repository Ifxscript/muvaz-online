import { MButton, MSeparator, MGoogle, mFont, mText, mMuted, mBorder, mWhite, mAccent, mRadiusSm } from './ui.jsx';

export default function AuthForm({ style }) {
  return (
    <div style={{ padding: '28px 24px', background: mWhite, ...style }}>
      <p style={{ fontFamily: mFont, fontWeight: 700, fontSize: 24, margin: '0 0 4px', letterSpacing: '-0.3px', color: mText }}>Welcome back</p>
      <p style={{ fontFamily: mFont, fontSize: 14, color: mMuted, margin: '0 0 24px' }}>
        Sign in to <span style={{ fontWeight: 700 }}>muvaz<span style={{ color: mAccent }}>.</span></span> or create an account
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontFamily: mFont, fontSize: 13, fontWeight: 500, color: mText, marginBottom: 6 }}>Email</label>
          <div style={{ display: 'flex', alignItems: 'center', height: 40, padding: '0 12px', borderRadius: mRadiusSm, border: `1px solid ${mBorder}`, background: mWhite }}>
            <input placeholder="you@email.com" style={{ flex: 1, border: 'none', outline: 'none', fontFamily: mFont, fontSize: 14, color: mText, background: 'transparent' }} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: mFont, fontSize: 13, fontWeight: 500, color: mText, marginBottom: 6 }}>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', height: 40, padding: '0 12px', borderRadius: mRadiusSm, border: `1px solid ${mBorder}`, background: mWhite }}>
            <input type="password" placeholder="••••••••" style={{ flex: 1, border: 'none', outline: 'none', fontFamily: mFont, fontSize: 14, color: mText, background: 'transparent' }} />
            <span style={{ fontFamily: mFont, fontSize: 11, fontWeight: 500, color: mAccent, cursor: 'pointer' }}>Show</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <span style={{ fontFamily: mFont, fontSize: 13, color: mAccent, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>Forgot password?</span>
      </div>

      <MButton variant="default" full style={{ marginBottom: 8 }}>Sign in</MButton>
      <MButton variant="outline" full>Create account</MButton>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
        <MSeparator style={{ flex: 1 }} />
        <span style={{ fontFamily: mFont, fontSize: 12, color: mMuted, whiteSpace: 'nowrap' }}>Or continue with</span>
        <MSeparator style={{ flex: 1 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MButton variant="outline" full icon={<MGoogle />}>Continue with Google</MButton>
        <MButton variant="outline" full icon={<span style={{ width: 16, height: 16, background: '#1877F2', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: mFont, fontWeight: 700, fontSize: 10, color: mWhite }}>f</span>}>Continue with Facebook</MButton>
        <MButton variant="outline" full icon={<span style={{ fontFamily: mFont, fontWeight: 700, fontSize: 14 }}></span>}>Continue with Apple</MButton>
      </div>
    </div>
  );
}
