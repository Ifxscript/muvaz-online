import React from 'react';
import { MButton, MSeparator, MClose, MChevRight, MHome, MSearch, MTag, MUser, MInfo, mFont, mText, mSubtext, mMuted, mMutedBg, mBorder, mWhite, mAccent, mRadius, mRadiusSm } from './ui.jsx';

export default function NavDrawer({ active = 'Home', style }) {
  const items = [
    { label: 'Home',              icon: <MHome size={18} /> },
    { label: 'Items page',        icon: <MSearch size={18} /> },
    { label: 'List an item',      icon: <MTag size={18} /> },
    { label: 'Sign in / Sign up', icon: <MUser size={18} /> },
    { label: 'About',             icon: <MInfo size={18} /> },
  ];

  return (
    <div style={{ width: 280, background: mWhite, borderRight: `1px solid ${mBorder}`, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 16px rgba(0,0,0,0.06)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 56, padding: '0 16px', borderBottom: `1px solid ${mBorder}` }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px', color: mText }}>
          muvaz<span style={{ color: mAccent }}>.</span>
        </span>
        <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: mRadiusSm }}>
          <MClose size={18} stroke={mMuted} />
        </button>
      </div>

      <nav style={{ padding: 8, flex: 1 }}>
        {items.map(it => {
          const on = it.label === active;
          return (
            <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: mRadius, marginBottom: 2, background: on ? mMutedBg : 'transparent', color: on ? mText : mSubtext, fontFamily: mFont, fontSize: 15, fontWeight: on ? 500 : 400, cursor: 'pointer' }}>
              {React.cloneElement(it.icon, { stroke: on ? mText : mMuted })}
              {it.label}
              {on && <span style={{ marginLeft: 'auto' }}><MChevRight size={16} stroke={mMuted} /></span>}
            </div>
          );
        })}
      </nav>

      <MSeparator style={{ margin: '0 16px' }} />

      <div style={{ padding: 16 }}>
        <div style={{ padding: 14, borderRadius: mRadius, background: mText, color: mWhite }}>
          <p style={{ fontFamily: mFont, fontWeight: 600, fontSize: 14, margin: '0 0 2px', color: mWhite }}>Moving out?</p>
          <p style={{ fontFamily: mFont, fontSize: 12, opacity: 0.7, margin: '0 0 10px', color: mWhite }}>We'll clear your place and sell everything.</p>
          <MButton variant="destructive" size="sm" iconRight={<MChevRight size={14} stroke={mWhite} />}>
            Book a pickup
          </MButton>
        </div>
      </div>
    </div>
  );
}
