import { useState, useEffect } from 'react'
import {
  MChevLeft, MCheck, MClose, MTrash, MSeparator,
  mFont, mText, mSubtext, mMuted, mMutedBg, mBorder, mBorder2,
  mAccent, mAccentBg, mRadius, mRadiusSm, mRadiusLg, mShadowMd, mWhite,
} from '../components/ui.jsx'
import { adminApi, normalizeListing } from '../lib/api.js'
import { CONDITION_LABEL } from '../lib/constants.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function normalizeOrder(raw) {
  return {
    id:        raw.id,
    itemTitle: raw.listingTitle ?? '—',
    amount:    Number(raw.finalPrice ?? 0),
    type:      raw.offerId ? 'offer' : 'buy',
    buyer:     raw.buyerName ?? '—',
    status:    raw.status,
    createdAt: timeAgo(raw.createdAt),
  }
}

// ── Status config ─────────────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG = {
  PENDING:      { label: 'Pending',      bg: '#fef9c3', color: '#854d0e' },
  PAYMENT_SENT: { label: 'Payment sent', bg: '#dbeafe', color: '#1e40af' },
  PAID:         { label: 'Paid',         bg: '#dcfce7', color: '#166534' },
  INSPECTION:   { label: 'Inspection',   bg: '#ede9fe', color: '#5b21b6' },
  SOLD:         { label: 'Sold',         bg: '#f4f4f5', color: '#52525b' },
  CANCELLED:    { label: 'Cancelled',    bg: '#fee2e2', color: '#991b1b' },
}

// ── Small components ──────────────────────────────────────────────────────────

function StatCard({ value, label, sub }) {
  return (
    <div style={{ padding: '16px', borderRadius: mRadius, border: `1px solid ${mBorder}`, background: mWhite }}>
      <p style={{ fontFamily: mFont, fontSize: 26, fontWeight: 900, color: mText, margin: '0 0 2px', letterSpacing: '-0.5px' }}>{value}</p>
      <p style={{ fontFamily: mFont, fontSize: 13, fontWeight: 600, color: mText, margin: '0 0 1px' }}>{label}</p>
      {sub && <p style={{ fontFamily: mFont, fontSize: 11, color: mMuted, margin: 0 }}>{sub}</p>}
    </div>
  )
}

function StatusPill({ status, config }) {
  const c = config[status]
  return (
    <span style={{ fontFamily: mFont, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: c.bg, color: c.color, whiteSpace: 'nowrap' }}>
      {c.label}
    </span>
  )
}

function ActionBtn({ children, dark, danger, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: mFont, fontSize: 13, fontWeight: 600,
      padding: '8px 14px', borderRadius: mRadiusSm,
      border: `1px solid ${dark ? mText : mBorder2}`,
      background: dark ? mText : mWhite,
      color: dark ? mWhite : mText,
      cursor: 'pointer', whiteSpace: 'nowrap',
    }}>{children}</button>
  )
}

// ── Reject modal ──────────────────────────────────────────────────────────────

function RejectModal({ listing, onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  return (
    <>
      <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 60 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '90%', maxWidth: 400, background: mWhite, borderRadius: mRadiusLg,
        zIndex: 70, padding: 24,
      }}>
        <p style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText, margin: '0 0 4px' }}>Reject listing</p>
        <p style={{ fontFamily: mFont, fontSize: 13, color: mMuted, margin: '0 0 16px' }}>{listing.title}</p>
        <label style={{ display: 'block', fontFamily: mFont, fontSize: 12, fontWeight: 500, color: mText, marginBottom: 6 }}>Reason (sent to seller)</label>
        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="e.g. Item description is not clear enough"
          style={{ width: '100%', padding: '10px 12px', borderRadius: mRadiusSm, border: `1px solid ${mBorder}`, fontFamily: mFont, fontSize: 14, color: mText, resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 40, borderRadius: mRadiusSm, border: `1px solid ${mBorder}`, background: mWhite, color: mText, fontFamily: mFont, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => reason.trim() && onConfirm(reason)} style={{ flex: 1, height: 40, borderRadius: mRadiusSm, border: 'none', background: mText, color: mWhite, fontFamily: mFont, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: reason.trim() ? 1 : 0.3 }}>Reject</button>
        </div>
      </div>
    </>
  )
}

// ── WhatsApp modal ────────────────────────────────────────────────────────────

function WhatsAppModal({ order, onClose, onMarkSent }) {
  const [waData,   setWaData]   = useState(null)
  const [waLoading, setWaLoading] = useState(true)

  useEffect(() => {
    adminApi.whatsappLink(order.id)
      .then(setWaData)
      .catch(() => setWaData(null))
      .finally(() => setWaLoading(false))
  }, [order.id])

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 60 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '90%', maxWidth: 400, background: mWhite, borderRadius: mRadiusLg,
        zIndex: 70, padding: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="#16a34a"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.104.546 4.08 1.503 5.8L0 24l6.335-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.37l-.358-.214-3.76.885.938-3.665-.234-.377A9.82 9.82 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/></svg>
          </div>
          <div>
            <p style={{ fontFamily: mFont, fontSize: 15, fontWeight: 700, color: mText, margin: 0 }}>Send payment details</p>
            <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: 0 }}>{order.buyer}</p>
          </div>
        </div>

        <div style={{ padding: '12px 14px', borderRadius: mRadius, background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 16 }}>
          <p style={{ fontFamily: mFont, fontSize: 12, color: '#166534', margin: '0 0 4px', fontWeight: 600 }}>Order summary</p>
          <p style={{ fontFamily: mFont, fontSize: 13, color: '#166534', margin: 0 }}>{order.itemTitle} · <strong>₦{Number(order.amount).toLocaleString('en-NG')}</strong></p>
        </div>

        <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: '0 0 12px', lineHeight: 1.5 }}>
          Click the button below to open WhatsApp with the pre-filled payment message. After sending it, mark it as sent.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {waLoading ? (
            <div style={{ height: 44, borderRadius: mRadiusSm, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #bbf7d0', borderTopColor: '#16a34a', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : waData?.waLink ? (
            <a href={waData.waLink} target="_blank" rel="noreferrer" style={{
              display: 'block', textAlign: 'center', height: 44, lineHeight: '44px',
              borderRadius: mRadiusSm, background: '#16a34a', color: mWhite,
              fontFamily: mFont, fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}>Open WhatsApp →</a>
          ) : (
            <p style={{ fontFamily: mFont, fontSize: 13, color: mMuted, textAlign: 'center', margin: 0 }}>Could not load WhatsApp link</p>
          )}
          <button onClick={() => { onMarkSent(order.id); onClose() }} style={{
            height: 44, borderRadius: mRadiusSm, border: `1px solid ${mBorder}`,
            background: mWhite, color: mText, fontFamily: mFont, fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>Mark payment details sent</button>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}

// ── Dashboard tab ─────────────────────────────────────────────────────────────

function DashboardTab() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    adminApi.dashboard()
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ padding: '60px 0', textAlign: 'center' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${mBorder}`, borderTopColor: mText, animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
    </div>
  )

  if (error || !stats) return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <p style={{ fontFamily: mFont, fontSize: 14, color: mMuted }}>{error ?? 'Could not load dashboard.'}</p>
    </div>
  )

  const ls = stats.listingsByStatus ?? {}
  const os = stats.ordersByStatus ?? {}

  return (
    <div style={{ padding: '20px 20px 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatCard value={stats.totalUsers ?? '—'} label="Total users" />
        <StatCard value={stats.totalListings ?? '—'} label="Total listings" />
        <StatCard value={stats.visitsLast24Hours ?? '—'} label="Visits" sub="Last 24 hours" />
        <StatCard value={stats.visitsLast7Days ?? '—'} label="Visits" sub="Last 7 days" />
      </div>

      {/* Listings breakdown */}
      {Object.keys(ls).length > 0 && (
        <div>
          <p style={{ fontFamily: mFont, fontSize: 11, fontWeight: 700, color: mText, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Listings by status</p>
          <div style={{ borderRadius: mRadius, border: `1px solid ${mBorder}`, overflow: 'hidden' }}>
            {Object.entries(ls).map(([status, count], i) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < Object.keys(ls).length - 1 ? `1px solid ${mBorder}` : 'none', background: mWhite }}>
                <span style={{ fontFamily: mFont, fontSize: 13, color: mSubtext }}>{status.replace(/_/g, ' ')}</span>
                <span style={{ fontFamily: mFont, fontSize: 14, fontWeight: 700, color: mText }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders breakdown */}
      {Object.keys(os).length > 0 && (
        <div>
          <p style={{ fontFamily: mFont, fontSize: 11, fontWeight: 700, color: mText, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Orders by status</p>
          <div style={{ borderRadius: mRadius, border: `1px solid ${mBorder}`, overflow: 'hidden' }}>
            {Object.entries(os).map(([status, count], i) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < Object.keys(os).length - 1 ? `1px solid ${mBorder}` : 'none', background: mWhite }}>
                <span style={{ fontFamily: mFont, fontSize: 13, color: mSubtext }}>{ORDER_STATUS_CONFIG[status]?.label ?? status}</span>
                <span style={{ fontFamily: mFont, fontSize: 14, fontWeight: 700, color: mText }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Listings tab ──────────────────────────────────────────────────────────────

function ListingsTab() {
  const [listings,     setListings]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [toast,        setToast]        = useState(null)

  useEffect(() => {
    adminApi.pendingListings()
      .then(data => setListings(Array.isArray(data) ? data.map(normalizeListing) : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2200) }

  const approve = async id => {
    try {
      await adminApi.approve(id)
      setListings(prev => prev.filter(l => l.id !== id))
      showToast('Listing approved — seller notified')
    } catch (e) { showToast(e.message) }
  }

  const reject = async (id, reason) => {
    try {
      await adminApi.reject(id, { reason })
      setListings(prev => prev.filter(l => l.id !== id))
      setRejectTarget(null)
      showToast('Listing rejected — seller notified')
    } catch (e) { showToast(e.message) }
  }

  return (
    <div style={{ padding: '20px 20px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <h2 style={{ fontFamily: mFont, fontSize: 15, fontWeight: 700, color: mText, margin: 0 }}>Pending approval</h2>
        <span style={{ background: listings.length > 0 ? mText : mMutedBg, color: listings.length > 0 ? mWhite : mMuted, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{listings.length}</span>
      </div>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${mBorder}`, borderTopColor: mText, animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
        </div>
      ) : listings.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', borderRadius: mRadiusLg, border: `1.5px dashed ${mBorder}`, background: mMutedBg }}>
          <p style={{ fontFamily: mFont, fontSize: 14, color: mMuted, margin: 0 }}>All caught up — no listings waiting for review.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {listings.map(listing => (
            <div key={listing.id} style={{ borderRadius: mRadius, border: `1px solid ${mBorder}`, background: mWhite, overflow: 'hidden' }}>

              {/* Image strip */}
              {listing.images?.length > 0 ? (
                <div style={{ display: 'flex', gap: 4, padding: '10px 10px 0' }}>
                  {listing.images.slice(0, 4).map((url, i) => (
                    <div key={i} style={{ flex: 1, aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: mMutedBg }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ height: 80, background: mMutedBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: mFont, fontSize: 11, color: mMuted }}>No images</span>
                </div>
              )}

              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: mFont, fontSize: 15, fontWeight: 700, color: mText, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</p>
                    <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: 0 }}>
                      {listing.ownerName} · {listing.cat} · {CONDITION_LABEL[listing.condition] ?? listing.condition} · {timeAgo(listing.createdAt)}
                    </p>
                    {listing.description && (
                      <p style={{ fontFamily: mFont, fontSize: 12, color: mSubtext, margin: '6px 0 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {listing.description}
                      </p>
                    )}
                  </div>
                  <p style={{ fontFamily: mFont, fontSize: 16, fontWeight: 900, color: mText, margin: '0 0 0 12px', letterSpacing: '-0.5px', flexShrink: 0 }}>₦{Number(listing.price).toLocaleString('en-NG')}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <ActionBtn dark onClick={() => approve(listing.id)}>Approve</ActionBtn>
                  <ActionBtn danger onClick={() => setRejectTarget(listing)}>Reject</ActionBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectTarget && (
        <RejectModal listing={rejectTarget} onConfirm={reason => reject(rejectTarget.id, reason)} onCancel={() => setRejectTarget(null)} />
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: mText, color: mWhite, fontFamily: mFont, fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 999, boxShadow: mShadowMd, zIndex: 100, whiteSpace: 'nowrap', animation: 'fadeInUp .2s ease' }}>{toast}</div>
      )}
    </div>
  )
}

// ── Orders tab ────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ['All', 'PENDING', 'PAYMENT_SENT', 'PAID', 'INSPECTION', 'SOLD', 'CANCELLED']

function OrdersTab() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('All')
  const [waOrder, setWaOrder] = useState(null)
  const [toast,   setToast]   = useState(null)

  useEffect(() => {
    adminApi.orders()
      .then(data => setOrders(Array.isArray(data) ? data.map(normalizeOrder) : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2200) }

  const advance = async (id, newStatus) => {
    const API_MAP = {
      PAYMENT_SENT: adminApi.markPaymentSent,
      PAID:         adminApi.confirmPayment,
      INSPECTION:   adminApi.inspection,
      SOLD:         adminApi.close,
      CANCELLED:    adminApi.cancel,
    }
    try {
      await API_MAP[newStatus]?.(id)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
      const msgs = {
        PAYMENT_SENT: 'Payment details sent',
        PAID:         'Payment confirmed',
        INSPECTION:   'Marked as inspection',
        SOLD:         'Order closed — listing sold',
        CANCELLED:    'Order cancelled',
      }
      showToast(msgs[newStatus] ?? 'Updated')
    } catch (e) { showToast(e.message) }
  }

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)
  const pendingCount = orders.filter(o => o.status === 'PENDING').length

  return (
    <div style={{ padding: '16px 20px 48px' }}>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
        {STATUS_FILTERS.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            fontFamily: mFont, fontSize: 12, fontWeight: 500, padding: '6px 12px',
            borderRadius: 999, border: `1px solid ${filter === s ? mText : mBorder}`,
            background: filter === s ? mText : mWhite,
            color: filter === s ? mWhite : mMuted,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {s === 'All' ? 'All' : ORDER_STATUS_CONFIG[s]?.label ?? s}
            {s === 'PENDING' && pendingCount > 0 && (
              <span style={{ marginLeft: 5, background: filter === 'PENDING' ? mWhite : mText, color: filter === 'PENDING' ? mText : mWhite, borderRadius: 999, padding: '1px 5px', fontSize: 10, fontWeight: 700 }}>{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${mBorder}`, borderTopColor: mText, animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', borderRadius: mRadiusLg, border: `1.5px dashed ${mBorder}`, background: mMutedBg }}>
          <p style={{ fontFamily: mFont, fontSize: 14, color: mMuted, margin: 0 }}>No orders in this status.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(order => (
            <div key={order.id} style={{ borderRadius: mRadius, border: `1px solid ${mBorder}`, background: mWhite, padding: 16 }}>

              {/* Order header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: mFont, fontSize: 15, fontWeight: 700, color: mText, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.itemTitle}</p>
                  <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: 0 }}>
                    {order.type === 'offer' ? 'Offer' : 'Buy now'} · Buyer: {order.buyer} · {order.createdAt}
                  </p>
                </div>
                <p style={{ fontFamily: mFont, fontSize: 18, fontWeight: 900, color: mText, margin: '0 0 0 12px', letterSpacing: '-0.5px', flexShrink: 0 }}>₦{Number(order.amount).toLocaleString('en-NG')}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <StatusPill status={order.status} config={ORDER_STATUS_CONFIG} />

                {/* Contextual actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {order.status === 'PENDING' && (
                    <>
                      <ActionBtn dark onClick={() => setWaOrder(order)}>Send payment details</ActionBtn>
                      <ActionBtn danger onClick={() => advance(order.id, 'CANCELLED')}>Cancel</ActionBtn>
                    </>
                  )}
                  {order.status === 'PAYMENT_SENT' && (
                    <>
                      <ActionBtn dark onClick={() => advance(order.id, 'PAID')}>Confirm payment</ActionBtn>
                      <ActionBtn danger onClick={() => advance(order.id, 'CANCELLED')}>Cancel</ActionBtn>
                    </>
                  )}
                  {order.status === 'PAID' && (
                    <>
                      <ActionBtn dark onClick={() => advance(order.id, 'INSPECTION')}>Mark inspection</ActionBtn>
                      <ActionBtn danger onClick={() => advance(order.id, 'CANCELLED')}>Cancel</ActionBtn>
                    </>
                  )}
                  {order.status === 'INSPECTION' && (
                    <>
                      <ActionBtn dark onClick={() => advance(order.id, 'SOLD')}>Close order</ActionBtn>
                      <ActionBtn danger onClick={() => advance(order.id, 'CANCELLED')}>Cancel</ActionBtn>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {waOrder && (
        <WhatsAppModal
          order={waOrder}
          onClose={() => setWaOrder(null)}
          onMarkSent={id => advance(id, 'PAYMENT_SENT')}
        />
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: mText, color: mWhite, fontFamily: mFont, fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 999, boxShadow: mShadowMd, zIndex: 100, whiteSpace: 'nowrap', animation: 'fadeInUp .2s ease' }}>{toast}</div>
      )}
    </div>
  )
}

// ── Users tab ─────────────────────────────────────────────────────────────────

function UsersTab() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.users()
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const fmt = dt => dt ? new Date(dt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <div style={{ padding: '20px 20px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <h2 style={{ fontFamily: mFont, fontSize: 15, fontWeight: 700, color: mText, margin: 0 }}>Signed up users</h2>
        <span style={{ background: mText, color: mWhite, fontFamily: mFont, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{users.length}</span>
      </div>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${mBorder}`, borderTopColor: mText, animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
        </div>
      ) : users.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', borderRadius: mRadiusLg, border: `1.5px dashed ${mBorder}`, background: mMutedBg }}>
          <p style={{ fontFamily: mFont, fontSize: 14, color: mMuted, margin: 0 }}>No users yet.</p>
        </div>
      ) : (
        <div style={{ borderRadius: mRadius, border: `1px solid ${mBorder}`, overflow: 'hidden', background: mWhite }}>
          {users.map((user, i) => (
            <div key={user.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: i < users.length - 1 ? `1px solid ${mBorder}` : 'none',
            }}>
              {/* Avatar */}
              <div style={{
                width: 38, height: 38, borderRadius: '50%', background: user.role === 'ADMIN' ? mText : mMutedBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontFamily: mFont, fontSize: 14, fontWeight: 700, color: user.role === 'ADMIN' ? mWhite : mSubtext }}>
                  {user.name?.[0]?.toUpperCase() ?? '?'}
                </span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <p style={{ fontFamily: mFont, fontSize: 14, fontWeight: 600, color: mText, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                  {user.role === 'ADMIN' && (
                    <span style={{ fontFamily: mFont, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999, background: mText, color: mWhite, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin</span>
                  )}
                </div>
                <p style={{ fontFamily: mFont, fontSize: 12, color: mMuted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
              </div>

              {/* Joined date */}
              <p style={{ fontFamily: mFont, fontSize: 11, color: mMuted, margin: 0, flexShrink: 0 }}>{fmt(user.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Admin page ────────────────────────────────────────────────────────────────

const TABS = ['Dashboard', 'Listings', 'Orders', 'Users']

export default function Admin({ onNavigate }) {
  const [tab, setTab] = useState('Dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20, background: mWhite,
        borderBottom: `1px solid ${mBorder}`,
        display: 'flex', alignItems: 'center', height: 52, padding: '0 16px', gap: 12,
      }}>
        <button onClick={() => onNavigate('home')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 6, borderRadius: mRadiusSm }}>
          <MChevLeft size={20} stroke={mText} />
        </button>
        <span style={{ fontFamily: mFont, fontSize: 16, fontWeight: 700, color: mText, flex: 1 }}>Admin panel</span>
        <span style={{ fontFamily: mFont, fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px', color: mMuted }}>
          muvaz<span style={{ color: mText }}>.</span>
        </span>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${mBorder}`, background: mWhite, position: 'sticky', top: 52, zIndex: 19 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, height: 44, border: 'none', cursor: 'pointer',
            fontFamily: mFont, fontSize: 13, fontWeight: tab === t ? 700 : 400,
            color: tab === t ? mText : mMuted,
            background: mWhite,
            borderBottom: tab === t ? `2px solid ${mText}` : '2px solid transparent',
            transition: 'all .15s',
          }}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Dashboard' && <DashboardTab />}
      {tab === 'Listings'  && <ListingsTab />}
      {tab === 'Orders'    && <OrdersTab />}
      {tab === 'Users'     && <UsersTab />}

      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  )
}
