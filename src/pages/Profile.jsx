import { useState } from 'react'
import { Separator } from '../components/ui/separator.jsx'
import ListCard from '../components/ListCard.jsx'
import {
  MPen, MTrash, MChevLeft, MBadge, MSeparator,
  mFont, mText, mSubtext, mMuted, mMutedBg, mBorder, mBorder2,
  mAccent, mAccentBg, mRadius, mRadiusSm, mRadiusLg, mShadowMd, mWhite,
} from '../components/ui.jsx'

const THUMB_GRADS = [
  'linear-gradient(135deg,#d4d4d8 0%,#c4c4c8 100%)',
  'linear-gradient(135deg,#c8c8cc 0%,#b8b8bc 100%)',
  'linear-gradient(135deg,#dcdce0 0%,#cccccc 100%)',
  'linear-gradient(135deg,#e4e4e8 0%,#d4d4d8 100%)',
]

const MY_ADVERTS = [
  {
    id: 1, title: 'Velvet armchair', price: 120, condition: 'Like new', cat: 'Furniture',
    status: 'Active', views: 34,
    description: 'Beautiful velvet armchair in excellent condition. Minor wear on base only.',
    offers: [
      { id: 1, amount: '£100', date: '2 days ago', status: 'pending' },
      { id: 2, amount: '£95',  date: '3 days ago', status: 'pending' },
    ],
  },
  {
    id: 2, title: 'IKEA Malm frame', price: 40, condition: 'Good', cat: 'Furniture',
    status: 'Active', views: 18,
    description: 'King size IKEA Malm bed frame, white. Dismantled and ready to go.',
    offers: [],
  },
  {
    id: 3, title: 'Mountain bike', price: 85, condition: 'Used', cat: 'Sports & Fitness',
    status: 'Paused', views: 52,
    description: '21-speed mountain bike. Some scratches but fully functional.',
    offers: [
      { id: 1, amount: '£70', date: '1 day ago', status: 'pending' },
    ],
  },
]

const MY_SOLD = [
  { title: 'Dining table, oak', meta: '£95 · Sold Apr 2026',  condition: 'Good' },
  { title: 'KitchenAid mixer',  meta: '£110 · Sold Mar 2026', condition: 'Like new' },
  { title: 'Brass floor lamp',  meta: '£35 · Sold Feb 2026',  condition: 'Good' },
]

const MY_SAVED = [
  { title: 'Leather sofa',   meta: '£280 · Schöneberg', condition: 'Like new', saved: true },
  { title: 'Vintage desk',   meta: '£90 · Mitte',       condition: 'Good',     saved: true },
  { title: 'Road bike 54cm', meta: '£200 · Kreuzberg',  condition: 'Used',     saved: false },
]


// ── Advert detail sub-page ────────────────────────────────────────────────────
function MyAdvertPage({ advert: initial, onBack, onEdit }) {
  const [advert, setAdvert]         = useState(initial)
  const [offers, setOffers]         = useState(initial.offers)
  const [activeThumb, setActiveThumb] = useState(0)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toast, setToast]           = useState(null)

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const toggleStatus = () => {
    const next = advert.status === 'Active' ? 'Paused' : 'Active'
    setAdvert(a => ({ ...a, status: next }))
    showToast(next === 'Paused' ? 'Advert paused' : 'Advert reactivated')
  }

  const handleOffer = (offerId, action) => {
    setOffers(prev => prev.filter(o => o.id !== offerId))
    showToast(action === 'accept' ? "Offer accepted — we'll be in touch" : 'Offer declined')
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-10">

      {/* ── Main image with floating back + status ── */}
      <div className="relative">
        <div className="w-full aspect-square transition-all duration-300"
          style={{ background: THUMB_GRADS[activeThumb] }} />

        {/* Floating back button */}
        <button onClick={onBack}
          className="fixed top-3 left-3 z-50 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-zinc-200">
          <MChevLeft size={18} stroke="#18181b" />
        </button>

        {/* Floating status pill */}
        <button onClick={toggleStatus}
          className="fixed top-3 right-3 z-50"
          style={{
            fontFamily: mFont, fontSize: 12, fontWeight: 600,
            padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
            background: advert.status === 'Active' ? mWhite : '#18181b',
            color: advert.status === 'Active' ? mText : mWhite,
            border: `1px solid ${mBorder}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
          }}>
          {advert.status}
        </button>
      </div>

      {/* ── Thumbnail strip ── */}
      <div className="scroll-row flex gap-2 overflow-x-auto px-4 py-3 scroll-pl-4 border-b border-zinc-100">
        {THUMB_GRADS.map((g, i) => (
          <div key={i} onClick={() => setActiveThumb(i)}
            className="shrink-0 w-14 h-12 rounded-lg cursor-pointer"
            style={{
              background: g,
              border: i === activeThumb ? '2px solid #18181b' : '1.5px solid #e4e4e7',
              transition: 'border .15s',
            }} />
        ))}
        <div className="w-4 shrink-0" />
      </div>

      {/* ── Item details ── */}
      <div className="px-5 pt-6 pb-4">

        {/* Badges */}
        <div className="flex gap-2 mb-3">
          <MBadge variant="secondary">{advert.condition}</MBadge>
          <MBadge variant="outline">{advert.cat}</MBadge>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: mFont, fontSize: 26, fontWeight: 900, color: mText, margin: '0 0 10px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          {advert.title}
        </h1>

        {/* Price + views */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5">
          <span style={{ fontFamily: mFont, fontSize: 30, fontWeight: 900, color: mText, letterSpacing: '-1px' }}>£{advert.price}</span>
          <span style={{ fontFamily: mFont, fontSize: 13, color: mMuted }}>{advert.views} views</span>
        </div>

        {/* Description */}
        <p style={{ fontFamily: mFont, fontSize: 14, color: mSubtext, lineHeight: 1.65, margin: '0 0 20px' }}>{advert.description}</p>

        {/* Tag pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[advert.cat, advert.condition].map(tag => (
            <span key={tag} style={{ fontFamily: mFont, fontSize: 12, fontWeight: 500, color: mMuted, background: '#f4f4f5', borderRadius: 999, padding: '4px 12px' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => onEdit(advert)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            height: 48, borderRadius: mRadius, border: `1px solid ${mBorder}`,
            background: mText, color: mWhite,
            fontFamily: mFont, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            <MPen size={16} stroke={mWhite} />
            Edit item
          </button>
          <button onClick={() => setDeleteOpen(true)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            height: 48, borderRadius: mRadius, border: `1px solid ${mBorder}`,
            background: mWhite, color: mText,
            fontFamily: mFont, fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>
            <MTrash size={16} stroke={mText} />
            Remove
          </button>
        </div>
      </div>

      <Separator />

      {/* ── Offers received ── */}
      <div className="px-5 pt-6 pb-10">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <h2 style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText, margin: 0 }}>Offers received</h2>
          {offers.length > 0 && (
            <span style={{ background: mText, color: mWhite, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999 }}>{offers.length}</span>
          )}
        </div>

        {offers.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', borderRadius: mRadiusLg, border: `1.5px dashed ${mBorder}`, background: mMutedBg }}>
            <p style={{ fontFamily: mFont, fontSize: 14, fontWeight: 500, color: mMuted, margin: '0 0 4px' }}>No offers yet</p>
            <p style={{ fontFamily: mFont, fontSize: 13, color: '#a1a1aa', margin: 0 }}>Buyer offers will appear here for you to accept or decline</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {offers.map(offer => (
              <div key={offer.id} style={{ padding: 16, borderRadius: mRadius, border: `1px solid ${mBorder}`, background: mWhite }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <p style={{ fontFamily: mFont, fontSize: 24, fontWeight: 900, color: mText, margin: '0 0 2px', letterSpacing: '-0.5px' }}>{offer.amount}</p>
                    <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: 0 }}>Offered {offer.date}</p>
                  </div>
                  <MBadge variant="outline">Pending</MBadge>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleOffer(offer.id, 'accept')} style={{
                    flex: 1, height: 42, borderRadius: mRadiusSm, border: 'none',
                    background: mAccent, color: mWhite,
                    fontFamily: mFont, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}>Accept</button>
                  <button onClick={() => handleOffer(offer.id, 'decline')} style={{
                    flex: 1, height: 42, borderRadius: mRadiusSm, border: `1px solid ${mBorder}`,
                    background: mWhite, color: mSubtext,
                    fontFamily: mFont, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Remove confirm bottom sheet ── */}
      {deleteOpen && (
        <>
          <div onClick={() => setDeleteOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.42)', zIndex: 60 }} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, background: mWhite,
            borderRadius: '20px 20px 0 0', zIndex: 70, paddingBottom: 36,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: mBorder2 }} />
            </div>
            <div style={{ padding: '20px 20px 0', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f4f4f5', border: '1.5px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <MTrash size={22} stroke={mText} />
              </div>
              <p style={{ fontFamily: mFont, fontSize: 18, fontWeight: 700, color: mText, margin: '0 0 8px' }}>Remove this advert?</p>
              <p style={{ fontFamily: mFont, fontSize: 14, color: mSubtext, margin: '0 0 24px', lineHeight: 1.55 }}>
                This listing will be taken down. Any pending offers will be declined automatically.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => { setDeleteOpen(false); onBack() }} style={{
                  width: '100%', height: 48, borderRadius: mRadiusSm, border: 'none',
                  background: mText, color: mWhite,
                  fontFamily: mFont, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                }}>Yes, remove it</button>
                <button onClick={() => setDeleteOpen(false)} style={{
                  width: '100%', height: 44, borderRadius: mRadiusSm, border: `1px solid ${mBorder}`,
                  background: mWhite, color: mText,
                  fontFamily: mFont, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}>Keep listing</button>
              </div>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: mText, color: mWhite,
          fontFamily: mFont, fontSize: 13, fontWeight: 500,
          padding: '10px 20px', borderRadius: 999,
          boxShadow: mShadowMd, zIndex: 100, whiteSpace: 'nowrap',
          animation: 'fadeInUp .2s ease',
        }}>{toast}</div>
      )}
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  )
}

// ── Profile page ──────────────────────────────────────────────────────────────
export default function Profile({ onNavigate, onEdit }) {
  const [selectedAdvert, setSelectedAdvert] = useState(null)
  const [adverts] = useState(MY_ADVERTS)

  if (selectedAdvert) {
    return (
      <MyAdvertPage
        advert={selectedAdvert}
        onBack={() => setSelectedAdvert(null)}
        onEdit={onEdit}
      />
    )
  }

  const totalOffers = adverts.reduce((n, a) => n + a.offers.length, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20, background: '#fff',
        borderBottom: `1px solid ${mBorder}`,
        display: 'flex', alignItems: 'center', height: 52, padding: '0 16px', gap: 12,
      }}>
        <button onClick={() => onNavigate('home')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 6, borderRadius: mRadiusSm }}>
          <MChevLeft size={20} stroke={mText} />
        </button>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: mText, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: mFont, fontWeight: 800, fontSize: 14, flexShrink: 0,
        }}>N</div>
        <span style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText }}>Nick O'niel</span>
      </div>

      <div style={{ paddingBottom: 48 }}>

        {/* ── Stats strip ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${mBorder}`, padding: '0 20px' }}>
          {[
            { value: adverts.length, label: 'Active' },
            { value: MY_SOLD.length, label: 'Sold' },
            { value: `£${adverts.reduce((s, a) => s + a.price, 0)}`, label: 'Listed value' },
          ].map(({ value, label }, i) => (
            <div key={label} style={{
              padding: '16px 0', textAlign: 'center',
              borderRight: i < 2 ? `1px solid ${mBorder}` : 'none',
            }}>
              <p style={{ fontFamily: mFont, fontSize: 20, fontWeight: 900, color: mText, margin: '0 0 2px', letterSpacing: '-0.5px' }}>{value}</p>
              <p style={{ fontFamily: mFont, fontSize: 11, color: mMuted, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* My Adverts */}
        <section style={{ paddingTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', marginBottom: 14 }}>
            <h2 style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText, margin: 0 }}>My adverts</h2>
            <span style={{ background: mText, color: '#fff', fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{adverts.length}</span>
            {totalOffers > 0 && (
              <span style={{ background: mAccentBg, color: mAccent, border: `1px solid rgba(24,24,27,0.15)`, fontFamily: mFont, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>
                {totalOffers} offer{totalOffers > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {adverts.map(item => (
              <div key={item.id} style={{ width: 160, flexShrink: 0, scrollSnapAlign: 'start' }}>
                <ListCard
                  title={item.title}
                  meta={`£${item.price}`}
                  tag={item.condition}
                  offerCount={item.offers.length}
                  paused={item.status === 'Paused'}
                  hideSave
                  onClick={() => setSelectedAdvert(item)}
                />
              </div>
            ))}
            <div style={{ minWidth: 20, flexShrink: 0 }} />
          </div>
        </section>

        <MSeparator style={{ margin: '24px 0 0' }} />

        {/* Sold */}
        <section style={{ paddingTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', marginBottom: 14 }}>
            <h2 style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText, margin: 0 }}>Sold</h2>
            <span style={{ background: mMutedBg, color: mMuted, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{MY_SOLD.length}</span>
          </div>
          <div className="scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {MY_SOLD.map((item, i) => (
              <div key={i} style={{ width: 160, flexShrink: 0, scrollSnapAlign: 'start' }}>
                <ListCard title={item.title} meta={item.meta} tag={item.condition} sold hideSave />
              </div>
            ))}
            <div style={{ minWidth: 20, flexShrink: 0 }} />
          </div>
        </section>

        <MSeparator style={{ margin: '24px 0 0' }} />

        {/* Saved */}
        <section style={{ paddingTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', marginBottom: 14 }}>
            <h2 style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText, margin: 0 }}>Saved</h2>
            <span style={{ background: mMutedBg, color: mMuted, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{MY_SAVED.length}</span>
          </div>
          <div className="scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {MY_SAVED.map((item, i) => (
              <div key={i} style={{ width: 160, flexShrink: 0, scrollSnapAlign: 'start' }}>
                <ListCard title={item.title} meta={item.meta} tag={item.condition} saved={item.saved} />
              </div>
            ))}
            <div style={{ minWidth: 20, flexShrink: 0 }} />
          </div>
        </section>

        <MSeparator style={{ margin: '24px 0 0' }} />

        {/* Placed offers — empty state */}
        <section style={{ padding: '24px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <h2 style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText, margin: 0 }}>Placed offers</h2>
            <span style={{ background: mMutedBg, color: mMuted, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>0</span>
          </div>
          <div style={{ padding: '32px 20px', textAlign: 'center', borderRadius: mRadiusLg, border: `1.5px dashed ${mBorder}`, background: mMutedBg }}>
            <p style={{ fontFamily: mFont, fontSize: 14, color: mMuted, margin: 0 }}>No offers placed yet.</p>
          </div>
        </section>

        {/* CTAs */}
        <div style={{ padding: '40px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
          <button onClick={() => onNavigate('upload')} style={{
            height: 44, padding: '0 18px', borderRadius: mRadiusSm,
            border: `1.5px solid ${mText}`, background: '#fff', color: mText,
            fontFamily: mFont, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Place a new advert</button>
          <button onClick={() => onNavigate('help')} style={{
            height: 40, padding: '0 16px', borderRadius: mRadiusSm,
            border: `1px solid ${mBorder}`, background: '#fff', color: mMuted,
            fontFamily: mFont, fontSize: 13, cursor: 'pointer',
          }}>Feedback / help</button>
        </div>

        {/* Account links */}
        <div style={{ padding: '24px 20px 48px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
          {[
            { label: 'Edit profile',     weight: 500, route: null },
            { label: 'Notifications',    weight: 500, route: null },
            { label: 'Privacy & safety', weight: 500, route: null },
            { label: 'Sign out',         weight: 600, route: 'home' },
          ].map(({ label, weight, route }) => (
            <button key={label} onClick={() => route && onNavigate(route)} style={{
              height: 40, padding: '0 16px', borderRadius: mRadiusSm,
              border: `1px solid ${mBorder}`, background: '#fff', color: mText,
              fontFamily: mFont, fontSize: 13, fontWeight: weight,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{label}</button>
          ))}
        </div>

      </div>
    </div>
  )
}
