// muvaz-item-page.jsx — Item detail (2 variations) + sheets
// Depends on muvaz-ui.jsx

const ITEM_DATA = {
  title: 'Velvet armchair',
  price: 120,
  condition: 'Like new',
  distance: '0.8 km away',
  location: 'Kreuzberg',
  rating: 4.8,
  reviews: 12,
  description: 'Beautiful vintage-style velvet armchair in excellent condition. Minimal use, no stains or damage. Perfect for a reading nook or living room. Smoke-free home. Dimensions: 80×75×90cm.',
  tags: ['Furniture', 'Living room', 'Vintage'],
};

const IMG_BGs = [
  'linear-gradient(150deg,#d4d4d8 0%,#b8b8bc 100%)',
  'linear-gradient(150deg,#c8c8cc 0%,#a8a8ac 100%)',
  'linear-gradient(150deg,#dcdce0 0%,#c0c0c4 100%)',
  'linear-gradient(150deg,#e0e0e4 0%,#c8c8cc 100%)',
];

// ── BottomSheet ───────────────────────────────────────────────
function BottomSheet({ open, onClose, title, children }) {
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.42)', zIndex:60, opacity:open?1:0, pointerEvents:open?'all':'none', transition:'opacity .25s' }} />
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:`translateX(-50%) translateY(${open?'0':'100%'})`, width:'100%', maxWidth:375, background:'#fff', borderRadius:'20px 20px 0 0', zIndex:70, transition:'transform .3s cubic-bezier(.4,0,.2,1)', paddingBottom:32 }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 8px' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:mBorder2 }} />
        </div>
        {title && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px 14px', borderBottom:`1px solid ${mBorder}` }}>
            <p style={{ fontFamily:mFont, fontSize:17, fontWeight:700, color:mText, margin:0 }}>{title}</p>
            <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
              <MClose size={18} stroke={mMuted} />
            </button>
          </div>
        )}
        <div style={{ padding:'20px 20px 0' }}>{children}</div>
      </div>
    </>
  );
}

// ── OfferSheet ────────────────────────────────────────────────
function OfferSheet({ price, open, onClose }) {
  const [offer, setOffer] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleClose = () => { onClose(); setTimeout(() => { setSubmitted(false); setOffer(''); }, 400); };

  if (submitted) {
    return (
      <BottomSheet open={open} onClose={handleClose} title="Offer sent">
        <div style={{ textAlign:'center', padding:'8px 0' }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:mAccentBg, border:`2px solid ${mAccent}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <MCheck size={26} stroke={mAccent} />
          </div>
          <p style={{ fontFamily:mFont, fontSize:18, fontWeight:700, color:mText, margin:'0 0 6px' }}>Offer submitted!</p>
          <p style={{ fontFamily:mFont, fontSize:14, color:mSubtext, margin:'0 0 24px', lineHeight:1.55 }}>We'll review your offer and get back to you within 24 hours.</p>
          <MButton full style={{ background:mAccent, color:'#fff', border:'none', height:48 }} onClick={handleClose}>Done</MButton>
        </div>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Make an offer">
      <p style={{ fontFamily:mFont, fontSize:13, color:mSubtext, margin:'0 0 16px', lineHeight:1.55 }}>
        Listed at <strong style={{ color:mText }}>£{price}</strong>. Enter your offer below.
      </p>
      <div style={{ display:'flex', alignItems:'center', height:54, borderRadius:mRadius, border:`1.5px solid ${mBorder2}`, overflow:'hidden', marginBottom:12, background:'#fafafa' }}>
        <span style={{ fontFamily:mFont, fontSize:22, fontWeight:700, padding:'0 12px 0 16px', color:mText }}>£</span>
        <div style={{ width:1, height:30, background:mBorder }} />
        <input type="number" value={offer} onChange={e => setOffer(e.target.value)} placeholder={String(Math.round(price * 0.85))}
          style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:22, fontWeight:700, padding:'0 16px', color:mText, background:'transparent' }} />
      </div>
      {offer && Number(offer) < price * 0.5 && (
        <p style={{ fontFamily:mFont, fontSize:12, color:'#71717a', margin:'0 0 10px' }}>Offers below 50% are unlikely to be accepted.</p>
      )}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {[0.7, 0.8, 0.9].map(f => {
          const v = String(Math.round(price * f));
          return (
            <button key={f} onClick={() => setOffer(v)} style={{ flex:1, height:36, borderRadius:mRadiusSm, border:`1px solid ${offer===v?mText:mBorder}`, background:offer===v?mText:'#fff', color:offer===v?'#fff':mSubtext, fontFamily:mFont, fontSize:13, fontWeight:500, cursor:'pointer' }}>
              £{Math.round(price * f)}
            </button>
          );
        })}
      </div>
      <MButton full style={{ background:mAccent, color:'#fff', border:'none', height:48 }} disabled={!offer||Number(offer)<=0} onClick={() => setSubmitted(true)}>Submit offer</MButton>
    </BottomSheet>
  );
}

// ── BuySheet ──────────────────────────────────────────────────
function BuySheet({ price, title, open, onClose }) {
  const fee = Math.round(price * 0.05 * 100) / 100;
  const total = (price + fee).toFixed(2);
  return (
    <BottomSheet open={open} onClose={onClose} title="Confirm purchase">
      <div style={{ display:'flex', gap:12, alignItems:'center', padding:14, borderRadius:mRadius, background:mMutedBg, marginBottom:18 }}>
        <div style={{ width:56, height:56, borderRadius:10, background:IMG_BGs[0], flexShrink:0 }} />
        <div style={{ flex:1 }}>
          <p style={{ fontFamily:mFont, fontSize:14, fontWeight:600, margin:0 }}>{title}</p>
          <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, margin:'2px 0 0' }}>Like new · Kreuzberg</p>
        </div>
        <p style={{ fontFamily:mFont, fontSize:18, fontWeight:800, color:mText, margin:0 }}>£{price}</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
        {[['Item price',`£${price}`],['muvaz fee (5%)',`£${fee.toFixed(2)}`],['Delivery','Free']].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:mFont, fontSize:14, color:mSubtext }}>{k}</span>
            <span style={{ fontFamily:mFont, fontSize:14, color:k==='Delivery'?mAccent:mText }}>{v}</span>
          </div>
        ))}
        <MSeparator />
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText }}>Total</span>
          <span style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText }}>£{total}</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, padding:'12px 14px', borderRadius:mRadius, background:mAccentBg, border:`1px solid rgba(24,24,27,0.10)`, marginBottom:20 }}>
        <MCheck size={15} stroke={mAccent} style={{ flexShrink:0, marginTop:1 }} />
        <p style={{ fontFamily:mFont, fontSize:13, color:mSubtext, margin:0, lineHeight:1.5 }}>muvaz handles pickup & delivery. You'll never meet the seller.</p>
      </div>
      <MButton full style={{ height:50, background:mAccent, color:'#fff', border:'none', fontSize:16, fontWeight:700 }} onClick={onClose}>Pay £{total}</MButton>
    </BottomSheet>
  );
}

// ── Shared item info block ────────────────────────────────────
function ItemInfoBlock({ item, showThumbs, activeImg, setActiveImg }) {
  return (
    <div style={{ padding:'10px 20px 0' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:10 }}>
        <div>
          <MBadge variant="brand" style={{ marginBottom:8 }}>{item.condition}</MBadge>
          <h1 style={{ fontFamily:mFont, fontSize:24, fontWeight:900, color:mText, letterSpacing:'-0.5px', lineHeight:1.15, margin:0 }}>{item.title}</h1>
        </div>
        <p style={{ fontFamily:mFont, fontSize:30, fontWeight:900, color:mText, margin:'18px 0 0', letterSpacing:'-0.5px', flexShrink:0 }}>£{item.price}</p>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
        <span style={{ display:'flex', alignItems:'center', gap:4 }}>
          <MPin size={13} stroke={mMuted} />
          <span style={{ fontFamily:mFont, fontSize:13, color:mMuted }}>{item.distance}</span>
        </span>
        <span style={{ display:'flex', alignItems:'center', gap:4 }}>
          <MStar size={13} />
          <span style={{ fontFamily:mFont, fontSize:13, fontWeight:600, color:mText }}>{item.rating}</span>
          <span style={{ fontFamily:mFont, fontSize:13, color:mMuted }}>({item.reviews} reviews)</span>
        </span>
      </div>
      <MSeparator style={{ marginBottom:16 }} />
      {showThumbs && (
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {IMG_BGs.map((bg,i) => (
            <div key={i} onClick={() => setActiveImg(i)} style={{ width:68, height:60, borderRadius:10, background:bg, border:i===activeImg?`2.5px solid ${mText}`:`1.5px solid ${mBorder}`, cursor:'pointer', flexShrink:0 }} />
          ))}
        </div>
      )}
      {showThumbs && <MSeparator style={{ marginBottom:20 }} />}
      <h3 style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:'0 0 8px' }}>About this item</h3>
      <p style={{ fontFamily:mFont, fontSize:14, color:mSubtext, lineHeight:1.65, margin:'0 0 16px' }}>{item.description}</p>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
        {item.tags.map(t => <MBadge key={t} variant="secondary">{t}</MBadge>)}
      </div>
      <MSeparator style={{ marginBottom:20 }} />
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderRadius:mRadiusLg, background:mMutedBg, marginBottom:16 }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:mText, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:mFont, fontWeight:800, fontSize:17, flexShrink:0 }}>m.</div>
        <div style={{ flex:1 }}>
          <p style={{ fontFamily:mFont, fontSize:14, fontWeight:700, color:mText, margin:0 }}>Sold by muvaz</p>
          <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, margin:'2px 0 0' }}>Vetted · anonymous · secure</p>
        </div>
        <MBadge variant="brand">Verified</MBadge>
      </div>
      <div style={{ display:'flex', gap:8, padding:'12px 14px', borderRadius:mRadius, background:mAccentBg, border:`1px solid rgba(24,24,27,0.10)`, marginBottom:24 }}>
        <MCheck size={15} stroke={mAccent} style={{ flexShrink:0, marginTop:1 }} />
        <p style={{ fontFamily:mFont, fontSize:13, color:mSubtext, margin:0, lineHeight:1.5 }}>You'll never meet the seller. muvaz handles pickup, vetting, and delivery.</p>
      </div>
    </div>
  );
}

// ── ItemPageV1 — Cinematic full-bleed, text over gradient ─────
const ITEM_IMGS = [
  'linear-gradient(160deg,#2a3828 0%,#1a2a1e 45%,#0d1a10 100%)',
  'linear-gradient(160deg,#1e2a38 0%,#121e2c 45%,#080e18 100%)',
  'linear-gradient(160deg,#38281a 0%,#2a1a0e 45%,#180e08 100%)',
  'linear-gradient(160deg,#282838 0%,#1a1a2a 45%,#0e0e18 100%)',
];

function ItemPageV1({ onBack }) {
  const [activeImg, setActiveImg] = React.useState(0);
  const [saved, setSaved]         = React.useState(false);
  const [showOffer, setShowOffer] = React.useState(false);
  const [showBuy, setShowBuy]     = React.useState(false);

  return (
    <div style={{ minHeight:'100vh', background:'#0d0d0d' }}>

      {/* ── Hero image with overlay ── */}
      <div style={{
        position:'relative', width:'100%', height:'78vh', minHeight:520,
        background:ITEM_IMGS[activeImg], transition:'background .4s',
        overflow:'hidden',
      }}>
        {/* Camera placeholder watermark */}
        <div style={{ position:'absolute', top:'38%', left:'50%', transform:'translate(-50%,-50%)', opacity:0.08, pointerEvents:'none' }}>
          <MCamera size={64} stroke="#fff" />
        </div>

        {/* Image dot indicators — top centre */}
        <div style={{ position:'absolute', top:56, left:'50%', transform:'translateX(-50%)', display:'flex', gap:5, zIndex:5 }}>
          {ITEM_IMGS.map((_,i) => (
            <div key={i} onClick={() => setActiveImg(i)} style={{
              width:i===activeImg?20:6, height:6, borderRadius:3,
              background:i===activeImg?'#fff':'rgba(255,255,255,0.4)',
              transition:'width .2s', cursor:'pointer',
            }} />
          ))}
        </div>

        {/* Back button */}
        <button onClick={onBack} style={{
          position:'absolute', top:48, left:16, zIndex:10,
          width:38, height:38, borderRadius:'50%',
          background:'rgba(0,0,0,0.45)', backdropFilter:'blur(8px)',
          border:'1px solid rgba(255,255,255,0.15)',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <MChevLeft size={20} stroke="#fff" />
        </button>

        {/* Save button */}
        <button onClick={() => setSaved(s=>!s)} style={{
          position:'absolute', top:48, right:16, zIndex:10,
          width:38, height:38, borderRadius:'50%',
          background:'rgba(0,0,0,0.45)', backdropFilter:'blur(8px)',
          border:'1px solid rgba(255,255,255,0.15)',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <MHeart size={17} stroke={saved?mAccent:'#fff'} fill={saved?mAccent:'none'} sw={2} />
        </button>

        {/* Bottom gradient */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 38%, transparent 70%)',
          pointerEvents:'none',
        }} />

        {/* Overlay content */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 20px 20px' }}>
          {/* Badges row */}
          <div style={{ display:'flex', gap:7, marginBottom:12, flexWrap:'wrap' }}>
            <span style={{ fontFamily:mFont, fontSize:11, fontWeight:600, color:'#fff', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:999, padding:'3px 10px' }}>
              {ITEM_DATA.condition}
            </span>
            {ITEM_DATA.tags.map(t => (
              <span key={t} style={{ fontFamily:mFont, fontSize:11, fontWeight:500, color:'rgba(255,255,255,0.75)', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:999, padding:'3px 10px' }}>
                {t}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily:mFont, fontSize:28, fontWeight:900, color:'#fff', margin:'0 0 8px', lineHeight:1.1, letterSpacing:'-0.5px' }}>
            {ITEM_DATA.title}
          </h1>

          {/* Description snippet */}
          <p style={{ fontFamily:mFont, fontSize:13, color:'rgba(255,255,255,0.7)', margin:'0 0 14px', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {ITEM_DATA.description}
          </p>

          {/* Price + distance row */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <span style={{ fontFamily:mFont, fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-0.5px' }}>£{ITEM_DATA.price}</span>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}>
              <MPin size={12} stroke="rgba(255,255,255,0.55)" />
              <span style={{ fontFamily:mFont, fontSize:13, color:'rgba(255,255,255,0.55)' }}>{ITEM_DATA.distance}</span>
            </span>
          </div>

          {/* CTA buttons */}
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setShowOffer(true)} style={{
              flex:1, height:50, borderRadius:999,
              background:'#fff', border:'none', cursor:'pointer',
              fontFamily:mFont, fontSize:15, fontWeight:700, color:mText,
            }}>Make an offer</button>
            <button onClick={() => setShowBuy(true)} style={{
              flex:1, height:50, borderRadius:999,
              background:mAccent, border:'none', cursor:'pointer',
              fontFamily:mFont, fontSize:15, fontWeight:700, color:'#fff',
            }}>Buy · £{ITEM_DATA.price}</button>
          </div>
        </div>
      </div>

      {/* ── Details card slides up ── */}
      <div style={{ background:'#fff', borderRadius:'22px 22px 0 0', marginTop:-22, position:'relative', zIndex:2, paddingBottom:48 }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:mBorder2 }} />
        </div>

        {/* Thumbnail strip */}
        <div className="scroll-row" style={{ display:'flex', gap:8, padding:'4px 20px 16px', overflowX:'auto' }}>
          {ITEM_IMGS.map((bg,i) => (
            <div key={i} onClick={() => setActiveImg(i)} style={{
              width:66, height:54, borderRadius:10, background:bg, flexShrink:0,
              border:i===activeImg?`2.5px solid ${mText}`:`1.5px solid ${mBorder}`,
              cursor:'pointer', transition:'border .15s',
            }} />
          ))}
        </div>

        <MSeparator />

        <div style={{ padding:'20px 20px 0' }}>
          {/* About */}
          <h3 style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:'0 0 8px' }}>About this item</h3>
          <p style={{ fontFamily:mFont, fontSize:14, color:mSubtext, lineHeight:1.65, margin:'0 0 20px' }}>{ITEM_DATA.description}</p>

          <MSeparator style={{ marginBottom:20 }} />

          {/* Sold by muvaz */}
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderRadius:mRadiusLg, background:mMutedBg, marginBottom:14 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:mText, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:mFont, fontWeight:800, fontSize:17, flexShrink:0 }}>m.</div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:mFont, fontSize:14, fontWeight:700, color:mText, margin:0 }}>Sold by muvaz</p>
              <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, margin:'2px 0 0' }}>Vetted · anonymous · secure</p>
            </div>
            <MBadge variant="brand">Verified</MBadge>
          </div>

          <div style={{ display:'flex', gap:8, padding:'12px 14px', borderRadius:mRadius, background:mAccentBg, border:`1px solid rgba(24,24,27,0.10)` }}>
            <MCheck size={15} stroke={mAccent} />
            <p style={{ fontFamily:mFont, fontSize:13, color:mSubtext, margin:0, lineHeight:1.5 }}>You'll never meet the seller. muvaz handles pickup, vetting, and delivery.</p>
          </div>
        </div>
      </div>

      <OfferSheet price={ITEM_DATA.price} open={showOffer} onClose={() => setShowOffer(false)} />
      <BuySheet  price={ITEM_DATA.price} title={ITEM_DATA.title} open={showBuy} onClose={() => setShowBuy(false)} />
    </div>
  );
}

// ── ItemPageV2 — Sticky header, editorial ─────────────────────
function ItemPageV2({ onBack }) {
  const [activeImg, setActiveImg] = React.useState(0);
  const [saved, setSaved] = React.useState(false);
  const [showOffer, setShowOffer] = React.useState(false);
  const [showBuy, setShowBuy] = React.useState(false);

  return (
    <div style={{ minHeight:'100vh', background:'#fff', paddingBottom:88 }}>
      {/* Sticky nav bar */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'#fff', borderBottom:`1px solid ${mBorder}`, display:'flex', alignItems:'center', height:52, padding:'0 12px', gap:8 }}>
        <button onClick={onBack} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', padding:6, borderRadius:mRadiusSm }}>
          <MChevLeft size={20} stroke={mText} />
        </button>
        <span style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ITEM_DATA.title}</span>
        <button onClick={() => setSaved(s=>!s)} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', padding:6, borderRadius:mRadiusSm }}>
          <MHeart size={20} stroke={saved?mAccent:mText} fill={saved?mAccent:'none'} sw={1.75} />
        </button>
      </div>

      {/* Main image */}
      <div style={{ position:'relative', width:'100%', height:290, background:IMG_BGs[activeImg], transition:'background .3s' }}>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:6, opacity:0.2 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.1em', color:'#333' }}>photo {activeImg+1} of 4</span>
        </div>
        <MBadge variant="brand" style={{ position:'absolute', bottom:12, left:12 }}>{ITEM_DATA.condition}</MBadge>
      </div>

      {/* Thumbnail strip */}
      <div style={{ display:'flex', gap:8, padding:'12px 16px', borderBottom:`1px solid ${mBorder}`, overflowX:'auto' }}>
        {IMG_BGs.map((bg,i) => (
          <div key={i} onClick={() => setActiveImg(i)} style={{ width:62, height:52, borderRadius:8, background:bg, border:i===activeImg?`2.5px solid ${mText}`:`1px solid ${mBorder}`, cursor:'pointer', flexShrink:0 }} />
        ))}
      </div>

      {/* Price breakdown widget */}
      <div style={{ padding:'20px 20px 0' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:10 }}>
          <h1 style={{ fontFamily:mFont, fontSize:22, fontWeight:900, color:mText, letterSpacing:'-0.4px', lineHeight:1.2, margin:0, flex:1 }}>{ITEM_DATA.title}</h1>
          <p style={{ fontFamily:mFont, fontSize:28, fontWeight:900, color:mAccent, margin:0, letterSpacing:'-0.5px', flexShrink:0 }}>£{ITEM_DATA.price}</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}>
            <MPin size={13} stroke={mMuted} />
            <span style={{ fontFamily:mFont, fontSize:13, color:mMuted }}>{ITEM_DATA.distance}</span>
          </span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}>
            <MStar size={13} />
            <span style={{ fontFamily:mFont, fontSize:13, fontWeight:600, color:mText }}>{ITEM_DATA.rating}</span>
            <span style={{ fontFamily:mFont, fontSize:13, color:mMuted }}>({ITEM_DATA.reviews})</span>
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderRadius:mRadius, border:`1px solid ${mBorder}`, overflow:'hidden', marginBottom:20 }}>
          {[['£120','Item price'],[`£${(ITEM_DATA.price*0.05).toFixed(0)}`,'muvaz fee'],['Free','Delivery']].map(([val,label],i) => (
            <div key={label} style={{ padding:'12px 0', textAlign:'center', borderRight:i<2?`1px solid ${mBorder}`:'none' }}>
              <p style={{ fontFamily:mFont, fontSize:16, fontWeight:800, color:i===0?mText:mSubtext, margin:'0 0 2px' }}>{val}</p>
              <p style={{ fontFamily:mFont, fontSize:11, color:mMuted, margin:0 }}>{label}</p>
            </div>
          ))}
        </div>
        <MSeparator style={{ marginBottom:20 }} />
        <h3 style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:'0 0 8px' }}>About this item</h3>
        <p style={{ fontFamily:mFont, fontSize:14, color:mSubtext, lineHeight:1.65, margin:'0 0 16px' }}>{ITEM_DATA.description}</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
          {ITEM_DATA.tags.map(t => <MBadge key={t} variant="secondary">{t}</MBadge>)}
        </div>
        <MSeparator style={{ marginBottom:20 }} />
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderRadius:mRadiusLg, background:mMutedBg, marginBottom:20 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:mText, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:mFont, fontWeight:800, fontSize:17, flexShrink:0 }}>m.</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:mFont, fontSize:14, fontWeight:700, color:mText, margin:0 }}>Sold by muvaz</p>
            <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, margin:'2px 0 0' }}>Vetted · anonymous · secure</p>
          </div>
          <MBadge variant="brand">Verified</MBadge>
        </div>
      </div>

      {/* Sticky CTAs */}
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:375, padding:'12px 20px 28px', background:'#fff', borderTop:`1px solid ${mBorder}`, display:'flex', gap:10, zIndex:10 }}>
        <MButton variant="outline" style={{ flex:1 }} onClick={() => setShowOffer(true)}>Make offer</MButton>
        <MButton style={{ flex:2, background:mAccent, color:'#fff', border:'none', fontWeight:600 }} onClick={() => setShowBuy(true)}>Buy now · £{ITEM_DATA.price}</MButton>
      </div>
      <OfferSheet price={ITEM_DATA.price} open={showOffer} onClose={() => setShowOffer(false)} />
      <BuySheet price={ITEM_DATA.price} title={ITEM_DATA.title} open={showBuy} onClose={() => setShowBuy(false)} />
    </div>
  );
}

Object.assign(window, { BottomSheet, OfferSheet, BuySheet, ItemPageV1, ItemPageV2 });
