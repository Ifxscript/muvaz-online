// ── Design tokens ─────────────────────────────────────────────
export const mBg        = '#fafafa';
export const mWhite     = '#ffffff';
export const mBorder    = '#e4e4e7';
export const mBorder2   = '#d4d4d8';
export const mText      = '#18181b';
export const mSubtext   = '#52525b';
export const mMuted     = '#71717a';
export const mMutedBg   = '#f4f4f5';
export const mMutedBg2  = '#e4e4e7';
export const mAccent    = '#18181b';
export const mAccentHov = '#3f3f46';
export const mAccentBg  = '#f4f4f5';
export const mRing      = 'rgba(24,24,27,0.15)';
export const mRadius    = '8px';
export const mRadiusSm  = '6px';
export const mRadiusLg  = '12px';
export const mShadow    = '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)';
export const mShadowMd  = '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)';
export const mFont      = "'Inter', system-ui, sans-serif";
export const mFontMono  = "'JetBrains Mono', 'Fira Mono', monospace";

// ── Base icon ─────────────────────────────────────────────────
export function MIco({ d, size = 18, stroke = mText, sw = 1.75, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block' }}>
      {d}
    </svg>
  );
}

// ── Icons ─────────────────────────────────────────────────────
export const MSearch    = p => <MIco {...p} d={<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>} />;
export const MHeart     = p => <MIco {...p} d={<path d="M12 20s-7-4.5-9.2-9C1.3 8 3 4.5 6.3 4.5c2 0 3.2 1.3 3.7 2.2.5-.9 1.7-2.2 3.7-2.2C20 4.5 21.7 8 21.2 11 19 15.5 12 20 12 20z" />} />;
export const MPin       = p => <MIco {...p} d={<><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>} />;
export const MChevDown  = p => <MIco {...p} d={<path d="M6 9l6 6 6-6" />} />;
export const MChevRight = p => <MIco {...p} d={<path d="M9 6l6 6-6 6" />} />;
export const MChevLeft  = p => <MIco {...p} d={<path d="M15 18l-6-6 6-6" />} />;
export const MMenu      = p => <MIco {...p} d={<><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>} />;
export const MClose     = p => <MIco {...p} d={<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>} />;
export const MGrid2     = p => <MIco {...p} d={<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>} />;
export const MGrid1     = p => <MIco {...p} d={<><rect x="3" y="4" width="18" height="6" rx="1" /><rect x="3" y="14" width="18" height="6" rx="1" /></>} />;
export const MCamera    = p => <MIco {...p} d={<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>} />;
export const MPlus      = p => <MIco {...p} d={<><path d="M12 5v14" /><path d="M5 12h14" /></>} />;
export const MCheck     = p => <MIco {...p} d={<path d="M20 6L9 17l-5-5" />} />;
export const MHome      = p => <MIco {...p} d={<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>} />;
export const MTag       = p => <MIco {...p} d={<><path d="M20.5 13.5L13 21l-9-9V4h8z" /><circle cx="8" cy="8" r="1.5" fill={mText} stroke="none" /></>} />;
export const MInfo      = p => <MIco {...p} d={<><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></>} />;
export const MUser      = p => <MIco {...p} d={<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>} />;
export const MUpload    = p => <MIco {...p} d={<><path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>} />;
export const MStar      = p => <MIco fill={mAccent} stroke="none" {...p} d={<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />} />;
export const MPen       = p => <MIco {...p} d={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>} />;
export const MTrash     = p => <MIco {...p} d={<><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>} />;
export const MBell      = p => <MIco {...p} d={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>} />;

export function MGoogle() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ── MButton ───────────────────────────────────────────────────
export function MButton({ children, variant = 'default', size = 'default', disabled, icon, iconRight, full, onClick, style }) {
  const pads    = { default: '0 16px', sm: '0 12px', lg: '0 24px', icon: '0' };
  const heights = { default: 40, sm: 36, lg: 44, icon: 40 };
  const fss     = { default: 14, sm: 13, lg: 15, icon: 16 };
  const skins   = {
    default:     { background: mText,    color: mWhite,  border: 'none' },
    destructive: { background: mAccent,  color: mWhite,  border: 'none' },
    outline:     { background: mWhite,   color: mText,   border: `1px solid ${mBorder}` },
    secondary:   { background: mMutedBg, color: mText,   border: 'none' },
    ghost:       { background: 'transparent', color: mText, border: 'none' },
    link:        { background: 'transparent', color: mText, border: 'none', textDecoration: 'underline', textUnderlineOffset: 4 },
  };
  return (
    <button disabled={disabled} onClick={onClick} style={{
      fontFamily: mFont, fontSize: fss[size], fontWeight: 500,
      height: heights[size],
      width: size === 'icon' ? heights[size] : full ? '100%' : 'auto',
      minWidth: size === 'icon' ? heights[size] : undefined,
      padding: pads[size], borderRadius: mRadiusSm,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'opacity .15s, background .15s',
      opacity: disabled ? 0.5 : 1,
      boxSizing: 'border-box', letterSpacing: '0.01em',
      ...skins[variant], ...style,
    }}>
      {icon}{children}{iconRight}
    </button>
  );
}

// ── MInput ────────────────────────────────────────────────────
export function MInput({ label, placeholder, value, type = 'text', state = 'default', hint, prefix, suffix, style }) {
  const borderColor = state === 'error' ? mAccent : state === 'focus' ? mText : mBorder;
  const shadow      = state === 'focus' ? `0 0 0 3px ${mRing}` : 'none';
  return (
    <div style={{ ...style }}>
      {label && <label style={{ display: 'block', fontFamily: mFont, fontSize: 13, fontWeight: 500, color: mText, marginBottom: 6 }}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px', borderRadius: mRadiusSm, border: `1px solid ${borderColor}`, background: mWhite, boxShadow: shadow, transition: 'box-shadow .15s, border-color .15s' }}>
        {prefix && <span style={{ display: 'flex', alignItems: 'center', color: mMuted }}>{prefix}</span>}
        <span style={{ flex: 1, fontFamily: mFont, fontSize: 14, color: value ? mText : '#a1a1aa' }}>
          {value || placeholder}
          {state === 'focus' && <span style={{ borderLeft: `2px solid ${mText}`, marginLeft: 1, height: 16, display: 'inline-block', verticalAlign: 'text-bottom' }} />}
        </span>
        {suffix && <span style={{ display: 'flex', alignItems: 'center', color: mMuted }}>{suffix}</span>}
      </div>
      {hint && <p style={{ fontFamily: mFont, fontSize: 12, color: state === 'error' ? mAccent : mMuted, margin: '4px 0 0' }}>{hint}</p>}
    </div>
  );
}

// ── MTextarea ─────────────────────────────────────────────────
export function MTextarea({ label, placeholder, value, rows = 3, count, max, style }) {
  return (
    <div style={{ ...style }}>
      {label && <label style={{ display: 'block', fontFamily: mFont, fontSize: 13, fontWeight: 500, color: mText, marginBottom: 6 }}>{label}</label>}
      <div style={{ padding: '10px 12px', borderRadius: mRadiusSm, border: `1px solid ${mBorder}`, background: mWhite, minHeight: rows * 24 + 20 }}>
        <span style={{ fontFamily: mFont, fontSize: 14, color: value ? mText : '#a1a1aa', lineHeight: 1.55 }}>{value || placeholder}</span>
      </div>
      {count != null && <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: '4px 0 0', textAlign: 'right' }}>{count}/{max}</p>}
    </div>
  );
}

// ── MBadge ────────────────────────────────────────────────────
export function MBadge({ children, variant = 'secondary', icon, style }) {
  const skins = {
    default:     { background: mText,    color: mWhite,   border: 'none' },
    secondary:   { background: mMutedBg, color: mSubtext, border: 'none' },
    destructive: { background: mAccent,  color: mWhite,   border: 'none' },
    outline:     { background: 'transparent', color: mText, border: `1px solid ${mBorder}` },
    brand:       { background: mAccentBg, color: mAccent, border: `1px solid ${mAccent}` },
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: mFont, fontSize: 11, fontWeight: 500, letterSpacing: '0.03em', padding: '2px 8px', borderRadius: 999, ...skins[variant], ...style }}>
      {icon}{children}
    </span>
  );
}

// ── MSegmented ────────────────────────────────────────────────
export function MSegmented({ options, active = 0, style }) {
  return (
    <div style={{ display: 'inline-flex', padding: 3, borderRadius: mRadius, border: `1px solid ${mBorder}`, background: mMutedBg, gap: 2, ...style }}>
      {options.map((option, index) => (
        <span key={option} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: mFont, fontSize: 13, fontWeight: index === active ? 500 : 400, padding: '5px 14px', borderRadius: `calc(${mRadius} - 2px)`, background: index === active ? mWhite : 'transparent', color: index === active ? mText : mMuted, boxShadow: index === active ? mShadow : 'none', transition: 'background .12s' }}>
          {option}
        </span>
      ))}
    </div>
  );
}

// ── MSearchBar ────────────────────────────────────────────────
export function MSearchBar({ value, grid = 2, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: mText, ...style }}>
      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: mRadiusSm }}>
        <MChevLeft size={20} stroke="rgba(255,255,255,0.85)" />
      </button>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 12px', borderRadius: mRadiusSm, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <MSearch size={15} stroke="rgba(255,255,255,0.6)" />
        <span style={{ fontFamily: mFont, fontSize: 14, color: value ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)' }}>{value || 'Search anything…'}</span>
      </div>
      <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.2)', borderRadius: mRadiusSm, overflow: 'hidden' }}>
        {[2, 1].map(g => (
          <button key={g} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 36, background: grid === g ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', cursor: 'pointer' }}>
            {g === 2 ? <MGrid2 size={16} stroke={grid === 2 ? '#fff' : 'rgba(255,255,255,0.5)'} /> : <MGrid1 size={16} stroke={grid === 1 ? '#fff' : 'rgba(255,255,255,0.5)'} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── MUploadImage ──────────────────────────────────────────────
export function MUploadImage({ state = 'empty', style }) {
  if (state === 'filled') {
    return (
      <div style={{ display: 'flex', gap: 8, ...style }}>
        <div style={{ position: 'relative', width: 90, height: 90, borderRadius: mRadius, border: `1px solid ${mBorder}`, background: mMutedBg, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #e4e4e7 0%, #d4d4d8 100%)' }} />
          <span style={{ position: 'absolute', bottom: 4, left: 4, fontFamily: mFont, fontSize: 9, fontWeight: 600, background: mText, color: mWhite, padding: '2px 6px', borderRadius: 4 }}>COVER</span>
          <button style={{ position: 'absolute', top: 3, right: 3, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MClose size={10} stroke={mWhite} />
          </button>
        </div>
        {[1, 2].map(i => (
          <div key={i} style={{ width: 90, height: 90, borderRadius: mRadius, border: `1px solid ${mBorder}`, background: 'linear-gradient(135deg, #e4e4e7 0%, #d4d4d8 100%)' }} />
        ))}
        <div style={{ width: 90, height: 90, borderRadius: mRadius, border: `1.5px dashed ${mBorder}`, background: mWhite, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: mMuted, cursor: 'pointer' }}>
          <MPlus size={18} stroke={mMuted} />
          <span style={{ fontFamily: mFont, fontSize: 10, fontWeight: 500 }}>Add</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ borderRadius: mRadiusLg, border: `1.5px dashed ${mBorder}`, background: mWhite, padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', cursor: 'pointer', ...style }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: mMutedBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MCamera size={22} stroke={mMuted} />
      </div>
      <div>
        <p style={{ fontFamily: mFont, fontSize: 15, fontWeight: 500, margin: '0 0 2px', color: mText }}>Upload photos</p>
        <p style={{ fontFamily: mFont, fontSize: 13, color: mMuted, margin: 0 }}>Up to 8 · first is cover</p>
      </div>
      <p style={{ fontFamily: mFont, fontSize: 11, color: '#a1a1aa', margin: 0 }}>JPG, PNG up to 10MB each</p>
    </div>
  );
}

// ── MCard ─────────────────────────────────────────────────────
export function MCard({ children, style, pad = '20px' }) {
  return (
    <div style={{ background: mWhite, border: `1px solid ${mBorder}`, borderRadius: mRadius, boxShadow: mShadow, padding: pad, ...style }}>
      {children}
    </div>
  );
}

// ── MSeparator ────────────────────────────────────────────────
export function MSeparator({ style }) {
  return <div style={{ height: 1, background: mBorder, ...style }} />;
}
