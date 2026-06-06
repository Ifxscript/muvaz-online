import { MBadge, MSeparator, MCheck, MPin, MStar, mFont, mText, mSubtext, mMuted, mBorder, mWhite, mAccent, mAccentBg, mMutedBg, mRadius, mRadiusLg } from './ui.jsx';

const IMG_BGS = [
  'linear-gradient(150deg,#d4d4d8 0%,#b8b8bc 100%)',
  'linear-gradient(150deg,#c8c8cc 0%,#a8a8ac 100%)',
  'linear-gradient(150deg,#dcdce0 0%,#c0c0c4 100%)',
  'linear-gradient(150deg,#e0e0e4 0%,#c8c8cc 100%)',
];

export default function ItemInfoBlock({ item, showThumbs, activeImg, setActiveImg }) {
  return (
    <div style={{ padding: '10px 20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
        <div>
          <MBadge variant="brand" style={{ marginBottom: 8 }}>{item.condition}</MBadge>
          <h1 style={{ fontFamily: mFont, fontSize: 24, fontWeight: 900, color: mText, letterSpacing: '-0.5px', lineHeight: 1.15, margin: 0 }}>{item.title}</h1>
        </div>
        <p style={{ fontFamily: mFont, fontSize: 30, fontWeight: 900, color: mText, margin: '18px 0 0', letterSpacing: '-0.5px', flexShrink: 0 }}>£{item.price}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MPin size={13} stroke={mMuted} />
          <span style={{ fontFamily: mFont, fontSize: 13, color: mMuted }}>{item.distance}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MStar size={13} />
          <span style={{ fontFamily: mFont, fontSize: 13, fontWeight: 600, color: mText }}>{item.rating}</span>
          <span style={{ fontFamily: mFont, fontSize: 13, color: mMuted }}>({item.reviews} reviews)</span>
        </span>
      </div>

      <MSeparator style={{ marginBottom: 16 }} />

      {showThumbs && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {IMG_BGS.map((bg, i) => (
              <div key={i} onClick={() => setActiveImg(i)} style={{ width: 68, height: 60, borderRadius: 10, background: bg, border: i === activeImg ? `2.5px solid ${mText}` : `1.5px solid ${mBorder}`, cursor: 'pointer', flexShrink: 0 }} />
            ))}
          </div>
          <MSeparator style={{ marginBottom: 20 }} />
        </>
      )}

      <h3 style={{ fontFamily: mFont, fontSize: 15, fontWeight: 700, color: mText, margin: '0 0 8px' }}>About this item</h3>
      <p style={{ fontFamily: mFont, fontSize: 14, color: mSubtext, lineHeight: 1.65, margin: '0 0 16px' }}>{item.description}</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {item.tags.map(t => <MBadge key={t} variant="secondary">{t}</MBadge>)}
      </div>

      <MSeparator style={{ marginBottom: 20 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: mRadiusLg, background: mMutedBg, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: mText, color: mWhite, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mFont, fontWeight: 800, fontSize: 17, flexShrink: 0 }}>m.</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: mFont, fontSize: 14, fontWeight: 700, color: mText, margin: 0 }}>Sold by muvaz</p>
          <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: '2px 0 0' }}>Vetted · anonymous · secure</p>
        </div>
        <MBadge variant="brand">Verified</MBadge>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '12px 14px', borderRadius: mRadius, background: mAccentBg, border: `1px solid rgba(24,24,27,0.10)`, marginBottom: 24 }}>
        <MCheck size={15} stroke={mAccent} />
        <p style={{ fontFamily: mFont, fontSize: 13, color: mSubtext, margin: 0, lineHeight: 1.5 }}>You'll never meet the seller. muvaz handles pickup, vetting, and delivery.</p>
      </div>
    </div>
  );
}
