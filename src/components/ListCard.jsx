import { MHeart, MChevRight, mFont, mText, mSubtext, mMuted, mBorder, mWhite, mAccent } from './ui.jsx';

export default function ListCard({ title, meta, tag, likeCount, saved, sold, offerCount, paused, hideSave, onClick, style, imageRatio = '68%' }) {
  const Wrapper = onClick ? 'button' : 'div';
  const wrapperStyle = {
    display: 'flex', flexDirection: 'column', gap: 0,
    background: 'transparent', border: 'none', padding: 0,
    cursor: onClick ? 'pointer' : 'default',
    textAlign: 'left', width: '100%',
    ...style,
  };

  return (
    <Wrapper onClick={onClick} style={wrapperStyle}>
      <div style={{ position: 'relative', width: '100%', paddingBottom: imageRatio, borderRadius: 16, background: 'linear-gradient(135deg, #d4d4d8 0%, #c4c4c8 100%)', overflow: 'hidden', flexShrink: 0 }}>
        {tag && !offerCount && (
          <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: mFont, fontSize: 11, fontWeight: 500, background: mWhite, color: mSubtext, border: `1px solid ${mBorder}`, borderRadius: 999, padding: '2px 8px', zIndex: 1 }}>{tag}</span>
        )}
        {offerCount > 0 && (
          <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: mFont, fontSize: 10, fontWeight: 700, background: mAccent, color: mWhite, borderRadius: 999, padding: '2px 8px', zIndex: 1 }}>
            {offerCount} offer{offerCount > 1 ? 's' : ''}
          </span>
        )}
        {sold && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <span style={{ background: mText, color: mWhite, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>Sold</span>
          </div>
        )}
        {paused && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <span style={{ background: mText, color: mWhite, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>Paused</span>
          </div>
        )}
        {!hideSave && (
          <button style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', zIndex: 2 }}>
            <MHeart size={16} stroke={saved ? mText : mMuted} fill={saved ? mText : 'none'} sw={2} />
          </button>
        )}
      </div>

      <div style={{ padding: '10px 4px 4px' }}>
        <p style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, margin: '0 0 2px', color: mText, lineHeight: 1.2 }}>{title}</p>
        <p style={{ fontFamily: mFont, fontSize: 13, color: mMuted, margin: '0 0 8px' }}>{meta}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MHeart size={13} fill={saved ? mText : 'none'} stroke={saved ? mText : mMuted} sw={1.75} />
          <span style={{ fontFamily: mFont, fontSize: 12, color: mMuted }}>{likeCount ?? 0}</span>
          {offerCount > 0 && (
            <>
              <span style={{ color: mMuted, fontSize: 11 }}>·</span>
              <span style={{ fontFamily: mFont, fontSize: 12, color: mMuted }}>{offerCount} offer{offerCount !== 1 ? 's' : ''}</span>
            </>
          )}
          {onClick && (
            <button style={{ marginLeft: 'auto', background: mText, border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <MChevRight size={18} stroke={mWhite} sw={2.5} />
            </button>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
