// muvaz-upload-page.jsx — List new item (single scrollable form)
// Depends on muvaz-ui.jsx

const UPLOAD_CATEGORIES = [
  'Furniture','Electronics','Clothing & Shoes','Books & Media',
  'Sports & Fitness','Kitchen','Garden & Outdoor','Toys & Games',
  'Art & Collectibles','Music Instruments','Cameras','Baby & Kids',
  'Office & Business','Health & Beauty','Bicycles','Cars & Vehicles',
  'Tools & DIY','Home Décor','Jewellery & Watches','Other',
];

const UPLOAD_CONDITIONS = ['Brand new','Like new','Good','Used','For parts'];

function UploadPage({ onBack }) {
  const [category, setCategory] = React.useState('');
  const [condition, setCondition] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [photoCount, setPhotoCount] = React.useState(0);

  const canSubmit = title.trim() && category && condition && price && Number(price) > 0;

  if (submitted) {
    return (
      <div style={{ minHeight:'100vh', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 32px', textAlign:'center' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:mAccentBg, border:`2px solid ${mAccent}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 0 24px' }}>
          <MCheck size={32} stroke={mAccent} />
        </div>
        <h1 style={{ fontFamily:mFont, fontSize:26, fontWeight:900, color:mText, margin:'0 0 10px', letterSpacing:'-0.5px' }}>Listing submitted!</h1>
        <p style={{ fontFamily:mFont, fontSize:15, color:mSubtext, lineHeight:1.6, margin:'0 0 8px' }}>
          Our team will review <strong style={{ color:mText }}>{title}</strong> and get it live within 24 hours.
        </p>
        <p style={{ fontFamily:mFont, fontSize:13, color:mMuted, margin:'0 0 32px' }}>We'll notify you when it's live.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10, width:'100%' }}>
          <MButton full style={{ height:48, background:mAccent, color:'#fff', border:'none', fontWeight:600 }} onClick={() => { setSubmitted(false); setTitle(''); setCategory(''); setCondition(''); setDesc(''); setPrice(''); setPostcode(''); setPhotoCount(0); }}>
            List another item
          </MButton>
          <MButton variant="ghost" full onClick={onBack}>Back to home</MButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'#fff' }}>
      {/* Header */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'#fff', borderBottom:`1px solid ${mBorder}`, display:'flex', alignItems:'center', height:52, padding:'0 16px', gap:12 }}>
        <button onClick={onBack} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', padding:6, borderRadius:mRadiusSm }}>
          <MChevLeft size={20} stroke={mText} />
        </button>
        <span style={{ fontFamily:mFont, fontSize:16, fontWeight:700, color:mText, flex:1 }}>List an item</span>
        <span style={{ fontFamily:mFont, fontSize:12, color:mMuted, background:mMutedBg, padding:'3px 10px', borderRadius:999 }}>Free listing</span>
      </div>

      <div style={{ padding:'24px 20px 48px' }}>

        {/* Photos */}
        <section style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:'0 0 4px' }}>Photos</h2>
          <p style={{ fontFamily:mFont, fontSize:13, color:mMuted, margin:'0 0 14px' }}>Up to 8 photos. First photo becomes the cover.</p>
          {photoCount === 0 ? (
            <div onClick={() => setPhotoCount(3)} style={{ borderRadius:mRadiusLg, border:`1.5px dashed ${mBorder}`, background:'#fafafa', padding:'28px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:8, textAlign:'center', cursor:'pointer' }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:mMutedBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <MCamera size={22} stroke={mMuted} />
              </div>
              <p style={{ fontFamily:mFont, fontSize:15, fontWeight:500, margin:0, color:mText }}>Tap to upload photos</p>
              <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, margin:0 }}>JPG, PNG up to 10 MB each</p>
            </div>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ position:'relative', width:90, height:90, borderRadius:mRadius, background:'linear-gradient(135deg,#d4d4d8,#c4c4c8)', border:`1px solid ${mBorder}`, overflow:'hidden', flexShrink:0 }}>
                <span style={{ position:'absolute', bottom:4, left:4, fontFamily:mFont, fontSize:9, fontWeight:600, background:mText, color:'#fff', padding:'2px 6px', borderRadius:4 }}>COVER</span>
                <button onClick={() => setPhotoCount(0)} style={{ position:'absolute', top:3, right:3, width:18, height:18, borderRadius:'50%', background:'rgba(0,0,0,0.5)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <MClose size={10} stroke="#fff" />
                </button>
              </div>
              {[1,2].map(i => (
                <div key={i} style={{ width:90, height:90, borderRadius:mRadius, background:'linear-gradient(135deg,#e4e4e7,#d4d4d8)', border:`1px solid ${mBorder}`, flexShrink:0 }} />
              ))}
              {photoCount < 8 && (
                <div onClick={() => setPhotoCount(c=>Math.min(c+1,8))} style={{ width:90, height:90, borderRadius:mRadius, border:`1.5px dashed ${mBorder}`, background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, cursor:'pointer', flexShrink:0 }}>
                  <MPlus size={18} stroke={mMuted} />
                  <span style={{ fontFamily:mFont, fontSize:10, fontWeight:500, color:mMuted }}>Add</span>
                </div>
              )}
            </div>
          )}
        </section>

        <MSeparator style={{ marginBottom:28 }} />

        {/* Category */}
        <section style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:'0 0 4px' }}>Category</h2>
          <p style={{ fontFamily:mFont, fontSize:13, color:mMuted, margin:'0 0 14px' }}>Pick the best fit for your item.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
            {UPLOAD_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                height:40, borderRadius:mRadius,
                border:`1.5px solid ${category===cat?mText:mBorder}`,
                background:category===cat?mText:'#fff',
                color:category===cat?'#fff':mSubtext,
                fontFamily:mFont, fontSize:12,
                fontWeight:category===cat?600:400,
                cursor:'pointer', transition:'all .15s',
                padding:'0 6px', textAlign:'center',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>{cat}</button>
            ))}
          </div>
        </section>

        <MSeparator style={{ marginBottom:28 }} />

        {/* Details */}
        <section style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:'0 0 16px' }}>Item details</h2>

          {/* Title */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Title <span style={{ color:'#71717a' }}>*</span></label>
            <div style={{ display:'flex', alignItems:'center', height:44, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
              <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. IKEA Kallax shelf unit, white" maxLength={80}
                style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
              <span style={{ fontFamily:mFont, fontSize:11, color:mMuted, flexShrink:0 }}>{title.length}/80</span>
            </div>
          </div>

          {/* Condition */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:8 }}>Condition <span style={{ color:'#71717a' }}>*</span></label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {UPLOAD_CONDITIONS.map(c => (
                <button key={c} onClick={() => setCondition(c)} style={{
                  height:36, padding:'0 14px', borderRadius:999,
                  border:`1.5px solid ${condition===c?mText:mBorder}`,
                  background:condition===c?mText:'#fff',
                  color:condition===c?'#fff':mSubtext,
                  fontFamily:mFont, fontSize:13,
                  fontWeight:condition===c?600:400,
                  cursor:'pointer', transition:'all .15s',
                }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display:'block', fontFamily:mFont, fontSize:13, fontWeight:500, color:mText, marginBottom:6 }}>Description</label>
            <div style={{ padding:'10px 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} maxLength={500} rows={4}
                placeholder="Dimensions, colour, any defects, reason for selling…"
                style={{ width:'100%', border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent', resize:'none', lineHeight:1.55 }} />
            </div>
            <p style={{ fontFamily:mFont, fontSize:11, color:mMuted, margin:'4px 0 0', textAlign:'right' }}>{desc.length}/500</p>
          </div>
        </section>

        <MSeparator style={{ marginBottom:28 }} />

        {/* Pricing */}
        <section style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:'0 0 4px' }}>Asking price <span style={{ color:'#71717a' }}>*</span></h2>
          <p style={{ fontFamily:mFont, fontSize:13, color:mMuted, margin:'0 0 14px' }}>muvaz takes a 5% commission on sale. No listing fee.</p>
          <div style={{ display:'flex', alignItems:'center', height:54, borderRadius:mRadius, border:`1.5px solid ${price?mText:mBorder2}`, overflow:'hidden', background:'#fff', transition:'border-color .15s' }}>
            <span style={{ fontFamily:mFont, fontSize:22, fontWeight:700, padding:'0 12px 0 16px', color:mText }}>£</span>
            <div style={{ width:1, height:32, background:mBorder }} />
            <input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="0" min="0"
              style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:22, fontWeight:700, padding:'0 16px', color:mText, background:'transparent' }} />
          </div>
          {price && Number(price) > 0 && (
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, padding:'10px 14px', borderRadius:mRadiusSm, background:mAccentBg }}>
              <span style={{ fontFamily:mFont, fontSize:13, color:mSubtext }}>You'll receive</span>
              <span style={{ fontFamily:mFont, fontSize:13, fontWeight:700, color:mAccent }}>£{(Number(price)*0.95).toFixed(2)}</span>
            </div>
          )}
        </section>

        <MSeparator style={{ marginBottom:28 }} />

        {/* Location */}
        <section style={{ marginBottom:32 }}>
          <h2 style={{ fontFamily:mFont, fontSize:15, fontWeight:700, color:mText, margin:'0 0 4px' }}>Pickup location</h2>
          <p style={{ fontFamily:mFont, fontSize:13, color:mMuted, margin:'0 0 14px' }}>Our team collects from you — buyers never see your address.</p>
          <div style={{ display:'flex', alignItems:'center', gap:8, height:44, padding:'0 12px', borderRadius:mRadiusSm, border:`1px solid ${mBorder}`, background:'#fff' }}>
            <MPin size={16} stroke={mMuted} />
            <input type="text" value={postcode} onChange={e=>setPostcode(e.target.value)} placeholder="Enter your postcode"
              style={{ flex:1, border:'none', outline:'none', fontFamily:mFont, fontSize:14, color:mText, background:'transparent' }} />
          </div>
        </section>

        {/* Submit */}
        <MButton full style={{ height:52, background:canSubmit?mAccent:'#d4d4d8', color:'#fff', border:'none', fontSize:16, fontWeight:700, transition:'background .2s' }} disabled={!canSubmit} onClick={() => setSubmitted(true)}>
          Submit listing
        </MButton>
        <p style={{ fontFamily:mFont, fontSize:12, color:mMuted, textAlign:'center', margin:'12px 0 0', lineHeight:1.5 }}>
          Every listing is reviewed by our team before going live (usually within 24 h).
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { UploadPage });
