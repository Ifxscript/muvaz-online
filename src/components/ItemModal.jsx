import { useState } from 'react'
import { X, Heart, Check, Camera } from 'lucide-react'

const GRADIENTS = [
  'linear-gradient(160deg,#2a3828 0%,#1a2a1e 45%,#0d1a10 100%)',
  'linear-gradient(160deg,#1e2a38 0%,#121e2c 45%,#080e18 100%)',
  'linear-gradient(160deg,#38281a 0%,#2a1a0e 45%,#180e08 100%)',
  'linear-gradient(160deg,#282838 0%,#1a1a2a 45%,#0e0e18 100%)',
  'linear-gradient(160deg,#38282a 0%,#2a1a1c 45%,#180e10 100%)',
  'linear-gradient(160deg,#1e3028 0%,#142018 45%,#0a1210 100%)',
]

function thumbs(id) {
  return [0, 1, 2, 3].map(i => GRADIENTS[(id + i) % GRADIENTS.length])
}

export default function ItemModal({ item, onClose }) {
  const [activeImg, setActiveImg] = useState(0)
  const [saved,     setSaved]     = useState(false)
  const [mode,      setMode]      = useState('view')
  const [amount,    setAmount]    = useState('')
  const [error,     setError]     = useState('')
  const [expanded,  setExpanded]  = useState(false)

  const imgs = thumbs(item.id)

  const handleSend = () => {
    const val = Number(amount)
    if (!amount || val <= 0)  { setError('Enter a valid amount'); return }
    if (val >= item.price)    { setError(`Must be below ₦${item.price}`); return }
    setMode('confirm')
    setError('')
    setTimeout(() => { setMode('view'); setAmount('') }, 2400)
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: 360,
          height: '78vh',
          minHeight: 520,
          borderRadius: 24,
          background: imgs[activeImg],
          transition: 'background .35s ease',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Camera placeholder watermark */}
        <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.07]">
          <Camera size={72} color="white" />
        </div>

        {/* Bottom-up dark gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.6) 38%, rgba(0,0,0,0.1) 62%, transparent 100%)' }}
        />

        {/* Top-right: close + save stacked */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {[
            { icon: <X size={14} color="white" />, action: onClose },
            { icon: <Heart size={15} color="white" fill={saved ? 'white' : 'none'} strokeWidth={2} />, action: () => setSaved(s => !s) },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-none"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Top-left: thumbnail strip */}
        <div
          className="scroll-row absolute top-3 left-3 z-10 flex gap-1.5 overflow-x-auto"
          style={{ right: 56 }}
        >
          {imgs.map((bg, i) => (
            <div
              key={i}
              onClick={() => setActiveImg(i)}
              className="shrink-0 cursor-pointer"
              style={{
                width: 44, height: 44,
                borderRadius: 10,
                background: bg,
                border: i === activeImg
                  ? '2px solid rgba(255,255,255,0.9)'
                  : '1.5px solid rgba(255,255,255,0.22)',
                transition: 'border .15s',
              }}
            />
          ))}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10">

          {/* ── View mode ── */}
          {mode === 'view' && (
            <>
              <div className="flex gap-1.5 mb-2 flex-wrap">
                <span
                  className="text-[11px] font-semibold text-white px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  {item.condition}
                </span>
                <span
                  className="text-[11px] text-white/70 px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}
                >
                  {item.cat}
                </span>
              </div>

              <h2 className="text-[22px] font-black text-white leading-[1.1] tracking-tight mb-2">
                {item.title}
              </h2>

              <div
                className="transition-all duration-300 overflow-hidden mb-1"
                style={{ maxHeight: expanded ? 110 : 42 }}
              >
                <p className="text-[13px] leading-relaxed m-0" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {item.description}
                </p>
              </div>
              <button
                onClick={() => setExpanded(x => !x)}
                className="text-[12px] mb-2.5 block border-none cursor-pointer bg-transparent underline underline-offset-2"
                style={{ color: 'rgba(255,255,255,0.4)', padding: 0 }}
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[20px] font-black text-white tracking-tight">₦{item.price}</span>
                <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  · {item.region}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setMode('offer')}
                  className="flex-1 h-11 rounded-full bg-white text-zinc-900 text-[14px] font-bold border-none cursor-pointer"
                >
                  Make an offer
                </button>
                <button className="flex-1 h-11 rounded-full bg-zinc-900 text-white text-[14px] font-bold border-none cursor-pointer">
                  Buy · ₦{item.price}
                </button>
              </div>
            </>
          )}

          {/* ── Offer mode ── */}
          {mode === 'offer' && (
            <div
              className="rounded-2xl px-3.5 py-3"
              style={{ background: 'rgba(8,8,8,0.82)', backdropFilter: 'blur(16px)' }}
            >
              <p className="text-[12px] mb-2" style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 8px' }}>
                Listed at <strong className="text-white">₦{item.price}</strong> — offer must be lower
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 flex items-center h-11 rounded-xl px-3 gap-1"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: `1.5px solid ${error ? '#71717a' : 'rgba(255,255,255,0.2)'}`,
                  }}
                >
                  <span className="text-[16px] font-bold text-white">₦</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setError('') }}
                    placeholder={String(Math.round(item.price * 0.8))}
                    autoFocus
                    className="flex-1 bg-transparent border-none outline-none text-[16px] font-bold text-white w-0"
                  />
                </div>
                <button
                  onClick={handleSend}
                  className="h-11 px-4 rounded-xl bg-zinc-900 text-white text-[14px] font-bold border-none cursor-pointer shrink-0"
                >
                  Send
                </button>
                <button
                  onClick={() => { setMode('view'); setAmount(''); setError('') }}
                  className="h-11 px-2.5 rounded-xl text-[13px] border-none cursor-pointer shrink-0"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.5)' }}
                >
                  ✕
                </button>
              </div>
              {error && <p className="text-[12px] text-zinc-500 mt-1.5 mb-0">{error}</p>}
            </div>
          )}

          {/* ── Confirm mode ── */}
          {mode === 'confirm' && (
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(8,8,8,0.82)', backdropFilter: 'blur(16px)' }}
            >
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                <Check size={18} color="white" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-white m-0">Offer sent!</p>
                <p className="text-[12px] mt-0.5 m-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  We'll notify you when the seller responds.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
