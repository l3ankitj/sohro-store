# Sohro — Search, Wishlist & Account Design Spec

**Date:** 2026-06-01
**Status:** Approved

---

## Overview

Three new features for the Sohro store: a search overlay, a wishlist drawer, and a personalized account page (with login/signup overlay). Each is designed to feel native to Sohro's editorial tone — unhurried, considered, personal.

---

## 1. Search Overlay

**Pattern:** Full-screen overlay (not a side drawer).

### Trigger
- Clicking "Search" in the header nav opens the overlay.
- ESC or the ✕ button closes it.

### Layout
- The overlay rises from the bottom, leaving ~8vh gap at the top so the page peeks through behind a dark scrim. This preserves spatial context.
- A logo + close button sit at the top of the overlay.
- A large italic search input with a magnifying-glass icon sits below, separated by a bottom border from the content area.

### Pre-search state (no query typed)
- **Category chips:** All · Dresses · Kurta Sets · Co-ord Sets · Suit Sets. Clicking a chip filters the product grid below without typing.
- **"New this season" grid:** 4 product tiles (image placeholder, name, category, price). These are the 4 most recently tagged `New` products from the data.

### Typing state
- As the user types, the product grid is replaced with live search results matching the query against product name and category.
- Empty results state: "Nothing matched — try a different word or browse by category."
- Results use the same `ProductCard` component as the collection page.

### Data
- Searches against `SOROH_DATA.products` on `name` and `cat` fields (client-side, no backend needed for the prototype).

---

## 2. Wishlist Drawer

**Pattern:** Side drawer, slides in from the right. Same dimensions and animation as the existing `CartDrawer` (420px wide).

### Trigger
- A heart/wishlist icon added to the header nav between "Account" and "Cart". Shows a count badge when items are saved (same pattern as cart count).
- Clicking ♥ on any `ProductCard` adds the item to the wishlist and opens the drawer. If the item is already saved, clicking ♥ again removes it (toggle).
- Clicking ♥ on any `ProductCard` adds the item and opens the drawer.

### Drawer layout
- **Head:** "Saved pieces" title (Cormorant serif), item count, ✕ close button.
- **Body (scrollable):** One row per saved item — 80px product image, name, category + collection, price, inline size picker (XS–XXL), "Add to bag" button, "Remove" link.
- A filled ♥ icon appears top-right of each row; clicking it removes the item.
- The size picker is required before "Add to bag" — selecting a size enables the button.
- "Add to bag" adds to cart but **keeps the item in the wishlist** — the user must explicitly hit Remove to clear it.

### Footer
- Item count + informational "Total if all added" price.
- **"Add all to bag"** — adds every item at its currently selected size (defaults to M if none selected).
- **"Shop the collection"** ghost button — closes the drawer and navigates to the collection page.
- Small note: "Items are saved to your account · not reserved."

### State
- Wishlist state lives in `App` alongside `cart` state, same pattern: `[wishlist, setWishlist]`.
- Items persist in `localStorage` keyed by `sohro_wishlist`.

---

## 3. Account Page

**Pattern:** Full page, sidebar + main content layout.

### Sidebar
- User avatar initial, name, email, **Inner Circle badge** (shown once logged in with member duration).
- Nav items: **Orders** (with unread badge), **Profile**, **Addresses**, **Wishlist** (with saved count badge).
- "Sign out" at the bottom.
- Clicking **Wishlist** opens the wishlist drawer rather than navigating to a new page.

### Personalized welcome band (Approach A — Named Edit)
- A full-width dark (`#232019`) band at the top of the main area.
- **Left side:**
  - Kicker: "Your account · [time of day]" (Good morning / Good afternoon / Good evening based on browser time)
  - Headline: "Good [time], *[First name]*." — large Cormorant italic, first name in warm gold (`#c8a882`).
  - Sub-copy: "You've been part of Sohro since [join month] — each piece you've chosen was made in a small batch, just for you."
  - **Stats row:** Pieces owned · Saved to wishlist · Months with Sohro.
- **Right side:**
  - Label: "Picked for you"
  - Title: "*"The [First name] Edit"*" in italic gold
  - 4 product thumbnails — sourced from products the user has _not_ bought, weighted toward categories they have bought. Falls back to 4 newest products for new accounts.
  - "View your edit →" link — navigates to collection page (future: filtered view).

### Orders tab (default active)
- **Back-in-stock nudge** — if any wishlisted item is available in the user's most-saved size, a warm amber nudge card appears above the orders list with a direct "Add to bag" CTA.
- Order cards: order ID, date, colour-coded status pill (Processing / Shipped / Delivered), product thumbnails, total, contextual actions (Track / View details / Buy again).

### Profile tab
- Editable fields: First name, Last name, Email, Phone.
- Password change section (separate from main fields).
- Save button.

### Addresses tab
- Saved address cards (name, full address, phone).
- "Add new address" button.
- Default address indicator.

### Empty / logged-out state
- If the user is not logged in and navigates to Account, the login overlay opens automatically.

---

## 4. Login / Sign Up Overlay

**Pattern:** Centered modal overlay with a dark scrim. Not a drawer — appears over the current page.

### Trigger
- Clicking "Account" in the header nav when not logged in.
- Automatically triggered when navigating to the Account page without a session.

### Two tab states

**Sign in tab:**
- Headline: "Welcome back."
- Sub: "Sign in to see your edit, orders, and saved pieces."
- Fields: Email, Password.
- "Forgot password?" link (right-aligned, below password field).
- Primary CTA: "Sign in"
- Divider: "or"
- Secondary CTA: "Continue with Google"
- Footer note with link to switch to "Create account" tab.

**Create account tab:**
- Headline: "Join the inner circle."
- Sub: "Create an account for early access, your personal edit, and order history."
- **Inner Circle teaser card** (amber tint): explains benefits — first access to new collections, small-batch restocks, personal edit.
- Fields: First name, Email, Password.
- Primary CTA: "Create my account"
- Divider + Google option.
- Footer note: terms, privacy, link back to sign in.

### Behaviour
- Closing the modal (✕ or scrim click) without signing in returns the user to wherever they were.
- On successful sign in/sign up: close overlay, re-render header with account state, redirect to Account page.

---

## Component summary

| New component | Type | File |
|---|---|---|
| `SearchOverlay` | Full-screen overlay | `ui.jsx` |
| `WishlistDrawer` | Side drawer | `ui.jsx` |
| `LoginOverlay` | Centered modal | `ui.jsx` |
| `AccountPage` | Full page | `pages.jsx` |
| Wishlist state | `[wishlist, setWishlist]` in `App` | `app.jsx` |
| Wishlist localStorage persistence | effect in `App` | `app.jsx` |

---

## Data requirements

- `SOROH_DATA` already has `products`, `categories`, `collections` — no additions needed for search and wishlist.
- Account page requires a simple mock user object in `SOROH_DATA` or `app.jsx`:
  ```js
  const MOCK_USER = {
    name: "Ananya Mehta",
    email: "ananya@example.com",
    joinDate: "2026-01-10",
    orders: [...] // order history array
  };
  ```
- "The Named Edit" sourced from `products` filtered to exclude already-purchased IDs, weighted toward purchased categories.
