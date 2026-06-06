import { MCard, MSeparator, MStar, mFont, mText, mMuted, mWhite } from './ui.jsx';

export default function TestimonialCard({ quote, name, role, initial, style }) {
  return (
    <MCard style={{ ...style }}>
      <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
        {[0, 1, 2, 3, 4].map(i => <MStar key={i} size={14} />)}
      </div>
      <p style={{ fontFamily: mFont, fontSize: 14.5, lineHeight: 1.55, margin: '0 0 16px', color: mText }}>"{quote}"</p>
      <MSeparator style={{ marginBottom: 14 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: mText, color: mWhite, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mFont, fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{initial}</div>
        <div>
          <p style={{ fontFamily: mFont, fontSize: 14, fontWeight: 500, margin: 0, color: mText }}>{name}</p>
          <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: 0 }}>{role}</p>
        </div>
      </div>
    </MCard>
  );
}
