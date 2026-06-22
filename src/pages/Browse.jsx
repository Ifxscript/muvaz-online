import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { ArrowLeft, Search, X, SlidersHorizontal, LayoutGrid, AlignJustify, Check, Star } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Separator } from '../components/ui/separator.jsx'
import ListCard from '../components/ListCard.jsx'
import ItemPage from './ItemPage.jsx'
import { MyAdvertPage } from './Profile.jsx'
import { cn } from '../lib/utils.js'
import { listingsApi, normalizeListing } from '../lib/api.js'
import { CONDITION_LABEL } from '../lib/constants.js'

const CATS    = ['All', 'Furniture', 'Electronics', 'Clothing', 'Sports', 'Kitchen', 'Other']
const REGIONS = ['All', 'Kreuzberg', 'Neukölln', 'Mitte', 'Prenzlauer Berg', 'Charlottenburg', 'Schöneberg', 'Friedrichshain']
const CONDS   = ['All', 'LIKE_NEW', 'GREAT', 'GOOD', 'FAIR']
const SORTS   = ['Nearest', 'Trending', 'Lowest price', 'Highest price', 'Newest']

function imageRatio(index) {
  const r = index % 3
  if (r === 0) return '68%'    // short
  if (r === 1) return '130%'   // tall
  return '100%'                 // standard
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-8 px-3.5 rounded-full text-[13px] font-medium shrink-0 border transition-colors whitespace-nowrap',
        active
          ? 'bg-zinc-900 text-white border-zinc-900'
          : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
      )}
    >
      {children}
    </button>
  )
}

function Sheet({ open, onClose, title, children }) {
  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-200',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl transition-transform duration-300 max-h-[85vh] flex flex-col',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)' }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-9 h-1 rounded-full bg-zinc-200" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 shrink-0">
          <span className="text-[17px] font-bold text-zinc-900">{title}</span>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
      </div>
    </>
  )
}

// ── Browse page ───────────────────────────────────────────────────────────────

export default function Browse({ onBack, requireAuth, currentUser, onEdit, initialQuery = '', initialSort = null, initialCat = 'All', onConsumeInitial }) {
  const [query,       setQuery]       = useState(initialQuery)
  const [cat,         setCat]         = useState(initialCat)
  const [sort,        setSort]        = useState(initialSort ?? 'Nearest')
  const [grid,        setGrid]        = useState(2)
  const [filterOpen,  setFilterOpen]  = useState(false)
  const [draftRegion, setDraftRegion] = useState('All')
  const [draftCond,    setDraftCond]    = useState('All')
  const [draftSort,    setDraftSort]    = useState('Nearest')
  const [region,       setRegion]       = useState('All')
  const [cond,         setCond]         = useState('All')
  const [selectedItem,   setSelectedItem]   = useState(null)
  const [selectedAdvert, setSelectedAdvert] = useState(null)
  const [items,        setItems]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [fetchError,   setFetchError]   = useState(null)
  const listScrollRef = useRef(0)

  useEffect(() => {
    listingsApi.getAll()
      .then(data => setItems((Array.isArray(data) ? data : []).map(normalizeListing)))
      .catch(e => setFetchError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // initialQuery/initialSort seeded our state on mount — clear them in the parent
  // so a later plain Browse visit doesn't re-apply a stale search/sort.
  useEffect(() => { onConsumeInitial?.() }, [])

  // Open item: own listing → its offers page; otherwise the buyer item view.
  // Either way remember scroll so closing restores the exact list position.
  const openItem = item => {
    listScrollRef.current = window.scrollY
    if (currentUser && item.ownerId && item.ownerId === currentUser.id) { setSelectedAdvert(item); return }
    setSelectedItem(item)
  }
  const closeItem = () => setSelectedItem(null)

  // Toggle save/like (requires auth). Updates the list from the API response.
  const toggleSave = item => {
    const run = async () => {
      try {
        const updated = normalizeListing(await listingsApi.toggleSave(item.id))
        setItems(prev => prev.map(x => x.id === updated.id
          ? { ...x, saved: updated.saved, likeCount: updated.likeCount }
          : x))
      } catch { /* ignore */ }
    }
    requireAuth ? requireAuth(run) : run()
  }

  useLayoutEffect(() => {
    window.scrollTo(0, (selectedItem || selectedAdvert) ? 0 : listScrollRef.current)
  }, [selectedItem, selectedAdvert])

  if (selectedAdvert) {
    return <MyAdvertPage advert={selectedAdvert} onBack={() => setSelectedAdvert(null)} onDelete={() => setSelectedAdvert(null)} onEdit={onEdit} />
  }
  if (selectedItem) {
    return <ItemPage item={selectedItem} allItems={items} onBack={closeItem} onSelectItem={openItem} requireAuth={requireAuth} />
  }

  const activeFilters = (region !== 'All' ? 1 : 0) + (cond !== 'All' ? 1 : 0) + (sort !== 'Nearest' ? 1 : 0)

  const openFilter  = () => { setDraftRegion(region); setDraftCond(cond); setDraftSort(sort); setFilterOpen(true) }
  const applyFilter = () => { setRegion(draftRegion); setCond(draftCond); setSort(draftSort); setFilterOpen(false) }
  const clearFilter = () => { setDraftRegion('All'); setDraftCond('All'); setDraftSort('Nearest') }

  const filtered = items
    .filter(item => {
      if (query && !item.title.toLowerCase().includes(query.toLowerCase())) return false
      if (cat !== 'All' && item.cat !== cat) return false
      if (region !== 'All' && item.region !== region) return false
      if (cond !== 'All' && item.condition !== cond) return false
      return true
    })
    .sort((a, b) => {
      switch (sort) {
        case 'Trending':      return ((b.likeCount + b.offerCount) - (a.likeCount + a.offerCount))
        case 'Lowest price':  return a.price - b.price
        case 'Highest price': return b.price - a.price
        case 'Newest':        return new Date(b.createdAt) - new Date(a.createdAt)
        default:              return 0   // 'Nearest' — keep server order
      }
    })

  return (
    <div className="min-h-screen bg-[#faf9f5] font-sans">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-zinc-200">

        {/* Search row */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-zinc-100 transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="text-zinc-700" />
          </button>

          <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg bg-zinc-100 border border-zinc-200">
            <Search size={15} className="text-zinc-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search items…"
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="flex shrink-0">
                <X size={14} className="text-zinc-400" />
              </button>
            )}
          </div>

          <button
            onClick={() => setGrid(g => g === 2 ? 1 : 2)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 shrink-0"
          >
            {grid === 2
              ? <LayoutGrid size={16} color="white" />
              : <AlignJustify size={16} color="white" />}
          </button>
        </div>

        {/* Category + filter chips */}
        <div className="scroll-row flex gap-2 overflow-x-auto px-3 pb-2.5 scroll-pl-3">
          {/* Filters button — mobile only (desktop uses sidebar) */}
          <button
            onClick={openFilter}
            className={cn(
              'md:hidden h-8 px-3 rounded-full text-[13px] font-semibold shrink-0 border flex items-center gap-1.5 transition-colors',
              activeFilters > 0
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
            )}
          >
            <SlidersHorizontal size={13} />
            Filters{activeFilters > 0 ? ` · ${activeFilters}` : ''}
          </button>

          <div className="md:hidden w-px h-8 bg-zinc-200 shrink-0 self-center" />

          {CATS.map(c => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
          ))}
          <div className="w-3 shrink-0" />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="md:flex md:max-w-screen-xl md:mx-auto">

        {/* Desktop sidebar filters */}
        <aside className="hidden md:flex flex-col gap-6 w-56 lg:w-64 shrink-0 p-6 border-r border-zinc-100 sticky top-[105px] self-start h-[calc(100vh-105px)] overflow-y-auto">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Sort by</p>
            {SORTS.map(s => (
              <button key={s} onClick={() => setSort(s)}
                className={cn('w-full flex items-center justify-between px-2 py-2 rounded-md text-sm mb-0.5 transition-colors', sort === s ? 'bg-zinc-100 font-semibold text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50')}>
                {s}
                {sort === s && <Check size={14} className="text-zinc-900" />}
              </button>
            ))}
          </div>

          <Separator />

          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Region</p>
            <div className="flex flex-col gap-0.5">
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegion(r)}
                  className={cn('w-full flex items-center justify-between px-2 py-2 rounded-md text-sm transition-colors', region === r ? 'bg-zinc-100 font-semibold text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50')}>
                  {r}
                  {region === r && <Check size={14} className="text-zinc-900" />}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Condition</p>
            <div className="flex flex-wrap gap-2">
              {CONDS.map(c => (
                <Chip key={c} active={cond === c} onClick={() => setCond(c)}>{c === 'All' ? 'All' : CONDITION_LABEL[c]}</Chip>
              ))}
            </div>
          </div>
        </aside>

        {/* Items area */}
        <div className="flex-1 min-w-0 px-3 md:px-6 pt-3 pb-10">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-900 animate-spin mb-3" />
              <p className="text-sm text-zinc-400">Loading listings…</p>
            </div>
          )}

          {/* Fetch error */}
          {fetchError && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm font-semibold text-zinc-900 mb-1">Couldn't load listings</p>
              <p className="text-xs text-zinc-400 mb-4">{fetchError}</p>
              <Button variant="outline" size="sm" onClick={() => {
                setLoading(true); setFetchError(null)
                listingsApi.getAll()
                  .then(data => setItems((Array.isArray(data) ? data : []).map(normalizeListing)))
                  .catch(e => setFetchError(e.message))
                  .finally(() => setLoading(false))
              }}>Retry</Button>
            </div>
          )}

          {/* Results — only shown once loaded */}
          {!loading && !fetchError && (<>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400 font-medium">
                {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={openFilter}
                className="md:hidden text-xs text-zinc-500 font-medium flex items-center gap-1 hover:text-zinc-900 transition-colors"
              >
                Sort: <span className="text-zinc-900 font-semibold">{sort}</span>
              </button>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                  <Search size={22} className="text-zinc-400" />
                </div>
                <p className="text-base font-semibold text-zinc-900 mb-1">No results</p>
                <p className="text-sm text-zinc-400 mb-5">Try a different search or adjust your filters.</p>
                <Button variant="outline" size="sm" onClick={() => { setQuery(''); setCat('All'); setRegion('All'); setCond('All') }}>
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Grid view */}
            {filtered.length > 0 && grid === 2 && (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
                {filtered.map((item, i) => (
                  <div key={item.id} className="break-inside-avoid mb-3 cursor-pointer" onClick={() => openItem(item)}>
                    <ListCard
                      title={item.title}
                      meta={item.region ? `₦${item.price} · ${item.region}` : `₦${item.price}`}
                      tag={CONDITION_LABEL[item.condition] ?? item.condition}
                      rating={item.rating}
                      reviews={item.reviews}
                      saved={item.saved}
                      likeCount={item.likeCount}
                      offerCount={item.offerCount}
                      image={item.images?.[0]}
                      imageRatio={imageRatio(i)}
                      onSave={() => toggleSave(item)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* List view */}
            {filtered.length > 0 && grid === 1 && (
              <div className="flex flex-col divide-y divide-zinc-100">
                {filtered.map(item => (
                  <div key={item.id} className="flex gap-3 py-3.5 cursor-pointer" onClick={() => openItem(item)}>
                    <div className="w-20 h-16 md:w-24 md:h-20 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 shrink-0 overflow-hidden">
                      {item.images?.[0] && (
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[15px] font-bold text-zinc-900 leading-tight truncate">{item.title}</p>
                          <p className="text-[15px] font-black text-zinc-900 shrink-0">₦{item.price}</p>
                        </div>
                        {item.region && <p className="text-xs text-zinc-400 mt-0.5">{item.region}</p>}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[11px] py-0 px-2 rounded-full">
                          {CONDITION_LABEL[item.condition] ?? item.condition}
                        </Badge>
                        {item.rating && (
                          <span className="flex items-center gap-1">
                            <Star size={11} fill="#18181b" stroke="none" />
                            <span className="text-xs font-semibold text-zinc-900">{item.rating}</span>
                            <span className="text-xs text-zinc-400">({item.reviews})</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>)}
        </div>
      </div>

      {/* ── Filter sheet (mobile) — includes sort, region, condition ── */}
      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter & sort">
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-zinc-400">{activeFilters > 0 ? `${activeFilters} active` : 'None active'}</span>
          <button onClick={clearFilter} className="text-sm text-zinc-400 underline underline-offset-2">Clear all</button>
        </div>

        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Sort by</p>
        <div className="flex flex-col mb-6">
          {SORTS.map(s => (
            <button
              key={s}
              onClick={() => setDraftSort(s)}
              className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0"
            >
              <span className={cn('text-[15px]', draftSort === s ? 'font-semibold text-zinc-900' : 'text-zinc-500')}>{s}</span>
              {draftSort === s && <Check size={16} className="text-zinc-900" />}
            </button>
          ))}
        </div>

        <Separator className="mb-6" />

        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Region</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {REGIONS.map(r => (
            <Chip key={r} active={draftRegion === r} onClick={() => setDraftRegion(r)}>{r}</Chip>
          ))}
        </div>

        <Separator className="mb-6" />

        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Condition</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {CONDS.map(c => (
            <Chip key={c} active={draftCond === c} onClick={() => setDraftCond(c)}>{c === 'All' ? 'All' : CONDITION_LABEL[c]}</Chip>
          ))}
        </div>

        <Button className="w-full h-12 text-base" onClick={applyFilter}>
          Show {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </Button>
      </Sheet>

    </div>
  )
}
