import { MMenu, mFont, mText, mMuted, mBorder, mWhite, mAccent, mAccentBg, mRadiusSm } from './ui.jsx';

export default function LandingHeader({ onMenu, style }) {
  return (
    <div style={{ background: mWhite, borderBottom: `1px solid ${mBorder}`, ...style }}>
      <div style={{ background: mText, color: mWhite, fontFamily: mFont, fontSize: 11, fontWeight: 500, padding: '6px 16px', display: 'flex', justifyContent: 'center', gap: 16, letterSpacing: '0.03em' }}>
        <span>We pick up</span>
        <span style={{ opacity: 0.35 }}>·</span>
        <span>We vet buyers</span>
        <span style={{ opacity: 0.35 }}>·</span>
        <span style={{ color: mAccentBg }}>You never meet a stranger</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 52 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px', color: mText }}>
          muvaz<span style={{ color: mAccent }}>.</span>
        </span>
        <span style={{ marginLeft: 8, fontFamily: mFont, fontSize: 11, fontWeight: 500, color: mMuted, letterSpacing: '0.04em', alignSelf: 'flex-end', paddingBottom: 14 }}>BERLIN</span>
        <button onClick={onMenu} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, color: mText, borderRadius: mRadiusSm }}>
          <MMenu size={22} stroke={mText} />
        </button>
      </div>
    </div>
  );
}
