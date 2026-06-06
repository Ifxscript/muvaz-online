// muvaz.online — UI blocks (shadcn-style)
// Depends on muvaz-ui.jsx being loaded first.

// ── LandingHeader ─────────────────────────────────────────────
function LandingHeader({ onMenu, style }) {
  return (
    <div style={{ background: mWhite, borderBottom: `1px solid ${mBorder}`, ...style }}>
      {/* promise strip */}
      <div style={{ background: mText, color: mWhite, fontFamily: mFont, fontSize: 11, fontWeight: 500, padding: '6px 16px', display: 'flex', justifyContent: 'center', gap: 16, letterSpacing: '0.03em' }}>
        <span>We pick up</span>
        <span style={{ opacity: 0.35 }}>·</span>
        <span>We vet buyers</span>
        <span style={{ opacity: 0.35 }}>·</span>
        <span style={{ color: mAccentBg }}>You never meet a stranger</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 52 }}>
        {/* wordmark */}
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px', color: mText }}>
          muvaz<span style={{ color: mAccent }}>.</span>
        </span>
        <span style={{ marginLeft: 8, fontFamily: mFont, fontSize: 11, fontWeight: 500, color: mMuted, letterSpacing: '0.04em', alignSelf: 'flex-end', paddingBottom: 14 }}>BERLIN</span>
        <button onClick={onMenu} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, color: mText, borderRadius: mRadiusSm }}>
          <MMenu size={22} />
        </button>
      </div>
    </div>
  );
}

// ── NavDrawer ─────────────────────────────────────────────────
function NavDrawer({ active = 'Home', style }) {
  const items = [
    { label: 'Home',              icon: <MHome size={18} /> },
    { label: 'Items page',        icon: <MSearch size={18} /> },
    { label: 'List an item',      icon: <MTag size={18} /> },
    { label: 'Sign in / Sign up', icon: <MUser size={18} /> },
    { label: 'About',             icon: <MInfo size={18} /> },
  ];
  return (
    <div style={{ width: 280, background: mWhite, borderRight: `1px solid ${mBorder}`, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 16px rgba(0,0,0,0.06)', ...style }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', height: 56, padding: '0 16px', borderBottom: `1px solid ${mBorder}` }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
          muvaz<span style={{ color: mAccent }}>.</span>
        </span>
        <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: mRadiusSm }}>
          <MClose size={18} stroke={mMuted} />
        </button>
      </div>
      {/* nav items */}
      <nav style={{ padding: '8px', flex: 1 }}>
        {items.map(it => {
          const on = it.label === active;
          return (
            <div key={it.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: mRadius, marginBottom: 2,
              background: on ? mMutedBg : 'transparent',
              color: on ? mText : mSubtext,
              fontFamily: mFont, fontSize: 15, fontWeight: on ? 500 : 400,
              cursor: 'pointer',
            }}>
              {React.cloneElement(it.icon, { stroke: on ? mText : mMuted })}
              {it.label}
              {on && <span style={{ marginLeft: 'auto' }}><MChevRight size={16} stroke={mMuted} /></span>}
            </div>
          );
        })}
      </nav>
      <MSeparator style={{ margin: '0 16px' }} />
      {/* CTA card */}
      <div style={{ padding: 16 }}>
        <div style={{ padding: 14, borderRadius: mRadius, background: mText, color: mWhite }}>
          <p style={{ fontFamily: mFont, fontWeight: 600, fontSize: 14, margin: '0 0 2px' }}>Moving out?</p>
          <p style={{ fontFamily: mFont, fontSize: 12, opacity: 0.7, margin: '0 0 10px' }}>We'll clear your place and sell everything.</p>
          <MButton variant="destructive" size="sm" iconRight={<MChevRight size={14} stroke={mWhite} />}>
            Book a pickup
          </MButton>
        </div>
      </div>
    </div>
  );
}

// ── ListCard ──────────────────────────────────────────────────
// Borderless card: fully-rounded image, text + optional rating below, black chevron
// Extra seller-mode props:
//   offerCount  — show green "N offers" badge top-left
//   paused      — show greyed "Paused" overlay
//   hideSave    — hide the heart button (seller's own listings)
//   onClick     — make the whole card a clickable button
function ListCard({ title, meta, tag, rating, reviews, saved, sold, offerCount, paused, hideSave, onClick, style }) {
  const Wrapper = onClick ? 'button' : 'div';
  const wrapperProps = onClick ? {
    onClick,
    style: {
      display: 'flex', flexDirection: 'column', gap: 0,
      background: 'transparent', border: 'none', padding: 0,
      cursor: 'pointer', textAlign: 'left', width: '100%',
      ...style,
    }
  } : { style: { display: 'flex', flexDirection: 'column', gap: 0, ...style } };

  return (
    <Wrapper {...wrapperProps}>
      {/* Fully-rounded image */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '68%', borderRadius: 16, background: 'linear-gradient(135deg, #d4d4d8 0%, #c4c4c8 100%)', overflow: 'hidden', flexShrink: 0 }}>
        {/* Condition tag */}
        {tag && (
          <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: mFont, fontSize: 11, fontWeight: 500, background: mWhite, color: mSubtext, border: `1px solid ${mBorder}`, borderRadius: 999, padding: '2px 8px', zIndex: 1 }}>{tag}</span>
        )}
        {/* Offer count badge (seller mode) */}
        {offerCount > 0 && (
          <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: mFont, fontSize: 10, fontWeight: 700, background: mAccent, color: mWhite, borderRadius: 999, padding: '2px 8px', zIndex: 1 }}>
            {offerCount} offer{offerCount > 1 ? 's' : ''}
          </span>
        )}
        {/* Sold overlay */}
        {sold && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <span style={{ background: mText, color: mWhite, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>Sold</span>
          </div>
        )}
        {/* Paused overlay (seller mode) */}
        {paused && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <span style={{ background: mText, color: mWhite, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>Paused</span>
          </div>
        )}
        {/* Save / heart button — hidden in seller mode */}
        {!hideSave && (
          <button style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', zIndex: 2 }}>
            <MHeart size={16} stroke={saved ? '#18181b' : mMuted} fill={saved ? '#18181b' : 'none'} sw={2} />
          </button>
        )}
      </div>

      {/* Text below — no box */}
      <div style={{ padding: '10px 4px 4px' }}>
        <p style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, margin: '0 0 2px', color: mText, lineHeight: 1.2 }}>{title}</p>
        <p style={{ fontFamily: mFont, fontSize: 13, color: mMuted, margin: '0 0 8px' }}>{meta}</p>
        {/* Rating row — only rendered when rating is provided */}
        {rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={mText} strokeWidth="1.75" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span style={{ fontFamily: mFont, fontSize: 13, fontWeight: 600, color: mText }}>{rating}</span>
            <span style={{ fontFamily: mFont, fontSize: 13, color: mMuted }}>{reviews} reviews</span>
            <button style={{ marginLeft: 'auto', background: mText, border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <MChevRight size={18} stroke={mWhite} sw={2.5} />
            </button>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

// ── TestimonialCard ───────────────────────────────────────────
function TestimonialCard({ quote, name, role, initial, style }) {
  return (
    <MCard style={{ ...style }}>
      {/* stars */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
        {[0,1,2,3,4].map(i => <MStar key={i} size={14} />)}
      </div>
      <p style={{ fontFamily: mFont, fontSize: 14.5, lineHeight: 1.55, margin: '0 0 16px', color: mText }}>"{quote}"</p>
      <MSeparator style={{ marginBottom: 14 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: mText, color: mWhite, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mFont, fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{initial}</div>
        <div>
          <p style={{ fontFamily: mFont, fontSize: 14, fontWeight: 500, margin: 0 }}>{name}</p>
          <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: 0 }}>{role}</p>
        </div>
      </div>
    </MCard>
  );
}

// ── HowItWorksCard ────────────────────────────────────────────
// Carousel card — vertical layout, icon on top, fixed width for horizontal scroll
function HowItWorksCard({ step, title, body, icon, style }) {
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

// ── AuthForm ──────────────────────────────────────────────────
function AuthForm({ style }) {
  return (
    <div style={{ padding: '28px 24px', background: mWhite, ...style }}>
      <p style={{ fontFamily: mFont, fontWeight: 700, fontSize: 24, margin: '0 0 4px', letterSpacing: '-0.3px' }}>Welcome back</p>
      <p style={{ fontFamily: mFont, fontSize: 14, color: mMuted, margin: '0 0 24px' }}>
        Sign in to <span style={{ fontWeight: 700 }}>muvaz<span style={{ color: mAccent }}>.</span></span> or create an account
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        <MInput label="Email" placeholder="you@email.com" />
        <MInput label="Password" placeholder="••••••••" suffix={<span style={{ fontFamily: mFont, fontSize: 11, fontWeight: 500, color: mAccent, cursor: 'pointer' }}>Show</span>} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <span style={{ fontFamily: mFont, fontSize: 13, color: mAccent, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>Forgot password?</span>
      </div>

      <MButton variant="default" full style={{ marginBottom: 8 }}>Sign in</MButton>
      <MButton variant="outline" full>Create account</MButton>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
        <MSeparator style={{ flex: 1 }} />
        <span style={{ fontFamily: mFont, fontSize: 12, color: mMuted, whiteSpace: 'nowrap' }}>Or continue with</span>
        <MSeparator style={{ flex: 1 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Google', icon: <MGoogle /> },
          { label: 'Facebook', icon: <span style={{ width: 16, height: 16, background: '#1877F2', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: mFont, fontWeight: 700, fontSize: 10, color: mWhite }}>f</span> },
          { label: 'Apple', icon: <span style={{ fontFamily: mFont, fontWeight: 700, fontSize: 14 }}></span> },
        ].map(s => (
          <MButton key={s.label} variant="outline" full icon={s.icon}>
            Continue with {s.label}
          </MButton>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  LandingHeader, NavDrawer, ListCard, TestimonialCard, HowItWorksCard, AuthForm,
});
