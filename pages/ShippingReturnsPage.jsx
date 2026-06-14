import React, { useState as useStateP, useEffect as useEffectP } from 'react';
import { SizeGuideModal, Footer } from '../ui.jsx';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Does Sohro offer free shipping?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, free standard shipping is available across India on orders above ₹2,500." } },
    { "@type": "Question", "name": "How do I return an item?", "acceptedAnswer": { "@type": "Answer", "text": "Returns are accepted within 14 days of delivery for unworn, unwashed items. Contact hello@sohro.in to initiate a return." } },
    { "@type": "Question", "name": "How long does delivery take?", "acceptedAnswer": { "@type": "Answer", "text": "Standard delivery takes 3–5 business days across India. Express delivery takes 1–2 business days." } },
    { "@type": "Question", "name": "Do you ship internationally?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we ship worldwide. International orders typically arrive in 10–15 business days." } },
    { "@type": "Question", "name": "Can I exchange for a different size?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, one free size exchange is offered per order. Contact us within 14 days of delivery." } },
  ]
};

export default function ShippingReturnsPage({ go }) {
  const [sizeGuideOpen, setSizeGuideOpen] = useStateP(false);

  useEffectP(() => {
    const el = document.getElementById('schema-ld');
    if (el) el.textContent = JSON.stringify(FAQ_SCHEMA);
    // No cleanup — app.jsx route-change effect overwrites schema when navigating away
  }, []);
  return (
    <main>
      <div className="wrap">
        <div className="page-head" style={{ textAlign: "left" }}>
          <div className="crumb label">Home / Shipping &amp; Returns</div>
          <h1 className="display">Shipping &amp;<br />Returns</h1>
          <p>All orders are made in small batches and dispatched with care. Here's everything you need to know.</p>
        </div>

        <div className="policy-body">
          <div className="policy-col">
            <section className="policy-section">
              <div className="policy-section-head">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m-3 10h6a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-6l-2-3H9a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1z"/></svg>
                <h2>Shipping</h2>
              </div>
              <div className="policy-table">
                <div className="policy-row head"><span>Destination</span><span>Delivery time</span><span>Cost</span></div>
                {[
                  ["India (standard)", "3–5 business days", "Free over ₹2,500"],
                  ["India (express)", "1–2 business days", "₹299"],
                  ["International", "10–15 business days", "Calculated at checkout"],
                ].map(([d, t, c]) => <div key={d} className="policy-row"><span>{d}</span><span>{t}</span><span>{c}</span></div>)}
              </div>
              <div className="policy-note">
                <strong>Ready to ship:</strong> Most pieces dispatch within 2–3 business days. You'll receive a shipping confirmation with tracking as soon as your order leaves our studio.
              </div>
            </section>

            <section className="policy-section">
              <div className="policy-section-head">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
                <h2>Returns &amp; Exchanges</h2>
              </div>
              <div className="policy-list">
                {[
                  ["14-day return window", "Returns accepted within 14 days of delivery. Items must be unworn, unwashed and in their original packaging with all tags attached."],
                  ["Free size exchange", "We offer one free size exchange per order. Contact us within 14 days and we'll arrange the swap at no extra cost."],
                  ["Exceptions", "Sale items, custom orders and pieces marked 'Final sale' are not eligible for return. Gift cards are non-refundable."],
                  ["Refund timeline", "Once we receive and inspect your return, a refund is processed to your original payment method within 5–7 business days."],
                ].map(([title, body]) => (
                  <div key={title} className="policy-list-item">
                    <span className="policy-list-bullet">✦</span>
                    <div><strong>{title}</strong><br />{body}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="policy-section">
              <div className="policy-section-head">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.8 19.79 19.79 0 0 1 0 1.18 2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.91 7.14a16 16 0 0 0 6.06 6.06l1.51-1.51a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 13.92z"/></svg>
                <h2>Get in touch</h2>
              </div>
              <p style={{ color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: 22 }}>To start a return or exchange, or if you have any questions about your order, reach out to us directly. We respond to every message within one business day.</p>
              <div className="policy-contact-row">
                {[["Email","hello@sohro.in"],["WhatsApp","+91 98765 43210"],["Hours","Mon–Sat · 10am–6pm IST"]].map(([k, v]) => (
                  <div key={k} className="policy-contact-item"><span className="label muted" style={{ fontSize: 9 }}>{k}</span><span>{v}</span></div>
                ))}
              </div>
            </section>
          </div>

          <div className="policy-sidebar">
            <div className="policy-sidebar-card">
              <h4>Helpful links</h4>
              <button className="policy-sidebar-link" onClick={() => go({ name: "our-story" })}>Our story</button>
              <button className="policy-sidebar-link" onClick={() => go({ name: "collection", cat: "all" })}>Shop all pieces</button>
              <button className="policy-sidebar-link" onClick={() => go({ name: "account" })}>My orders</button>
            </div>
            <div className="policy-sidebar-card policy-sidebar-dark">
              <h4>Not sure of your size?</h4>
              <p>Our size guide covers all measurements. When in doubt, size up — or contact us and we'll advise.</p>
              <button className="btn ghost" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff", padding: "11px 20px", fontSize: 10, width: "100%" }} onClick={() => setSizeGuideOpen(true)}>View size guide</button>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <Footer go={go} />
    </main>
  );
}
