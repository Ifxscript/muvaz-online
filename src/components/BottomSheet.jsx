import { MClose, mFont, mText, mMuted, mBorder, mBorder2 } from './ui.jsx';

export default function BottomSheet({ open, onClose, title, children }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.42)', zIndex: 60, opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none', transition: 'opacity .25s' }}
      />
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: `translateX(-50%) translateY(${open ? '0' : '100%'})`, width: '100%', maxWidth: 375, background: '#faf9f5', borderRadius: '20px 20px 0 0', zIndex: 70, transition: 'transform .3s cubic-bezier(.4,0,.2,1)', paddingBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: mBorder2 }} />
        </div>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 14px', borderBottom: `1px solid ${mBorder}` }}>
            <p style={{ fontFamily: mFont, fontSize: 17, fontWeight: 700, color: mText, margin: 0 }}>{title}</p>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
              <MClose size={18} stroke={mMuted} />
            </button>
          </div>
        )}
        <div style={{ padding: '20px 20px 0' }}>{children}</div>
      </div>
    </>
  );
}
