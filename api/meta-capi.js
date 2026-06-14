/**
 * Meta Conversions API — serverless function stub
 * Deploy to Netlify Functions, Vercel Edge, or Cloudflare Workers.
 *
 * Environment variables required:
 *   META_PIXEL_ID   — your Pixel ID (same as PIXEL_ID_HERE in index.html)
 *   META_CAPI_TOKEN — your Conversions API access token (from Meta Events Manager)
 *
 * Netlify/Vercel: place in netlify/functions/meta-capi.js or api/meta-capi.js
 * Cloudflare:    export default { fetch: handler }
 *
 * Client-side call (add to pages/CheckoutPage.jsx placeOrder, alongside fbq Purchase):
 *   fetch('/api/meta-capi', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ event_name: 'Purchase', value: grandTotal, currency: 'INR',
 *                            email: form.email, items: cart })
 *   }).catch(() => {});
 */

const PIXEL_ID   = process.env.META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;

function sha256(str) {
  // Node.js 18+ built-in crypto
  const { createHash } = require('crypto');
  return createHash('sha256').update(str.trim().toLowerCase()).digest('hex');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }

  const { event_name, value, currency, email, phone, items, event_id } = req.body || {};

  const user_data = {};
  if (email) user_data.em = [sha256(email)];
  if (phone) user_data.ph = [sha256(phone.replace(/\D/g, ''))];
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
  if (ip) user_data.client_ip_address = ip;
  user_data.client_user_agent = req.headers['user-agent'] || '';

  const payload = {
    data: [{
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: event_id || `${event_name}_${Date.now()}`,
      action_source: 'website',
      user_data,
      custom_data: {
        value,
        currency: currency || 'INR',
        contents: (items || []).map(i => ({ id: i.id, quantity: i.qty || 1 })),
        content_type: 'product',
      },
    }],
    test_event_code: process.env.META_TEST_EVENT_CODE || undefined,
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );
    const data = await response.json();
    res.status(200).json({ ok: true, events_received: data.events_received });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
