import React, { useState as useStateP } from 'react';
import { fmt, PROMO_CODES } from '../data.js';
import { validateEmail, validatePhone } from '../validate.js';
import { Ph, Footer } from '../ui.jsx';

export default function CheckoutPage({ go, cart, onPlaceOrder }) {
  const [step, setStep] = useStateP("shipping");
  const [promoInput, setPromoInput] = useStateP("");
  const [promoApplied, setPromoApplied] = useStateP(null);
  const [promoMsg, setPromoMsg] = useStateP("");
  const [giftWrap, setGiftWrap] = useStateP(false);
  const GIFT_WRAP_FEE = 199;
  const [orderNum, setOrderNum] = useStateP("");
  const [form, setForm] = useStateP({ firstName: "", lastName: "", email: "", phone: "", line1: "", city: "", state: "Telangana", pin: "" });
  const [payMethod, setPayMethod] = useStateP("card");
  const [card, setCard] = useStateP({ number: "", expiry: "", cvv: "", name: "" });
  const [upiId, setUpiId] = useStateP("");
  const [errors, setErrors] = useStateP({});
  const [shakeFields, setShakeFields] = useStateP({});

  function blurField(key, val) {
    let err = null;
    if (key === "email") err = validateEmail(val);
    if (key === "phone") err = validatePhone(val);
    if (err) {
      setErrors(e => ({ ...e, [key]: err }));
      setShakeFields(s => ({ ...s, [key]: true }));
      setTimeout(() => setShakeFields(s => ({ ...s, [key]: false })), 400);
    } else {
      setErrors(e => ({ ...e, [key]: null }));
    }
  }

  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const totalQty = cart.reduce((s, x) => s + x.qty, 0);
  const discountPct = promoApplied ? PROMO_CODES[promoApplied] : 0;
  const discount = Math.round(subtotal * discountPct / 100);
  const grandTotal = subtotal - discount + (giftWrap ? GIFT_WRAP_FEE : 0);

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromoMsg("Enter a promo code"); return; }
    if (PROMO_CODES[code]) { setPromoApplied(code); setPromoMsg(""); }
    else { setPromoApplied(null); setPromoMsg("Invalid code."); }
  }

  function field(key) { return { value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) }; }
  function cardField(key) { return { value: card[key], onChange: (e) => setCard((c) => ({ ...c, [key]: e.target.value })) }; }

  function goToPayment(e) {
    e.preventDefault();
    const emailErr = validateEmail(form.email);
    const phoneErr = validatePhone(form.phone);
    if (emailErr || phoneErr) {
      const newErrors = { ...errors }; const fieldsToShake = {};
      if (emailErr) { newErrors.email = emailErr; fieldsToShake.email = true; }
      if (phoneErr) { newErrors.phone = phoneErr; fieldsToShake.phone = true; }
      setErrors(newErrors); setShakeFields(fieldsToShake);
      setTimeout(() => setShakeFields({}), 400);
      return;
    }
    setStep("payment"); window.scrollTo(0, 0);
  }

  function placeOrder(e) {
    e.preventDefault();
    const num = "#SRH-" + (10000 + Math.floor(Math.random() * 90000));
    setOrderNum(num);
    try {
      window.__analytics && window.__analytics.event('purchase', {
        transaction_id: num.replace('#', ''), value: grandTotal, currency: 'INR', tax: 0, shipping: 0,
        coupon: promoApplied || '',
        items: cart.map(it => ({ item_id: it.id, item_name: it.name, price: it.price, quantity: it.qty, item_variant: it.size }))
      });
    } catch (_) {}
    if (window.fbq) fbq('track', 'Purchase', { value: grandTotal, currency: 'INR', content_ids: cart.map(i => i.id), content_type: 'product' });
    if (window.pintrk) pintrk('track', 'checkout', { value: grandTotal, currency: 'INR', product_ids: cart.map(i => i.id) });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'purchase', ecommerce: { transaction_id: num.replace('#', ''), value: grandTotal, currency: 'INR' } });
    localStorage.removeItem('sohro_abandon');
    onPlaceOrder();
    setStep("confirmation"); window.scrollTo(0, 0);
  }

  const steps = [{ key: "shipping", label: "Shipping" }, { key: "payment", label: "Payment" }, { key: "confirmation", label: "Confirmation" }];
  const stepIndex = steps.findIndex((s) => s.key === step);

  const StepBar = () => (
    <div className="checkout-steps">
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          {i > 0 && <div className="checkout-step-div" />}
          <div className={"checkout-step" + (i === stepIndex ? " active" : i < stepIndex ? " done" : "")}>
            <div className="checkout-step-num">{i < stepIndex ? "✓" : i + 1}</div>
            {s.label}
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  const OrderSummary = () => (
    <div className="checkout-summary">
      <div className="checkout-summary-title">Your bag · {totalQty} item{totalQty !== 1 ? "s" : ""}</div>
      {cart.map((it) => (
        <div className="checkout-item" key={it.id + it.size}>
          <Ph tone={it.tone} img={it.img} cap="" />
          <div>
            <div className="checkout-item-name">{it.name}</div>
            <div className="checkout-item-meta">Size {it.size}{it.qty > 1 ? " · ×" + it.qty : ""}</div>
          </div>
          <div className="checkout-item-price">{fmt(it.price * it.qty)}</div>
        </div>
      ))}
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16, marginTop: 6 }}>
        {promoApplied ? (
          <div className="promo-ok">
            ✓ {promoApplied} applied — {discountPct}% off
            <button onClick={() => { setPromoApplied(null); setPromoInput(""); }} style={{ marginLeft: 10, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}>Remove</button>
          </div>
        ) : (
          <>
            <div className="promo-row">
              <input className="promo-input" placeholder="Promo code" value={promoInput} onChange={(e) => { setPromoInput(e.target.value); setPromoMsg(""); }} onKeyDown={(e) => e.key === "Enter" && applyPromo()} />
              <button className="promo-btn" onClick={applyPromo}>Apply</button>
            </div>
            {promoMsg && <div className="promo-err">{promoMsg}</div>}
          </>
        )}
      </div>
      <div className="checkout-totals">
        <div className="checkout-total-row"><span className="lab">Subtotal</span><span>{fmt(subtotal)}</span></div>
        {discount > 0 && <div className="checkout-total-row promo-saving-row"><span className="lab">Discount ({discountPct}%)</span><span>−{fmt(discount)}</span></div>}
        <div className="checkout-total-row"><span className="lab">Shipping</span><span style={{ color: "var(--accent)" }}>Free</span></div>
        {giftWrap && <div className="checkout-total-row"><span className="lab">Gift wrapping</span><span>{fmt(GIFT_WRAP_FEE)}</span></div>}
        <div className="checkout-total-row grand"><span className="lab">Total</span><span>{fmt(grandTotal)}</span></div>
      </div>
    </div>
  );

  // Empty cart guard
  if (cart.length === 0 && step !== "confirmation") {
    return (
      <main>
        <div className="wrap" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, textAlign: "center", padding: "80px var(--gut)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,5vw,48px)", color: "var(--ink)" }}>Your bag is empty.</div>
          <p style={{ color: "var(--ink-soft)", fontSize: 15, maxWidth: 340 }}>Add some pieces before checking out.</p>
          <button className="btn" onClick={() => go({ name: "collection", cat: "all" })}>Browse the collection</button>
        </div>
        <Footer go={go} />
      </main>
    );
  }

  if (step === "confirmation") {
    return (
      <main>
        <div className="checkout-page">
          <div className="checkout-wrap">
            <div className="checkout-confirmation">
              <div className="confirmation-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div className="confirmation-order">{orderNum}</div>
              <h1 className="confirmation-title">Your order<br />is confirmed.</h1>
              <p className="confirmation-sub">Thank you, {form.firstName || "friend"}. We're preparing your pieces with care — each one made in a small batch, just for you. You'll receive a dispatch confirmation soon.</p>
              <button className="btn" onClick={() => go({ name: "home" })}>Continue shopping</button>
            </div>
          </div>
        </div>
        <Footer go={go} />
      </main>
    );
  }

  return (
    <main>
      <div className="checkout-page">
        <div className="checkout-wrap">
          <StepBar />
          <div className="checkout-cols">
            <div className="checkout-form-col">
              {step === "shipping" && (
                <form onSubmit={goToPayment}>
                  <div className="checkout-section">
                    <div className="checkout-section-title">Contact</div>
                    <div className="checkout-fields">
                      <div className="checkout-field"><label>First name</label><input required placeholder="Ananya" autoComplete="given-name" {...field("firstName")} /></div>
                      <div className="checkout-field"><label>Last name</label><input required placeholder="Mehta" autoComplete="family-name" {...field("lastName")} /></div>
                      <div className={"checkout-field" + (shakeFields.email ? " shake" : "")}>
                        <label>Email</label>
                        <input required type="email" placeholder="you@example.com" autoComplete="email" {...field("email")}
                          onBlur={() => {
                            blurField("email", form.email);
                            if (form.email && !validateEmail(form.email)) {
                              try { localStorage.setItem("sohro_guest_email", form.email); } catch (_) {}
                            }
                          }}
                          className={errors.email ? "input-error" : ""} />
                        {errors.email && <div className="field-error">{errors.email}</div>}
                      </div>
                      <div className={"checkout-field" + (shakeFields.phone ? " shake" : "")}>
                        <label>Phone</label>
                        <input required placeholder="+91 98765 43210" autoComplete="tel" {...field("phone")} onBlur={() => blurField("phone", form.phone)} className={errors.phone ? "input-error" : ""} />
                        {errors.phone && <div className="field-error">{errors.phone}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="checkout-section">
                    <div className="checkout-section-title">Shipping address</div>
                    <div className="checkout-fields">
                      <div className="checkout-field full"><label>Address</label><input required placeholder="24 Garden Lane, Banjara Hills" autoComplete="street-address" {...field("line1")} /></div>
                      <div className="checkout-field"><label>City</label><input required placeholder="Hyderabad" autoComplete="address-level2" {...field("city")} /></div>
                      <div className="checkout-field"><label>PIN code</label><input required placeholder="500034" maxLength={6} autoComplete="postal-code" {...field("pin")} /></div>
                      <div className="checkout-field full">
                        <label>State</label>
                        <select {...field("state")}>
                          {["Andhra Pradesh","Delhi","Gujarat","Karnataka","Kerala","Maharashtra","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className={"gift-wrap-row" + (giftWrap ? " active" : "")} onClick={() => setGiftWrap((g) => !g)}>
                    <div className="gift-wrap-check">{giftWrap ? "✓" : ""}</div>
                    <div className="gift-wrap-text"><div className="gift-wrap-label">Gift wrapping</div><div className="gift-wrap-sub">Handmade tissue paper with a ribbon and personalised note</div></div>
                    <div className="gift-wrap-price">+₹199</div>
                  </div>
                  <button type="submit" className="btn full" style={{ marginTop: 16 }}>Continue to payment</button>
                </form>
              )}
              {step === "payment" && (
                <form onSubmit={placeOrder}>
                  <div className="checkout-section">
                    <div className="checkout-section-title">Payment</div>
                    <div className="pay-methods">
                      <button type="button" className={"pay-method" + (payMethod === "card" ? " active" : "")} onClick={() => setPayMethod("card")}>Credit / Debit card</button>
                      <button type="button" className={"pay-method" + (payMethod === "upi" ? " active" : "")} onClick={() => setPayMethod("upi")}>UPI</button>
                    </div>
                    {payMethod === "card" && (
                      <div className="checkout-fields">
                        <div className="checkout-field full"><label>Card number</label><input placeholder="1234 5678 9012 3456" maxLength={19} autoComplete="cc-number" {...cardField("number")} /></div>
                        <div className="checkout-field full"><label>Name on card</label><input placeholder="Ananya Mehta" autoComplete="cc-name" {...cardField("name")} /></div>
                        <div className="checkout-field"><label>Expiry</label><input placeholder="MM / YY" maxLength={7} autoComplete="cc-exp" {...cardField("expiry")} /></div>
                        <div className="checkout-field"><label>CVV</label><input placeholder="•••" maxLength={4} type="password" autoComplete="cc-csc" {...cardField("cvv")} /></div>
                      </div>
                    )}
                    {payMethod === "upi" && (
                      <div className="checkout-fields single">
                        <div className="checkout-field"><label>UPI ID</label><input placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} /></div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                    <button type="submit" className="btn full accent">Place order · {fmt(grandTotal)}</button>
                    <button type="button" className="btn ghost full" onClick={() => { setStep("shipping"); window.scrollTo(0, 0); }}>← Back to shipping</button>
                  </div>
                  <p className="label muted" style={{ textAlign: "center", marginTop: 16 }}>Your payment details are secure and encrypted</p>
                </form>
              )}
            </div>
            <div className="checkout-summary-col"><OrderSummary /></div>
          </div>
        </div>
      </div>
      <Footer go={go} />
    </main>
  );
}
