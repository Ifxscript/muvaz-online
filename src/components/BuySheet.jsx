import BottomSheet from './BottomSheet.jsx';
import { MButton, MCheck, MSeparator, mFont, mText, mSubtext, mMuted, mBorder, mAccent, mAccentBg, mMutedBg, mRadius } from './ui.jsx';

const ITEM_IMG = 'linear-gradient(150deg,#d4d4d8 0%,#b8b8bc 100%)';

export default function BuySheet({ price, title, open, onClose }) {
  const fee   = Math.round(price * 0.05 * 100) / 100;
  const total = (price + fee).toFixed(2);

  return (
    <BottomSheet open={open} onClose={onClose} title="Confirm purchase">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14, borderRadius: mRadius, background: mMutedBg, marginBottom: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: 10, background: ITEM_IMG, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: mFont, fontSize: 14, fontWeight: 600, margin: 0, color: mText }}>{title}</p>
          <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: '2px 0 0' }}>Like new · Kreuzberg</p>
        </div>
        <p style={{ fontFamily: mFont, fontSize: 18, fontWeight: 800, color: mText, margin: 0 }}>₦{price}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {[['Item price', `₦${price}`], ['muvaz fee (5%)', `₦${fee.toFixed(2)}`], ['Delivery', 'Free']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: mFont, fontSize: 14, color: mSubtext }}>{k}</span>
            <span style={{ fontFamily: mFont, fontSize: 14, color: k === 'Delivery' ? mAccent : mText }}>{v}</span>
          </div>
        ))}
        <MSeparator />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: mFont, fontSize: 15, fontWeight: 700, color: mText }}>Total</span>
          <span style={{ fontFamily: mFont, fontSize: 15, fontWeight: 700, color: mText }}>₦{total}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '12px 14px', borderRadius: mRadius, background: mAccentBg, border: `1px solid rgba(24,24,27,0.10)`, marginBottom: 20 }}>
        <MCheck size={15} stroke={mAccent} />
        <p style={{ fontFamily: mFont, fontSize: 13, color: mSubtext, margin: 0, lineHeight: 1.5 }}>muvaz handles pickup &amp; delivery. You'll never meet the seller.</p>
      </div>

      <MButton full style={{ height: 50, background: mAccent, color: '#fff', border: 'none', fontSize: 16, fontWeight: 700 }} onClick={onClose}>
        Pay ₦{total}
      </MButton>
    </BottomSheet>
  );
}
