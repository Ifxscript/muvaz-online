import {
  MSearch, MButton,
  mFont, mText, mSubtext, mMuted, mMutedBg2, mBorder,
  mAccent, mShadow,
} from '../components/ui.jsx'

export default function NotFound({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#faf9f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>

      {/* 404 visual */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <p style={{ fontFamily: mFont, fontSize: 128, fontWeight: 900, color: mMutedBg2, margin: 0, letterSpacing: '-6px', lineHeight: 1, userSelect: 'none' }}>404</p>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 60, height: 60, borderRadius: '50%', background: '#fff', border: `1.5px solid ${mBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: mShadow }}>
          <MSearch size={26} stroke={mMuted} />
        </div>
      </div>

      <h1 style={{ fontFamily: mFont, fontSize: 24, fontWeight: 900, color: mText, margin: '0 0 10px', letterSpacing: '-0.5px' }}>Page not found</h1>
      <p style={{ fontFamily: mFont, fontSize: 15, color: mSubtext, margin: '0 0 36px', lineHeight: 1.6, maxWidth: 280 }}>
        This page doesn't exist or has been moved. Let's get you back on track.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
        <MButton full style={{ height: 48, background: mAccent, color: '#fff', border: 'none', fontWeight: 600 }} onClick={() => onNavigate('home')}>
          Back to home
        </MButton>
        <MButton variant="outline" full onClick={() => onNavigate('help')}>
          Get help
        </MButton>
      </div>

      <p style={{ fontFamily: mFont, fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', color: mMuted, marginTop: 48 }}>
        muvaz<span style={{ color: mAccent }}>.</span>
      </p>
    </div>
  )
}
