// muvaz-profile-page.jsx — Profile + My Advert management
// Anonymous marketplace: no reviews, no direct buyer/seller contact
// Depends on muvaz-ui.jsx, muvaz-blocks.jsx

// ── Edit icon (not in muvaz-ui) ───────────────────────────────
function MPen({ size = 18, stroke = mText }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink:0, display:'block' }}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function MTrash({ size = 18, stroke = mText }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink:0, display:'block' }}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
function MBell({ size = 18, stroke = mText }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink:0, display:'block' }}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ── Sample data ───────────────────────────────────────────────
const MY_ADVERTS = [
  {
    id: 1, title: 'Velvet armchair', price: '£120', condition: 'Like new',
    status: 'Active', views: 34, desc: 'Beautiful velvet armchair in excellent condition. Minor wear on base only.',
    offers: [
      { id: 1, amount: '£100', date: '2 days ago', status: 'pending' },
      { id: 2, amount: '£95',  date: '3 days ago', status: 'pending' },
    ],
  },
  {
    id: 2, title: 'IKEA Malm frame', price: '£40', condition: 'Good',
    status: 'Active', views: 18, desc: 'King size IKEA Malm bed frame, white. Dismantled and ready to go.',
    offers: [],
  },
  {
    id: 3, title: 'Mountain bike', price: '£85', condition: 'Used',
    status: 'Paused', views: 52, desc: '21-speed mountain bike. Some scratches but fully functional.',
    offers: [
      { id: 1, amount: '£70', date: '1 day ago', status: 'pending' },
    ],
  },
];

const MY_SOLD = [
  { title: 'Dining table, oak', meta: '£95 · Sold Apr 2026', condition: 'Good',     sold: true },
  { title: 'KitchenAid mixer',  meta: '£110 · Sold Mar 2026', condition: 'Like new', sold: true },
  { title: 'Brass floor lamp',  meta: '£35 · Sold Feb 2026',  condition: 'Good',     sold: true },
];

const MY_SAVED = [
  { title: 'Leather sofa',  meta: '£280 · Schöneberg', condition: 'Like new', saved: true },
  { title: 'Vintage desk',  meta: '£90 · Mitte',        condition: 'Good',     saved: true },
  { title: 'Road bike 54cm',meta: '£200 · Kreuzberg',   condition: 'Used',     saved: false },
];

const MY_PLACED_OFFERS = [];   // buyer has placed no offers — empty state per sketch

// ── Gradient image placeholder ─────────────────────────────────
function ImgPlaceholder({ style }) {
  return (
    <div style={{ background:'linear-gradient(135deg,#e4e4e7 0%,#d4d4d8 100%)', ...style }} />
  );
}

// ══════════════════════════════════════════════════════════════
// MyAdvertPage — shown when seller taps one of their listings
// ══════════════════════════════════════════════════════════════
function MyAdvertPage({ advert: initial, onBack, onNavigateUpload }) {
  const [advert, setAdvert]       = React.useState(initial);
  const [offers, setOffers]       = React.useState(initial.offers);
  const [editOpen, setEditOpen]   = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(initial.title);
  const [editPrice, setEditPrice] = React.useState(initial.price.replace('£',''));
  const [editDesc, setEditDesc]   = React.useState(initial.desc);
  const [toast, setToast]         = React.useState(null);

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const toggleStatus = () => {
    setAdvert(a => ({ ...a, status: a.status === 'Active' ? 'Paused' : 'Active' }));
    showToast(advert.status === 'Active' ? 'Advert paused' : 'Advert reactivated');
  };

  const handleOffer = (offerId, action) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
    showToast(action === 'accept' ? 'Offer accepted — we\'ll be in touch' : 'Offer declined');
  };

  const saveEdit = () => {
    setAdvert(a => ({ ...a, title: editTitle, price: '£' + editPrice, desc: editDesc }));
    setEditOpen(false);
    showToast('Changes saved');
  };

  return (
    <div style={{ minHeight:'100vh', background:'#fff' }}>

      {/* ── Header ── */}
      <div style={{
        position:'sticky', top:0, zIndex:20, background:'#fff',
        borderBottom:`1px solid ${mBorder}`,
        display:'flex', alignItems:'center', height:52, padding:'0 16px', gap:12
      }}>
        <button onClick={onBack} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', padding:6, borderRadius:mRadiusSm }}>
          <MChevLeft size={20} stroke={mText} />
        </button>
        <span style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, flex:1 }}>My advert</span>

        {/* Active / Paused pill toggle */}
        <button onClick={toggleStatus} style={{
          fontFamily:mFont, fontSize:12, fontWeight:600,
          padding:'5px 12px', borderRadius:999, cursor:'pointer',
          background: advert.status === 'Active' ? mAccentBg : mMutedBg,
          color:       advert.status === 'Active' ? mAccent  : mMuted,
          border:`1px solid ${advert.status === 'Active' ? 'rgba(24,24,27,0.15)' : mBorder}`,
          transition:'all .15s',
        }}>
          {advert.status}
        </button>
      </div>

      <div style={{ padding:'20px 20px 80px' }}>

        {/* ── Item preview card ── */}
        <div style={{
          display:'flex', gap:14, padding:16,
          borderRadius:mRadiusLg, border:`1px solid ${mBorder}`,
          background:'#fff', marginBottom:20,
        }}>
          <ImgPlaceholder style={{ width:84, height:84, borderRadius:mRadius, flexShrink:0 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{advert.title}</p>
            <p style={{ fontFamily:mFont, fontSize:20, fontWeight:900, color:mText, margin:'0 0 6px', letterSpacing:'-0.5px' }}>{advert.price}</p>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <MBadge variant="secondary">{advert.condition}</MBadge>
              <span style={{ fontFamily:mFont, fontSize:12, color:mMuted }}>{advert.views} views</span>
            </div>
          </div>
        </div>

        {/* ── Actions row ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:28 }}>
          {/* Edit */}
          <button onClick={() => setEditOpen(true)} style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            padding:'13px 0', borderRadius:mRadius, border:`1px solid ${mBorder}`,
            background:'#fff', cursor:'pointer', fontFamily:mFont, fontSize:14, fontWeight:500, color:mText,
          }}>
            <MPen size={16} stroke={mText} />
            Edit item
          </button>

          {/* Remove listing */}
          <button onClick={() => setDeleteOpen(true)} style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            padding:'13px 0', borderRadius:mRadius, border:`1px solid #e4e4e7`,
            background:'#ffffff', cursor:'pointer', fontFamily:mFont, fontSize:14, fontWeight:500, color:'#18181b',
          }}>
            <MTrash size={16} stroke="#18181b" />
            Remove
          </button>
        </div>

        {/* ── Offers received ── */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <h2 style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, margin:0 }}>Offers received</h2>
            {offers.length > 0 && (
              <span style={{
                background:mText, color:'#fff',
                fontFamily:mFont, fontSize:11, fontWeight:700,
                padding:'1px 7px', borderRadius:999
              }}>{offers.length}</span>
            )}
          </div>

          {offers.length === 0 ? (
            <div style={{
              padding:'36px 20px', textAlign:'center',
              borderRadius:mRadiusLg, border:`1.5px dashed ${mBorder}`,
              background:mMutedBg,
            }}>
              <p style={{ fontFamily:mFont, fontSize:14, fontWeight:500, color:mMuted, margin:'0 0 4px' }}>No offers yet</p>
              <p style={{ fontFamily:mFont, fontSize:13, color:'#a1a1aa', margin:0 }}>Buyer offers will appear here for you to accept or decline</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {offers.map(offer => (
                <div key={offer.id} style={{
                  padding:'16px', borderRadius:mRadius,
                  border:`1px solid ${mBorder}`, background:'#fff',
                }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                    <div>
                      <p style={{ fontFamily:mFont, fontSize:22, fontWeight:900, color:mText, margin:'0 0 2px', letterSpacing:'-0.5px' }}>{offer.amount}</p>
                      <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, margin:0 }}>Offered {offer.date}</p>
                    </div>
                    <MBadge variant="outline">Pending</MBadge>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => handleOffer(offer.id, 'accept')} style={{
                      flex:1, height:40, borderRadius:mRadiusSm, border:'none',
                      background:mAccent, color:'#fff',
                      fontFamily:mFont, fontSize:14, fontWeight:600, cursor:'pointer',
                    }}>Accept</button>
                    <button onClick={() => handleOffer(offer.id, 'decline')} style={{
                      flex:1, height:40, borderRadius:mRadiusSm, border:`1px solid ${mBorder}`,
                      background:'#fff', color:mSubtext,
                      fontFamily:mFont, fontSize:14, fontWeight:500, cursor:'pointer',
                    }}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Edit bottom sheet ── */}
      {editOpen && (
        <>
          <div onClick={() => setEditOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.42)', zIndex:60 }} />
          <div style={{
            position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
            width:'100%', maxWidth:375, background:'#fff',
            borderRadius:'20px 20px 0 0', zIndex:70, paddingBottom:36,
          }}>
            <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
              <div style={{ width:36, height:4, borderRadius:2, background:mBorder2 }} />
            </div>
            <div style={{ display:'flex', alignItems:'center', padding:'10px 20px 14px', borderBottom:`1px solid ${mBorder}` }}>
              <p style={{ fontFamily:mFont, fontSize:17, fontWeight:700, color:mText, margin:0, flex:1 }}>Edit item</p>
              <button onClick={() => setEditOpen(false)} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
                <MClose size={18} stroke={mMuted} />
              </button>
            </div>
            <div style={{ padding:'20px 20px 0', display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Title</label>
                <input
                  value={editTitle} onChange={e => setEditTitle(e.target.value)}
                  style={{ width:'100%', height:42, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, fontFamily:mFont, fontSize:14, color:mText, outline:'none', boxSizing:'border-box' }}
                />
              </div>
              <div>
                <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Price</label>
                <div style={{ display:'flex', alignItems:'center', height:42, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, gap:6 }}>
                  <span style={{ fontFamily:mFont, fontSize:14, color:mMuted }}>£</span>
                  <input
                    value={editPrice} onChange={e => setEditPrice(e.target.value)}
                    type="number"
                    style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Description</label>
                <textarea
                  value={editDesc} onChange={e => setEditDesc(e.target.value)}
                  rows={3}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, fontFamily:mFont, fontSize:14, color:mText, outline:'none', resize:'none', lineHeight:1.55, boxSizing:'border-box' }}
                />
              </div>
              <button onClick={saveEdit} style={{
                width:'100%', height:48, borderRadius:mRadiusSm, border:'none',
                background:mAccent, color:'#fff',
                fontFamily:mFont, fontSize:15, fontWeight:600, cursor:'pointer',
              }}>Save changes</button>
            </div>
          </div>
        </>
      )}

      {/* ── Remove confirm sheet ── */}
      {deleteOpen && (
        <>
          <div onClick={() => setDeleteOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.42)', zIndex:60 }} />
          <div style={{
            position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
            width:'100%', maxWidth:375, background:'#fff',
            borderRadius:'20px 20px 0 0', zIndex:70, paddingBottom:36,
          }}>
            <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
              <div style={{ width:36, height:4, borderRadius:2, background:mBorder2 }} />
            </div>
            <div style={{ padding:'20px 20px 0', textAlign:'center' }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'#f4f4f5', border:'1.5px solid #e4e4e7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <MTrash size={22} stroke="#18181b" />
              </div>
              <p style={{ fontFamily:mFont, fontSize:18, fontWeight:700, color:mText, margin:'0 0 8px' }}>Remove this advert?</p>
              <p style={{ fontFamily:mFont, fontSize:14, color:mSubtext, margin:'0 0 24px', lineHeight:1.55 }}>
                This listing will be taken down. Any pending offers will be declined automatically.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <button onClick={() => { setDeleteOpen(false); onBack(); }} style={{
                  width:'100%', height:48, borderRadius:mRadiusSm, border:'none',
                  background:'#18181b', color:'#fff',
                  fontFamily:mFont, fontSize:15, fontWeight:600, cursor:'pointer',
                }}>Yes, remove it</button>
                <button onClick={() => setDeleteOpen(false)} style={{
                  width:'100%', height:44, borderRadius:mRadiusSm, border:`1px solid ${mBorder}`,
                  background:'#fff', color:mText,
                  fontFamily:mFont, fontSize:14, fontWeight:500, cursor:'pointer',
                }}>Keep listing</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position:'fixed', bottom:32, left:'50%', transform:'translateX(-50%)',
          background:mText, color:'#fff',
          fontFamily:mFont, fontSize:13, fontWeight:500,
          padding:'10px 20px', borderRadius:999,
          boxShadow:mShadowMd, zIndex:100, whiteSpace:'nowrap',
          animation:'fadeInUp .2s ease',
        }}>{toast}</div>
      )}

      <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ProfilePage — main profile view matching the sketch
// ══════════════════════════════════════════════════════════════
function ProfilePage({ onNavigate }) {
  const [selectedAdvert, setSelectedAdvert] = React.useState(null);
  const [adverts, setAdverts]               = React.useState(MY_ADVERTS);

  // Sub-page: My Advert
  if (selectedAdvert) {
    return (
      <MyAdvertPage
        advert={selectedAdvert}
        onBack={() => setSelectedAdvert(null)}
        onNavigateUpload={() => { setSelectedAdvert(null); onNavigate('upload'); }}
      />
    );
  }

  const totalOffers = adverts.reduce((n, a) => n + a.offers.length, 0);

  return (
    <div style={{ minHeight:'100vh', background:'#fff' }}>

      {/* ── Header: Welcome back ── */}
      <div style={{
        position:'sticky', top:0, zIndex:20, background:'#fff',
        borderBottom:`1px solid ${mBorder}`,
        display:'flex', alignItems:'center',
        height:60, padding:'0 20px', gap:14,
      }}>
        {/* Avatar */}
        <div style={{
          width:40, height:40, borderRadius:'50%',
          background:mText, color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:mFont, fontWeight:800, fontSize:17, flexShrink:0,
        }}>N</div>

        {/* Greeting */}
        <div style={{ flex:1 }}>
          <p style={{ fontFamily:mFont, fontSize:11, fontWeight:400, color:mMuted, margin:0, lineHeight:1.2 }}>Welcome back</p>
          <p style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, margin:0, lineHeight:1.2 }}>Nick O'niel</p>
        </div>

        {/* Back — navigate home */}
        <button onClick={() => onNavigate('home')} style={{
          background:'transparent', border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          width:36, height:36, borderRadius:mRadiusSm,
        }}>
          <MChevRight size={20} stroke={mText} />
        </button>
      </div>

      {/* ── Section header helper ── */}
      {/* rendered inline below */}

      <div style={{ paddingBottom:48 }}>

        {/* ── My Adverts ── */}
        <section style={{ paddingTop:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 20px', marginBottom:14 }}>
            <h2 style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, margin:0 }}>My adverts</h2>
            <span style={{ background:mText, color:'#fff', fontFamily:mFont, fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:999 }}>{adverts.length}</span>
            {totalOffers > 0 && (
              <span style={{ background:mAccentBg, color:mAccent, border:`1px solid rgba(24,24,27,0.15)`, fontFamily:mFont, fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:999 }}>
                {totalOffers} offer{totalOffers > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {adverts.length === 0 ? (
            <div style={{ margin:'0 20px', padding:'32px 20px', textAlign:'center', borderRadius:mRadiusLg, border:`1.5px dashed ${mBorder}` }}>
              <p style={{ fontFamily:mFont, fontSize:14, color:mMuted, margin:0 }}>No adverts yet.</p>
            </div>
          ) : (
            <div className="scroll-row" style={{ display:'flex', gap:14, overflowX:'auto', padding:'0 20px 4px', scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch' }}>
              {adverts.map(item => (
                <div key={item.id} style={{ width:160, flexShrink:0, scrollSnapAlign:'start' }}>
                  <ListCard
                    title={item.title}
                    meta={item.price}
                    tag={item.condition}
                    offerCount={item.offers.length}
                    paused={item.status === 'Paused'}
                    hideSave
                    onClick={() => setSelectedAdvert(item)}
                  />
                </div>
              ))}
              <div style={{ minWidth:4, flexShrink:0 }} />
            </div>
          )}
        </section>

        <MSeparator style={{ margin:'24px 0 0' }} />

        {/* ── Sold ── */}
        <section style={{ paddingTop:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 20px', marginBottom:14 }}>
            <h2 style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, margin:0 }}>Sold</h2>
            <span style={{ background:mMutedBg, color:mMuted, fontFamily:mFont, fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:999 }}>{MY_SOLD.length}</span>
          </div>

          {MY_SOLD.length === 0 ? (
            <div style={{ margin:'0 20px', padding:'32px 20px', textAlign:'center', borderRadius:mRadiusLg, border:`1.5px dashed ${mBorder}`, background:mMutedBg }}>
              <p style={{ fontFamily:mFont, fontSize:14, color:mMuted, margin:0 }}>Nothing sold yet.</p>
            </div>
          ) : (
            <div className="scroll-row" style={{ display:'flex', gap:14, overflowX:'auto', padding:'0 20px 4px', scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch' }}>
              {MY_SOLD.map((item, i) => (
                <div key={i} style={{ width:160, flexShrink:0, scrollSnapAlign:'start' }}>
                  <ListCard title={item.title} meta={item.meta} tag={item.condition} sold hideSave />
                </div>
              ))}
              <div style={{ minWidth:4, flexShrink:0 }} />
            </div>
          )}
        </section>

        <MSeparator style={{ margin:'24px 0 0' }} />

        {/* ── Saved ── */}
        <section style={{ paddingTop:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 20px', marginBottom:14 }}>
            <h2 style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, margin:0 }}>Saved</h2>
            <span style={{ background:mMutedBg, color:mMuted, fontFamily:mFont, fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:999 }}>{MY_SAVED.length}</span>
          </div>

          {MY_SAVED.length === 0 ? (
            <div style={{ margin:'0 20px', padding:'32px 20px', textAlign:'center', borderRadius:mRadiusLg, border:`1.5px dashed ${mBorder}`, background:mMutedBg }}>
              <p style={{ fontFamily:mFont, fontSize:14, color:mMuted, margin:0 }}>Nothing saved yet.</p>
            </div>
          ) : (
            <div className="scroll-row" style={{ display:'flex', gap:14, overflowX:'auto', padding:'0 20px 4px', scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch' }}>
              {MY_SAVED.map((item, i) => (
                <div key={i} style={{ width:160, flexShrink:0, scrollSnapAlign:'start' }}>
                  <ListCard title={item.title} meta={item.meta} tag={item.condition} saved={item.saved} />
                </div>
              ))}
              <div style={{ minWidth:4, flexShrink:0 }} />
            </div>
          )}
        </section>

        <MSeparator style={{ margin:'24px 0 0' }} />

        {/* ── Placed Offers ── */}
        <section style={{ padding:'24px 20px 0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <h2 style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, margin:0 }}>Placed offers</h2>
            <span style={{
              background:MY_PLACED_OFFERS.length > 0 ? mText : mMutedBg,
              color:MY_PLACED_OFFERS.length > 0 ? '#fff' : mMuted,
              fontFamily:mFont, fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:999,
            }}>{MY_PLACED_OFFERS.length}</span>
          </div>

          {MY_PLACED_OFFERS.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {MY_PLACED_OFFERS.map((o, i) => (
                <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'14px 16px', borderRadius:mRadius, border:`1px solid ${mBorder}` }}>
                  <ImgPlaceholder style={{ width:48, height:48, borderRadius:10, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:mFont, fontSize:14, fontWeight:600, color:mText, margin:'0 0 2px' }}>{o.title}</p>
                    <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, margin:0 }}>{o.meta}</p>
                  </div>
                  <span style={{
                    fontFamily:mFont, fontSize:12, fontWeight:600, padding:'4px 10px', borderRadius:999, whiteSpace:'nowrap', flexShrink:0,
                    background:o.status==='Accepted'?mAccentBg:o.status==='Declined'?'#f4f4f5':'#f4f4f5',
                    color:o.status==='Accepted'?mAccent:o.status==='Declined'?'#71717a':mMuted,
                  }}>{o.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── CTAs ── */}
        <div style={{ padding:'40px 20px 0', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:10 }}>
          <button onClick={() => onNavigate('upload')} style={{
            height:44, padding:'0 18px', borderRadius:mRadiusSm,
            border:`1.5px solid ${mText}`,
            background:'#fff', color:mText,
            fontFamily:mFont, fontSize:14, fontWeight:600, cursor:'pointer',
            whiteSpace:'nowrap',
          }}>Place a new advert</button>

          <button onClick={() => onNavigate('help')} style={{
            height:40, padding:'0 16px', borderRadius:mRadiusSm,
            border:`1px solid ${mBorder}`,
            background:'#fff', color:mMuted,
            fontFamily:mFont, fontSize:13, fontWeight:400, cursor:'pointer',
            whiteSpace:'nowrap',
          }}>Feedback / help</button>
        </div>

        {/* ── Account links ── */}
        <div style={{ padding:'24px 20px 48px', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:10 }}>
          {[
            { label:'Edit profile',     col:mText,     weight:500 },
            { label:'Notifications',    col:mText,     weight:500 },
            { label:'Privacy & safety', col:mText,     weight:500 },
            { label:'Sign out',         col:'#18181b', weight:600 },
          ].map(({ label, col, weight }) => (
            <button key={label} style={{
              height:40, padding:'0 16px', borderRadius:mRadiusSm,
              border:`1px solid ${label === 'Sign out' ? '#e4e4e7' : mBorder}`,
              background: label === 'Sign out' ? '#ffffff' : '#fff',
              color:col, fontFamily:mFont, fontSize:13, fontWeight:weight,
              cursor:'pointer', whiteSpace:'nowrap',
            }}>{label}</button>
          ))}
        </div>
      </div>

    </div>
  );
}

Object.assign(window, { ProfilePage });
