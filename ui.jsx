import React, { useState, useEffect, useRef } from 'react';
import { fmt, ratings, products } from './data.js';
import { validateEmail } from './validate.js';
import { routeToUrl } from './routing.js';

/* ---------- Placeholder / image ---------- */
function Ph({ tone, cap, img, className = "", style = {}, dark = false, children, priority = false }) {
  const isImg = !!img;
  return (
    <div
      className={"ph " + (dark ? "dark " : "") + (isImg ? "has-img " : "is-ph ") + className}
      data-cap={isImg ? "" : cap}
      style={{ "--ph-tone": tone, ...style }}
    >
      {isImg ? <img className="ph-img" src={img} alt={cap || ""} loading={priority ? "eager" : "lazy"} fetchpriority={priority ? "high" : undefined} /> : (
        <div className="ph-motif" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M32 17c0-2.4 1.9-4.2 4.3-4.2 2.2 0 3.9 1.7 3.9 3.8 0 1.9-1.4 2.9-2.9 3.4-1.6.5-2.3 1.3-2.3 2.6" />
            <path d="M35 23.4 13.6 38.8c-1.3.9-1.9 2-1.9 3.1 0 1.8 1.5 3.1 3.6 3.1h33.4c2.1 0 3.6-1.3 3.6-3.1 0-1.1-.6-2.2-1.9-3.1L35 23.4z" />
          </svg>
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------- Header ---------- */
const TOPBAR_MSGS = [
  "Free shipping across India · We ship worldwide",
  "Summer '26 · Pastel Riverie collection is now live",
  "Use code WELCOME15 for 15% off your first order",
  "Handmade in small batches · Every piece is one of few",
];

function Header({ go, cartCount, openCart, openSearch, wishlistCount, openWishlist, user, openLogin, openMobileMenu }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [msgKey, setMsgKey] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => { setMsgIdx((i) => (i + 1) % TOPBAR_MSGS.length); setMsgKey((k) => k + 1); }, 3600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <React.Fragment>
      <div className="topbar">
        <div className="label"><span className="topbar-msg" key={msgKey}>{TOPBAR_MSGS[msgIdx]}</span></div>
      </div>
      <header className={"header" + (scrolled ? " scrolled" : "")}>
        <div className="wrap header-inner">
          <nav className="nav left">
            <div className="nav-item">
              <a href="/shop" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "all" }); }}>Shop</a>
              <div className="nav-dropdown">
                <a href="/shop" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "all" }); }}>All clothing</a>
                <a href="/shop" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "all" }); }}>New in</a>
                <a href="/shop" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "all" }); }}>Bestsellers</a>
                <a href="/shop" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "all" }); }}>Most loved</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="/categories/kurta-sets" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Kurta Sets" }); }}>Kurta Sets</a>
              <div className="nav-dropdown">
                <a href="/categories/kurta-sets" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Kurta Sets" }); }}>All kurta sets</a>
                <a href="/collections/sitaara" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Kurta Sets", collection: "Sitaara" }); }}>Sitaara</a>
                <a href="/collections/garden-poem" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Kurta Sets", collection: "Garden Poem" }); }}>The Garden Poem</a>
                <a href="/collections/pastel-riverie" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Kurta Sets", collection: "Pastel Riverie" }); }}>Pastel Riverie</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="/categories/dresses" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Dresses" }); }}>Dresses</a>
              <div className="nav-dropdown">
                <a href="/categories/dresses" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Dresses" }); }}>All dresses</a>
                <a href="/collections/sweet-serenade" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Dresses", collection: "Sweet Serenade" }); }}>Sweet Serenade</a>
                <a href="/collections/summer-breeze" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Dresses", collection: "Summer Breeze" }); }}>Summer Breeze</a>
                <a href="/collections/whispers" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Dresses", collection: "Whispers" }); }}>Whispers</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="/categories/co-ord-sets" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Co-ord Sets" }); }}>Co-ords</a>
              <div className="nav-dropdown">
                <a href="/categories/co-ord-sets" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Co-ord Sets" }); }}>All co-ords</a>
                <a href="/collections/chaandni" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Co-ord Sets", collection: "Chaandni" }); }}>Chaandni</a>
                <a href="/collections/noor" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Co-ord Sets", collection: "Noor" }); }}>Noor</a>
                <a href="/collections/pastel-riverie" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Co-ord Sets", collection: "Pastel Riverie" }); }}>Pastel Riverie</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="/categories/suit-sets" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Suit Sets" }); }}>Suit Sets</a>
              <div className="nav-dropdown">
                <a href="/categories/suit-sets" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Suit Sets" }); }}>All suit sets</a>
                <a href="/collections/gulmohar" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Suit Sets", collection: "Gulmohar" }); }}>Gulmohar</a>
                <a href="/collections/tamara" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Suit Sets", collection: "Tamara" }); }}>Tamara</a>
              </div>
            </div>
          </nav>
          <button className="menu-toggle nav" onClick={openMobileMenu} aria-label="Open menu" style={{ justifyContent: "flex-start", padding: "4px 0" }}>
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <line x1="2" y1="2.4" x2="22" y2="2.4"/>
              <line x1="2" y1="9"   x2="22" y2="9"/>
              <line x1="2" y1="15.6" x2="22" y2="15.6"/>
            </svg>
          </button>
          <a className="brand" href="/" onClick={(e) => { e.preventDefault(); go({ name: "home" }); }}>SOHRO</a>
          {/* Mobile-only icon row — visible only below 720px */}
          <div className="mobile-actions">
            <button className="mobile-icon-btn" onClick={openSearch} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
            <button className="mobile-icon-btn" onClick={openCart} aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
            </button>
          </div>

          <nav className="nav right">
            <div className="nav-item">
              <a onClick={openSearch} className="search-link">Search</a>
              <div className="nav-dropdown">
                <a onClick={openSearch}>Search pieces</a>
                <a onClick={() => go({ name: "collection", cat: "all" })}>Browse all</a>
                <a onClick={() => go({ name: "collection", cat: "all" })}>New in</a>
              </div>
            </div>
            <div className="nav-item">
              <a onClick={() => user ? go({ name: "account" }) : openLogin()}>Account</a>
              <div className="nav-dropdown">
                {user ? (
                  <React.Fragment>
                    <a onClick={() => go({ name: "account" })}>My orders</a>
                    <a onClick={() => go({ name: "account" })}>My profile</a>
                    <a onClick={() => go({ name: "account" })}>Addresses</a>
                    <a onClick={openWishlist}>Wishlist{wishlistCount > 0 ? " (" + wishlistCount + ")" : ""}</a>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <a onClick={openLogin}>Sign in</a>
                    <a onClick={openLogin}>Create account</a>
                    <a onClick={openWishlist}>Wishlist{wishlistCount > 0 ? " (" + wishlistCount + ")" : ""}</a>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="nav-item">
              <button onClick={openCart}>Cart<span className="cart-count">({cartCount})</span></button>
              <div className="nav-dropdown">
                <a onClick={openCart}>View bag ({cartCount})</a>
                <a onClick={openCart}>Checkout</a>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </React.Fragment>
  );
}

/* ---------- Values / craft strip ---------- */
function Values() {
  const stroke = { viewBox: "0 0 64 64", fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };
  const Ring = () => <circle cx="32" cy="32" r="29" />;
  const icons = {
    hand: (
      <svg {...stroke}>
        <Ring />
        <path d="M32 29.2c-1.7-3.1-6.3-2.4-6.3 1.2 0 2.8 4.2 5.6 6.3 6.9 2.1-1.3 6.3-4.1 6.3-6.9 0-3.6-4.6-4.3-6.3-1.2z" />
        <path d="M25 40.5c.6 3.4 3.6 5.8 7 5.8s6.4-2.4 7-5.8" />
        <path d="M25 40.5c-2-.2-3.5-1.7-3.3-3.4.13-1.2 1.3-1.7 2.2-1 .7.5.9 1.5.6 2.4" />
        <path d="M39 40.5c2-.2 3.5-1.7 3.3-3.4-.13-1.2-1.3-1.7-2.2-1-.7.5-.9 1.5-.6 2.4" />
        <path d="M29 46l.3-3M32 46.3v-3.1M35 46l-.3-3" />
      </svg>
    ),
    quality: (
      <svg {...stroke}>
        <Ring />
        <path d="M30 22h6l8 8-12 12-8-8v-6a6 6 0 0 1 6-6z" />
        <circle cx="29" cy="29" r="1.6" />
        <path d="M33 35.4c-1.2-2.2-4.4-1.7-4.4.8 0 1.9 2.9 3.9 4.4 4.8 1.5-.9 4.4-2.9 4.4-4.8 0-2.5-3.2-3-4.4-.8z" />
      </svg>
    ),
    leaf: (
      <svg {...stroke}>
        <Ring />
        <circle cx="32" cy="23.5" r="3.4" />
        <circle cx="27.8" cy="26" r="2.6" />
        <circle cx="36.2" cy="26" r="2.6" />
        <circle cx="32" cy="28.6" r="2.6" />
        <path d="M32 31v12" />
        <path d="M32 35c-2.3-2.8-6-2.8-8.2-1.1.9 3.2 4.6 4.3 8.2 2.7z" />
        <path d="M32 39c2.3-2.8 6-2.8 8.2-1.1-.9 3.2-4.6 4.3-8.2 2.7z" />
      </svg>
    ),
    scale: (
      <svg {...stroke}>
        <Ring />
        <circle cx="32" cy="32" r="5.6" />
        <path d="M30 30h4M30 31.9h4M33.7 30c.3 1.9-1.3 2.6-3.7 2.6l3.5 3.3" />
        <path d="M40.5 23.5c-1.7 1.3-3.6 2.3-5.5 3.2" />
        <path d="M40.5 23.5c1.5-.6 2.9.5 2.6 2-.2 1.1-1.1 1.6-1.1 1.6" />
        <path d="M40.5 23.5l2.3-1M41.8 25.7l2.4-.4" />
        <path d="M23.5 40.5c1.7-1.3 3.6-2.3 5.5-3.2" />
        <path d="M23.5 40.5c-1.5.6-2.9-.5-2.6-2 .2-1.1 1.1-1.6 1.1-1.6" />
        <path d="M23.5 40.5l-2.3 1M22.2 38.3l-2.4.4" />
      </svg>
    ),
    pin: (
      <svg {...stroke}>
        <Ring />
        <path d="M42 32 Q45.5 35.6 40.7 37 Q41.9 41.9 37 40.7 Q35.6 45.5 32 42 Q28.4 45.5 27 40.7 Q22.1 41.9 23.3 37 Q18.5 35.6 22 32 Q18.5 28.4 23.3 27 Q22.1 22.1 27 23.3 Q28.4 18.5 32 22 Q35.6 18.5 37 23.3 Q41.9 22.1 40.7 27 Q45.5 28.4 42 32 Z" />
        <circle cx="32" cy="32" r="7.5" />
        <path d="M27 26.5c-.8-1.4 0-2.8 1.5-2.5" />
        <path d="M37 26.5c.8-1.4 0-2.8-1.5-2.5" />
        <path d="M29 31h1.3M33.7 31h1.3" />
        <path d="M30.8 33.2h2.4L32 34.8z" />
        <path d="M32 34.8v1.2" />
        <path d="M30 36.4c1.2 1 2.8 1 4 0" />
      </svg>
    ),
  };
  const items = [
    ["Handmade", "By artisans", "hand"],
    ["High quality", "Made to last", "quality"],
    ["Natural fibres", "Cotton · linen · silk", "leaf"],
    ["Fair wages", "Ethically made", "scale"],
    ["Made in India", "With care", "pin"],
  ];
  return (
    <section className="values">
      <div className="values-inner">
        {items.map(([t, s, ic]) => (
          <div className="value" key={t}>
            <div className="v-icon">{icons[ic]}</div>
            <div className="v-title">{t}</div>
            <div className="v-sub">{s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Product card ---------- */
function ProductCard({ p, go, onAdd, wishlist = [], onToggleWishlist, onQuickView }) {
  const saved = wishlist.some((w) => w.id === p.id);
  const rating = ratings[p.id];
  return (
    <a className="card" href={routeToUrl({ name: "product", id: p.id })} onClick={(e) => { e.preventDefault(); go({ name: "product", id: p.id }); }}>
      <Ph tone={p.tone} img={p.img} cap={p.name + " — " + p.cat + " by Sohro"}>
        {p.tag ? <div className="tagchip">{p.tag}</div> : null}
        {p.stock && p.stock <= 5 ? <div className="stock-chip">Only {p.stock} left</div> : null}
        {onToggleWishlist && (
          <button
            className={"wish-toggle" + (saved ? " saved" : "")}
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(p); }}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          >
            {saved ? "♥" : "♡"}
          </button>
        )}
        <div className="quick" onClick={(e) => e.stopPropagation()}>
          {onQuickView
            ? <button className="btn accent" onClick={() => onQuickView(p)}>Quick view</button>
            : <button className="btn accent" onClick={() => onAdd(p, "M")}>Quick add — M</button>
          }
        </div>
      </Ph>
      <div className="card-info">
        <div className="nm">{p.name}</div>
        {rating && (
          <div className="rating-line">
            <Stars avg={rating.avg} size={11} />
            <span className="rating-count">({rating.count})</span>
          </div>
        )}
        <div className="meta">
          <span className="cat">{p.cat}</span>
          <span className="px">{fmt(p.price)}</span>
        </div>
        {p.colors && p.colors.length > 1 && (
          <div className="card-swatches">
            {p.colors.map((c) => (
              <span key={c.n} className="card-swatch" style={{ "--sw": c.s }} title={c.n} />
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

/* ---------- Footer ---------- */
function Footer({ go }) {
  const [subEmail, setSubEmail] = useState("");
  const [subError, setSubError] = useState("");
  const [subShake, setSubShake] = useState(false);
  const [subJoined, setSubJoined] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Close contact modal on Escape
  useEffect(() => {
    if (!contactOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setContactOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [contactOpen]);

  function blurSubEmail() {
    if (!subEmail.trim()) return;
    const err = validateEmail(subEmail);
    setSubError(err || "");
    if (err) { setSubShake(true); setTimeout(() => setSubShake(false), 400); }
  }

  async function joinNewsletter() {
    if (!subEmail.trim()) {
      setSubError("Enter your email address");
      setSubShake(true);
      setTimeout(() => setSubShake(false), 400);
      return;
    }
    const err = validateEmail(subEmail);
    if (err) {
      setSubError(err);
      setSubShake(true);
      setTimeout(() => setSubShake(false), 400);
      return;
    }
    const klaviyoKey  = import.meta.env.VITE_KLAVIYO_PUBLIC_KEY;
    const klaviyoList = import.meta.env.VITE_KLAVIYO_LIST_ID;
    if (klaviyoKey && klaviyoKey !== 'YOUR_PUBLIC_KEY') {
      try {
        await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${klaviyoKey}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'revision': '2023-02-22' },
          body: JSON.stringify({
            data: {
              type: 'subscription',
              attributes: {
                profile: { data: { type: 'profile', attributes: { email: subEmail } } },
                list_id: klaviyoList,
              },
            },
          }),
        });
      } catch (e) {
        if (import.meta.env.DEV) console.warn('[Klaviyo] subscribe error:', e);
      }
    }
    try { window.__analytics && window.__analytics.event('sign_up', { method: 'newsletter_footer' }); } catch (_) {}
    if (window.fbq) fbq('track', 'Lead');
    setSubJoined(true);
    setSubEmail("");
    setSubError("");
  }

  return (
  <React.Fragment>
    <footer className="footer">
      <div className="footer-border" />
      <div className="wrap footer-top">
        <div>
          <div className="f-brand">SOHRO</div>
          <p className="f-tag">Quietly considered clothing for women — handmade in small batches, made to be lived in.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="/categories/kurta-sets" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Kurta Sets" }); }}>Kurta Sets</a></li>
            <li><a href="/categories/dresses" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Dresses" }); }}>Dresses</a></li>
            <li><a href="/categories/co-ord-sets" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Co-ord Sets" }); }}>Co-ord Sets</a></li>
            <li><a href="/categories/suit-sets" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "Suit Sets" }); }}>Suit Sets</a></li>
          </ul>
        </div>
        <div>
          <h4>House</h4>
          <ul>
            <li><a href="/our-story" onClick={(e) => { e.preventDefault(); go({ name: "our-story" }); }}>Our story</a></li>
            <li><a href="/shop" onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "all" }); }}>Our textiles</a></li>
            <li><a href="/shipping-returns" onClick={(e) => { e.preventDefault(); go({ name: "shipping-returns" }); }}>Shipping &amp; returns</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSizeGuideOpen(true); }}>Size guide</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }}>Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>The inner circle</h4>
          <p className="f-tag" style={{ marginTop: 0 }}>Early access to new collections and small-batch restocks.</p>
          {subJoined ? (
            <p className="f-tag" style={{ marginTop: 14, color: "rgba(255,255,255,0.7)" }}>You're in the circle.</p>
          ) : (
            <div>
              <div className={"f-sub" + (subShake ? " shake" : "") + (subError ? " f-sub-error" : "")}>
                <input
                  placeholder="Your email"
                  aria-label="email"
                  value={subEmail}
                  onChange={(e) => { setSubEmail(e.target.value); if (subError) setSubError(""); }}
                  onBlur={blurSubEmail}
                />
                <button onClick={joinNewsletter}>Join</button>
              </div>
              {subError && <div className="field-error-light">{subError}</div>}
            </div>
          )}
        </div>
      </div>
      <div className="wrap footer-bottom">
        <div className="label">© 2026 Sohro</div>
        <div className="label">Instagram · Pinterest · Facebook</div>
      </div>
    </footer>

    {/* Size guide modal (footer-level) */}
    <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

    {/* Contact modal */}
    {contactOpen && (
      <div className="login-scrim open" onClick={(e) => { if (e.target === e.currentTarget) setContactOpen(false); }}>
        <div className="login-modal" style={{ maxWidth: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px 0" }}>
            <span className="sohro-gold" style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: ".3em" }}>SOHRO</span>
            <button className="x-btn" onClick={() => setContactOpen(false)} aria-label="close">✕</button>
          </div>
          <div className="login-body">
            <div className="login-title">Get in touch.</div>
            <div className="login-sub" style={{ marginBottom: 28 }}>We'd love to hear from you — questions, custom orders, or just to say hello.</div>
            {[
              ["Email",     <a href="mailto:hello@sohro.in" style={{ color: "var(--ink)", textDecoration: "none" }}>hello@sohro.in</a>],
              ["WhatsApp",  <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "none" }}>+91 98765 43210</a>],
              ["Hours",     "Mon–Sat · 10am–6pm IST"],
              ["Studio",    "Hyderabad, India"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                <span className="label muted" style={{ fontSize: 10 }}>{k}</span>
                <span style={{ fontSize: 13, color: "var(--ink)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </React.Fragment>
  );
}

/* ---------- Cart drawer ---------- */
function CartDrawer({ open, onClose, items, removeItem, addQty, go, onCheckout }) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  return (
    <React.Fragment>
      <div className={"scrim " + (open ? "open" : "")} onClick={onClose}></div>
      <aside className={"drawer " + (open ? "open" : "")} aria-hidden={!open}>
        <div className="drawer-head">
          <h3>Your bag</h3>
          <button className="x-btn" onClick={onClose} aria-label="close">✕</button>
        </div>
        {items.length > 0 && (
          <div className="free-ship-bar">
            <span className="free-ship-icon">✦</span>
            <span className="free-ship-text">You qualify for free shipping</span>
          </div>
        )}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p className="label" style={{ marginBottom: 18 }}>Your bag is empty</p>
              <button className="btn ghost" onClick={() => { onClose(); go({ name: "collection", cat: "all" }); }}>Start shopping</button>
            </div>
          ) : (
            items.map((it) => (
              <div className="cart-row" key={it.id + it.size}>
                <Ph tone={it.tone} img={it.img} cap="" />
                <div>
                  <div className="nm">{it.name}</div>
                  <div className="sz">Size {it.size}</div>
                  <div className="cart-qty">
                    <button onClick={() => removeItem(it.id, it.size)} aria-label="decrease">−</button>
                    <span className="qty-val">{it.qty}</span>
                    <button onClick={() => addQty(it.id, it.size)} aria-label="increase">+</button>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <div className="px">{fmt(it.price * it.qty)}</div>
                  <button className="rm" onClick={() => removeItem(it.id, it.size, true)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="subtotal">
              <span className="lab">Subtotal</span>
              <span className="val">{fmt(subtotal)}</span>
            </div>
            <button className="btn full accent" onClick={onCheckout}>Checkout</button>
            <p className="label" style={{ textAlign: "center", marginTop: 14, color: "var(--muted)" }}>
              Free shipping · Estimated delivery {(() => {
                const d = new Date(); d.setDate(d.getDate() + 5);
                return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
              })()}
            </p>
          </div>
        )}
      </aside>
    </React.Fragment>
  );
}

/* ---------- Wishlist drawer ---------- */
function WishlistDrawer({ open, onClose, items, onRemove, onAdd, go }) {
  const [sizes, setSizes] = useState({});

  function selectSize(id, size) {
    setSizes((s) => ({ ...s, [id]: size }));
  }

  function addAll() {
    items.forEach((p) => onAdd(p, sizes[p.id] || "M"));
    onClose();
  }

  const subtotal = items.reduce((s, p) => s + p.price, 0);

  return (
    <React.Fragment>
      <div className={"scrim " + (open ? "open" : "")} onClick={onClose}></div>
      <aside className={"drawer " + (open ? "open" : "")} aria-hidden={!open}>
        <div className="drawer-head">
          <h3>Wishlist</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {items.length > 0 && <span className="label muted">{items.length} item{items.length !== 1 ? "s" : ""}</span>}
            <button className="x-btn" onClick={onClose} aria-label="close">✕</button>
          </div>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p className="label" style={{ marginBottom: 18 }}>Your wishlist is empty</p>
              <button className="btn ghost" onClick={() => { onClose(); go({ name: "collection", cat: "all" }); }}>Browse the collection</button>
            </div>
          ) : items.map((p) => (
            <div className="wish-row" key={p.id}>
              <Ph tone={p.tone} img={p.img} cap="" />
              <div>
                <div className="nm">{p.name}</div>
                <div className="cat-lbl">{p.cat} · {p.collection}</div>
                <div className="px">{fmt(p.price)}</div>
                <div className="wish-sizes">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                    <button key={s} className={"wish-sz" + (sizes[p.id] === s ? " active" : "")} onClick={() => selectSize(p.id, s)}>{s}</button>
                  ))}
                </div>
                <button className="wish-add-btn" onClick={() => onAdd(p, sizes[p.id] || "M")}>
                  Add to bag — {fmt(p.price)}
                </button>
                <button className="rm" style={{ marginTop: 6 }} onClick={() => onRemove(p.id)}>Remove</button>
              </div>
              <button className="wish-heart-btn" onClick={() => onRemove(p.id)} aria-label="Remove from wishlist">♥</button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="subtotal">
              <span className="lab">{items.length} piece{items.length !== 1 ? "s" : ""} in wishlist</span>
              <span className="val">{fmt(subtotal)}</span>
            </div>
            <button className="btn full" style={{ marginBottom: 10 }} onClick={addAll}>Add all to bag</button>
            <button className="btn ghost full" onClick={() => { onClose(); go({ name: "collection", cat: "all" }); }}>Shop the collection</button>
            <p className="label" style={{ textAlign: "center", marginTop: 14, color: "var(--muted)" }}>Items wishlisted · not reserved</p>
          </div>
        )}
      </aside>
    </React.Fragment>
  );
}

/* ---------- Search overlay ---------- */
function SearchOverlay({ open, onClose, go, onAdd, wishlist, onToggleWishlist }) {
  const [queryRaw, setQueryRaw] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const inputRef = useRef(null);
  const cats = ["all", "Dresses", "Kurta Sets", "Co-ord Sets", "Suit Sets"];

  useEffect(() => {
    if (open) { setQueryRaw(""); setTimeout(() => inputRef.current && inputRef.current.focus(), 50); }
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const query = queryRaw.trim();

  let displayProducts;
  if (query) {
    displayProducts = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.cat.toLowerCase().includes(query.toLowerCase()) ||
      p.collection.toLowerCase().includes(query.toLowerCase())
    );
  } else {
    const base = activeCat === "all" ? products : products.filter((p) => p.cat === activeCat);
    const newFirst = base.filter((p) => p.tag === "New").concat(base.filter((p) => p.tag !== "New"));
    displayProducts = newFirst.slice(0, 4);
  }

  function navigateAndClose(route) { go(route); onClose(); }

  return (
    <React.Fragment>
      <div className={"search-overlay-scrim " + (open ? "open" : "")} onClick={onClose} />
      <div className={"search-overlay " + (open ? "open" : "")} role="dialog" aria-modal="true">
        <div className="search-bar">
          <div className="wrap" style={{ maxWidth: "var(--maxw)", margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
            <div className="search-field" style={{ flex: 1 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                placeholder="Search for a piece…"
                value={queryRaw}
                onChange={(e) => setQueryRaw(e.target.value)}
                aria-label="Search"
              />
            </div>
            <button className="search-close-btn" onClick={onClose} aria-label="Close search">✕</button>
          </div>
        </div>
        <div className="search-body">
          {!query && (
            <React.Fragment>
              <div className="label muted" style={{ marginBottom: 14 }}>Browse by category</div>
              <div className="chips" style={{ marginBottom: 32 }}>
                {cats.map((c) => (
                  <button key={c} className={"chip" + (activeCat === c ? " active" : "")} onClick={() => setActiveCat(c)}>
                    {c === "all" ? "All" : c}
                  </button>
                ))}
              </div>
              <div className="label muted" style={{ marginBottom: 20 }}>New this season</div>
            </React.Fragment>
          )}
          {query && displayProducts.length === 0 && (
            <p className="muted" style={{ padding: "60px 0", textAlign: "center" }}>
              Nothing matched — try a different word or browse by category.
            </p>
          )}
          <div className="prod-grid">
            {displayProducts.map((p) => (
              <ProductCard
                key={p.id} p={p}
                go={navigateAndClose}
                onAdd={onAdd}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

/* ---------- Login / sign-up overlay ---------- */
function LoginOverlay({ open, onClose, onLogin }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailShake, setEmailShake] = useState(false);

  function blurLoginEmail() {
    const err = validateEmail(email);
    setEmailError(err || "");
    if (err) {
      setEmailShake(true);
      setTimeout(() => setEmailShake(false), 400);
    }
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function submit(e) {
    e.preventDefault();
    onLogin({ ...window.SOROH_DATA.MOCK_USER });
  }

  function handleGoogleSignIn() {
    const clientId = window.GOOGLE_CLIENT_ID;
    if (!window.google || !clientId || clientId.startsWith("YOUR_CLIENT_ID")) {
      onLogin({ ...window.SOROH_DATA.MOCK_USER });
      return;
    }
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "email profile",
      callback: async (tokenResponse) => {
        if (tokenResponse.error) return;
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: "Bearer " + tokenResponse.access_token },
        });
        const info = await res.json();
        onLogin({
          name: info.name,
          firstName: info.given_name,
          email: info.email,
          avatar: info.picture,
          joinDate: new Date().toISOString().split("T")[0],
        });
      },
    });
    client.requestAccessToken({ prompt: "select_account" });
  }


  return (
    <div className={"login-scrim " + (open ? "open" : "")} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="login-modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px 0" }}>
          <span className="sohro-gold" style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: ".3em" }}>SOHRO</span>
          <button className="x-btn" onClick={onClose} aria-label="close">✕</button>
        </div>
        <div className="login-tabs">
          <div className={"login-tab" + (tab === "login" ? " active" : "")} onClick={() => { setTab("login"); setEmailError(""); }}>Sign in</div>
          <div className={"login-tab" + (tab === "signup" ? " active" : "")} onClick={() => { setTab("signup"); setEmailError(""); }}>Create account</div>
        </div>
        <form className="login-body" onSubmit={submit}>
          {tab === "login" ? (
            <React.Fragment>
              <div className="login-title">Welcome back.</div>
              <div className="login-sub">Sign in to see your edit, orders, and wishlist.</div>
              <div className={"login-field" + (emailShake ? " shake" : "")}>
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                  onBlur={blurLoginEmail}
                  placeholder="you@example.com"
                  className={emailError ? "input-error" : ""}
                />
                {emailError && <div className="field-error">{emailError}</div>}
              </div>
              <div className="login-field"><label>Password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" /></div>
              <div style={{ textAlign: "right", marginBottom: 22 }}>
                <span style={{ fontSize: 11, color: "var(--muted)", borderBottom: "1px solid var(--line-strong)", paddingBottom: 1, cursor: "pointer" }}>Forgot password?</span>
              </div>
              <button type="submit" className="btn full" style={{ marginBottom: 14 }}>Sign in</button>
              <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", margin: "0 0 14px" }}>or</div>
              <button type="button" className="btn-google" onClick={handleGoogleSignIn}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C18.658 13.652 17.64 11.346 17.64 9.2z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>
              <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
                New to Sohro?{" "}
                <span style={{ color: "var(--ink)", borderBottom: "1px solid var(--line-strong)", cursor: "pointer" }} onClick={() => setTab("signup")}>Create an account</span>
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="login-title">Join the inner circle.</div>
              <div className="login-sub">Early access, your personal edit, and your full order history.</div>
              <div className="login-field"><label>Your name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="First name" /></div>
              <div className={"login-field" + (emailShake ? " shake" : "")}>
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                  onBlur={blurLoginEmail}
                  placeholder="you@example.com"
                  className={emailError ? "input-error" : ""}
                />
                {emailError && <div className="field-error">{emailError}</div>}
              </div>
              <div className="login-field"><label>Password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Create a password" /></div>
              <button type="submit" className="btn full" style={{ marginTop: 8, marginBottom: 14 }}>Create my account</button>
              <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", margin: "0 0 14px" }}>or</div>
              <button type="button" className="btn-google" onClick={handleGoogleSignIn}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C18.658 13.652 17.64 11.346 17.64 9.2z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>
              <p style={{ fontSize: 10, color: "var(--muted)", textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
                By creating an account you agree to our{" "}
                <span style={{ borderBottom: "1px solid var(--line-strong)", cursor: "pointer" }}>Terms</span> and{" "}
                <span style={{ borderBottom: "1px solid var(--line-strong)", cursor: "pointer" }}>Privacy policy</span>.{" "}
                Already have an account?{" "}
                <span style={{ color: "var(--ink)", borderBottom: "1px solid var(--line-strong)", cursor: "pointer" }} onClick={() => setTab("login")}>Sign in</span>
              </p>
            </React.Fragment>
          )}
        </form>
      </div>
    </div>
  );
}

/* ---------- Stars (rating display) ---------- */
function Stars({ avg, size = 12 }) {
  const full = Math.floor(avg);
  const half = avg - full >= 0.5;
  return (
    <div className="stars" aria-label={avg + " stars"}>
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={"star" + (i <= full ? "" : (i === full + 1 && half) ? " half" : " empty")}
          style={{ fontSize: size }}>
          {i <= full ? "★" : (i === full + 1 && half) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

/* ---------- Toast container ---------- */
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={"toast" + (t.exit ? " exit" : "")}>
          <span className="toast-icon">{t.icon || "✓"}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Size guide modal ---------- */
function SizeGuideModal({ open, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const rows = [
    ["XS", "32–33", "25–26", "35–36"],
    ["S",  "34–35", "27–28", "37–38"],
    ["M",  "36–37", "29–30", "39–40"],
    ["L",  "38–39", "31–32", "41–42"],
    ["XL", "40–41", "33–34", "43–44"],
    ["XXL","42–44", "35–37", "45–47"],
  ];
  return (
    <div className={"size-guide-scrim " + (open ? "open" : "")} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="size-guide-modal">
        <div className="size-guide-head">
          <div>
            <div className="size-guide-title">Size guide</div>
            <div className="size-guide-sub">All measurements in inches. Take measurements over light clothing.</div>
          </div>
          <button className="x-btn" onClick={onClose} aria-label="close">✕</button>
        </div>
        <table className="size-table">
          <thead>
            <tr>
              <th>Size</th><th>Bust</th><th>Waist</th><th>Hips</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([s, b, w, h]) => (
              <tr key={s}>
                <td>{s}</td><td>{b}"</td><td>{w}"</td><td>{h}"</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="size-guide-tip">
          <strong>How to measure:</strong> Bust — around the fullest part of your chest. Waist — around your natural waistline. Hips — around the fullest part of your hips, about 8" below your waist. When in between sizes, size up.
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile menu drawer ---------- */
function MobileMenuDrawer({ open, onClose, go, openSearch, openLogin, openWishlist, user }) {
  const navLinks = [
    { label: "Shop", cat: "all" },
    { label: "Kurta Sets", cat: "Kurta Sets" },
    { label: "Dresses", cat: "Dresses" },
    { label: "Co-ord Sets", cat: "Co-ord Sets" },
    { label: "Suit Sets", cat: "Suit Sets" },
  ];
  function nav(route) { go(route); onClose(); }
  return (
    <React.Fragment>
      <div className={"mobile-menu-scrim " + (open ? "open" : "")} onClick={onClose} />
      <nav className={"mobile-menu-drawer " + (open ? "open" : "")} aria-hidden={!open}>
        <div className="mobile-menu-section">
          <div className="mobile-menu-label">Shop</div>
          {navLinks.map(({ label, cat }) => (
            <button key={cat} className="mobile-menu-btn" onClick={() => nav({ name: "collection", cat })}>{label}</button>
          ))}
        </div>
        <div className="mobile-menu-section">
          <div className="mobile-menu-label">Collections</div>
          {["Pastel Riverie","Gulmohar","Sitaara","Garden Poem","Chaandni","Noor"].map((c) => (
            <button key={c} className="mobile-menu-btn sub" onClick={() => nav({ name: "collection", cat: "all", collection: c })}>{c}</button>
          ))}
        </div>
        <div className="mobile-menu-section">
          <button className="mobile-menu-btn" onClick={() => { openSearch(); onClose(); }}>Search</button>
          <button className="mobile-menu-btn" onClick={() => { user ? nav({ name: "account" }) : openLogin(); }}>
            {user ? "My account" : "Sign in / Register"}
          </button>
          <button className="mobile-menu-btn" onClick={() => { openWishlist(); onClose(); }}>Wishlist</button>
        </div>
        <div className="mobile-menu-foot">
          <div className="label muted" style={{ fontSize: 10, lineHeight: 1.8 }}>
            Free shipping across India · We ship worldwide
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}

/* ---------- Back to top ---------- */
function BackToTop() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const onScroll = () => setVis(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      className={"back-top" + (vis ? " visible" : "")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  );
}

/* ---------- Quick View modal ---------- */
function QuickViewModal({ product, open, onClose, go, onAdd, wishlist, onToggleWishlist }) {
  const [size, setSize] = useState(null);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const p = product;

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => { if (open) setSize(null); }, [open]);

  if (!p) return null;
  const isSaved = wishlist && wishlist.some((w) => w.id === p.id);

  return (
    <div className={"qv-scrim " + (open ? "open" : "")} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="qv-modal">
        <div className="qv-gallery">
          <Ph tone={p.tone} img={p.img} cap="" style={{ height: "100%" }} />
          <button className="qv-close" onClick={onClose} aria-label="close">✕</button>
        </div>
        <div className="qv-info">
          <div>
            <div className="label muted" style={{ marginBottom: 6 }}>{p.cat} · {p.collection}</div>
            <div className="qv-name">{p.name}</div>
            <div className="qv-price" style={{ marginTop: 6 }}>{fmt(p.price)}</div>
          </div>
          <p className="qv-desc">{p.desc}</p>
          <div>
            <div className="label muted" style={{ marginBottom: 10 }}>Size{size ? " · " + size : ""}</div>
            <div className="sizes">
              {sizes.map((s) => (
                <button key={s} className={"size" + (size === s ? " active" : "")} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>
          {p.stock && p.stock <= 5 && <div className="low-stock">Only {p.stock} left</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn full accent" onClick={() => { onAdd(p, size || "M"); onClose(); }}>
              Add to bag — {fmt(p.price)}
            </button>
            <button
              className="btn full ghost"
              onClick={() => onToggleWishlist && onToggleWishlist(p)}
              style={isSaved ? { borderColor: "#c8605a", color: "#c8605a" } : {}}
            >
              {isSaved ? "♥ In wishlist" : "♡ Add to wishlist"}
            </button>
          </div>
          <span className="qv-view-link" onClick={() => { go({ name: "product", id: p.id }); onClose(); }}>
            View full details →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Image lightbox ---------- */
function ImageLightbox({ open, images, index, onClose, onChange }) {
  useEffect(() => {
    if (!open) return;
    function h(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") onChange((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, images.length, onClose, onChange]);

  if (!open || !images.length) return null;
  const img = images[index];
  return (
    <div className="lightbox-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
      {images.length > 1 && (
        <React.Fragment>
          <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); onChange((i) => (i - 1 + images.length) % images.length); }} aria-label="Previous">‹</button>
          <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); onChange((i) => (i + 1) % images.length); }} aria-label="Next">›</button>
        </React.Fragment>
      )}
      <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
        <img src={img.src} alt={img.cap || ""} className="lightbox-img" />
        {img.cap && <div className="lightbox-cap">{img.cap}</div>}
      </div>
      {images.length > 1 && (
        <div className="lightbox-dots">
          {images.map((_, i) => (
            <button key={i} className={"lightbox-dot" + (i === index ? " active" : "")} onClick={(e) => { e.stopPropagation(); onChange(i); }} aria-label={"Image " + (i + 1)} />
          ))}
        </div>
      )}
    </div>
  );
}

const WA_NUMBER = '919876543210';
const WA_MSG = encodeURIComponent('Hi! I have a question about my Sohro order.');
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

function WhatsAppButton() {
  return (
    <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.855L0 24l6.31-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.359-.214-3.727.891.937-3.624-.234-.372A9.785 9.785 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
      </svg>
    </a>
  );
}

function ExitIntentModal({ open, onClose, cart }) {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  if (!open || cart.length > 0) return null;
  function handleSubmit(e) {
    e.preventDefault();
    setJoined(true);
    try { window.__analytics && window.__analytics.event('sign_up', { method: 'exit_intent' }); } catch (_) {}
    if (window.fbq) fbq('track', 'Lead');
  }
  return (
    <div className="exit-scrim" onClick={onClose}>
      <div className="exit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="x-btn exit-close" onClick={onClose} aria-label="close">✕</button>
        <div className="exit-kicker label">Before you go</div>
        <h2 className="exit-title">Stay in the<br /><em>inner circle.</em></h2>
        <p className="exit-sub">Get early access to new collections, restocks, and a one-time 15% welcome discount.</p>
        {joined ? (
          <p className="exit-thanks">You're in — watch your inbox. ✦</p>
        ) : (
          <form className="exit-form" onSubmit={handleSubmit}>
            <input
              type="email" required placeholder="your@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn full">Claim 15% off</button>
          </form>
        )}
      </div>
    </div>
  );
}

export { Ph, Header, Footer, Values, ProductCard, CartDrawer, WishlistDrawer, SearchOverlay, LoginOverlay, Stars, ToastContainer, SizeGuideModal, MobileMenuDrawer, BackToTop, QuickViewModal, ImageLightbox, WhatsAppButton, ExitIntentModal };
