import React from 'react';
import { featured, collections, fabricImg } from '../data.js';
import { Ph, Values, Footer } from '../ui.jsx';

export default function OurStoryPage({ go }) {
  return (
    <main>
      <section className="story-page-hero">
        <Ph tone="oklch(0.80 0.04 50)" img={featured.img2} cap="" dark style={{ height: "100%" }} />
        <div className="story-page-overlay">
          <span className="label" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.28em", marginBottom: 20, display: "block" }}>Sohro · Est. 2018</span>
          <h1 className="display story-page-title">Made with<br /><em>care.</em></h1>
          <p className="story-page-sub">Handmade clothing for women — in small batches, made in India, made to last.</p>
        </div>
      </section>

      <section className="section wrap">
        <div className="story-letter">
          <div className="story-letter-aside">
            <span className="label muted" style={{ letterSpacing: "0.24em", marginBottom: 24, display: "block" }}>From the founder</span>
            <Ph tone="oklch(0.84 0.035 60)" img={featured.img} cap="" style={{ aspectRatio: "3/4" }} />
          </div>
          <div className="story-letter-body">
            <h2 className="display story-letter-title">Sohro began with a simple question: where do the clothes that last a lifetime come from?</h2>
            <p>We're a small studio based in Hyderabad, India — a team who care deeply about cloth, craft, and the women who wear what we make.</p>
            <p>Every piece in a Sohro collection is made in small batches, never in bulk. We work directly with weavers and block printers across Telangana and Rajasthan, many of whom have practised their craft for generations.</p>
            <p>Our philosophy is quiet but clear: if we wouldn't wear it ourselves, it doesn't get made. No filler, no fast fashion — just considered clothing you'll reach for again and again.</p>
            <p className="story-letter-sig">— Priya, Founder</p>
          </div>
        </div>
      </section>

      <div className="story-numbers-band">
        <div className="wrap story-numbers-inner">
          {[["2018","Year founded"],["12","Artisan clusters"],["Small batch","Every collection"],["India","Where it's made"]].map(([n, l]) => (
            <div key={l} className="story-number">
              <div className="story-num-val">{n}</div>
              <div className="story-num-lab">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow label">The making</span>
            <h2>How every piece<br />comes to be</h2>
          </div>
        </div>
        <div className="story-craft-grid">
          {[
            { title: "Woven at source", body: "We source all our cottons, linens and silks directly from cooperative weavers. The cloth arrives at our studio before a single cut is made.", img: fabricImg, tone: "oklch(0.84 0.035 60)" },
            { title: "Printed by hand", body: "Our block prints are carved by hand in Sanganer, Rajasthan. Every print run is done by a single artisan who registers each colour by eye.", img: featured.img, tone: "oklch(0.82 0.04 55)" },
            { title: "Finished with care", body: "Hems are hand-rolled. Buttons sewn by hand. Every seam is pressed before the piece leaves our studio. We check everything twice.", img: collections[3] ? collections[3].img : featured.img2, tone: "oklch(0.80 0.04 50)" },
          ].map(({ title, body, img, tone }) => (
            <div key={title} className="story-craft-card">
              <Ph tone={tone} img={img} cap="" style={{ aspectRatio: "4/3" }} />
              <div className="story-craft-body"><h3>{title}</h3><p>{body}</p></div>
            </div>
          ))}
        </div>
      </section>

      <Values />

      <section className="story-cta-band">
        <Ph tone="oklch(0.80 0.04 50)" img={collections[0].img} cap="" dark style={{ height: "100%" }} />
        <div className="story-cta-overlay">
          <span className="label" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.28em", marginBottom: 20, display: "block" }}>Summer '26</span>
          <h2 className="display" style={{ color: "#fff", fontStyle: "italic", fontSize: "clamp(32px, 5vw, 72px)", lineHeight: 1, margin: "0 0 32px" }}>Shop the<br />collection</h2>
          <button className="btn story-cta-btn" onClick={() => go({ name: "collection", cat: "all" })}>View all pieces</button>
        </div>
      </section>

      <Footer go={go} />
    </main>
  );
}
