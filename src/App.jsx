import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Menu, ArrowRight, Package, Search, CreditCard, Star, ChevronDown, Plus,
         Monitor, Car, Shirt, Armchair, Sofa, UtensilsCrossed, Dumbbell, BookOpen } from 'lucide-react'
import MobileDrawer from './components/MobileDrawer.jsx'
import Browse from './pages/Browse.jsx'
import Auth from './pages/Auth.jsx'
import Upload from './pages/Upload.jsx'
import Profile, { MyAdvertPage } from './pages/Profile.jsx'
import Help from './pages/Help.jsx'
import NotFound from './pages/NotFound.jsx'
import ItemPage from './pages/ItemPage.jsx'
import Admin from './pages/Admin.jsx'
import { setToken, clearToken, authApi, listingsApi, normalizeListing, recordVisit } from './lib/api.js'
import { Button } from './components/ui/button.jsx'
import { Badge } from './components/ui/badge.jsx'
import { Separator } from './components/ui/separator.jsx'
import { Card, CardContent } from './components/ui/card.jsx'
import ListCard from './components/ListCard.jsx'

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = price => `₦${Number(price).toLocaleString('en-NG')}`

// ── Static marketing content ──────────────────────────────────────────────────

const TESTIMONIALS = [
  { quote: 'Listed my old AC and generator before moving office. Both sold in 3 days. Super smooth.',  name: 'Emeka O.',  role: 'Wuse 2, Abuja',   initial: 'E' },
  { quote: 'Got ₦85k for stuff I was going to throw away. Buyer came straight to my house.',          name: 'Fatima A.', role: 'Gwarinpa, Abuja', initial: 'F' },
  { quote: 'No stress, no random calls. Buyer saw it, liked it, paid securely through the app.',       name: 'Chidi N.',  role: 'Garki, Abuja',    initial: 'C' },
]

const STATS = [
  { value: '2,400+',  label: 'Items sold' },
  { value: '₦180M+', label: 'Paid to sellers' },
  { value: 'Abuja',   label: 'Currently serving' },
]

const STEPS = [
  { step: '01', Icon: Package,    title: 'List your item',     body: 'Take your own photos, set a price and write a description. We review your listing and put it live.' },
  { step: '02', Icon: Search,     title: 'Buyers find you',    body: 'Interested buyers browse your listing, make an offer, or buy at your price — all through muvaz.' },
  { step: '03', Icon: CreditCard, title: 'They come to you',   body: 'The buyer inspects and picks up the item from you directly. Payment is handled securely through muvaz.' },
]

const NAV_LINKS = ['Browse', 'How it works', 'Pricing', 'About']

// Top-categories grid — labels map to real backend category strings so each tile filters Browse
const CATEGORY_TILES = [
  { label: 'Electronics', cat: 'Electronics',      Icon: Monitor },
  { label: 'Vehicles',    cat: 'Cars & Vehicles',  Icon: Car },
  { label: 'Fashion',     cat: 'Clothing & Shoes', Icon: Shirt },
  { label: 'Furniture',   cat: 'Furniture',        Icon: Armchair },
  { label: 'Home',        cat: 'Home Décor',       Icon: Sofa },
  { label: 'Kitchen',     cat: 'Kitchen',          Icon: UtensilsCrossed },
  { label: 'Sports',      cat: 'Sports & Fitness', Icon: Dumbbell },
  { label: 'Books',       cat: 'Books & Media',    Icon: BookOpen },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function Stars({ size = 13 }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map(i => <Star key={i} size={size} fill="#18181b" stroke="none" />)}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <Badge variant="secondary" className="mb-3 text-[11px] font-semibold tracking-widest uppercase rounded-full">
      {children}
    </Badge>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [page, setPage] = useState('home')
  const [editItem,     setEditItem]     = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentUser,       setCurrentUser]       = useState(null)
  const [authLoading,       setAuthLoading]       = useState(true)
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null)
  const [activeListings, setActiveListings] = useState([])
  const [soldListings,   setSoldListings]   = useState([])
  const [verifiedNotice, setVerifiedNotice] = useState(null)   // 'success' | 'error' | null
  const [heroQuery,      setHeroQuery]      = useState('')      // search box on the home hero
  const [browseQuery,    setBrowseQuery]    = useState('')      // seed query passed into Browse
  const [browseSort,     setBrowseSort]     = useState(null)    // seed sort passed into Browse
  const [browseCat,      setBrowseCat]      = useState('All')   // seed category passed into Browse

  // ── On mount: restore session + handle OAuth callback ───────────────────────
  useEffect(() => {
    recordVisit()
    const params = new URLSearchParams(window.location.search)
    const oauthToken = params.get('token')

    const init = async () => {
      // Email verification redirect from the backend link
      const verified = params.get('verified')
      if (verified) {
        window.history.replaceState({}, '', '/')
        setVerifiedNotice(verified === '1' ? 'success' : 'error')
        setPage('auth')
        setAuthLoading(false)
        return
      }

      // OAuth failure redirect — show auth page with error
      if (params.get('error')) {
        window.history.replaceState({}, '', '/')
        setPage('auth')
        setAuthLoading(false)
        return
      }

      const token = oauthToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('muvaz_token') : null)
      if (!token) {
        const hasVisited = localStorage.getItem('muvaz_visited')
        if (!hasVisited) {
          localStorage.setItem('muvaz_visited', '1')
          setPage('auth')
        }
        setAuthLoading(false)
        return
      }

      if (oauthToken) {
        setToken(oauthToken)
        window.history.replaceState({}, '', '/')
      }

      try {
        const user = await authApi.me()
        setCurrentUser(user)
        if (!user.profileComplete) {
          setPendingGoogleUser(user)
          setPage('auth')
        }
      } catch {
        clearToken()
      } finally {
        setAuthLoading(false)
      }
    }

    init()
  }, [])

  // ── Listen for token expiry from api.js ─────────────────────────────────────
  useEffect(() => {
    const handler = () => { setCurrentUser(null); setPage('auth') }
    window.addEventListener('muvaz:unauthenticated', handler)
    return () => window.removeEventListener('muvaz:unauthenticated', handler)
  }, [])

  // ── Redirect logged-in users away from the auth page ────────────────────────
  useEffect(() => {
    if (page === 'auth' && currentUser) setPage('home')
  }, [page, currentUser])

  // ── Fetch homepage listings ──────────────────────────────────────────────────
  useEffect(() => {
    listingsApi.getAll({ status: 'ACTIVE' })
      .then(data => setActiveListings(data.map(normalizeListing)))
      .catch(() => {})
    listingsApi.getAll({ status: 'SOLD' })
      .then(data => setSoldListings(data.map(normalizeListing)))
      .catch(() => {})
  }, [])

  // ── Navigation stack with per-frame scroll memory ───────────────────────────
  // The app is single-URL/state-based, so we keep our own history stack. Each
  // forward navigation saves the current scroll position; going back restores it.
  const historyRef       = useRef([])
  const pendingScrollRef = useRef(null)

  const navTo = (nextPage, { item, editItem: ed } = {}) => {
    historyRef.current.push({ page, selectedItem, editItem, scrollY: window.scrollY })
    if (item !== undefined) setSelectedItem(item)
    if (ed   !== undefined) setEditItem(ed)
    pendingScrollRef.current = 0
    window.history.pushState({ depth: historyRef.current.length }, '')
    setPage(nextPage)
  }

  // In-app back delegates to the browser so the OS/hardware back button stays in sync
  const navBack = () => {
    if (historyRef.current.length > 0) window.history.back()
    else setPage('home')
  }

  // Browser/OS back → pop our stack and restore page + scroll
  useEffect(() => {
    const onPop = () => {
      const frame = historyRef.current.pop()
      if (!frame) { pendingScrollRef.current = 0; setPage('home'); return }
      setSelectedItem(frame.selectedItem)
      setEditItem(frame.editItem)
      pendingScrollRef.current = frame.scrollY
      setPage(frame.page)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Apply the pending scroll target after the new page has rendered
  useLayoutEffect(() => {
    if (pendingScrollRef.current != null) {
      window.scrollTo(0, pendingScrollRef.current)
      pendingScrollRef.current = null
    }
  }, [page, selectedItem, editItem])

  // Open Browse, optionally seeded with a search query and/or sort (cleared after Browse reads them)
  const goBrowse = ({ query = '', sort = null, cat = 'All' } = {}) => {
    setBrowseQuery(query)
    setBrowseSort(sort)
    setBrowseCat(cat)
    navTo('browse')
  }

  // Seller opening the offers view for their own listing → push the advert page onto the stack
  const manageListing = item => navTo('advert', { item })

  // Tapping a listing: own item → go straight to its offers page; otherwise open the item
  const openItem = item => {
    if (currentUser && item.ownerId && item.ownerId === currentUser.id) { manageListing(item); return }
    navTo('item', { item })
  }
  const closeItem = () => navBack()

  // Toggle save/like on a listing (requires auth). Updates both lists from the API response.
  const toggleSave = item => requireAuth(async () => {
    try {
      const updated = normalizeListing(await listingsApi.toggleSave(item.id))
      const apply = arr => arr.map(x => x.id === updated.id ? { ...x, saved: updated.saved, likeCount: updated.likeCount } : x)
      setActiveListings(apply)
      setSoldListings(apply)
    } catch { /* ignore — heart simply won't change */ }
  })

  const handleSignOut = () => { clearToken(); setCurrentUser(null); historyRef.current = []; setPage('home') }

  // Lazy auth gate — call this before any action requiring login
  const requireAuth = (then) => {
    if (currentUser) { then(); return true }
    navTo('auth')
    return false
  }

  // ── Auth loading splash ─────────────────────────────────────────────────────
  if (authLoading) return (
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
      <p className="font-extrabold text-xl tracking-tight text-zinc-300 select-none animate-pulse">muvaz.</p>
    </div>
  )

  // ── Force profile completion (WhatsApp) before the app is usable ────────────
  // A logged-in user without a completed profile (e.g. fresh Google sign-in) must
  // add their WhatsApp number first — there is no way around this screen.
  if (currentUser && !currentUser.profileComplete) return <Auth
    pendingGoogleUser={currentUser}
    onSuccess={user => { setCurrentUser(user); setPendingGoogleUser(null); historyRef.current = []; setPage('home') }}
  />

  if (page === 'browse')  return <Browse onBack={navBack} requireAuth={requireAuth} currentUser={currentUser} onEdit={item => navTo('edit', { editItem: item })} initialQuery={browseQuery} initialSort={browseSort} initialCat={browseCat} onConsumeInitial={() => { setBrowseQuery(''); setBrowseSort(null); setBrowseCat('All') }} />
  if (page === 'auth')    return <Auth
    onBack={navBack}
    pendingGoogleUser={pendingGoogleUser}
    verifiedNotice={verifiedNotice}
    onSuccess={user => { localStorage.setItem('muvaz_visited', '1'); setCurrentUser(user); setPendingGoogleUser(null); historyRef.current = []; setPage('home') }}
  />
  if (page === 'upload')  return currentUser
    ? <Upload onBack={navBack} />
    : (() => { setPage('auth'); return null })()
  if (page === 'profile') return currentUser
    ? <Profile currentUser={currentUser} onNavigate={p => navTo(p)} onSignOut={handleSignOut} onEdit={item => navTo('edit', { editItem: item })} />
    : (() => { setPage('auth'); return null })()
  if (page === 'advert') return currentUser
    ? <MyAdvertPage advert={selectedItem} onBack={navBack} onDelete={() => {}} onEdit={item => navTo('edit', { editItem: item })} />
    : (() => { setPage('auth'); return null })()
  if (page === 'edit') return currentUser
    ? <Upload initialItem={editItem} onBack={navBack} onSuccess={navBack} />
    : (() => { setPage('auth'); return null })()
  if (page === 'help')    return <Help onNavigate={p => navTo(p)} />
  if (page === 'admin')   return <Admin onNavigate={p => navTo(p)} />
  if (page === 'item')    return <ItemPage item={selectedItem} allItems={activeListings} onBack={closeItem} onSelectItem={openItem} requireAuth={requireAuth} />
  if (page !== 'home')    return <NotFound onNavigate={p => navTo(p)} />

  return (
    <div className="min-h-screen bg-[#faf9f5] font-sans">

      {/* ── Announcement bar ── */}
      <div className="bg-zinc-900 text-white text-[11px] font-medium py-2 flex justify-center gap-5 tracking-wide select-none">
        <span>Free to list</span>
        <span className="opacity-25">·</span>
        <span>Secure payment</span>
        <span className="opacity-25">·</span>
        <span>Abuja's marketplace</span>
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
        <div className="flex items-center justify-between h-14 px-4 md:h-16 md:px-8 max-w-screen-xl mx-auto">

          {/* Wordmark */}
          <button onClick={() => navTo('home')} className="font-extrabold text-xl tracking-tight text-zinc-900 select-none bg-transparent border-none cursor-pointer p-0">
            muvaz<span className="text-zinc-300">.</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(n => (
              <button key={n} onClick={() => {
                if (n === 'Browse') navTo('browse')
                else navTo('help')   // How it works / Pricing / About all live on Help for now
              }} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium bg-transparent border-none cursor-pointer p-0">{n}</button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {currentUser ? (
              <button onClick={() => navTo('profile')}
                className="flex items-center gap-2 h-9 px-3 rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors text-sm font-medium text-zinc-700">
                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {currentUser.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                {currentUser.name?.split(' ')[0]}
              </button>
            ) : (
              <Button variant="ghost" size="sm" className="text-zinc-600" onClick={() => navTo('auth')}>Sign in</Button>
            )}
            <Button size="sm" onClick={() => requireAuth(() => navTo('upload'))}>Start selling</Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-zinc-100 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile slide-in drawer */}
      <MobileDrawer
        open={menuOpen}
        currentUser={currentUser}
        onClose={() => setMenuOpen(false)}
        onSignOut={handleSignOut}
        onNavigate={label => {
          if (label === 'Home')               navTo('home')
          if (label === 'Browse items')      navTo('browse')
          if (label === 'List an item')      requireAuth(() => navTo('upload'))
          if (label === 'My profile')        navTo('profile')
          if (label === 'Sign in / Sign up') navTo('auth')
          if (label === 'Admin panel')       navTo('admin')
          setMenuOpen(false)
        }}
      />

      {/* ── Hero — search-led ── */}
      <section className="px-5 pt-8 pb-6 md:pt-12 md:pb-10 max-w-screen-md mx-auto md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-5">
          What are you selling today?
        </h1>

        {/* Search bar */}
        <form
          onSubmit={e => { e.preventDefault(); goBrowse({ query: heroQuery.trim() }) }}
          className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-zinc-100 border border-zinc-200 focus-within:border-zinc-400 transition-colors"
        >
          <Search size={18} className="text-zinc-500 shrink-0" />
          <input
            value={heroQuery}
            onChange={e => setHeroQuery(e.target.value)}
            placeholder="Search the marketplace…"
            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-zinc-900 placeholder:text-zinc-400"
          />
          <span className="w-px h-5 bg-zinc-300 shrink-0" />
          <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900 shrink-0 select-none">
            Abuja <ChevronDown size={14} className="text-zinc-500" />
          </span>
        </form>

        {/* Quick actions */}
        <div className="scroll-row flex gap-2.5 overflow-x-auto mt-3.5 -mx-5 px-5 md:mx-0 md:px-0">
          <button
            onClick={() => requireAuth(() => navTo('upload'))}
            className="shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-full bg-zinc-900 text-white text-[13px] font-semibold"
          >
            <Plus size={14} strokeWidth={2.5} /> Post ad
          </button>
          <button
            onClick={() => goBrowse({ sort: 'Trending' })}
            className="shrink-0 h-9 px-4 rounded-full bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold hover:border-zinc-400 transition-colors"
          >
            Trending
          </button>
          <button
            onClick={() => navTo('help')}
            className="shrink-0 h-9 px-4 rounded-full bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold hover:border-zinc-400 transition-colors"
          >
            How to sell
          </button>
        </div>
      </section>

      {/* ── Top categories ── */}
      <section className="px-5 pb-8 md:px-8 max-w-screen-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Top categories</h2>
          <button onClick={() => goBrowse({})} className="text-sm font-semibold text-zinc-900 underline underline-offset-2">
            See all
          </button>
        </div>
        <div className="grid grid-cols-4 gap-x-3 gap-y-4">
          {CATEGORY_TILES.map(({ label, cat, Icon }) => (
            <button key={label} onClick={() => goBrowse({ cat })} className="flex flex-col items-center gap-2 group">
              <span className="w-full aspect-square rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:border-zinc-300 transition-colors">
                <Icon size={22} className="text-zinc-800" strokeWidth={1.75} />
              </span>
              <span className="text-[12px] font-medium text-zinc-700">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Stats strip — desktop only ── */}
      <div className="hidden md:block border-y border-zinc-200 bg-zinc-50">
        <div className="max-w-screen-xl mx-auto grid grid-cols-3 divide-x divide-zinc-200">
          {STATS.map(s => (
            <div key={s.label} className="flex flex-col items-center justify-center py-6 px-3 text-center gap-0.5">
              <span className="text-3xl font-black text-zinc-900 tracking-tight">{s.value}</span>
              <span className="text-sm text-zinc-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Listed in Abuja ── */}
      <section className="pt-6 pb-12 md:py-16 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between px-5 md:px-8 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">Recommended for you</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-zinc-500 gap-1 -mr-2" onClick={() => navTo('browse')}>
            See all <ArrowRight size={13} />
          </Button>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {activeListings.map(item => (
            <div key={item.id} className="w-44 shrink-0 cursor-pointer" style={{ scrollSnapAlign: 'start' }} onClick={() => openItem(item)}>
              <ListCard title={item.title} meta={`${fmt(item.price)} · Abuja`} tag={item.condition} likeCount={item.likeCount} saved={item.saved} offerCount={item.offerCount} image={item.images?.[0]} onSave={() => toggleSave(item)} />
            </div>
          ))}
          <div className="w-5 shrink-0" />
        </div>

        {/* Desktop: 4-col grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 px-8">
          {activeListings.map(item => (
            <div key={item.id} className="cursor-pointer" onClick={() => openItem(item)}>
              <ListCard title={item.title} meta={`${fmt(item.price)} · Abuja`} tag={item.condition} likeCount={item.likeCount} saved={item.saved} offerCount={item.offerCount} image={item.images?.[0]} onSave={() => toggleSave(item)} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Recently sold ── */}
      {soldListings.length > 0 && (
      <section className="pb-12 md:pb-16 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between px-5 md:px-8 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">Recently sold</h2>
            <p className="text-xs text-zinc-400 mt-0.5 font-medium">Sold in the last 7 days</p>
          </div>
          <Button variant="ghost" size="sm" className="text-zinc-500 gap-1 -mr-2" onClick={() => navTo('browse')}>
            See all <ArrowRight size={13} />
          </Button>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {soldListings.map(item => (
            <div key={item.id} className="w-44 shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <ListCard title={item.title} meta={`${fmt(item.price)} · Abuja`} tag={item.condition} likeCount={item.likeCount} sold hideSave image={item.images?.[0]} />
            </div>
          ))}
          <div className="w-5 shrink-0" />
        </div>

        {/* Desktop: 6-col grid */}
        <div className="hidden md:grid md:grid-cols-6 gap-5 px-8">
          {soldListings.map(item => (
            <div key={item.id}>
              <ListCard title={item.title} meta={`${fmt(item.price)} · Abuja`} tag={item.condition} likeCount={item.likeCount} sold hideSave image={item.images?.[0]} />
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── How it works ── */}
      <section className="py-12 md:py-20 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-screen-xl mx-auto">

          <div className="px-5 md:px-8 mb-8 md:text-center">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Three steps. That's it.</h2>
            <p className="text-sm md:text-base text-zinc-500 mt-2 max-w-sm mx-auto">
              List it, get an offer, collect your money.
            </p>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {STEPS.map(({ step, Icon, title, body }) => (
              <Card key={step} className="w-64 shrink-0 border-zinc-200 bg-white" style={{ scrollSnapAlign: 'start' }}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
                      <Icon size={18} color="white" />
                    </div>
                    <span className="font-mono text-sm font-semibold text-zinc-200">{step}</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
                </CardContent>
              </Card>
            ))}
            <div className="w-5 shrink-0" />
          </div>

          {/* Desktop: 3-col grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 px-8">
            {STEPS.map(({ step, Icon, title, body }) => (
              <Card key={step} className="border-zinc-200 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center">
                      <Icon size={22} color="white" />
                    </div>
                    <span className="font-mono text-base font-semibold text-zinc-200">{step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-12 md:py-20 max-w-screen-xl mx-auto">
        <div className="px-5 md:px-8 mb-8 md:text-center">
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">What sellers say</h2>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {TESTIMONIALS.map(t => (
            <Card key={t.name} className="w-[300px] shrink-0 border-zinc-200" style={{ scrollSnapAlign: 'start' }}>
              <CardContent className="p-5">
                <Stars size={13} />
                <p className="text-sm text-zinc-700 leading-relaxed mt-3 mb-4">"{t.quote}"</p>
                <Separator className="mb-4" />
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0">{t.initial}</div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 leading-none">{t.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="w-5 shrink-0" />
        </div>

        {/* Desktop: 3-col grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 px-8">
          {TESTIMONIALS.map(t => (
            <Card key={t.name} className="border-zinc-200">
              <CardContent className="p-8">
                <Stars size={14} />
                <p className="text-sm text-zinc-700 leading-relaxed mt-4 mb-6">"{t.quote}"</p>
                <Separator className="mb-5" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold shrink-0">{t.initial}</div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 leading-none">{t.name}</p>
                    <p className="text-xs text-zinc-400 mt-1">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-zinc-900 text-white py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-screen-sm mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            Ready to<br />declutter?
          </h2>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
            Free to list. 5% on sale. Buyer comes to you — you just get paid.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 w-full sm:w-auto h-12 px-7 text-base gap-2" onClick={() => navTo('upload')}>
              List your first item <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 w-full sm:w-auto h-12 px-7 text-base"
              onClick={() => navTo('browse')}>
              Browse items
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 md:px-8 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {[
              { head: 'Marketplace', links: ['Browse items', 'List an item', 'How it works', 'Pricing'] },
              { head: 'Company',     links: ['About us', 'Blog', 'Careers', 'Press'] },
              { head: 'Support',     links: ['Help centre', 'Contact us', 'Trust & safety', 'Report an issue'] },
              { head: 'Legal',       links: ['Privacy policy', 'Terms of service', 'Cookie settings'] },
            ].map(col => (
              <div key={col.head}>
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">{col.head}</p>
                <ul className="flex flex-col gap-2 list-none p-0 m-0">
                  {col.links.map(l => {
                    const route = {
                      'Browse items': 'browse', 'List an item': 'upload',
                      'How it works': 'help', 'Help centre': 'help',
                      'Contact us': 'help', 'Report an issue': 'help',
                    }[l]
                    return (
                      <li key={l}>
                        <button onClick={() => route && navTo(route)}
                          className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors bg-transparent border-none cursor-pointer p-0 text-left">{l}</button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="mb-6" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="font-extrabold text-xl tracking-tight text-zinc-900 select-none">
              muvaz<span className="text-zinc-300">.</span>
            </span>
            <p className="text-xs text-zinc-400">© 2026 muvaz.online · Made in Abuja</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
