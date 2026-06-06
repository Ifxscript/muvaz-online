// muvaz-misc-pages.jsx — 404 Error + Help/FAQ
// Depends on muvaz-ui.jsx

const FAQ_DATA = [
  { q:'How does muvaz work?',         a:'You list your items — we photograph, vet buyers, arrange pickup, handle delivery, and transfer payment to you. You never meet a buyer or seller.' },
  { q:'How much does muvaz charge?',  a:'muvaz takes a 5% commission on each successful sale. There are no listing fees, no upfront costs.' },
  { q:'How long does it take to sell?', a:'Most items sell within 3–7 days of going live. Premium or niche items may take up to two weeks.' },
  { q:'When do I get paid?',          a:'Payment is transferred to your bank account within 2 business days of confirmed delivery.' },
  { q:'What if my item doesn\'t sell?', a:'If your item doesn\'t sell within 30 days we\'ll contact you to discuss repricing or arrange a free return.' },
  { q:'Can I list multiple items?',   a:'Yes — list as many as you like. Each one is reviewed by our team before going live.' },
  { q:'How does the offer system work?', a:'Buyers submit offers below the listed price. You\'re notified and can accept, decline, or counter. All communication goes through muvaz.' },
  { q:'Is there a minimum item value?', a:'We generally list items priced at £10 or above. Fragile or difficult-to-ship items may not be eligible.' },
  { q:'Can buyers contact me directly?', a:'No — buyers can only communicate through muvaz after payment is confirmed. Your identity and address are always protected.' },
];

// ── ErrorPage ─────────────────────────────────────────────────
function ErrorPage({ onNavigate }) {
  return (
    <div style={{ minHeight:'100vh', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 32px', textAlign:'center' }}>
      {/* 404 visual */}
      <div style={{ position:'relative', marginBottom:24 }}>
        <p style={{ fontFamily:mFont, fontSize:128, fontWeight:900, color:mMutedBg2, margin:0, letterSpacing:'-6px', lineHeight:1, userSelect:'none' }}>404</p>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:60, height:60, borderRadius:'50%', background:'#fff', border:`1.5px solid ${mBorder}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:mShadow }}>
          <MSearch size={26} stroke={mMuted} />
        </div>
      </div>

      <h1 style={{ fontFamily:mFont, fontSize:24, fontWeight:900, color:mText, margin:'0 0 10px', letterSpacing:'-0.5px' }}>Page not found</h1>
      <p style={{ fontFamily:mFont, fontSize:15, color:mSubtext, margin:'0 0 36px', lineHeight:1.6, maxWidth:280 }}>
        This page doesn't exist or has been moved. Let's get you back on track.
      </p>

      <div style={{ display:'flex', flexDirection:'column', gap:10, width:'100%', maxWidth:280 }}>
        <MButton full style={{ height:48, background:mAccent, color:'#fff', border:'none', fontWeight:600 }} onClick={() => onNavigate('home')}>
          Back to home
        </MButton>
        <MButton variant="outline" full onClick={() => onNavigate('help')}>
          Get help
        </MButton>
      </div>

      {/* muvaz wordmark */}
      <p style={{ fontFamily:mFont, fontWeight:800, fontSize:18, letterSpacing:'-0.5px', color:mMuted, marginTop:48 }}>
        muvaz<span style={{ color:mAccent }}>.</span>
      </p>
    </div>
  );
}

// ── HelpPage ──────────────────────────────────────────────────
function HelpPage({ onNavigate }) {
  const [open, setOpen] = React.useState(null);
  const [subject, setSubject] = React.useState('General question');
  const [message, setMessage] = React.useState('');
  const [sent, setSent] = React.useState(false);

  return (
    <div style={{ minHeight:'100vh', background:'#fff' }}>
      {/* Header */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'#fff', borderBottom:`1px solid ${mBorder}`, display:'flex', alignItems:'center', height:52, padding:'0 16px', gap:12 }}>
        <button onClick={() => onNavigate('home')} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', padding:6, borderRadius:mRadiusSm }}>
          <MChevLeft size={20} stroke={mText} />
        </button>
        <span style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText }}>Help &amp; feedback</span>
      </div>

      <div style={{ padding:'24px 20px 48px' }}>
        {/* Hero */}
        <h1 style={{ fontFamily:mFont, fontSize:24, fontWeight:900, color:mText, margin:'0 0 6px', letterSpacing:'-0.4px' }}>How can we help?</h1>
        <p style={{ fontFamily:mFont, fontSize:14, color:mMuted, margin:'0 0 20px' }}>Browse common questions or send us a message.</p>

        {/* Search bar (static) */}
        <div style={{ display:'flex', alignItems:'center', gap:10, height:44, padding:'0 14px', borderRadius:mRadius, border:`1px solid ${mBorder}`, background:mMutedBg, marginBottom:28 }}>
          <MSearch size={16} stroke={mMuted} />
          <span style={{ fontFamily:mFont, fontSize:14, color:'#a1a1aa' }}>Search help articles…</span>
        </div>

        {/* Quick links */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:28 }}>
          {[['How it works','item-v1'],['Listing an item','upload'],['Pricing & fees',null],['Contact us',null]].map(([label]) => (
            <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', borderRadius:mRadius, border:`1px solid ${mBorder}`, cursor:'pointer', background:'#fff' }}>
              <span style={{ fontFamily:mFont, fontSize:13, fontWeight:500, color:mText }}>{label}</span>
              <MChevRight size={14} stroke={mMuted} />
            </div>
          ))}
        </div>

        <MSeparator style={{ marginBottom:24 }} />

        {/* FAQ accordion */}
        <h2 style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:'0 0 4px' }}>Frequently asked questions</h2>
        <p style={{ fontFamily:mFont, fontSize:13, color:mMuted, margin:'0 0 16px' }}>{FAQ_DATA.length} articles</p>

        <div style={{ marginBottom:32 }}>
          {FAQ_DATA.map((item,i) => (
            <div key={i} style={{ borderBottom:`1px solid ${mBorder}` }}>
              <button onClick={() => setOpen(open===i?null:i)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'16px 0', background:'transparent', border:'none', cursor:'pointer', textAlign:'left' }}>
                <span style={{ fontFamily:mFont, fontSize:14, fontWeight:open===i?700:500, color:mText, flex:1, lineHeight:1.4 }}>{item.q}</span>
                <div style={{ transform:open===i?'rotate(180deg)':'rotate(0)', transition:'transform .2s', flexShrink:0 }}>
                  <MChevDown size={18} stroke={mMuted} />
                </div>
              </button>
              {open===i && (
                <p style={{ fontFamily:mFont, fontSize:14, color:mSubtext, lineHeight:1.65, margin:'0 0 16px', paddingRight:28 }}>{item.a}</p>
              )}
            </div>
          ))}
        </div>

        <MSeparator style={{ marginBottom:28 }} />

        {/* Contact form */}
        <h2 style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:'0 0 4px' }}>Contact us</h2>
        <p style={{ fontFamily:mFont, fontSize:13, color:mMuted, margin:'0 0 18px' }}>We typically respond within a few hours.</p>

        {sent ? (
          <div style={{ padding:24, borderRadius:mRadiusLg, background:mAccentBg, border:`1px solid rgba(24,24,27,0.12)`, textAlign:'center' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'#fff', border:`1.5px solid ${mAccent}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
              <MCheck size={22} stroke={mAccent} />
            </div>
            <p style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, margin:'0 0 4px' }}>Message sent!</p>
            <p style={{ fontFamily:mFont, fontSize:13, color:mSubtext, margin:'0 0 16px' }}>We'll get back to you shortly.</p>
            <MButton variant="outline" size="sm" onClick={() => { setSent(false); setMessage(''); }}>Send another</MButton>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Your name</label>
                <div style={{ display:'flex', alignItems:'center', height:40, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
                  <input type="text" placeholder="Sarah" style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Email</label>
                <div style={{ display:'flex', alignItems:'center', height:40, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
                  <input type="email" placeholder="sarah@email.com" style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Subject</label>
              <div style={{ display:'flex', alignItems:'center', height:40, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
                <select value={subject} onChange={e=>setSubject(e.target.value)} style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent', cursor:'pointer' }}>
                  <option>General question</option>
                  <option>Issue with a listing</option>
                  <option>Payment query</option>
                  <option>Report a problem</option>
                  <option>Feedback & suggestions</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Message</label>
              <div style={{ padding:'10px 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} placeholder="Tell us how we can help…"
                  style={{ width:'100%', border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent', resize:'none', lineHeight:1.55 }} />
              </div>
            </div>

            <MButton full style={{ height:48, background:mAccent, color:'#fff', border:'none', fontWeight:600 }} disabled={!message.trim()} onClick={() => setSent(true)}>
              Send message
            </MButton>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ErrorPage, HelpPage });
