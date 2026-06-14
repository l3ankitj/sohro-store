import React, { lazy, Suspense, useState as useS, useEffect as useE, useRef as useR } from 'react';
import ReactDOM from 'react-dom/client';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSlider, TweakToggle } from './tweaks-panel.jsx';
import { Header, CartDrawer, WishlistDrawer, SearchOverlay, LoginOverlay, ToastContainer, MobileMenuDrawer, BackToTop, QuickViewModal, WhatsAppButton, ExitIntentModal } from './ui.jsx';

const Home             = lazy(() => import('./pages/Home.jsx'));
const Collection       = lazy(() => import('./pages/Collection.jsx'));
const Product          = lazy(() => import('./pages/Product.jsx'));
const AccountPage      = lazy(() => import('./pages/AccountPage.jsx'));
const CheckoutPage     = lazy(() => import('./pages/CheckoutPage.jsx'));
const OurStoryPage     = lazy(() => import('./pages/OurStoryPage.jsx'));
const ShippingReturnsPage = lazy(() => import('./pages/ShippingReturnsPage.jsx'));
import { products as allProducts, collections as allCollections, ratings, mockReviews, MOCK_USER } from './data.js';
import { slugify, routeToUrl, urlToRoute } from './routing.js';

const DOMAIN = 'https://sohro.in';
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=1200&q=85&auto=format&fit=crop';

function dlPush(event, data) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

function updateMeta({ title, description, image, url, type = 'website', robots = 'index, follow' }) {
  const set = (id, attr, val) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, val); };
  document.title = title;
  set('meta-desc',   'content', description);
  set('meta-robots', 'content', robots);
  set('og-title',    'content', title);
  set('og-desc',     'content', description);
  set('og-image',    'content', image || DEFAULT_IMG);
  set('og-url',      'content', DOMAIN + url);
  set('og-type',     'content', type);
  set('tw-title',    'content', title);
  set('tw-desc',     'content', description);
  set('tw-image',    'content', image || DEFAULT_IMG);
  const canon = document.getElementById('sohro-canonical');
  if (canon) canon.href = DOMAIN + url;
}

function metaForRoute(r) {
  const url = routeToUrl(r);
  switch (r.name) {
    case 'product': {
      const p = allProducts.find(x => x.id === r.id);
      if (!p) return null;
      return { title: `${p.name} — ${p.fabric} | Sohro`, description: p.desc + ' Handmade in small batches in India. Free shipping above ₹2,500.', image: p.img + '&w=1200', url, type: 'product' };
    }
    case 'collection': {
      if (r.collection) {
        const c = allCollections.find(x => x.key === r.collection);
        if (c) return { title: `${c.label} — ${c.season} Collection | Sohro`, description: c.note + ' Handwoven, hand block-printed clothing made in small batches in India.', image: c.img, url };
      }
      const catMap = { Dresses: 'Dresses — Easy everyday silhouettes', 'Co-ord Sets': 'Co-ord Sets — Effortless two-pieces', 'Kurta Sets': 'Kurta Sets — Hand-finished classics', 'Suit Sets': 'Suit Sets — For the occasion' };
      const label = catMap[r.cat] || 'All Clothing';
      return { title: `${label} | Sohro`, description: `Shop ${r.cat || 'all'} — handwoven, hand block-printed clothing made in small batches in India. Free shipping above ₹2,500.`, url };
    }
    case 'our-story':        return { title: 'Our Story — Handmade in India | Sohro', description: 'Sohro is a small studio in Hyderabad making considered clothing for women. Every piece is handwoven, hand block-printed and finished in small batches.', url };
    case 'shipping-returns': return { title: 'Shipping & Returns — Free Shipping Above ₹2,500 | Sohro', description: 'Free standard shipping across India above ₹2,500. Returns accepted within 14 days. Express delivery available.', url };
    case 'checkout':         return { title: 'Checkout | Sohro', description: 'Complete your Sohro order.', url, robots: 'noindex, nofollow' };
    case 'account':          return { title: 'My Account | Sohro', description: 'Manage your orders, wishlist and profile.', url, robots: 'noindex, nofollow' };
    default:                 return { title: 'Sohro — Handmade Clothing for Women', description: 'Quietly considered clothing for women — handwoven cotton, linen and silk, made in small batches in India. Free shipping above ₹2,500.', url: '/' };
  }
}

function injectSchema(data) {
  const el = document.getElementById('schema-ld');
  if (el) el.textContent = data ? JSON.stringify(data) : '';
}

function schemaForRoute(r) {
  const org = {
    "@type": "Organization",
    "@id": "https://sohro.in/#organization",
    "name": "Sohro",
    "url": "https://sohro.in",
    "logo": "https://sohro.in/logo.png",
    "contactPoint": { "@type": "ContactPoint", "email": "hello@sohro.in", "contactType": "customer service" },
    "address": { "@type": "PostalAddress", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "addressCountry": "IN" }
  };
  switch (r.name) {
    case 'home': return {
      "@context": "https://schema.org",
      "@graph": [org, {
        "@type": "WebSite", "@id": "https://sohro.in/#website", "url": "https://sohro.in", "name": "Sohro",
        "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": "https://sohro.in/shop?q={search_term_string}" }, "query-input": "required name=search_term_string" }
      }]
    };
    case 'product': {
      const p = allProducts.find(x => x.id === r.id);
      if (!p) return { "@context": "https://schema.org", "@graph": [org] };
      const rating = ratings[p.id];
      return {
        "@context": "https://schema.org",
        "@graph": [org, {
          "@type": "Product",
          "name": p.name,
          "description": p.desc,
          "image": [p.img, p.img2],
          "sku": p.id,
          "brand": { "@type": "Brand", "name": "Sohro" },
          "material": p.fabric,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": p.price,
            "priceValidUntil": "2027-12-31",
            "availability": (p.stock && p.stock <= 5) ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
            "seller": { "@type": "Organization", "name": "Sohro" },
            "url": "https://sohro.in/products/" + slugify(p.name),
            "hasMerchantReturnPolicy": { "@type": "MerchantReturnPolicy", "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow", "merchantReturnDays": 14, "returnMethod": "https://schema.org/ReturnByMail" },
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "INR" },
              "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "DAY" }, "transitTime": { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 5, "unitCode": "DAY" } }
            }
          },
          ...(rating ? {
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": rating.avg, "reviewCount": rating.count, "bestRating": 5, "worstRating": 1 },
            "review": mockReviews.map(rv => ({
              "@type": "Review",
              "reviewRating": { "@type": "Rating", "ratingValue": rv.stars, "bestRating": 5 },
              "author": { "@type": "Person", "name": rv.name },
              "reviewBody": rv.text,
              "datePublished": "2026-05-01"
            }))
          } : {})
        }, {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sohro.in/" },
            { "@type": "ListItem", "position": 2, "name": p.cat, "item": `https://sohro.in/categories/${slugify(p.cat)}` },
            { "@type": "ListItem", "position": 3, "name": p.name }
          ]
        }]
      };
    }
    case 'collection': {
      const catLabel = r.collection || r.cat || 'All Clothing';
      return {
        "@context": "https://schema.org",
        "@graph": [org, {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sohro.in/" },
            { "@type": "ListItem", "position": 2, "name": catLabel }
          ]
        }]
      };
    }
    case 'our-story': return { "@context": "https://schema.org", "@graph": [org, { "@type": "AboutPage", "name": "Our Story — Sohro", "url": "https://sohro.in/our-story" }] };
    case 'shipping-returns': return null; // ShippingReturnsPage injects FAQPage schema itself
    default: return { "@context": "https://schema.org", "@graph": [org] };
  }
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "a",
  "accentB": "#8B3D6A",
  "fontScale": 1,
  "showCraftStrip": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useS(() => urlToRoute(window.location.pathname));
  const [tweaksPanelVisible, setTweaksPanelVisible] = useS(false);
  const [cart, setCart] = useS([]);
  const [cartOpen, setCartOpen] = useS(false);
  const [wishlist, setWishlist] = useS([]);
  const [wishlistOpen, setWishlistOpen] = useS(false);
  const [searchOpen, setSearchOpen] = useS(false);
  const [loginOpen, setLoginOpen] = useS(false);
  const [user, setUser] = useS(null);
  const [quickViewProduct, setQuickViewProduct] = useS(null);
  const [toasts, setToasts] = useS([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useS(false);
  const [exitOpen, setExitOpen] = useS(false);
  const exitFired = useR(false);
  const toastId = useR(0);
  const pendingCheckout = useR(false);

  function addToast(message, icon) {
    const id = ++toastId.current;
    setToasts((ts) => [...ts, { id, message, icon, exit: false }]);
    setTimeout(() => {
      setToasts((ts) => ts.map((t) => t.id === id ? { ...t, exit: true } : t));
      setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 300);
    }, 2400);
  }

  // Persist wishlist to localStorage
  useE(() => {
    try {
      const saved = localStorage.getItem("sohro_wishlist");
      if (saved) {
        const ids = JSON.parse(saved);
        setWishlist(ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean));
      }
    } catch (_) {}
  }, []);
  useE(() => {
    try { localStorage.setItem("sohro_wishlist", JSON.stringify(wishlist.map((p) => p.id))); } catch (_) {}
  }, [wishlist]);

  // Persist cart to localStorage
  useE(() => {
    try {
      const saved = localStorage.getItem("sohro_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (_) {}
  }, []);
  useE(() => {
    try { localStorage.setItem("sohro_cart", JSON.stringify(cart)); } catch (_) {}
  }, [cart]);

  // Cart abandonment signal — store cart + email in localStorage for recovery flows
  useE(() => {
    if (cart.length === 0) { localStorage.removeItem("sohro_abandon"); return; }
    const email = localStorage.getItem("sohro_guest_email");
    if (!email) return;
    try {
      localStorage.setItem("sohro_abandon", JSON.stringify({
        email, ts: Date.now(),
        items: cart, total: cart.reduce((s, x) => s + x.price * x.qty, 0)
      }));
    } catch (_) {}
  }, [cart]);

  // Tweaks panel — toggle with Shift+Alt+T (hidden from shoppers by default)
  useE(() => {
    function onKey(e) {
      if (e.shiftKey && e.altKey && (e.key === "T" || e.key === "t")) setTweaksPanelVisible((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Exit intent — mouse leaves viewport upward, cart empty, fires once per session
  useE(() => {
    function onLeave(e) {
      if (e.clientY <= 0 && !exitFired.current && cart.length === 0) {
        exitFired.current = true;
        setExitOpen(true);
      }
    }
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, [cart.length]);

  // Dynamic meta tags + JSON-LD schema per route
  useE(() => {
    const meta = metaForRoute(route);
    if (meta) updateMeta(meta);
    injectSchema(schemaForRoute(route));
  }, [route.name, route.id, route.collection, route.cat]);

  // Seed the initial history entry so popstate can always read a state object
  useE(() => {
    history.replaceState(route, '', routeToUrl(route));
    function onPop(e) {
      const r = e.state || urlToRoute(window.location.pathname);
      setRoute(r);
      window.scrollTo(0, 0);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function go(r) {
    const url = routeToUrl(r);
    history.pushState(r, '', url);
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'instant' });
    try { window.__analytics && window.__analytics.page(url); } catch (_) {}
    dlPush('page_view', { page_path: url });
    try { if (window.fbq) fbq('track', 'PageView'); } catch (_) {}
    try { if (window.pintrk) pintrk('track', 'pagevisit'); } catch (_) {}
  }

  // Cart — grouped by id+size with qty
  function addToCart(p, size) {
    setCart((c) => {
      const idx = c.findIndex((x) => x.id === p.id && x.size === size);
      if (idx >= 0) return c.map((x, i) => i === idx ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { id: p.id, name: p.name, price: p.price, tone: p.tone, img: p.img, size, qty: 1 }];
    });
    addToast("Added to bag", "✦");
    try {
      window.__analytics && window.__analytics.event('add_to_cart', {
        currency: 'INR', value: p.price,
        items: [{ item_id: p.id, item_name: p.name, item_category: p.cat, item_variant: size, price: p.price, quantity: 1 }]
      });
    } catch (_) {}
    dlPush('add_to_cart', { ecommerce: { currency: 'INR', value: p.price, items: [{ item_id: p.id, item_name: p.name, item_category: p.cat, price: p.price }] } });
    try { if (window.fbq) fbq('track', 'AddToCart', { content_ids: [p.id], content_type: 'product', value: p.price, currency: 'INR', content_name: p.name }); } catch (_) {}
    try { if (window.pintrk) pintrk('track', 'addtocart', { value: p.price, currency: 'INR', product_ids: [p.id] }); } catch (_) {}
  }
  function addQty(id, size) {
    setCart((c) => c.map((x) => x.id === id && x.size === size ? { ...x, qty: x.qty + 1 } : x));
  }
  function removeItem(id, size, force = false) {
    setCart((c) => {
      const item = c.find((x) => x.id === id && x.size === size);
      if (!item) return c;
      if (!force && item.qty > 1) return c.map((x) => x.id === id && x.size === size ? { ...x, qty: x.qty - 1 } : x);
      return c.filter((x) => !(x.id === id && x.size === size));
    });
  }
  function clearCart() { setCart([]); }

  // Wishlist
  function toggleWishlist(p) {
    setWishlist((w) => {
      const isSaved = w.find((x) => x.id === p.id);
      addToast(isSaved ? "Removed from wishlist" : "Added to wishlist", isSaved ? "♡" : "♥");
      return isSaved ? w.filter((x) => x.id !== p.id) : [...w, p];
    });
  }
  function removeFromWishlist(id) { setWishlist((w) => w.filter((x) => x.id !== id)); }

  // Auth
  function handleLogin(u) {
    setUser(u);
    setLoginOpen(false);
    if (pendingCheckout.current) {
      pendingCheckout.current = false;
      go({ name: 'checkout' });
    } else {
      go({ name: 'account' });
    }
  }
  function handleSignOut() { setUser(null); go({ name: "home" }); }

  // Checkout
  function handleCheckout() {
    setCartOpen(false);
    if (!user) {
      pendingCheckout.current = true;
      setLoginOpen(true);
      return;
    }
    try {
      const snap = cart;
      window.__analytics && window.__analytics.event('begin_checkout', {
        currency: 'INR', value: snap.reduce((s, x) => s + x.price * x.qty, 0),
        items: snap.map(it => ({ item_id: it.id, item_name: it.name, price: it.price, quantity: it.qty }))
      });
    } catch (_) {}
    dlPush('begin_checkout', { ecommerce: { currency: 'INR', value: cart.reduce((s, x) => s + x.price * x.qty, 0) } });
    if (window.fbq) fbq('track', 'InitiateCheckout', { content_ids: cart.map(i => i.id), num_items: cart.length, value: cart.reduce((s, x) => s + x.price * x.qty, 0), currency: 'INR' });
    go({ name: 'checkout' });
  }

  // Tweak tokens
  const dir = t.direction;
  const rootStyle = { "--fs": t.fontScale };
  useE(() => {
    const el = document.getElementById("soroh-root");
    if (!el) return;
    if (dir === "b" && t.accentB) el.style.setProperty("--accent", t.accentB);
    else el.style.removeProperty("--accent");
  }, [dir, t.accentB]);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const qvProps = { onQuickView: setQuickViewProduct };

  let page;
  if (route.name === "collection") {
    page = <Collection route={route} go={go} onAdd={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} {...qvProps} />;
  } else if (route.name === "product") {
    page = <Product route={route} go={go} onAdd={addToCart} openCart={() => setCartOpen(true)} wishlist={wishlist} onToggleWishlist={toggleWishlist} />;
  } else if (route.name === "account") {
    page = <AccountPage go={go} user={user || MOCK_USER} wishlist={wishlist} openWishlist={() => setWishlistOpen(true)} onSignOut={handleSignOut} />;
  } else if (route.name === "checkout") {
    page = <CheckoutPage go={go} cart={cart} onPlaceOrder={clearCart} />;
  } else if (route.name === "our-story") {
    page = <OurStoryPage go={go} />;
  } else if (route.name === "shipping-returns") {
    page = <ShippingReturnsPage go={go} />;
  } else {
    page = <Home go={go} onAdd={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} {...qvProps} />;
  }

  return (
    <div id="soroh-root" data-dir={dir} style={rootStyle} className={t.showCraftStrip ? "" : "no-craft"}>
      <Header
        go={go}
        cartCount={cartCount}
        openCart={() => setCartOpen(true)}
        openSearch={() => setSearchOpen(true)}
        wishlistCount={wishlist.length}
        openWishlist={() => setWishlistOpen(true)}
        user={user}
        openLogin={() => setLoginOpen(true)}
        openMobileMenu={() => setMobileMenuOpen(true)}
      />
      <Suspense fallback={
        <div id="main-content" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="page-spinner" />
        </div>
      }>
        <div id="main-content">{page}</div>
      </Suspense>
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        removeItem={removeItem}
        addQty={addQty}
        go={go}
        onCheckout={handleCheckout}
      />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} items={wishlist} onRemove={removeFromWishlist} onAdd={addToCart} go={go} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} go={go} onAdd={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
      <LoginOverlay open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />

      <MobileMenuDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        go={go}
        openSearch={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
        openLogin={() => { setLoginOpen(true); setMobileMenuOpen(false); }}
        openWishlist={() => { setWishlistOpen(true); setMobileMenuOpen(false); }}
        user={user}
      />
      <ToastContainer toasts={toasts} />
      <BackToTop />
      {route.name !== 'checkout' && <WhatsAppButton />}
      {route.name !== 'checkout' && <ExitIntentModal open={exitOpen} onClose={() => setExitOpen(false)} cart={cart} />}
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        go={go}
        onAdd={addToCart}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />

      {tweaksPanelVisible && (
        <TweaksPanel>
          <TweakSection label="Design direction" />
          <TweakRadio
            label="Direction"
            value={t.direction}
            options={[{ value: "a", label: "Editorial" }, { value: "b", label: "Artisanal" }]}
            onChange={(v) => setTweak("direction", v)}
          />
          <div style={{ fontSize: 11, lineHeight: 1.5, color: "rgba(0,0,0,0.5)", padding: "2px 2px 6px" }}>
            {t.direction === "a"
              ? "A · airy editorial — Cormorant serif, fine sans, cream & taupe."
              : "B · warm artisanal — Marcellus + Spectral, blush & deep rose."}
          </div>
          {t.direction === "b" && (
            <TweakColor
              label="Accent (B)"
              value={t.accentB}
              options={["#8B3D6A", "#7A3060", "#9E4E78", "#6D2D54"]}
              onChange={(v) => setTweak("accentB", v)}
            />
          )}
          <TweakSection label="Type & layout" />
          <TweakSlider label="Font scale" value={t.fontScale} min={0.9} max={1.15} step={0.01} onChange={(v) => setTweak("fontScale", v)} />
          <TweakToggle label="Craft / values strip" value={t.showCraftStrip} onChange={(v) => setTweak("showCraftStrip", v)} />
        </TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
