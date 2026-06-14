import { collections, products } from './data.js';

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Convert a product name to its URL slug: "Surmayi Kurta Set" → "surmayi-kurta-set" */
export function productSlug(name) {
  return slugify(name);
}

/** Find a product by its URL slug; returns the product or undefined */
function productBySlug(slug) {
  return products.find(p => slugify(p.name) === slug);
}

export function routeToUrl(r) {
  if (!r) return '/';
  switch (r.name) {
    case 'product': {
      const p = products.find(x => x.id === r.id);
      return p ? `/products/${slugify(p.name)}` : `/products/${r.id}`;
    }
    case 'collection':
      if (r.collection) return `/collections/${slugify(r.collection)}`;
      if (r.cat && r.cat !== 'all') return `/categories/${slugify(r.cat)}`;
      return '/shop';
    case 'our-story':        return '/our-story';
    case 'shipping-returns': return '/shipping-returns';
    case 'checkout':         return '/checkout';
    case 'account':          return '/account';
    default:                 return '/';
  }
}

function unslugCollection(slug) {
  return collections.find(c => slugify(c.key) === slug)?.key || slug;
}

const CATEGORY_UNSLUG = { 'dresses': 'Dresses', 'co-ord-sets': 'Co-ord Sets', 'kurta-sets': 'Kurta Sets', 'suit-sets': 'Suit Sets' };

export function urlToRoute(pathname) {
  const seg = pathname.replace(/^\//, '').split('/');
  if (seg[0] === 'products' && seg[1]) {
    // Support both slug (/products/surmayi-kurta-set) and legacy id (/products/p1)
    const bySlug = productBySlug(seg[1]);
    const id = bySlug ? bySlug.id : seg[1];
    return { name: 'product', id };
  }
  if (seg[0] === 'collections' && seg[1]) return { name: 'collection', cat: 'all', collection: unslugCollection(seg[1]) };
  if (seg[0] === 'categories' && seg[1])  return { name: 'collection', cat: CATEGORY_UNSLUG[seg[1]] || seg[1] };
  if (seg[0] === 'shop')                  return { name: 'collection', cat: 'all' };
  if (seg[0] === 'our-story')             return { name: 'our-story' };
  if (seg[0] === 'shipping-returns')      return { name: 'shipping-returns' };
  if (seg[0] === 'checkout')              return { name: 'checkout' };
  if (seg[0] === 'account')               return { name: 'account' };
  return { name: 'home' };
}
