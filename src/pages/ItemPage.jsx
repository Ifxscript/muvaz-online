import { useState, useEffect } from 'react'
import { CONDITION_LABEL } from '../lib/constants.js'
import { listingsApi, normalizeListing, offersApi, ordersApi } from '../lib/api.js'
import { ArrowLeft, MapPin, Star, Check, X } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Separator } from '../components/ui/separator.jsx'
import ListCard from '../components/ListCard.jsx'
import { cn } from '../lib/utils.js'

const THUMB_GRADS = [
  'linear-gradient(135deg,#d4d4d8 0%,#c4c4c8 100%)',
  'linear-gradient(135deg,#c8c8cc 0%,#b8b8bc 100%)',
  'linear-gradient(135deg,#dcdce0 0%,#cccccc 100%)',
  'linear-gradient(135deg,#e4e4e8 0%,#d4d4d8 100%)',
]

function imageRatio(i) {
  const r = i % 3
  if (r === 0) return '68%'
  if (r === 1) return '130%'
  return '100%'
}

export default function ItemPage({ item: initialItem, allItems, onBack, onSelectItem, requireAuth }) {
  const [item,        setItem]        = useState(initialItem)
  const [activeThumb, setActiveThumb] = useState(0)
  const [offerMode,   setOfferMode]   = useState('idle') // idle | input | sent
  const [amount,      setAmount]      = useState('')
  const [error,       setError]       = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [initialItem.id])

  // Re-fetch fresh data from API on open
  useEffect(() => {
    listingsApi.getOne(initialItem.id)
      .then(data => setItem(normalizeListing(data)))
      .catch(() => {}) // keep showing the initial item on failure
  }, [initialItem.id])

  const related = [
    ...allItems.filter(i => i.id !== item.id && i.cat === item.cat),
    ...allItems.filter(i => i.id !== item.id && i.cat !== item.cat),
  ].slice(0, 10)

  const handleSend = async () => {
    const val = Number(amount)
    if (!amount || isNaN(val) || val <= 0) { setError('Enter a valid amount'); return }
    if (val >= item.price)                 { setError(`Must be below £${item.price}`); return }
    setOfferMode('sending')
    setError('')
    try {
      await offersApi.make(item.id, { amount: val })
      setOfferMode('sent')
      setTimeout(() => { setOfferMode('idle'); setAmount('') }, 2600)
    } catch (e) {
      setError(e.message)
      setOfferMode('input')
    }
  }

  const handleBuy = async () => {
    setOfferMode('buying')
    try {
      await ordersApi.buy(item.id)
      setOfferMode('bought')
    } catch (e) {
      setError(e.message)
      setOfferMode('idle')
    }
  }

  const cancelOffer = () => { setOfferMode('idle'); setAmount(''); setError('') }

  return (
    <div className="min-h-screen bg-white font-sans pb-10">

      <div className="max-w-screen-lg mx-auto">

        {/* ── Main image — 55vh with back button floating on top ── */}
        <div className="relative p-px">
          <div
            className="w-full aspect-square rounded-2xl transition-all duration-300"
            style={{ background: THUMB_GRADS[activeThumb] }}
          />
          <button
            onClick={onBack}
            className="fixed top-3 left-3 z-50 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-zinc-200 hover:bg-white transition-colors"
          >
            <ArrowLeft size={18} className="text-zinc-700" />
          </button>
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="scroll-row flex gap-2 overflow-x-auto px-4 py-3 scroll-pl-4 border-b border-zinc-100">
          {THUMB_GRADS.map((g, i) => (
            <div
              key={i}
              onClick={() => setActiveThumb(i)}
              className="shrink-0 w-14 h-12 rounded-lg cursor-pointer"
              style={{
                background: g,
                border: i === activeThumb
                  ? '2px solid #18181b'
                  : '1.5px solid #e4e4e7',
                transition: 'border .15s',
              }}
            />
          ))}
          <div className="w-4 shrink-0" />
        </div>

        {/* ── Details ── */}
        <div className="px-5 md:px-8 pt-6 pb-4">

          {/* Badges */}
          <div className="flex gap-2 mb-3">
            <Badge variant="secondary" className="rounded-full">{CONDITION_LABEL[item.condition] ?? item.condition}</Badge>
            <Badge variant="outline" className="rounded-full text-zinc-500">{item.cat}</Badge>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-tight mb-3">
            {item.title}
          </h1>

          {/* Price + location + rating */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6">
            <span className="text-3xl font-black text-zinc-900 tracking-tight">£{item.price}</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <MapPin size={13} />
              <span className="text-sm">{item.region}</span>
            </span>
            <span className="flex items-center gap-1">
              <Star size={13} fill="#18181b" stroke="none" />
              <span className="text-sm font-semibold text-zinc-900">{item.rating}</span>
              <span className="text-sm text-zinc-400">({item.reviews})</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-500 leading-relaxed mb-5">{item.description}</p>

          {/* Tag pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            {[item.cat, CONDITION_LABEL[item.condition] ?? item.condition, item.region].map(tag => (
              <span
                key={tag}
                className="text-xs font-medium text-zinc-500 bg-zinc-100 rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* ── CTA — inline offer / buy ── */}
          <div>
            {/* Idle — both buttons */}
            {offerMode === 'idle' && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12 text-base"
                    onClick={() => requireAuth ? requireAuth(() => setOfferMode('input')) : setOfferMode('input')}>
                    Make an offer
                  </Button>
                  <Button className="flex-1 h-12 text-base"
                    onClick={() => requireAuth ? requireAuth(() => handleBuy()) : handleBuy()}>
                    Buy · £{item.price}
                  </Button>
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>
            )}

            {/* Offer input */}
            {(offerMode === 'input' || offerMode === 'sending') && (
              <div>
                <p className="text-xs text-zinc-400 mb-2">
                  Offer must be below <span className="font-semibold text-zinc-900">£{item.price}</span> — numbers only
                </p>
                <div className="flex gap-2 items-center">
                  <div className={cn(
                    'flex-1 flex items-center h-12 rounded-md border px-3 gap-1.5 bg-white transition-colors',
                    error ? 'border-red-300' : 'border-zinc-300 focus-within:border-zinc-900'
                  )}>
                    <span className="text-base font-bold text-zinc-900">£</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={amount}
                      onChange={e => { setAmount(e.target.value); setError('') }}
                      placeholder={String(Math.round(item.price * 0.8))}
                      autoFocus
                      disabled={offerMode === 'sending'}
                      className="flex-1 bg-transparent border-none outline-none text-base font-bold text-zinc-900 w-0"
                    />
                  </div>
                  <Button className="h-12 px-5 shrink-0" onClick={handleSend} disabled={!amount || offerMode === 'sending'}>
                    {offerMode === 'sending' ? '…' : 'Send'}
                  </Button>
                  <button onClick={cancelOffer} disabled={offerMode === 'sending'}
                    className="h-12 w-12 flex items-center justify-center rounded-md border border-zinc-200 hover:bg-zinc-50 transition-colors shrink-0">
                    <X size={16} className="text-zinc-400" />
                  </button>
                </div>
                {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
              </div>
            )}

            {/* Buying spinner */}
            {offerMode === 'buying' && (
              <div className="flex items-center justify-center gap-3 h-12 px-4 rounded-md bg-zinc-50 border border-zinc-200">
                <div className="w-4 h-4 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin shrink-0" />
                <p className="text-sm font-semibold text-zinc-900">Placing order…</p>
              </div>
            )}

            {/* Offer sent */}
            {offerMode === 'sent' && (
              <div className="flex items-center gap-3 h-12 px-4 rounded-md bg-zinc-50 border border-zinc-200">
                <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                  <Check size={13} color="white" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-semibold text-zinc-900">Offer sent!</p>
                <p className="text-sm text-zinc-400 truncate">We'll notify you when the seller responds.</p>
              </div>
            )}

            {/* Order placed */}
            {offerMode === 'bought' && (
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-md bg-zinc-900">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check size={13} color="white" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white leading-none mb-0.5">Order placed!</p>
                  <p className="text-xs text-zinc-400 truncate">We'll send you payment details shortly.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* ── More like this ── */}
        <section className="px-4 md:px-8 pt-7 pb-12">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">More like this</h2>
            <span className="text-xs text-zinc-400 font-medium">{related.length} items</span>
          </div>
          <div className="columns-2 md:columns-4 gap-3">
            {related.map((rel, i) => (
              <div key={rel.id} className="break-inside-avoid mb-3 cursor-pointer" onClick={() => onSelectItem?.(rel)}>
                <ListCard
                  title={rel.title}
                  meta={`£${rel.price} · ${rel.region}`}
                  tag={CONDITION_LABEL[rel.condition] ?? rel.condition}
                  rating={rel.rating}
                  reviews={rel.reviews}
                  saved={rel.saved}
                  imageRatio={imageRatio(i)}
                />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
