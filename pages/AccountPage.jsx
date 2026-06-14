import React, { useState as useStateP } from 'react';
import { products, fmt, orders } from '../data.js';
import { Ph, Footer } from '../ui.jsx';

function ProfileTab({ user }) {
  const [editing, setEditing] = useStateP(false);
  const [draft, setDraft] = useStateP({
    firstName: user.firstName,
    lastName: user.name.split(" ").slice(1).join(" "),
    email: user.email,
    phone: "",
  });
  const [saved, setSaved] = useStateP(false);
  const fields = [["First name","firstName"],["Last name","lastName"],["Email","email"],["Phone","phone"]];

  function save(e) {
    e.preventDefault();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <div className="account-section-head">
        <div className="account-section-title">Your profile</div>
        {!editing && <button className="btn ghost" style={{ padding: "8px 18px", fontSize: 10 }} onClick={() => setEditing(true)}>Edit</button>}
      </div>
      {saved && <div className="promo-ok" style={{ marginBottom: 16 }}>✓ Profile updated</div>}
      {editing ? (
        <form onSubmit={save}>
          {fields.map(([label, key]) => (
            <div key={key} style={{ marginBottom: 20 }}>
              <div className="label muted" style={{ marginBottom: 6, fontSize: 9 }}>{label}</div>
              <input style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--line-strong)", padding: "9px 0", outline: "none", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink)" }}
                value={draft[key]} onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))} placeholder={label} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn" style={{ padding: "12px 24px" }}>Save changes</button>
            <button type="button" className="btn ghost" style={{ padding: "12px 24px" }} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        fields.map(([label, key]) => (
          <div key={key} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 16, marginBottom: 16 }}>
            <div className="label muted" style={{ marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 15, color: draft[key] ? "var(--ink)" : "var(--muted)" }}>{draft[key] || "—"}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default function AccountPage({ go, user, wishlist, openWishlist, onSignOut }) {
  const [activeTab, setActiveTab] = useStateP("orders");
  const [expandedOrder, setExpandedOrder] = useStateP(null);

  const firstName = user.firstName || user.name.split(" ")[0];
  const joinDate = new Date(user.joinDate);
  const now = new Date();
  const months = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth());
  const joinMonthLabel = joinDate.toLocaleString("en-IN", { month: "long", year: "numeric" });
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const orderedIds = orders.flatMap((o) => o.items.map((p) => p.id));
  const orderedCats = orders.flatMap((o) => o.items.map((p) => p.cat));
  const unowned = products.filter((p) => !orderedIds.includes(p.id));
  const preferred = unowned.filter((p) => orderedCats.includes(p.cat));
  const editProducts = [...preferred, ...unowned.filter((p) => !orderedCats.includes(p.cat))].slice(0, 4);

  const nudgeItem = wishlist[0] || null;

  const navItems = [
    { key: "orders",    label: "Orders",    badge: orders.length },
    { key: "profile",   label: "Profile",   badge: 0 },
    { key: "addresses", label: "Addresses", badge: 0 },
    { key: "wishlist",  label: "Wishlist",  badge: wishlist.length },
  ];

  const NavIcon = ({ k }) => {
    if (k === "orders")    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>;
    if (k === "profile")   return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    if (k === "addresses") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
  };

  return (
    <main>
      <div className="account-page">
        <aside className="account-sidebar">
          <div className="sidebar-profile" style={{ padding: "0 28px 28px", borderBottom: "1px solid var(--line)", marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--surface-2)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontSize: 20, color: "var(--muted)", marginBottom: 12 }}>{firstName[0]}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 3 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>{user.email}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 20, padding: "3px 12px", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(0.55 0.08 55)", flexShrink: 0 }}></span>
              Inner Circle · {months} month{months !== 1 ? "s" : ""}
            </div>
          </div>
          <nav style={{ flex: 1 }}>
            {navItems.map((item) => (
              <button key={item.key} className={"account-nav-item" + (activeTab === item.key && item.key !== "wishlist" ? " active" : "")} onClick={() => item.key === "wishlist" ? openWishlist() : setActiveTab(item.key)}>
                <NavIcon k={item.key} />
                {item.label}
                {item.badge > 0 && <span className="account-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="sidebar-foot" style={{ padding: "20px 28px 0", borderTop: "1px solid var(--line)", marginTop: 20 }}>
            <button style={{ background: "none", border: "none", fontFamily: "var(--font-label)", textTransform: "uppercase", letterSpacing: ".1em", fontSize: 11, color: "var(--muted)", cursor: "pointer" }} onClick={onSignOut}>Sign out</button>
          </div>
        </aside>

        <div className="account-main">
          <div className="welcome-band">
            <div>
              <div className="label" style={{ color: "rgba(247,243,236,.4)", marginBottom: 10 }}>Your account · {greeting.replace("Good ", "").toLowerCase()}</div>
              <div className="welcome-greeting">{greeting},<br /><em>{firstName}.</em></div>
              <div className="welcome-sub">You've been part of Sohro since {joinMonthLabel} — each piece you've chosen was made in a small batch, just for you.</div>
              <div className="welcome-stats">
                <div><div className="welcome-stat-val">{orderedIds.length}</div><div className="welcome-stat-lab">Pieces owned</div></div>
                <div><div className="welcome-stat-val">{wishlist.length}</div><div className="welcome-stat-lab">Wishlisted</div></div>
                <div><div className="welcome-stat-val">{months}</div><div className="welcome-stat-lab">Months with Sohro</div></div>
              </div>
            </div>
            <div className="welcome-edit-col">
              <div className="label" style={{ color: "rgba(247,243,236,.4)", marginBottom: 8 }}>Picked for you</div>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, color: "#c8a882", marginBottom: 12 }}>"{firstName} Edit"</div>
              <div className="edit-grid">
                {editProducts.map((p) => (
                  <div key={p.id} className="edit-thumb" onClick={() => go({ name: "product", id: p.id })}>
                    <Ph tone={p.tone} img={p.img} cap="" style={{ height: "100%" }} dark />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <span className="link-underline" style={{ color: "rgba(247,243,236,.5)", borderColor: "rgba(247,243,236,.3)", fontSize: 11 }} onClick={() => go({ name: "collection", cat: "all" })}>View your edit →</span>
              </div>
            </div>
          </div>

          <div className="account-content">
            {activeTab === "orders" && (
              <div>
                {nudgeItem && (
                  <div className="nudge-card">
                    <Ph tone={nudgeItem.tone} img={nudgeItem.img} cap="" className="nudge-thumb" />
                    <div style={{ flex: 1 }}>
                      <div className="nudge-label">Back in your size</div>
                      <div className="nudge-nm">{nudgeItem.name}</div>
                      <div className="nudge-sub">You wishlisted this — only a few left.</div>
                    </div>
                    <button className="btn accent" style={{ padding: "10px 18px", fontSize: 10 }} onClick={() => go({ name: "product", id: nudgeItem.id })}>View piece</button>
                  </div>
                )}
                <div className="account-section-head">
                  <div className="account-section-title">Your orders</div>
                  <span className="label muted">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
                </div>
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  return (
                    <div className="order-card" key={order.id}>
                      <div className="order-head">
                        <div>
                          <div className="order-id-label">{order.id}</div>
                          <div className="order-date-text">{order.date}</div>
                        </div>
                        <div className={"order-status-pill " + order.status}>{order.statusLabel}</div>
                      </div>
                      <div className="order-thumbs">
                        {order.items.map((p) => (
                          <Ph key={p.id} tone={p.tone} img={p.img} cap="" className="order-thumb-ph" style={{ cursor: "pointer" }} onClick={() => go({ name: "product", id: p.id })} />
                        ))}
                      </div>
                      <div className="order-foot">
                        <div className="order-total-txt"><span className="order-total-lab">Total </span>{fmt(order.total)}</div>
                        <div style={{ display: "flex", gap: 16 }}>
                          {order.status === "shipped" && <span className="link-underline" style={{ fontSize: 11 }}>Track order</span>}
                          <span className="link-underline" style={{ fontSize: 11, color: "var(--muted)", borderColor: "var(--line-strong)" }} onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                            {isExpanded ? "Hide details" : "View details"}
                          </span>
                          {order.status === "delivered" && <span className="link-underline" style={{ fontSize: 11 }}>Buy again</span>}
                        </div>
                      </div>
                      {isExpanded && (
                        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16, marginTop: 4 }}>
                          {order.items.map((p) => (
                            <div key={p.id} style={{ display: "flex", gap: 14, paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid var(--line)", alignItems: "center" }}>
                              <Ph tone={p.tone} img={p.img} cap="" style={{ width: 52, height: 64, flexShrink: 0, borderRadius: "var(--radius)" }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 15 }}>{p.name}</div>
                                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{p.cat} · {p.collection}</div>
                              </div>
                              <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>{fmt(p.price)}</div>
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-soft)", paddingTop: 4 }}>
                            <span>Delivered to: Hyderabad, 500034</span>
                            {order.status === "delivered" && <span className="link-underline" style={{ fontSize: 11 }}>Download invoice</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {activeTab === "profile" && <ProfileTab user={user} />}
            {activeTab === "addresses" && (
              <div>
                <div className="account-section-head">
                  <div className="account-section-title">Saved addresses</div>
                  <button className="btn ghost" style={{ padding: "8px 18px", fontSize: 10 }}>Add new</button>
                </div>
                <div style={{ border: "1px solid var(--line)", padding: "18px 22px", background: "var(--surface)", borderRadius: "var(--radius)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 6 }}>{user.name}</div>
                      <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.7 }}>24 Garden Lane, Banjara Hills<br />Hyderabad, Telangana 500034<br />+91 98765 43210</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", background: "var(--surface-2)", padding: "2px 10px", borderRadius: 20, color: "var(--muted)" }}>Default</span>
                      <span className="link-underline" style={{ fontSize: 11, color: "var(--muted)", borderColor: "var(--line-strong)" }}>Edit</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer go={go} />
    </main>
  );
}
