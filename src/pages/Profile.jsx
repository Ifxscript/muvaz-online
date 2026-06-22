import { useState, useEffect } from 'react'
import P5PeteAvatar from '../components/P5PeteAvatar.jsx'
import { Separator } from '../components/ui/separator.jsx'
import ListCard from '../components/ListCard.jsx'
import { CONDITION_LABEL } from '../lib/constants.js'
import { listingsApi, offersApi, normalizeListing } from '../lib/api.js'
import {
  MPen, MTrash, MChevLeft, MBadge, MSeparator,
  mFont, mText, mSubtext, mMuted, mMutedBg, mBorder, mBorder2,
  mAccent, mAccentBg, mRadius, mRadiusSm, mRadiusLg, mShadowMd, mWhite,
} from '../components/ui.jsx'

const PLACEHOLDER_GRAD = 'linear-gradient(135deg,#d4d4d8 0%,#c4c4c8 100%)'

const STATUS_LABEL = { ACTIVE: 'Active', PAUSED: 'Paused', PENDING_APPROVAL: 'Pending', REJECTED: 'Rejected', SOLD: 'Sold' }

function timeAgo(isoStr) {
  if (!isoStr) return ''
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function normalizeOffer(raw) {
  return {
    id:           raw.id,
    amount:       `₦${Number(raw.amount).toFixed(0)}`,
    date:         timeAgo(raw.createdAt),
    status:       raw.status,
    note:         raw.note ?? '',
    buyerName:    raw.buyerName,
    listingTitle: raw.listingTitle ?? '',
  }
}


// ── Advert detail sub-page ────────────────────────────────────────────────────
export function MyAdvertPage({ advert: initial, onBack, onDelete, onEdit }) {
  const [advert,        setAdvert]        = useState(initial)
  const [offers,        setOffers]        = useState([])
  const [offersLoading, setOffersLoading] = useState(true)
  const [activeThumb,   setActiveThumb]   = useState(0)
  const [deleteOpen,    setDeleteOpen]    = useState(false)
  const [toast,         setToast]         = useState(null)
  const images = advert.images?.length ? advert.images : []

  // Fetch offers for this listing on mount
  useEffect(() => {
    offersApi.forListing(advert.id)
      .then(data => setOffers((Array.isArray(data) ? data : []).map(normalizeOffer)))
      .catch(() => {})
      .finally(() => setOffersLoading(false))
  }, [advert.id])

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const toggleStatus = async () => {
    try {
      const updated = await listingsApi.togglePause(advert.id)
      setAdvert(normalizeListing(updated))
      showToast(updated.status === 'PAUSED' ? 'Advert paused' : 'Advert reactivated')
    } catch (e) {
      showToast(e.message)
    }
  }

  const handleDelete = async () => {
    try {
      await listingsApi.remove(advert.id)
      setDeleteOpen(false)
      onDelete(advert.id)
      onBack()
    } catch (e) {
      showToast(e.message)
    }
  }

  const handleOffer = async (offerId, action) => {
    try {
      if (action === 'accept') await offersApi.accept(offerId)
      else await offersApi.decline(offerId)
      setOffers(prev => prev.filter(o => o.id !== offerId))
      showToast(action === 'accept' ? "Offer accepted — we'll be in touch" : 'Offer declined')
    } catch (e) {
      showToast(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f5] font-sans pb-10">

      {/* ── Main image with floating back + status ── */}
      <div className="relative">
        <div className="w-full aspect-square overflow-hidden transition-all duration-300"
          style={{ background: PLACEHOLDER_GRAD }}>
          {images[activeThumb] && (
            <img src={images[activeThumb]} alt={advert.title} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Floating back button */}
        <button onClick={onBack}
          className="fixed top-3 left-3 z-50 flex items-center justify-center w-9 h-9 rounded-full bg-[#faf9f5]/90 backdrop-blur-sm shadow-sm border border-zinc-200">
          <MChevLeft size={18} stroke="#18181b" />
        </button>

        {/* Floating status pill */}
        <button onClick={toggleStatus}
          className="fixed top-3 right-3 z-50"
          style={{
            fontFamily: mFont, fontSize: 12, fontWeight: 600,
            padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
            background: advert.status === 'ACTIVE' ? mWhite : '#18181b',
            color: advert.status === 'ACTIVE' ? mText : mWhite,
            border: `1px solid ${mBorder}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
          }}>
          {STATUS_LABEL[advert.status] ?? advert.status}
        </button>
      </div>

      {/* ── Thumbnail strip — only if multiple images ── */}
      {images.length > 1 && (
        <div className="scroll-row flex gap-2 overflow-x-auto px-4 py-3 scroll-pl-4 border-b border-zinc-100">
          {images.map((url, i) => (
            <div key={i} onClick={() => setActiveThumb(i)}
              className="shrink-0 w-14 h-12 rounded-lg cursor-pointer overflow-hidden"
              style={{
                background: PLACEHOLDER_GRAD,
                border: i === activeThumb ? '2px solid #18181b' : '1.5px solid #e4e4e7',
                transition: 'border .15s',
              }}>
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="w-4 shrink-0" />
        </div>
      )}

      {/* ── Item details ── */}
      <div className="px-5 pt-6 pb-4">

        {/* Badges */}
        <div className="flex gap-2 mb-3">
          <MBadge variant="secondary">{CONDITION_LABEL[advert.condition] ?? advert.condition}</MBadge>
          <MBadge variant="outline">{advert.cat}</MBadge>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: mFont, fontSize: 26, fontWeight: 900, color: mText, margin: '0 0 10px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          {advert.title}
        </h1>

        {/* Price + views */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5">
          <span style={{ fontFamily: mFont, fontSize: 30, fontWeight: 900, color: mText, letterSpacing: '-1px' }}>₦{advert.price}</span>
          <span style={{ fontFamily: mFont, fontSize: 13, color: mMuted }}>{advert.views} views</span>
        </div>

        {/* Description */}
        <p style={{ fontFamily: mFont, fontSize: 14, color: mSubtext, lineHeight: 1.65, margin: '0 0 20px' }}>{advert.description}</p>

        {/* Tag pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[advert.cat, CONDITION_LABEL[advert.condition] ?? advert.condition].map(tag => (
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

        {offersLoading ? (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${mBorder}`, borderTopColor: mText, animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
          </div>
        ) : offers.length === 0 ? (
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
                <button onClick={handleDelete} style={{
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
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── Profile page ──────────────────────────────────────────────────────────────
export default function Profile({ onNavigate, onEdit, onSignOut, currentUser }) {
  const [selectedAdvert, setSelectedAdvert] = useState(null)
  const [adverts,        setAdverts]        = useState([])
  const [sold,           setSold]           = useState([])
  const [savedListings,  setSavedListings]  = useState([])
  const [placedOffers,   setPlacedOffers]   = useState([])
  const [loading,        setLoading]        = useState(true)

  useEffect(() => {
    Promise.all([
      listingsApi.mine().catch(() => []),
      offersApi.mine().catch(() => []),
      listingsApi.saved().catch(() => []),
    ]).then(([listings, myOffers, saved]) => {
      const all = Array.isArray(listings) ? listings.map(normalizeListing) : []
      setAdverts(all.filter(l => l.status !== 'SOLD'))
      setSold(all.filter(l => l.status === 'SOLD'))
      setPlacedOffers(Array.isArray(myOffers) ? myOffers.map(normalizeOffer) : [])
      setSavedListings(Array.isArray(saved) ? saved.map(normalizeListing) : [])
    }).finally(() => setLoading(false))
  }, [])

  const handleUnsave = async (item) => {
    try {
      await listingsApi.toggleSave(item.id)
      setSavedListings(prev => prev.filter(l => l.id !== item.id))
    } catch { /* ignore */ }
  }

  const handleDelete = id => setAdverts(prev => prev.filter(a => a.id !== id))

  if (selectedAdvert) {
    return (
      <MyAdvertPage
        advert={selectedAdvert}
        onBack={() => setSelectedAdvert(null)}
        onDelete={handleDelete}
        onEdit={onEdit}
      />
    )
  }

  const activeCount   = adverts.filter(a => a.status === 'ACTIVE').length
  const listedValue   = adverts.reduce((s, a) => s + (a.price ?? 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f5' }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20, background: '#faf9f5',
        borderBottom: `1px solid ${mBorder}`,
        display: 'flex', alignItems: 'center', height: 52, padding: '0 16px', gap: 12,
      }}>
        <button onClick={() => onNavigate('home')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 6, borderRadius: mRadiusSm }}>
          <MChevLeft size={20} stroke={mText} />
        </button>
        <P5PeteAvatar displaySize={40} userId={currentUser?.id ?? currentUser?.email} />
        <span style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText }}>{currentUser?.name ?? 'My profile'}</span>
      </div>

      <div style={{ paddingBottom: 48 }}>

        {/* ── Stats strip ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${mBorder}`, padding: '0 20px' }}>
          {[
            { value: loading ? '—' : activeCount,          label: 'Active' },
            { value: loading ? '—' : sold.length,          label: 'Sold' },
            { value: loading ? '—' : `₦${listedValue}`,    label: 'Listed value' },
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
          </div>
          {loading ? (
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${mBorder}`, borderTopColor: mText, animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
            </div>
          ) : adverts.length === 0 ? (
            <div style={{ margin: '0 20px', padding: '28px 20px', textAlign: 'center', borderRadius: mRadiusLg, border: `1.5px dashed ${mBorder}` }}>
              <p style={{ fontFamily: mFont, fontSize: 14, color: mMuted, margin: 0 }}>No adverts yet.</p>
            </div>
          ) : (
            <div className="scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
              {adverts.map(item => (
                <div key={item.id} style={{ width: 160, flexShrink: 0, scrollSnapAlign: 'start' }}>
                  <ListCard
                    title={item.title}
                    meta={`₦${item.price}`}
                    tag={CONDITION_LABEL[item.condition] ?? item.condition}
                    paused={item.status === 'PAUSED'}
                    hideSave
                    image={item.images?.[0]}
                    onClick={() => setSelectedAdvert(item)}
                  />
                </div>
              ))}
              <div style={{ minWidth: 20, flexShrink: 0 }} />
            </div>
          )}
        </section>

        <MSeparator style={{ margin: '24px 0 0' }} />

        {/* Sold */}
        <section style={{ paddingTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', marginBottom: 14 }}>
            <h2 style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText, margin: 0 }}>Sold</h2>
            <span style={{ background: mMutedBg, color: mMuted, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{sold.length}</span>
          </div>
          {sold.length === 0 && !loading ? (
            <div style={{ margin: '0 20px', padding: '28px 20px', textAlign: 'center', borderRadius: mRadiusLg, border: `1.5px dashed ${mBorder}`, background: mMutedBg }}>
              <p style={{ fontFamily: mFont, fontSize: 14, color: mMuted, margin: 0 }}>Nothing sold yet.</p>
            </div>
          ) : (
            <div className="scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
              {sold.map(item => (
                <div key={item.id} style={{ width: 160, flexShrink: 0, scrollSnapAlign: 'start' }}>
                  <ListCard title={item.title} meta={`₦${item.price}`} tag={CONDITION_LABEL[item.condition] ?? item.condition} sold hideSave image={item.images?.[0]} />
                </div>
              ))}
              <div style={{ minWidth: 20, flexShrink: 0 }} />
            </div>
          )}
        </section>

        <MSeparator style={{ margin: '24px 0 0' }} />

        {/* Saved */}
        <section style={{ paddingTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', marginBottom: 14 }}>
            <h2 style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText, margin: 0 }}>Saved</h2>
            <span style={{
              background: savedListings.length > 0 ? mText : mMutedBg,
              color: savedListings.length > 0 ? '#fff' : mMuted,
              fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
            }}>{loading ? '—' : savedListings.length}</span>
          </div>
          {loading ? (
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${mBorder}`, borderTopColor: mText, animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
            </div>
          ) : savedListings.length === 0 ? (
            <div style={{ margin: '0 20px', padding: '28px 20px', textAlign: 'center', borderRadius: mRadiusLg, border: `1.5px dashed ${mBorder}`, background: mMutedBg }}>
              <p style={{ fontFamily: mFont, fontSize: 14, fontWeight: 500, color: mMuted, margin: '0 0 4px' }}>Nothing saved yet.</p>
              <p style={{ fontFamily: mFont, fontSize: 13, color: '#a1a1aa', margin: 0 }}>Tap the ♥ on any listing to save it here.</p>
            </div>
          ) : (
            <div className="scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
              {savedListings.map(item => (
                <div key={item.id} style={{ width: 160, flexShrink: 0, scrollSnapAlign: 'start' }}>
                  <ListCard
                    title={item.title}
                    meta={`₦${Number(item.price).toLocaleString('en-NG')}`}
                    tag={CONDITION_LABEL[item.condition] ?? item.condition}
                    image={item.images?.[0]}
                    saved
                    likeCount={item.likeCount}
                    offerCount={item.offerCount}
                    onSave={() => handleUnsave(item)}
                  />
                </div>
              ))}
              <div style={{ minWidth: 20, flexShrink: 0 }} />
            </div>
          )}
        </section>

        <MSeparator style={{ margin: '24px 0 0' }} />

        {/* Placed offers */}
        <section style={{ padding: '24px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <h2 style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText, margin: 0 }}>Placed offers</h2>
            <span style={{ background: placedOffers.length > 0 ? mText : mMutedBg, color: placedOffers.length > 0 ? '#fff' : mMuted, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{placedOffers.length}</span>
          </div>
          {placedOffers.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', borderRadius: mRadiusLg, border: `1.5px dashed ${mBorder}`, background: mMutedBg }}>
              <p style={{ fontFamily: mFont, fontSize: 14, color: mMuted, margin: 0 }}>No offers placed yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {placedOffers.map(offer => (
                <div key={offer.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: mRadius, border: `1px solid ${mBorder}` }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: mFont, fontSize: 14, fontWeight: 600, color: mText, margin: '0 0 2px' }}>{offer.listingTitle}</p>
                    <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: 0 }}>{offer.amount} · {offer.date}</p>
                  </div>
                  <span style={{ fontFamily: mFont, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0, background: offer.status === 'ACCEPTED' ? mAccentBg : '#f4f4f5', color: offer.status === 'ACCEPTED' ? mAccent : mMuted }}>{offer.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTAs */}
        <div style={{ padding: '40px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
          <button onClick={() => onNavigate('upload')} style={{
            height: 44, padding: '0 18px', borderRadius: mRadiusSm,
            border: `1.5px solid ${mText}`, background: '#faf9f5', color: mText,
            fontFamily: mFont, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Place a new advert</button>
          <button onClick={() => onNavigate('help')} style={{
            height: 40, padding: '0 16px', borderRadius: mRadiusSm,
            border: `1px solid ${mBorder}`, background: '#faf9f5', color: mMuted,
            fontFamily: mFont, fontSize: 13, cursor: 'pointer',
          }}>Feedback / help</button>
        </div>

        {/* Account links */}
        <div style={{ padding: '24px 20px 48px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
          {[
            { label: 'Edit profile',     weight: 500, route: null, action: null },
            { label: 'Notifications',    weight: 500, route: null, action: null },
            { label: 'Privacy & safety', weight: 500, route: null, action: null },
            { label: 'Sign out',         weight: 600, route: null, action: onSignOut },
          ].map(({ label, weight, route, action }) => (
            <button key={label} onClick={() => action ? action() : route && onNavigate(route)} style={{
              height: 40, padding: '0 16px', borderRadius: mRadiusSm,
              border: `1px solid ${mBorder}`, background: '#faf9f5', color: mText,
              fontFamily: mFont, fontSize: 13, fontWeight: weight,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{label}</button>
          ))}
        </div>

      </div>
    </div>
  )
}
