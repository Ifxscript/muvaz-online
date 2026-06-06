// muvaz-browse-page.jsx — Browse all listed items
// Depends on muvaz-ui.jsx, muvaz-blocks.jsx

const BROWSE_ITEMS = [
  { title:'Velvet armchair',    price:120, region:'Kreuzberg',      condition:'Like new', cat:'Furniture',    rating:'4.8', reviews:'12', saved:true },
  { title:'IKEA Malm frame',    price:40,  region:'Neukölln',       condition:'Good',     cat:'Furniture',    rating:'4.3', reviews:'8' },
  { title:'Mountain bike',      price:85,  region:'Mitte',          condition:'Used',     cat:'Sports',       rating:'4.6', reviews:'21' },
  { title:'Espresso machine',   price:70,  region:'Mitte',          condition:'Good',     cat:'Kitchen',      rating:'4.5', reviews:'9' },
  { title:'Leather sofa',       price:280, region:'Schöneberg',     condition:'Like new', cat:'Furniture',    rating:'4.7', reviews:'6' },
  { title:'Vintage desk',       price:90,  region:'Mitte',          condition:'Good',     cat:'Furniture',    rating:'4.5', reviews:'11' },
  { title:'Road bike 54cm',     price:220, region:'Prenzlauer Berg',condition:'Good',     cat:'Sports',       rating:'4.4', reviews:'7' },
  { title:'Standing lamp',      price:35,  region:'Neukölln',       condition:'Like new', cat:'Other',        rating:'4.6', reviews:'5' },
  { title:'Dining chairs ×4',   price:60,  region:'Charlottenburg', condition:'Used',     cat:'Furniture',    rating:'4.2', reviews:'14' },
  { title:'Camera — Sony A6000',price:180, region:'Mitte',          condition:'Like new', cat:'Electronics',  rating:'4.9', reviews:'22' },
  { title:'Bookshelf, oak',     price:55,  region:'Friedrichshain', condition:'Good',     cat:'Furniture',    rating:'4.3', reviews:'9' },
  { title:'Yoga mat + blocks',  price:18,  region:'Kreuzberg',      condition:'Used',     cat:'Sports',       rating:'4.1', reviews:'4' },
  { title:'MacBook Pro 2021',   price:950, region:'Charlottenburg', condition:'Like new', cat:'Electronics',  rating:'4.8', reviews:'3' },
  { title:'Winter coat, L',     price:45,  region:'Schöneberg',     condition:'Good',     cat:'Clothing',     rating:'4.4', reviews:'6' },
  { title:'KitchenAid blender', price:65,  region:'Prenzlauer Berg',condition:'Brand new',cat:'Kitchen',      rating:'4.7', reviews:'8' },
  { title:'Art print, framed',  price:30,  region:'Friedrichshain', condition:'Like new', cat:'Other',        rating:'4.3', reviews:'5' },
];

const BROWSE_CATS  = ['All','Furniture','Electronics','Clothing','Sports','Kitchen','Other'];
const BROWSE_REGIONS = ['All','Kreuzberg','Neukölln','Mitte','Prenzlauer Berg','Charlottenburg','Schöneberg','Friedrichshain'];
const BROWSE_CONDS   = ['All','Brand new','Like new','Good','Used','For parts'];
const SORT_OPTS      = ['Nearest','Lowest price','Highest price','Newest'];

function BrowsePage({ onBack, onItemClick }) {
  const [query,      setQuery]      = React.useState('');
  const [cat,        setCat]        = React.useState('All');
  const [sort,       setSort]       = React.useState('Nearest');
  const [grid,       setGrid]       = React.useState(2);
  const [sortOpen,   setSortOpen]   = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);

  // draft filter state (inside sheet before Apply)
  const [draftRegion, setDraftRegion] = React.useState('All');
  const [draftCond,   setDraftCond]   = React.useState('All');
  const [draftSort,   setDraftSort]   = React.useState('Nearest');
  // applied state
  const [region, setRegion] = React.useState('All');
  const [cond,   setCond]   = React.useState('All');

  const activeFilters = (region !== 'All' ? 1 : 0) + (cond !== 'All' ? 1 : 0);

  const openFilter = () => { setDraftRegion(region); setDraftCond(cond); setDraftSort(sort); setFilterOpen(true); };
  const applyFilter = () => { setRegion(draftRegion); setCond(draftCond); setSort(draftSort); setFilterOpen(false); };
  const clearFilter = () => { setDraftRegion('All'); setDraftCond('All'); setDraftSort('Nearest'); };

  const filtered = BROWSE_ITEMS.filter(item => {
    if (query && !item.title.toLowerCase().includes(query.toLowerCase())) return false;
    if (cat !== 'All' && item.cat !== cat) return false;
    if (region !== 'All' && item.region !== region) return false;
    if (cond !== 'All' && item.condition !== cond) return false;
    return true;
  });

  // build meta string for ListCard
  const itemMeta = item => `£${item.price} · ${item.region}`;

  return (
    <div style={{ minHeight:'100vh', background:'#fff', paddingBottom:24 }}>

      {/* Sticky header */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'#fff', borderBottom:`1px solid ${mBorder}` }}>

        {/* Search row */}
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px' }}>
          <button onClick={onBack} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', padding:6, borderRadius:mRadiusSm, flexShrink:0 }}>
            <MChevLeft size={20} stroke={mText} />
          </button>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, height:40, padding:'0 12px', borderRadius:mRadius, background:mMutedBg, border:`1px solid ${mBorder}` }}>
            <MSearch size={15} stroke={mMuted} />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search items…"
              style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
            {query && (
              <button onClick={() => setQuery('')} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', padding:2 }}>
                <MClose size={14} stroke={mMuted} />
              </button>
            )}
          </div>
          {/* Single toggle icon — clicks between grid and list */}
          <button onClick={() => setGrid(g => g === 2 ? 1 : 2)} style={{
            width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center',
            background:mText, border:'none', borderRadius:mRadiusSm, cursor:'pointer', flexShrink:0,
          }}>
            {grid === 2
              ? <MGrid2 size={16} stroke="#fff" />
              : <MGrid1 size={16} stroke="#fff" />}
          </button>
        </div>

        {/* Filters btn + category chips — single scrollable row */}
        <div className="scroll-row" style={{ display:'flex', gap:8, padding:'0 12px 10px', overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          {/* Filters */}
          <button onClick={openFilter} style={{
            flexShrink:0, display:'flex', alignItems:'center', gap:6,
            height:32, padding:'0 12px', borderRadius:999,
            border:`1.5px solid ${activeFilters>0 ? mText : mBorder}`,
            background:activeFilters>0 ? mText : '#fff', cursor:'pointer',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={activeFilters>0?'#fff':mText} strokeWidth="2.2" strokeLinecap="round"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
            <span style={{ fontFamily:mFont, fontSize:13, fontWeight:600, color:activeFilters>0?'#fff':mText, whiteSpace:'nowrap' }}>Filters{activeFilters > 0 ? ` · ${activeFilters}` : ''}</span>
          </button>

          {/* Divider */}
          <div style={{ width:1, height:32, background:mBorder, flexShrink:0, alignSelf:'center' }} />

          {/* Category chips */}
          {BROWSE_CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              height:32, padding:'0 14px', borderRadius:999, flexShrink:0,
              border:`1.5px solid ${cat===c ? mText : mBorder}`,
              background:cat===c ? mText : '#fff',
              color:cat===c ? '#fff' : mSubtext,
              fontFamily:mFont, fontSize:13, fontWeight:cat===c ? 600 : 400,
              cursor:'pointer', transition:'all .15s', whiteSpace:'nowrap',
            }}>{c}</button>
          ))}
          <div style={{ minWidth:4, flexShrink:0 }} />
        </div>
      </div>

      {/* Results count */}
      <div style={{ padding:'10px 16px 4px' }}>
        <span style={{ fontFamily:mFont, fontSize:13, color:mMuted }}>{filtered.length} item{filtered.length!==1?'s':''}</span>
      </div>

      {/* Grid / List */}
      {filtered.length > 0 ? (
        <div style={{ padding:'8px 12px 0', display:grid===2?'grid':'flex', gridTemplateColumns:grid===2?'1fr 1fr':undefined, flexDirection:grid===1?'column':undefined, gap:grid===2?16:0 }}>
          {filtered.map((item, i) => (
            grid === 2 ? (
              <div key={i} onClick={() => onItemClick && onItemClick()} style={{ cursor:'pointer' }}>
                <ListCard title={item.title} meta={itemMeta(item)} tag={item.condition} rating={item.rating} reviews={item.reviews} saved={item.saved} />
              </div>
            ) : (
              <div key={i} onClick={() => onItemClick && onItemClick()} style={{ display:'flex', gap:14, padding:'14px 4px', borderBottom:`1px solid ${mBorder}`, cursor:'pointer' }}>
                <div style={{ width:86, height:76, borderRadius:12, background:'linear-gradient(135deg,#d4d4d8,#c4c4c8)', flexShrink:0 }} />
                <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', gap:8, marginBottom:3 }}>
                      <p style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:0 }}>{item.title}</p>
                      <p style={{ fontFamily:mFont, fontSize:15, fontWeight:800, color:mText, margin:0, flexShrink:0 }}>£{item.price}</p>
                    </div>
                    <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, margin:0 }}>{item.region}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <MBadge variant="secondary">{item.condition}</MBadge>
                    <span style={{ display:'flex', alignItems:'center', gap:3 }}>
                      <MStar size={11} />
                      <span style={{ fontFamily:mFont, fontSize:12, fontWeight:600, color:mText }}>{item.rating}</span>
                      <span style={{ fontFamily:mFont, fontSize:12, color:mMuted }}>({item.reviews})</span>
                    </span>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'64px 32px' }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:mMutedBg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <MSearch size={24} stroke={mMuted} />
          </div>
          <p style={{ fontFamily:mFont, fontSize:16, fontWeight:600, color:mText, margin:'0 0 6px' }}>No results</p>
          <p style={{ fontFamily:mFont, fontSize:14, color:mMuted, margin:'0 0 20px' }}>Try adjusting your search or filters.</p>
          <MButton variant="outline" size="sm" onClick={() => { setQuery(''); setCat('All'); setRegion('All'); setCond('All'); }}>Clear all filters</MButton>
        </div>
      )}

      {/* ── Sort sheet ─────────────────────────────────────── */}
      {sortOpen && (
        <>
          <div onClick={() => setSortOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:60 }} />
          <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:375, background:'#fff', borderRadius:'20px 20px 0 0', zIndex:70, paddingBottom:32 }}>
            <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 8px' }}>
              <div style={{ width:36, height:4, borderRadius:2, background:mBorder2 }} />
            </div>
            <p style={{ fontFamily:mFont, fontSize:17, fontWeight:700, color:mText, padding:'0 20px 14px', margin:0, borderBottom:`1px solid ${mBorder}` }}>Sort by</p>
            {SORT_OPTS.map(opt => (
              <button key={opt} onClick={() => { setSort(opt); setSortOpen(false); }} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'15px 20px', background:'transparent', border:'none', borderBottom:`1px solid ${mBorder}`, cursor:'pointer' }}>
                <span style={{ fontFamily:mFont, fontSize:15, color:mText, fontWeight:opt===sort?600:400 }}>{opt}</span>
                {opt === sort && <MCheck size={18} stroke={mAccent} />}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Filter sheet ───────────────────────────────────── */}
      {filterOpen && (
        <>
          <div onClick={() => setFilterOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:60 }} />
          <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:375, background:'#fff', borderRadius:'20px 20px 0 0', zIndex:70, paddingBottom:32, maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px', position:'sticky', top:0, background:'#fff', zIndex:1 }}>
              <div style={{ width:36, height:4, borderRadius:2, background:mBorder2 }} />
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 20px 14px', borderBottom:`1px solid ${mBorder}`, position:'sticky', top:20, background:'#fff', zIndex:1 }}>
              <p style={{ fontFamily:mFont, fontSize:17, fontWeight:700, color:mText, margin:0 }}>Filters</p>
              <button onClick={clearFilter} style={{ background:'transparent', border:'none', cursor:'pointer', fontFamily:mFont, fontSize:13, color:mMuted, textDecoration:'underline', textUnderlineOffset:3 }}>Clear all</button>
            </div>

            <div style={{ padding:'20px 20px 0' }}>
              {/* Region */}
              <h3 style={{ fontFamily:mFont, fontSize:14, fontWeight:700, color:mText, margin:'0 0 12px' }}>Region</h3>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
                {BROWSE_REGIONS.map(r => (
                  <button key={r} onClick={() => setDraftRegion(r)} style={{
                    height:36, padding:'0 14px', borderRadius:999,
                    border:`1.5px solid ${draftRegion===r?mText:mBorder}`,
                    background:draftRegion===r?mText:'#fff',
                    color:draftRegion===r?'#fff':mSubtext,
                    fontFamily:mFont, fontSize:13, fontWeight:draftRegion===r?600:400,
                    cursor:'pointer', transition:'all .15s', whiteSpace:'nowrap',
                  }}>{r}</button>
                ))}
              </div>

              <MSeparator style={{ marginBottom:20 }} />

              {/* Condition */}
              <h3 style={{ fontFamily:mFont, fontSize:14, fontWeight:700, color:mText, margin:'0 0 12px' }}>Condition</h3>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
                {BROWSE_CONDS.map(c => (
                  <button key={c} onClick={() => setDraftCond(c)} style={{
                    height:36, padding:'0 14px', borderRadius:999,
                    border:`1.5px solid ${draftCond===c?mText:mBorder}`,
                    background:draftCond===c?mText:'#fff',
                    color:draftCond===c?'#fff':mSubtext,
                    fontFamily:mFont, fontSize:13, fontWeight:draftCond===c?600:400,
                    cursor:'pointer', transition:'all .15s', whiteSpace:'nowrap',
                  }}>{c}</button>
                ))}
              </div>

              <MButton full style={{ height:48, background:mAccent, color:'#fff', border:'none', fontWeight:600 }} onClick={applyFilter}>
                Show results
              </MButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { BrowsePage });
