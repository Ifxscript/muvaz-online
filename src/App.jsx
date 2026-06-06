import { useState, useEffect } from 'react'
import { Menu, ArrowRight, Package, Truck, CreditCard, Star, Check } from 'lucide-react'
import MobileDrawer from './components/MobileDrawer.jsx'
import Browse from './pages/Browse.jsx'
import Auth from './pages/Auth.jsx'
import Upload from './pages/Upload.jsx'
import Profile from './pages/Profile.jsx'
import Help from './pages/Help.jsx'
import NotFound from './pages/NotFound.jsx'
import ItemPage from './pages/ItemPage.jsx'
import { ITEMS as ALL_ITEMS } from './data/items.js'
import { Button } from './components/ui/button.jsx'
import { Badge } from './components/ui/badge.jsx'
import { Separator } from './components/ui/separator.jsx'
import { Card, CardContent } from './components/ui/card.jsx'
import ListCard from './components/ListCard.jsx'

// ── Data ──────────────────────────────────────────────────────────────────────

const ITEMS = ALL_ITEMS.slice(0, 8)

const TESTIMONIALS = [
  { quote: 'Moved to Lisbon in two weeks. Muvaz cleared the whole flat. I never met a single buyer.',     name: 'Ana M.', role: 'Neukölln → Lisbon',    initial: 'A' },
  { quote: 'Listed 15 items before my move. Every single one sold within 4 days. Unreal service.',        name: 'Tom K.', role: 'Berlin → Amsterdam',    initial: 'T' },
  { quote: "Didn't have to deal with a single stranger. Just dropped the stuff off and got paid.",         name: 'Sara L.', role: 'Prenzlauer Berg',      initial: 'S' },
]

const STATS = [
  { value: '12 400+', label: 'Items sold' },
  { value: '£1.2M',   label: 'Paid to sellers' },
  { value: '6',       label: 'Cities active' },
]

const SOLD = [
  { id: 1, title: 'Dining table, oak',   meta: '£95 · Prenzlauer Berg',  tag: 'Good',     rating: '4.7', reviews: '5' },
  { id: 2, title: 'KitchenAid mixer',    meta: '£110 · Charlottenburg',  tag: 'Like new', rating: '4.9', reviews: '18' },
  { id: 3, title: 'Brass floor lamp',    meta: '£35 · Friedrichshain',   tag: 'Good',     rating: '4.4', reviews: '7' },
  { id: 4, title: 'Velvet dining chair', meta: '£60 · Kreuzberg',        tag: 'Like new', rating: '4.6', reviews: '9' },
  { id: 5, title: 'Road bike 54cm',      meta: '£185 · Mitte',           tag: 'Good',     rating: '4.5', reviews: '14' },
  { id: 6, title: 'Bookshelf, oak',      meta: '£55 · Friedrichshain',   tag: 'Good',     rating: '4.3', reviews: '9' },
]

const STEPS = [
  { step: '01', Icon: Package,    title: 'You list',     body: 'Snap a few photos and set a price. Our team reviews, writes the copy, and prices it right.' },
  { step: '02', Icon: Truck,      title: 'We sell',      body: 'Buyers reserve through muvaz. You stay completely anonymous throughout the process.' },
  { step: '03', Icon: CreditCard, title: 'You get paid', body: 'We collect, deliver, and transfer the cash to your account within 48 hours of sale.' },
]

const NAV_LINKS = ['Browse', 'How it works', 'Pricing', 'About']

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
  const [editItem, setEditItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [page])

  const openItem = item => { setSelectedItem(item); setPage('item') }
  const closeItem = () => { setSelectedItem(null); setPage('home') }

  if (page === 'browse')  return <Browse onBack={() => setPage('home')} />
  if (page === 'auth')    return <Auth onBack={() => setPage('home')} onSuccess={() => setPage('home')} />
  if (page === 'upload')  return <Upload onBack={() => setPage('home')} />
  if (page === 'profile') return (
    <Profile
      onNavigate={setPage}
      onEdit={item => { setEditItem(item); setPage('edit') }}
    />
  )
  if (page === 'edit') return (
    <Upload
      initialItem={editItem}
      onBack={() => setPage('profile')}
      onSuccess={() => { setEditItem(null); setPage('profile') }}
    />
  )
  if (page === 'help')    return <Help onNavigate={setPage} />
  if (page === 'item')    return <ItemPage item={selectedItem} allItems={ALL_ITEMS} onBack={closeItem} onSelectItem={openItem} />
  if (page !== 'home')    return <NotFound onNavigate={setPage} />

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Announcement bar ── */}
      <div className="bg-zinc-900 text-white text-[11px] font-medium py-2 flex justify-center gap-5 tracking-wide select-none">
        <span>We pick up</span>
        <span className="opacity-25">·</span>
        <span>We vet buyers</span>
        <span className="opacity-25">·</span>
        <span>You never meet a stranger</span>
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
        <div className="flex items-center justify-between h-14 px-4 md:h-16 md:px-8 max-w-screen-xl mx-auto">

          {/* Wordmark */}
          <button onClick={() => setPage('home')} className="font-extrabold text-xl tracking-tight text-zinc-900 select-none bg-transparent border-none cursor-pointer p-0">
            muvaz<span className="text-zinc-300">.</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(n => (
              <button key={n} onClick={() => {
                if (n === 'Browse') setPage('browse')
                else if (n === 'How it works') setPage('help')
              }} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium bg-transparent border-none cursor-pointer p-0">{n}</button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-zinc-600" onClick={() => setPage('auth')}>Sign in</Button>
            <Button size="sm" onClick={() => setPage('upload')}>Start selling</Button>
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
        onClose={() => setMenuOpen(false)}
        onNavigate={label => {
          if (label === 'Home')               setPage('home')
          if (label === 'Browse items')      setPage('browse')
          if (label === 'List an item')      setPage('upload')
          if (label === 'My profile')        setPage('profile')
          if (label === 'Sign in / Sign up') setPage('auth')
          setMenuOpen(false)
        }}
      />

      {/* ── Hero ── */}
      <section className="px-5 py-12 md:py-20 max-w-screen-xl mx-auto md:px-8">
        <div className="md:grid md:grid-cols-[1fr_1fr] md:gap-14 lg:gap-20 md:items-center">

          {/* Left: copy */}
          <div className="mb-10 md:mb-0">
            <div className="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 shrink-0" />
              <span className="text-xs font-semibold text-zinc-600 tracking-wide">Declutter marketplace · Berlin</span>
            </div>

            <h1 className="text-[2.6rem] md:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.05] text-zinc-900 mb-4">
              Moving out?<br />
              Have old stuff?<br />
              <span className="text-zinc-400">We'll sell it.</span>
            </h1>

            <p className="text-base md:text-lg text-zinc-500 leading-relaxed mb-6 max-w-[420px]">
              List your items — we photograph, vet buyers, arrange pickup and delivery, then send you the cash. You never deal with a stranger.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
              {['Free to list', '5% on sale only', 'Zero stranger contact'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <Check size={13} className="text-zinc-900 shrink-0" strokeWidth={2.5} />
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-7" onClick={() => setPage('browse')}>
                Browse items <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-7" onClick={() => setPage('upload')}>
                List an item
              </Button>
            </div>

            {/* Stats — single line, mobile only */}
            <div className="md:hidden flex items-center gap-2 text-[12px] text-zinc-400 font-medium flex-wrap">
              {STATS.map((s, i) => (
                <span key={s.label} className="flex items-center gap-2">
                  {i > 0 && <span className="opacity-40">·</span>}
                  <span className="font-bold text-zinc-700">{s.value}</span>
                  <span>{s.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: item grid — desktop only */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {ITEMS.slice(0, 4).map(item => (
              <div key={item.id} className="cursor-pointer" onClick={() => openItem(item)}>
                <ListCard
                  title={item.title} meta={`£${item.price} · ${item.region}`}
                  tag={item.condition} rating={item.rating}
                  reviews={item.reviews} saved={item.saved}
                />
              </div>
            ))}
          </div>
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

      {/* ── Listed near you ── */}
      <section className="pt-6 pb-12 md:py-16 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between px-5 md:px-8 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">Listed near you</h2>
            <p className="text-xs text-zinc-400 mt-0.5 font-medium">Berlin · Updated today</p>
          </div>
          <Button variant="ghost" size="sm" className="text-zinc-500 gap-1 -mr-2" onClick={() => setPage('browse')}>
            See all <ArrowRight size={13} />
          </Button>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {ITEMS.map(item => (
            <div key={item.id} className="w-44 shrink-0 cursor-pointer" style={{ scrollSnapAlign: 'start' }} onClick={() => openItem(item)}>
              <ListCard title={item.title} meta={`£${item.price} · ${item.region}`} tag={item.condition} rating={item.rating} reviews={item.reviews} saved={item.saved} />
            </div>
          ))}
          <div className="w-5 shrink-0" />
        </div>

        {/* Desktop: 4-col grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 px-8">
          {ITEMS.map(item => (
            <div key={item.id} className="cursor-pointer" onClick={() => openItem(item)}>
              <ListCard title={item.title} meta={`£${item.price} · ${item.region}`} tag={item.condition} rating={item.rating} reviews={item.reviews} saved={item.saved} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Recently sold ── */}
      <section className="pb-12 md:pb-16 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between px-5 md:px-8 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">Recently sold</h2>
            <p className="text-xs text-zinc-400 mt-0.5 font-medium">Sold in the last 7 days</p>
          </div>
          <Button variant="ghost" size="sm" className="text-zinc-500 gap-1 -mr-2" onClick={() => setPage('browse')}>
            See all <ArrowRight size={13} />
          </Button>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden scroll-row flex gap-3.5 overflow-x-auto px-5 py-3 scroll-pl-5"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {SOLD.map(item => (
            <div key={item.id} className="w-44 shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <ListCard title={item.title} meta={item.meta} tag={item.tag} rating={item.rating} reviews={item.reviews} sold hideSave />
            </div>
          ))}
          <div className="w-5 shrink-0" />
        </div>

        {/* Desktop: 6-col grid (wider, no save button) */}
        <div className="hidden md:grid md:grid-cols-6 gap-5 px-8">
          {SOLD.map(item => (
            <div key={item.id}>
              <ListCard title={item.title} meta={item.meta} tag={item.tag} rating={item.rating} reviews={item.reviews} sold hideSave />
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-12 md:py-20 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-screen-xl mx-auto">

          <div className="px-5 md:px-8 mb-8 md:text-center">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Three steps. No strangers.</h2>
            <p className="text-sm md:text-base text-zinc-500 mt-2 max-w-sm mx-auto">
              We handle everything between listing and payment.
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
            Free listing. 5% on sale. We handle everything — you just drop it off.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 w-full sm:w-auto h-12 px-7 text-base gap-2" onClick={() => setPage('upload')}>
              List your first item <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 w-full sm:w-auto h-12 px-7 text-base"
              onClick={() => setPage('browse')}>
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
                        <button onClick={() => route && setPage(route)}
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
            <p className="text-xs text-zinc-400">© 2026 muvaz.online · Made in Berlin</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
