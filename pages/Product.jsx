import React, { useState as useStateP, useEffect as useEffectP, useRef as useRefP } from 'react';
import { products, fabricImg, fmt, ratings, mockReviews } from '../data.js';
import { routeToUrl } from '../routing.js';
import { Ph, ProductCard, Stars, SizeGuideModal, ImageLightbox, Footer } from '../ui.jsx';

function Accordion({ label, children }) {
  const [open, setOpen] = useStateP(false);
  return (
    <div className="accordion-item">
      <button className="accordion-trigger" onClick={() => setOpen((o) => !o)}>
        {label}
        <span className={"accordion-icon" + (open ? " open" : "")}>+</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

function ReviewForm({ productId }) {
  const storageKey = `sohro_reviews_${productId}`;
  const [localReviews, setLocalReviews] = useStateP(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  const [draft, setDraft] = useStateP({ name: '', stars: 5, text: '' });
  const [submitted, setSubmitted] = useStateP(false);

  useEffectP(() => {
    setLocalReviews(() => {
      try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
    });
    setSubmitted(false);
    setDraft({ name: '', stars: 5, text: '' });
  }, [productId]);

  function submit(e) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.text.trim()) return;
    const rev = { name: draft.name.trim(), stars: draft.stars, text: draft.text.trim(), date: 'Just now', size: 'M' };
    const updated = [rev, ...localReviews];
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch (_) {}
    setLocalReviews(updated);
    setSubmitted(true);
    try { window.__analytics && window.__analytics.event('submit_review', { item_id: productId }); } catch (_) {}
  }

  return (
    <div className="review-form">
      {localReviews.length > 0 && (
        <div className="reviews-grid" style={{ marginBottom: 24 }}>
          {localReviews.map((r, i) => (
            <div className="review-card" key={i}>
              <Stars avg={r.stars} />
              <p className="review-text">"{r.text}"</p>
              <div className="review-meta">{r.name} · size {r.size}</div>
              <div className="review-meta" style={{ marginTop: 3 }}>{r.date}</div>
            </div>
          ))}
        </div>
      )}
      <div className="review-form-title">Write a review</div>
      {submitted ? (
        <p className="review-submitted">Thank you — your review has been submitted. ✦</p>
      ) : (
        <form onSubmit={submit}>
          <div className="review-form-stars">
            {[1,2,3,4,5].map((n) => (
              <button key={n} type="button" className={"review-star-btn" + (draft.stars >= n ? " active" : "")} onClick={() => setDraft((d) => ({ ...d, stars: n }))}>★</button>
            ))}
          </div>
          <div className="review-form-fields">
            <input required placeholder="Your name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} maxLength={50} />
            <textarea required placeholder="Tell us what you think..." value={draft.text} onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))} rows={3} maxLength={500} />
          </div>
          <button type="submit" className="btn ghost" style={{ fontSize: 11 }}>Submit review</button>
        </form>
      )}
    </div>
  );
}

export default function Product({ route, go, onAdd, openCart, wishlist, onToggleWishlist }) {
  const p = products.find((x) => x.id === route.id) || products[0];
  const [size, setSize] = useStateP(null);
  const [qty, setQty] = useStateP(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useStateP(false);
  const [pincode, setPincode] = useStateP("");
  const [pinMsg, setPinMsg] = useStateP(null);
  const [stickyBar, setStickyBar] = useStateP(false);
  const [selectedColor, setSelectedColor] = useStateP(null);
  const [lightboxOpen, setLightboxOpen] = useStateP(false);
  const [lightboxIdx, setLightboxIdx] = useStateP(0);
  const addBtnRef = useRefP(null);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const rating = ratings[p.id];
  const galleryImages = [
    { src: p.img,     cap: `${p.name} — full look, ${p.fabric}, Sohro` },
    { src: p.img2,    cap: `${p.name} — detail view, ${p.collection} collection` },
    { src: fabricImg, cap: `${p.fabric} fabric — ${p.name} by Sohro` },
  ];

  useEffectP(() => {
    if (!addBtnRef.current) return;
    const obs = new IntersectionObserver(([e]) => setStickyBar(!e.isIntersecting), { threshold: 0 });
    obs.observe(addBtnRef.current);
    return () => obs.disconnect();
  }, [p.id]);

  function checkPin() {
    const d = pincode.replace(/\s/g, "");
    if (/^\d{6}$/.test(d)) {
      setPinMsg({ ok: true, text: "✓ Delivery available · Arrives in 3–5 business days" });
    } else {
      setPinMsg({ ok: false, text: "Enter a valid 6-digit PIN code" });
    }
  }
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const relatedFill = related.length < 4 ? related.concat(products.filter((x) => x.id !== p.id && !related.includes(x)).slice(0, 4 - related.length)) : related;

  const [recentlyViewed, setRecentlyViewed] = useStateP([]);
  useEffectP(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("sohro_recent") || "[]");
      const updated = [p.id, ...stored.filter((id) => id !== p.id)].slice(0, 5);
      localStorage.setItem("sohro_recent", JSON.stringify(updated));
      setRecentlyViewed(updated.slice(1).map((id) => products.find((x) => x.id === id)).filter(Boolean));
    } catch (_) {}
  }, [p.id]);

  useEffectP(() => {
    setSize(null); setQty(1); setSelectedColor(null); window.scrollTo(0, 0);
    try {
      window.__analytics && window.__analytics.event('view_item', {
        currency: 'INR', value: p.price,
        items: [{ item_id: p.id, item_name: p.name, item_category: p.cat, item_list_name: p.collection, price: p.price }]
      });
    } catch (_) {}
    if (window.fbq) fbq('track', 'ViewContent', { content_ids: [p.id], content_type: 'product', value: p.price, currency: 'INR', content_name: p.name });
  }, [route.id]);

  function add() { for (let i = 0; i < qty; i++) onAdd(p, size || "M"); openCart(); }
  function buyNow() { for (let i = 0; i < qty; i++) onAdd(p, size || "M"); go({ name: "checkout" }); }

  const isSaved = wishlist && wishlist.some((w) => w.id === p.id);

  return (
    <main>
      <div className="wrap">
        <div className="pdp">
          <div className="pdp-gallery">
            {galleryImages.map((it, i) => (
              <div key={i} className={"pdp-gallery-item" + (i === 2 ? " span" : "")} onClick={() => { setLightboxIdx(i); setLightboxOpen(true); }} title="Click to zoom">
                <Ph tone={i === 1 ? p.tone2 : p.tone} img={it.src} cap={it.cap} className={i === 2 ? "span" : ""} />
                <div className="pdp-zoom-icon" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <div className="pdp-info">
            <div className="crumb label">
              <a className="link-underline" style={{ fontSize: 10 }} href={routeToUrl({ name: "collection", cat: p.cat })} onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: p.cat }); }}>{p.cat}</a>
              {" · "}
              <a className="link-underline" style={{ fontSize: 10 }} href={routeToUrl({ name: "collection", cat: "all", collection: p.collection })} onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "all", collection: p.collection }); }}>{p.collection}</a>
            </div>
            <h1 className="display">{p.name}</h1>
            {rating && (
              <div className="rating-line">
                <Stars avg={rating.avg} />
                <span className="rating-avg">{rating.avg}</span>
                <span className="rating-count">({rating.count} reviews)</span>
              </div>
            )}
            <div className="pdp-price">{fmt(p.price)}</div>
            <p className="pdp-desc">{p.desc}</p>

            <div className="pdp-row">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="label" style={{ color: "var(--muted)" }}>Size{size ? " · " + size : ""}</span>
                <button className="size-guide-link" onClick={() => setSizeGuideOpen(true)}>Size guide</button>
              </div>
              <div className="sizes">
                {sizes.map((s) => (
                  <button key={s} className={"size" + (size === s ? " active" : "")} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </div>

            {p.colors && p.colors.length > 1 && (
              <div className="pdp-row">
                <span className="label" style={{ color: "var(--muted)" }}>
                  Colour · {selectedColor ? selectedColor.n : p.colors[0].n}
                </span>
                <div className="swatches">
                  {p.colors.map((c, i) => (
                    <button key={c.n} className={"swatch" + ((!selectedColor && i === 0) || (selectedColor && selectedColor.n === c.n) ? " active" : "")} style={{ "--sw": c.s }} onClick={() => setSelectedColor(c)} title={c.n} aria-label={c.n} />
                  ))}
                </div>
              </div>
            )}

            <div className="pdp-qty-row">
              <div className="pdp-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="decrease qty">−</button>
                <span className="qty-num">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="increase qty">+</button>
              </div>
              <span className="label muted" style={{ fontSize: 10 }}>Max 10 per order</span>
            </div>

            {p.stock && p.stock <= 5 && <div className="low-stock">Only {p.stock} left in stock</div>}
            {!p.stock && (
              <div className="label muted" style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4a8c50", flexShrink: 0 }}></span>
                {Math.floor(8 + (p.id.charCodeAt(1) % 14))} people viewing this right now
              </div>
            )}

            <div ref={addBtnRef} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn full accent" onClick={add}>Add to bag{qty > 1 ? " · ×" + qty : ""} — {fmt(p.price * qty)}</button>
              <button className="btn full" onClick={buyNow}>Buy now</button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn ghost" style={{ flex: 1, ...(isSaved ? { borderColor: "#c8605a", color: "#c8605a" } : {}) }} onClick={() => onToggleWishlist && onToggleWishlist(p)}>
                  {isSaved ? "♥ In wishlist" : "♡ Wishlist"}
                </button>
                <button className="btn ghost" style={{ padding: "15px 18px" }} title="Share this piece"
                  onClick={() => {
                    if (navigator.share) { navigator.share({ title: p.name, text: p.desc, url: window.location.href }); }
                    else { navigator.clipboard && navigator.clipboard.writeText(window.location.href); }
                  }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <div className="label muted" style={{ marginBottom: 8 }}>Check delivery</div>
              <div className="pin-row">
                <input className="pin-input" placeholder="Enter PIN code" maxLength={6} value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "")); setPinMsg(null); }}
                  onKeyDown={(e) => e.key === "Enter" && checkPin()} />
                <button className="pin-btn" onClick={checkPin}>Check</button>
              </div>
              {pinMsg && <div className={pinMsg.ok ? "pin-ok" : "pin-err"}>{pinMsg.text}</div>}
            </div>

            <div className="spec-list">
              <div className="spec"><span className="k">Fabric</span><span>{p.fabric}</span></div>
              <div className="spec"><span className="k">Collection</span><span>{p.collection}</span></div>
              <div className="spec"><span className="k">Made</span><span>Small batch · India</span></div>
              <div className="spec"><span className="k">Dispatch</span><span>Ready to ship · 3–5 days</span></div>
            </div>

            <div className="pdp-accordion">
              <Accordion label="Care instructions">
                <ul>
                  <li>Hand wash in cold water with mild detergent</li>
                  <li>Do not wring — gently press out excess water</li>
                  <li>Dry flat in shade away from direct sunlight</li>
                  <li>Iron on low heat while slightly damp</li>
                  <li>Store folded in a cool, dry place</li>
                </ul>
              </Accordion>
              <Accordion label="Shipping & delivery">
                <p style={{ margin: 0 }}>Orders are dispatched within <strong>2–3 business days</strong>. Standard delivery takes 3–5 business days across India. Express options are available at checkout.<br /><br />We ship worldwide. International orders typically arrive in 10–15 business days.</p>
              </Accordion>
              <Accordion label="Returns & exchanges">
                <p style={{ margin: 0 }}>We accept returns within <strong>14 days</strong> of delivery for unworn, unwashed items in original packaging. Sale items and custom orders are not eligible for returns.<br /><br />To initiate a return, contact us at <span style={{ borderBottom: "1px solid var(--line-strong)" }}>hello@sohro.in</span><br /><br /><span className="link-underline" style={{ fontSize: 11 }} onClick={() => go({ name: "shipping-returns" })}>Full shipping &amp; returns policy →</span></p>
              </Accordion>
            </div>
          </div>
        </div>

        {rating && (
          <section className="reviews-section">
            <div className="section-head">
              <h2>Reviews</h2>
              <span className="rating-count">{rating.count} verified reviews</span>
            </div>
            <div className="reviews-overall">
              <div className="reviews-big-num">{rating.avg}</div>
              <div>
                <Stars avg={rating.avg} size={16} />
                <div className="reviews-label">{rating.count} reviews</div>
              </div>
            </div>
            <div className="reviews-grid">
              {mockReviews.map((r, i) => (
                <div className="review-card" key={i}>
                  <Stars avg={r.stars} />
                  <p className="review-text">"{r.text}"</p>
                  <div className="review-meta">{r.name} · size {r.size}</div>
                  <div className="review-meta" style={{ marginTop: 3 }}>{r.date}</div>
                </div>
              ))}
            </div>
            <ReviewForm productId={p.id} />
          </section>
        )}

        {recentlyViewed.length > 0 && (
          <section className="recently-viewed">
            <div className="section-head compact"><h2>Recently viewed</h2></div>
            <div className="prod-grid">
              {recentlyViewed.slice(0, 4).map((rp) => <ProductCard key={rp.id} p={rp} go={go} onAdd={onAdd} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />)}
            </div>
          </section>
        )}

        <section className="section">
          <div className="section-head">
            <h2>You may also like</h2>
            <span className="link-underline" onClick={() => go({ name: "collection", cat: p.cat })}>More {p.cat}</span>
          </div>
          <div className="prod-grid">
            {relatedFill.map((rp) => <ProductCard key={rp.id} p={rp} go={go} onAdd={onAdd} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />)}
          </div>
        </section>
      </div>

      <div className={"sticky-atc" + (stickyBar ? " visible" : "")}>
        <span className="sticky-atc-name">{p.name}</span>
        {size && <span className="label muted" style={{ fontSize: 10 }}>{size}</span>}
        <button className="btn accent" onClick={add}>{fmt(p.price * qty)}</button>
      </div>

      <ImageLightbox open={lightboxOpen} images={galleryImages} index={lightboxIdx} onClose={() => setLightboxOpen(false)} onChange={setLightboxIdx} />
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <Footer go={go} />
    </main>
  );
}
