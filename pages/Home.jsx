import React, { useState as useStateP } from 'react';
import { products, categories, collections, featured } from '../data.js';
import { routeToUrl } from '../routing.js';
import { Ph, ProductCard, Values, Footer } from '../ui.jsx';

export default function Home({ go, onAdd, wishlist, onToggleWishlist, onQuickView }) {
  const heroSlides = [
    { img: featured.img,         kicker: featured.kicker,      title: "Pastel Riverie",       sub: featured.sub,         cta: "Shop the collection", nav: { name: "collection", cat: "all" } },
    { img: collections[1].img,   kicker: "Festive Collection", title: collections[1].label,   sub: collections[1].note,  cta: "Explore the edit",    nav: { name: "collection", cat: "all", collection: collections[1].key } },
    { img: collections[3].img,   kicker: "Core Edit",          title: collections[3].label,   sub: collections[3].note,  cta: "Shop the edit",       nav: { name: "collection", cat: "all", collection: collections[3].key } },
  ];
  const [slide, setSlide] = useStateP(0);
  React.useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const mostLoved = (() => {
    const tagged = products.filter((p) => p.tag === "Most loved" || p.tag === "Bestseller");
    const seen = new Set(); const result = [];
    for (const p of tagged) {
      if (!seen.has(p.img)) { seen.add(p.img); result.push(p); }
      if (result.length === 3) break;
    }
    return result;
  })();

  const featCats = categories; // all 4: Dresses, Co-ord Sets, Kurta Sets, Suit Sets

  const shopLook = (() => {
    const pool = products.filter((p) => p.cat === "Dresses" || p.cat === "Co-ord Sets");
    const seen = new Set(); const result = [];
    for (const p of pool) {
      if (!seen.has(p.img)) { seen.add(p.img); result.push(p); }
      if (result.length === 3) break;
    }
    return result;
  })();

  return (
    <main>
      <section className="hero-carousel">
        {heroSlides.map((s, i) => (
          <div key={i} className={"hero-slide" + (i === slide ? " active" : "")}>
            <Ph tone={featured.tone} img={s.img} cap="" dark style={{ height: "100%" }} priority={i === 0} />
            <div className="hero-slide-overlay" />
            <div className="hero-slide-content">
              <span className="label hero-slide-kicker">{s.kicker}</span>
              <h1 className="display hero-slide-title">{s.title}</h1>
              <p className="hero-slide-sub">{s.sub}</p>
              <button className="btn hero-slide-btn" onClick={() => go(s.nav)}>{s.cta}</button>
            </div>
          </div>
        ))}
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button key={i} className={"hero-dot" + (i === slide ? " active" : "")} onClick={() => setSlide(i)} aria-label={"Slide " + (i + 1)} />
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head compact">
          <h2>Most loved</h2>
          <span className="link-underline" onClick={() => go({ name: "collection", cat: "all" })}>View all</span>
        </div>
        <div className="prod-grid cols-3">
          {mostLoved.map((p) => <ProductCard key={p.id} p={p} go={go} onAdd={onAdd} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onQuickView={onQuickView} />)}
        </div>
      </section>

      <section className="about-band">
        <Ph tone="oklch(0.80 0.04 50)" img={featured.img2} cap="About Sohro — handmade clothing studio, Hyderabad" dark style={{ height: "100%" }} />
        <div className="about-band-overlay">
          <span className="label" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.28em", marginBottom: 22, display: "block" }}>Our story</span>
          <h2 className="about-band-title">About Sohro</h2>
          <button className="btn about-band-btn" style={{ marginTop: 32 }} onClick={() => go({ name: "our-story" })}>Know more</button>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow label">Browse by style</span>
            <h2>Shop by category</h2>
          </div>
        </div>
        <div className="cat-showcase">
          {featCats.map((c) => (
            <a key={c.key} className="cat-showcase-card" href={routeToUrl({ name: "collection", cat: c.key })} onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: c.key }); }}>
              <Ph tone={c.tone} img={c.img} cap={c.label} dark />
              <div className="cat-showcase-overlay">
                <h3>{c.label}</h3>
                <span className="link-underline" style={{ color: "rgba(255,255,255,0.88)", borderColor: "rgba(255,255,255,0.5)", fontSize: 11 }}>Shop this</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow label">The latest</span>
            <h2>New collections</h2>
          </div>
          <span className="link-underline" onClick={() => go({ name: "collection", cat: "all" })}>See all</span>
        </div>
        <div className="coll-grid-uniform">
          {collections.map((c) => (
            <a key={c.key} className="coll-card-sm" href={routeToUrl({ name: "collection", cat: "all", collection: c.key })} onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "all", collection: c.key }); }}>
              <Ph tone={c.tone} img={c.img} cap="" dark />
              <div className="coll-card-sm-overlay">
                <span className="c-season label">{c.season}</span>
                <h3>{c.label}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="story">
        <Ph tone="oklch(0.8 0.045 55)" img={featured.img} cap="" dark />
        <div className="story-copy">
          <span className="eyebrow label">Featured · Summer '26</span>
          <h2>Pastel<br />Riverie</h2>
          <p>Hand block-printed cotton and linen in the colour of a slow morning by the river — clay, cream and river-stone. Made in small batches, finished by hand.</p>
          <div>
            <button className="btn" onClick={() => go({ name: "collection", cat: "all" })}>Shop now</button>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head compact">
          <h2>Shop the look</h2>
          <span className="link-underline" onClick={() => go({ name: "collection", cat: "all" })}>View all</span>
        </div>
        <div className="prod-grid cols-3">
          {shopLook.map((p) => <ProductCard key={p.id} p={p} go={go} onAdd={onAdd} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onQuickView={onQuickView} />)}
        </div>
      </section>

      <Values />
      <Footer go={go} />
    </main>
  );
}
