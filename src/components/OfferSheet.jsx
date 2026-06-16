import { useState } from 'react';
import BottomSheet from './BottomSheet.jsx';
import { MButton, MCheck, mFont, mText, mSubtext, mMuted, mBorder, mBorder2, mAccent, mAccentBg, mRadius, mRadiusSm } from './ui.jsx';

export default function OfferSheet({ price, open, onClose }) {
  const [offer, setOffer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    onClose();
    setTimeout(() => { setSubmitted(false); setOffer(''); }, 400);
  };

  if (submitted) {
    return (
      <BottomSheet open={open} onClose={handleClose} title="Offer sent">
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: mAccentBg, border: `2px solid ${mAccent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <MCheck size={26} stroke={mAccent} />
          </div>
          <p style={{ fontFamily: mFont, fontSize: 18, fontWeight: 700, color: mText, margin: '0 0 6px' }}>Offer submitted!</p>
          <p style={{ fontFamily: mFont, fontSize: 14, color: mSubtext, margin: '0 0 24px', lineHeight: 1.55 }}>We'll review your offer and get back to you within 24 hours.</p>
          <MButton full style={{ background: mAccent, color: '#fff', border: 'none', height: 48 }} onClick={handleClose}>Done</MButton>
        </div>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Make an offer">
      <p style={{ fontFamily: mFont, fontSize: 13, color: mSubtext, margin: '0 0 16px', lineHeight: 1.55 }}>
        Listed at <strong style={{ color: mText }}>₦{price}</strong>. Enter your offer below.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', height: 54, borderRadius: mRadius, border: `1.5px solid ${mBorder2}`, overflow: 'hidden', marginBottom: 12, background: '#fafafa' }}>
        <span style={{ fontFamily: mFont, fontSize: 22, fontWeight: 700, padding: '0 12px 0 16px', color: mText }}>₦</span>
        <div style={{ width: 1, height: 30, background: mBorder }} />
        <input
          type="number" value={offer} onChange={e => setOffer(e.target.value)}
          placeholder={String(Math.round(price * 0.85))}
          style={{ flex: 1, border: 'none', outline: 'none', fontFamily: mFont, fontSize: 22, fontWeight: 700, padding: '0 16px', color: mText, background: 'transparent' }}
        />
      </div>
      {offer && Number(offer) < price * 0.5 && (
        <p style={{ fontFamily: mFont, fontSize: 12, color: '#71717a', margin: '0 0 10px' }}>Offers below 50% are unlikely to be accepted.</p>
      )}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[0.7, 0.8, 0.9].map(f => {
          const v = String(Math.round(price * f));
          return (
            <button key={f} onClick={() => setOffer(v)} style={{ flex: 1, height: 36, borderRadius: mRadiusSm, border: `1px solid ${offer === v ? mText : mBorder}`, background: offer === v ? mText : '#fff', color: offer === v ? '#fff' : mSubtext, fontFamily: mFont, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              ₦{Math.round(price * f)}
            </button>
          );
        })}
      </div>
      <MButton full style={{ background: mAccent, color: '#fff', border: 'none', height: 48 }} disabled={!offer || Number(offer) <= 0} onClick={() => setSubmitted(true)}>
        Submit offer
      </MButton>
    </BottomSheet>
  );
}
