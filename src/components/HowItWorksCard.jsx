import React from 'react';
import { MCard, mFont, mFontMono, mText, mSubtext, mAccent, mAccentBg, mBorder2, mRadius } from './ui.jsx';

export default function HowItWorksCard({ step, title, body, icon, style }) {
  return (
    <MCard style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 44, height: 44, borderRadius: mRadius, background: mAccentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(196,69,45,0.15)` }}>
          {React.cloneElement(icon, { stroke: mAccent, size: 22 })}
        </div>
        <span style={{ fontFamily: mFontMono, fontSize: 13, fontWeight: 600, color: mBorder2 }}>0{step}</span>
      </div>
      <div>
        <p style={{ fontFamily: mFont, fontSize: 15, fontWeight: 600, margin: '0 0 4px', color: mText }}>{title}</p>
        <p style={{ fontFamily: mFont, fontSize: 13, color: mSubtext, lineHeight: 1.5, margin: 0 }}>{body}</p>
      </div>
    </MCard>
  );
}
