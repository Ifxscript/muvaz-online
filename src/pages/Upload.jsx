import { useState, useRef } from 'react'
import { ArrowLeft, Camera, Plus, X, MapPin, Check, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'
import { Separator } from '../components/ui/separator.jsx'
import { cn } from '../lib/utils.js'
import { CATEGORIES, CONDITIONS } from '../lib/constants.js'
import { listingsApi } from '../lib/api.js'

// ── Small helpers ─────────────────────────────────────────────

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-4">
      <h2 className="text-[15px] font-bold text-zinc-900">{children}</h2>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-9 px-4 rounded-full text-[13px] font-medium border transition-all whitespace-nowrap',
        active
          ? 'bg-zinc-900 text-white border-zinc-900'
          : 'bg-[#faf9f5] text-zinc-500 border-zinc-200 hover:border-zinc-400'
      )}
    >
      {children}
    </button>
  )
}

// ── Page ──────────────────────────────────────────────────────

export default function Upload({ onBack, onSuccess, initialItem }) {
  const isEdit       = Boolean(initialItem)
  const fileInputRef = useRef(null)

  // Each entry: { file: File | null, preview: string, uploaded: boolean }
  // - New files:       { file: File, preview: blobURL, uploaded: false }
  // - Existing images: { file: null, preview: 'https://...', uploaded: true }
  const [files,       setFiles]       = useState(
    isEdit && initialItem?.images?.length
      ? initialItem.images.map(url => ({ file: null, preview: url, uploaded: true }))
      : []
  )
  const [category,    setCategory]    = useState(initialItem?.cat ?? '')
  const [condition,   setCondition]   = useState(initialItem?.condition ?? '')
  const [title,       setTitle]       = useState(initialItem?.title ?? '')
  const [desc,        setDesc]        = useState(initialItem?.description ?? '')
  const [price,       setPrice]       = useState(initialItem?.price ? String(initialItem.price) : '')
  const [postcode,    setPostcode]    = useState('')
  const [submitted,   setSubmitted]   = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [submitError, setSubmitError] = useState('')

  const pickFile = () => fileInputRef.current?.click()

  const handleFileChange = e => {
    const chosen = Array.from(e.target.files)
    const remaining = 8 - files.length
    const toAdd = chosen.slice(0, remaining).map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      uploaded: false,
    }))
    setFiles(prev => [...prev, ...toAdd])
    e.target.value = ''
  }

  const removeFile = idx => {
    setFiles(prev => {
      const f = prev[idx]
      if (!f.uploaded) URL.revokeObjectURL(f.preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const resetFiles = () => {
    files.forEach(f => { if (!f.uploaded) URL.revokeObjectURL(f.preview) })
    setFiles([])
  }

  const canSubmit = title.trim() && category && condition && price && Number(price) > 0
  const payout    = price ? (Number(price) * 0.95).toFixed(2) : null

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      // Upload any new (not-yet-uploaded) files
      const imageUrls = await Promise.all(
        files.map(async f => {
          if (f.uploaded) return f.preview
          const res = await listingsApi.uploadImage(f.file)
          return res.url
        })
      )

      const body = {
        title,
        description: desc,
        price: Number(price),
        condition,
        category,
        images: imageUrls,
      }

      if (isEdit) {
        await listingsApi.update(initialItem.id, body)
      } else {
        await listingsApi.create(body)
      }

      setSubmitted(true)
    } catch (e) {
      setSubmitError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ───────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#faf9f5] font-sans flex flex-col items-center justify-center px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 border-2 border-zinc-900 flex items-center justify-center mb-6">
          <Check size={28} className="text-zinc-900" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">
          {isEdit ? 'Changes saved!' : 'Listing submitted!'}
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed mb-1 max-w-xs">
          {isEdit
            ? <>Your listing for <strong className="text-zinc-900">{title}</strong> has been updated.</>
            : <>Our team will review <strong className="text-zinc-900">{title}</strong> and get it live within 24 hours.</>}
        </p>
        <p className="text-xs text-zinc-400 mb-8">
          {isEdit ? '' : "We'll notify you when it's live."}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {!isEdit && (
            <Button className="w-full h-12" onClick={() => {
              setSubmitted(false); setTitle(''); setCategory(''); setCondition('')
              setDesc(''); setPrice(''); setPostcode(''); setSubmitError(''); resetFiles()
            }}>
              List another item
            </Button>
          )}
          <Button variant={isEdit ? 'default' : 'ghost'} className={isEdit ? 'w-full h-12' : 'w-full text-zinc-400'} onClick={onSuccess ?? onBack}>
            {isEdit ? 'Back to my advert' : 'Back to home'}
          </Button>
        </div>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#faf9f5] font-sans">

      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#faf9f5] border-b border-zinc-200">
        <div className="flex items-center gap-3 h-14 px-4 max-w-screen-lg mx-auto">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-zinc-700" />
          </button>
          <span className="text-base font-bold text-zinc-900 flex-1">{isEdit ? 'Edit listing' : 'List an item'}</span>
          {!isEdit && (
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 rounded-full px-3 py-1">Free listing</span>
          )}
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-5 py-6 pb-24 space-y-7">

        {/* ── Photos ── */}
        <section>
          <SectionTitle sub="Up to 8 photos. First photo becomes the cover.">Photos</SectionTitle>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {files.length === 0 ? (
            <div
              onClick={pickFile}
              className="rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-8 flex flex-col items-center gap-2.5 cursor-pointer hover:border-zinc-400 transition-colors text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#faf9f5] border border-zinc-200 flex items-center justify-center">
                <Camera size={20} className="text-zinc-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-700">Tap to upload photos</p>
              <p className="text-xs text-zinc-400">JPG or PNG, up to 10 MB each</p>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {files.map((f, i) => (
                <div key={f.preview} className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-zinc-900 text-white rounded px-1.5 py-0.5">
                      COVER
                    </span>
                  )}
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center border-none cursor-pointer"
                  >
                    <X size={11} color="white" />
                  </button>
                </div>
              ))}
              {files.length < 8 && (
                <button
                  onClick={pickFile}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-zinc-200 bg-[#faf9f5] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-zinc-400 transition-colors shrink-0"
                >
                  <Plus size={18} className="text-zinc-400" />
                  <span className="text-[11px] font-medium text-zinc-400">Add</span>
                </button>
              )}
            </div>
          )}
        </section>

        <Separator />

        {/* ── Category ── */}
        <section>
          <SectionTitle sub="Pick the best fit for your item.">Category</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'h-10 rounded-lg text-xs font-medium border transition-all px-2 truncate',
                  category === cat
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-[#faf9f5] text-zinc-500 border-zinc-200 hover:border-zinc-400'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── Item details ── */}
        <section className="space-y-5">
          <SectionTitle>Item details</SectionTitle>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-zinc-900">
                Title <span className="text-zinc-400">*</span>
              </label>
              <span className="text-xs text-zinc-400">{title.length}/80</span>
            </div>
            <div className="flex items-center h-12 px-3 rounded-md border border-zinc-200 bg-[#f0efe9] focus-within:border-zinc-900 transition-colors">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value.slice(0, 80))}
                placeholder="e.g. IKEA Kallax shelf unit, white"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-3">
              Condition <span className="text-zinc-400">*</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {CONDITIONS.map(c => (
                <Pill key={c.value} active={condition === c.value} onClick={() => setCondition(c.value)}>{c.label}</Pill>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-zinc-900">Description</label>
              <span className="text-xs text-zinc-400">{desc.length}/500</span>
            </div>
            <div className="rounded-md border border-zinc-200 bg-[#f0efe9] focus-within:border-zinc-900 transition-colors">
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value.slice(0, 500))}
                rows={4}
                placeholder="Dimensions, colour, any defects, reason for selling…"
                className="w-full px-3 py-3 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400 resize-none leading-relaxed"
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* ── Pricing ── */}
        <section>
          <SectionTitle sub="muvaz takes 5% on sale. No listing fee.">
            Asking price <span className="text-zinc-400 font-normal text-sm">*</span>
          </SectionTitle>
          <div className={cn(
            'flex items-center h-14 rounded-md border overflow-hidden transition-colors',
            price ? 'border-zinc-900' : 'border-zinc-200'
          )}>
            <span className="text-xl font-black text-zinc-900 px-4 border-r border-zinc-200">₦</span>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0"
              min="0"
              className="flex-1 px-4 bg-transparent outline-none text-xl font-black text-zinc-900 placeholder:text-zinc-300"
            />
          </div>

          {payout && (
            <div className="flex items-center justify-between mt-3 px-4 py-3 rounded-md bg-zinc-50 border border-zinc-100">
              <span className="text-sm text-zinc-500">You'll receive</span>
              <span className="text-sm font-bold text-zinc-900">₦{payout}</span>
            </div>
          )}
        </section>

        <Separator />

        {/* ── Location ── */}
        <section>
          <SectionTitle sub="Our team collects from you — buyers never see your address.">
            Pickup location
          </SectionTitle>
          <div className="flex items-center gap-2 h-12 px-3 rounded-md border border-zinc-200 bg-[#f0efe9] focus-within:border-zinc-900 transition-colors">
            <MapPin size={16} className="text-zinc-400 shrink-0" />
            <input
              type="text"
              value={postcode}
              onChange={e => setPostcode(e.target.value)}
              placeholder="Enter your postcode"
              className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
            />
          </div>
        </section>

        {/* ── Submit ── */}
        <div>
          {submitError && (
            <p className="text-sm text-red-500 text-center mb-3">{submitError}</p>
          )}
          <Button
            className={cn('w-full h-13 text-base transition-colors', (!canSubmit || submitting) && 'opacity-40')}
            style={{ height: 52 }}
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                {isEdit ? 'Saving…' : 'Submitting…'}
              </span>
            ) : (
              isEdit ? 'Save changes' : 'Submit listing'
            )}
          </Button>
          {!isEdit && (
            <p className="text-xs text-zinc-400 text-center mt-3 leading-relaxed">
              Every listing is reviewed by our team before going live — usually within 24 hours.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
