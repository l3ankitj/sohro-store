import React, { useState as useStateP } from 'react';
import { products, collections } from '../data.js';
import { routeToUrl } from '../routing.js';
import { Ph, ProductCard, Footer } from '../ui.jsx';

const PRICE_BANDS = [
  { key: "all",   label: "All prices",    min: 0,     max: Infinity },
  { key: "u10",   label: "Under ₹10,000", min: 0,     max: 10000 },
  { key: "10-15", label: "₹10–15k",       min: 10000, max: 15000 },
  { key: "15+",   label: "₹15,000+",      min: 15000, max: Infinity },
];

export default function Collection({ route, go, onAdd, wishlist, onToggleWishlist, onQuickView }) {
  const cats = ["all", "Dresses", "Co-ord Sets", "Kurta Sets", "Suit Sets"];
  const [active, setActive] = useStateP(route.cat || "all");
  const [sort, setSort] = useStateP("featured");
  const [priceBand, setPriceBand] = useStateP("all");
  const [visibleCount, setVisibleCount] = useStateP(8);

  React.useEffect(() => { setActive(route.cat || "all"); setVisibleCount(8); }, [route.cat, route.collection]);
  React.useEffect(() => { setVisibleCount(8); }, [sort, priceBand]);

  const band = PRICE_BANDS.find((b) => b.key === priceBand) || PRICE_BANDS[0];
  let list = products.filter((p) => active === "all" || p.cat === active);
  if (route.collection) list = list.filter((p) => p.collection === route.collection);
  list = list.filter((p) => p.price >= band.min && p.price < band.max);
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);

  const titleMap = { all: "All clothing", Dresses: "Dresses", "Co-ord Sets": "Co-ord Sets", "Kurta Sets": "Kurta Sets", "Suit Sets": "Suit Sets" };
  const heading = route.collection ? route.collection : titleMap[active] || "Shop";
  const collData = route.collection ? collections.find((c) => c.key === route.collection) : null;

  return (
    <main>
      {collData && (
        <section className="coll-hero">
          <Ph tone={collData.tone} img={collData.img} cap={collData.label + " collection — Sohro"} dark style={{ height: "100%" }} priority />
          <div className="coll-hero-overlay">
            <span className="label coll-hero-season">{collData.season}</span>
            <h1 className="display coll-hero-title">{collData.label}</h1>
            <p className="coll-hero-note">{collData.note}</p>
            <button className="btn coll-hero-btn" onClick={() => { const el = document.getElementById("coll-grid-anchor"); el && el.scrollIntoView({ behavior: "smooth" }); }}>
              Shop this collection
            </button>
          </div>
        </section>
      )}

      <div className="wrap" id="coll-grid-anchor">
        {!collData && (
          <div className="page-head">
            <div className="crumb label">Home / Shop / {heading}</div>
            <h1 className="display">{heading}</h1>
            <p>Considered pieces in natural fibres — handwoven, hand block-printed and finished in small batches.</p>
          </div>
        )}
        {collData && (
          <div className="coll-sub-head">
            <div className="crumb label">
              <a href={routeToUrl({ name: "collection", cat: "all" })} onClick={(e) => { e.preventDefault(); go({ name: "collection", cat: "all" }); }}>All clothing</a>
              {" / "}{collData.label}
            </div>
          </div>
        )}

        <div className="filterbar">
          <div className="chips">
            {cats.map((c) => (
              <button key={c} className={"chip" + (active === c ? " active" : "")} onClick={() => { setActive(c); go({ name: "collection", cat: c }); }}>
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
          <select className="sortsel" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Sort · Featured</option>
            <option value="low">Price · Low to high</option>
            <option value="high">Price · High to low</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 20, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
          <span className="label muted" style={{ fontSize: 10, flexShrink: 0 }}>Price</span>
          <div className="price-filter-pills">
            {PRICE_BANDS.map((b) => (
              <button key={b.key} className={"price-pill" + (priceBand === b.key ? " active" : "")} onClick={() => setPriceBand(b.key)}>
                {b.label}
              </button>
            ))}
          </div>
          <span className="label muted" style={{ fontSize: 10, marginLeft: "auto" }}>{list.length} piece{list.length !== 1 ? "s" : ""}</span>
        </div>

        <section className="section tight">
          <div className="prod-grid">
            {list.slice(0, visibleCount).map((p) => <ProductCard key={p.id} p={p} go={go} onAdd={onAdd} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onQuickView={onQuickView} />)}
          </div>
          {list.length === 0 && <p className="muted" style={{ padding: "60px 0", textAlign: "center" }}>Nothing here yet — check back soon.</p>}
          {list.length > visibleCount && (
            <div style={{ textAlign: "center", paddingTop: 36 }}>
              <button className="btn ghost" onClick={() => setVisibleCount((n) => n + 8)}>
                Load more · {list.length - visibleCount} remaining
              </button>
            </div>
          )}
        </section>
      </div>
      <Footer go={go} />
    </main>
  );
}
