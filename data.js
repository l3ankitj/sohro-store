// Soroh store data — ES module.

const TONES = [
  "oklch(0.86 0.03 70)",
  "oklch(0.81 0.04 55)",
  "oklch(0.88 0.025 95)",
  "oklch(0.83 0.035 45)",
  "oklch(0.79 0.045 60)",
  "oklch(0.90 0.02 80)",
  "oklch(0.84 0.03 30)",
  "oklch(0.82 0.04 100)",
];
const tone = (i) => TONES[i % TONES.length];

export const products = [
  { id: "p1",  name: "Surmayi Kurta Set",     cat: "Kurta Sets",   price: 15800, tag: "Bestseller",  collection: "Garden Poem",    desc: "A breezy three-piece in handwoven cotton, block-printed by hand in soft indigo.", fabric: "Handwoven cotton", ratio: "4/5" },
  { id: "p2",  name: "Noor Co-ord Set",       cat: "Co-ord Sets",  price: 11660, tag: "New",         collection: "Pastel Riverie", desc: "Relaxed co-ord with a cropped overshirt and wide-leg trousers in airy linen.", fabric: "Pure linen", ratio: "4/5" },
  { id: "p3",  name: "Pearl Dress",           cat: "Dresses",      price: 8650,  tag: "Most loved",  collection: "Whispers",       desc: "A column dress with a quiet drape, finished with hand-rolled hems.", fabric: "Cotton mul", ratio: "4/5" },
  { id: "p4",  name: "Gulmohar Suit Set",     cat: "Suit Sets",    price: 18850, tag: "",            collection: "Gulmohar",       desc: "Anarkali silhouette with fine mukaish detailing across the yoke.", fabric: "Chanderi silk", ratio: "4/5" },
  { id: "p5",  name: "Kyla Slip Dress",       cat: "Dresses",      price: 7650,  tag: "New",         collection: "Sweet Serenade", desc: "An easy bias-cut slip that moves with you, in a warm sand wash.", fabric: "Cupro blend", ratio: "4/5" },
  { id: "p6",  name: "Sitaara Kurta Set",     cat: "Kurta Sets",   price: 16400, tag: "",            collection: "Sitaara",        desc: "Straight kurta with churidar, hand-embroidered with small star motifs.", fabric: "Handwoven cotton", ratio: "4/5" },
  { id: "p7",  name: "Baby Blue Dress",       cat: "Dresses",      price: 7300,  tag: "",            collection: "Summer Breeze",  desc: "A soft tiered dress in the lightest blue, made for slow summer days.", fabric: "Cotton voile", ratio: "4/5" },
  { id: "p8",  name: "Chaandni Co-ord",       cat: "Co-ord Sets",  price: 12900, tag: "Bestseller",  collection: "Chaandni",       desc: "Moon-pale co-ord with mother-of-pearl buttons and a clean notch collar.", fabric: "Linen blend", ratio: "4/5" },
  { id: "p9",  name: "Riverie Kurta Set",     cat: "Kurta Sets",   price: 14300, tag: "",            collection: "Pastel Riverie", desc: "A-line kurta with palazzo, in a watercolour wash of clay and cream.", fabric: "Mulmul cotton", ratio: "4/5" },
  { id: "p10", name: "Tamara Suit Set",       cat: "Suit Sets",    price: 19850, tag: "New",         collection: "Tamara",         desc: "Statement suit set with a flared sharara and delicate gota piping.", fabric: "Cotton silk", ratio: "4/5" },
  { id: "p11", name: "Poppy Dress",           cat: "Dresses",      price: 6750,  tag: "Most loved",  collection: "Garden Poem",    desc: "A buttoned shirtdress with a softly gathered waist and deep pockets.", fabric: "Cotton poplin", ratio: "4/5" },
  { id: "p12", name: "Gulab Kurta Set",       cat: "Kurta Sets",   price: 18850, tag: "",            collection: "Whispers",       desc: "Rose-tinted kurta set with hand-quilted detailing along the placket.", fabric: "Chanderi", ratio: "4/5" },
  { id: "p13", name: "Meera Slip Dress",      cat: "Dresses",      price: 7950,  tag: "New",         collection: "Noor",           desc: "A slip dress in the softest ivory cupro — elegant enough for evenings, easy enough for slow days.", fabric: "Cupro silk", ratio: "4/5" },
  { id: "p14", name: "Basant Co-ord",         cat: "Co-ord Sets",  price: 13800, tag: "",            collection: "Garden Poem",    desc: "A relaxed-fit shirt and tapered trousers, hand block-printed in small garden florals.", fabric: "Cotton voile", ratio: "4/5" },
  { id: "p15", name: "Anokha Kurta Set",      cat: "Kurta Sets",   price: 16800, tag: "Bestseller",  collection: "Chaandni",       desc: "Straight kurta with sharara in moon-white cotton, finished with hand-quilted panels.", fabric: "Mulmul cotton", ratio: "4/5" },
  { id: "p16", name: "Mishti Suit Set",       cat: "Suit Sets",    price: 21500, tag: "New",         collection: "Pastel Riverie", desc: "Anarkali suit in layered georgette with a watercolour hand-print and delicate coin-lace hem.", fabric: "Georgette", ratio: "4/5" },
  { id: "p17", name: "Rooh Dress",            cat: "Dresses",      price: 9400,  tag: "",            collection: "Sitaara",        desc: "A soft midi with hand-smocked bodice and flowing gathered skirt in star-print cotton.", fabric: "Cotton print", ratio: "4/5" },
  { id: "p18", name: "Khushboo Kurta Set",    cat: "Kurta Sets",   price: 15200, tag: "Most loved",  collection: "Gulmohar",       desc: "Festival kurta set with blooming gulmohar embroidery across the yoke on handwoven cotton.", fabric: "Handwoven cotton", ratio: "4/5" },
  { id: "p19", name: "Neel Co-ord",           cat: "Co-ord Sets",  price: 14600, tag: "",            collection: "Tamara",         desc: "Structured co-ord with a peplum top and wide palazzo, in rich indigo linen.", fabric: "Linen", ratio: "4/5" },
  { id: "p20", name: "Paro Dress",            cat: "Dresses",      price: 8200,  tag: "Bestseller",  collection: "Chaandni",       desc: "Effortless wrap dress in a crinkle-cotton weave with pearl buttons down the front.", fabric: "Cotton crinkle", ratio: "4/5" },
  { id: "p21", name: "Asha Kurta Set",        cat: "Kurta Sets",   price: 13900, tag: "",            collection: "Noor",           desc: "Relaxed kurta with patiala in pale moonlit ivory cotton with a hand-loomed texture.", fabric: "Handwoven cotton", ratio: "4/5" },
  { id: "p22", name: "Kesari Suit Set",       cat: "Suit Sets",    price: 20400, tag: "New",         collection: "Whispers",       desc: "Statement Anarkali in saffron-gold silk cotton with thread-worked borders.", fabric: "Cotton silk", ratio: "4/5" },
];
products.forEach((p, i) => { p.tone = tone(i); p.tone2 = tone(i + 3); });

export const categories = [
  { key: "Dresses",     label: "Dresses",     ratio: "3/4", blurb: "Easy, everyday silhouettes" },
  { key: "Co-ord Sets", label: "Co-ord Sets", ratio: "3/4", blurb: "Effortless two-pieces" },
  { key: "Kurta Sets",  label: "Kurta Sets",  ratio: "3/4", blurb: "Hand-finished classics" },
  { key: "Suit Sets",   label: "Suit Sets",   ratio: "3/4", blurb: "For the occasion" },
];
categories.forEach((c, i) => { c.tone = tone(i + 1); });

export const collections = [
  { key: "Pastel Riverie", label: "Pastel Riverie",       season: "Summer '26", note: "A watercolour of clay, cream and river-stone." },
  { key: "Gulmohar",       label: "Gulmohar",             season: "Festive",    note: "Warm blooms and gold-threaded evenings." },
  { key: "Sitaara",        label: "Sitaara",              season: "New",        note: "Quiet stars on handwoven cotton." },
  { key: "Whispers",       label: "Whispers of the Soul", season: "Core",       note: "The pieces we return to, again and again." },
  { key: "Tamara",         label: "Tamara",               season: "Limited",    note: "A small-batch ode to celebration." },
  { key: "Garden Poem",    label: "The Garden Poem",      season: "Summer '26", note: "Block prints drawn from a courtyard garden." },
  { key: "Noor",           label: "Noor",                 season: "New",        note: "Moonlit ivories and the softest gold." },
  { key: "Chaandni",       label: "Chaandni",             season: "Festive",    note: "Hand-quilted silks for quiet evenings." },
];
collections.forEach((c, i) => { c.tone = tone(i + 2); c.tone2 = tone(i + 5); });

export const featured = {
  collection: "Pastel Riverie",
  kicker: "Summer '26 · New In",
  title: "Pastel Riverie",
  sub: "Hand block-printed cotton and linen, made in small batches. The colour of a slow morning by the river.",
  tone: "oklch(0.84 0.035 60)",
};

// ---- Imagery (Unsplash CDN, hotlinked) ----
const IMG = (id, w) => "https://images.unsplash.com/photo-" + id + "?w=" + (w || 900) + "&q=78&auto=format&fit=crop";
const G = {
  ochre:  "1571513800374-df1bbe650e56",
  blouse: "1564257631407-4deb1f99d992",
  floral: "1483985988355-763728e1935b",
  rack:   "1490481651871-ab68de25d43d",
  saree:  "1610030469983-98e550d6193c",
};
const GOOD = [G.ochre, G.blouse, G.floral, G.rack, G.saree];

const PATTERN = [0, 3, 2, 4, 1, 0, 3, 2, 4, 2, 1, 3];
products.forEach((p, i) => {
  p.img  = IMG(GOOD[PATTERN[i % PATTERN.length]], 800);
  p.img2 = IMG(GOOD[(PATTERN[i % PATTERN.length] + 2) % GOOD.length], 800);
});

// Colour variants
const CV = {
  warm:    [{n:"Ecru",   s:"oklch(0.92 0.025 82)"},{n:"Clay",  s:"oklch(0.72 0.07 52)"}, {n:"Blush",  s:"oklch(0.81 0.065 12)"}],
  festive: [{n:"Gold",   s:"oklch(0.80 0.12 75)"},  {n:"Rose",  s:"oklch(0.67 0.14 15)"},{n:"Ivory",  s:"oklch(0.94 0.02 82)"}],
  soft:    [{n:"Cream",  s:"oklch(0.93 0.02 82)"},  {n:"Mauve", s:"oklch(0.76 0.07 355)"},{n:"Dusk",   s:"oklch(0.63 0.08 270)"}],
  earth:   [{n:"Sand",   s:"oklch(0.80 0.04 70)"},  {n:"Sage",  s:"oklch(0.69 0.08 153)"},{n:"Stone",  s:"oklch(0.75 0.02 88)"}],
  cool:    [{n:"Sky",    s:"oklch(0.78 0.08 236)"},  {n:"Lilac", s:"oklch(0.78 0.07 292)"},{n:"Mint",   s:"oklch(0.82 0.09 160)"}],
};
const PC = { p1:"warm",p2:"earth",p3:"soft",p4:"festive",p5:"soft",p6:"warm",p7:"cool",p8:"earth",p9:"warm",p10:"festive",p11:"soft",p12:"festive",p13:"soft",p14:"earth",p15:"warm",p16:"soft",p17:"cool",p18:"festive",p19:"cool",p20:"earth",p21:"warm",p22:"festive" };
products.forEach((p) => { p.colors = CV[PC[p.id]] || CV.warm; });

const catMap = { "Dresses": G.floral, "Co-ord Sets": G.rack, "Kurta Sets": G.ochre, "Suit Sets": G.blouse };
categories.forEach((c) => { c.img = IMG(catMap[c.key] || G.ochre, 700); });

const COLL = [G.blouse, G.saree, G.ochre, G.rack, G.floral, G.rack, G.saree, G.ochre];
collections.forEach((c, i) => { c.img = IMG(COLL[i % COLL.length], 900); });
collections[0].img = IMG(G.blouse, 1100);

featured.img  = IMG(G.ochre, 1300);
featured.img2 = IMG(G.rack,  1300);

export const fabricImg = IMG(G.rack, 900);

export const MOCK_USER = {
  name: "Ananya Mehta",
  firstName: "Ananya",
  email: "ananya@example.com",
  joinDate: "2026-01-10",
};

export const orders = [
  { id: "#SRH-2041", date: "12 May 2026", status: "delivered",  statusLabel: "Delivered",                 items: [products[0], products[2]],               total: products[0].price + products[2].price },
  { id: "#SRH-2038", date: "28 Apr 2026", status: "shipped",    statusLabel: "Shipped · out for delivery", items: [products[7]],                            total: products[7].price },
  { id: "#SRH-2031", date: "14 Mar 2026", status: "processing", statusLabel: "Processing",                 items: [products[1], products[4], products[10]], total: products[1].price + products[4].price + products[10].price },
];

const stockData = { p2: 3, p3: 5, p4: 2, p8: 4, p10: 2, p16: 3, p19: 4, p22: 2 };
products.forEach((p) => { if (stockData[p.id]) p.stock = stockData[p.id]; });

export const ratings = {
  p1:{avg:4.8,count:127}, p2:{avg:4.6,count:84},  p3:{avg:4.9,count:203},
  p4:{avg:4.7,count:56},  p5:{avg:4.5,count:91},  p6:{avg:4.8,count:68},
  p7:{avg:4.6,count:112}, p8:{avg:4.9,count:188}, p9:{avg:4.7,count:79},
  p10:{avg:4.6,count:43}, p11:{avg:4.8,count:156},p12:{avg:4.5,count:37},
  p13:{avg:4.7,count:28}, p14:{avg:4.6,count:41}, p15:{avg:4.8,count:92},
  p16:{avg:4.5,count:19}, p17:{avg:4.7,count:35}, p18:{avg:4.9,count:78},
  p19:{avg:4.6,count:22}, p20:{avg:4.8,count:64}, p21:{avg:4.5,count:17},
  p22:{avg:4.6,count:31},
};

export const mockReviews = [
  { name: "Priya S.",   stars: 5, size: "S", date: "2 weeks ago",  text: "The fabric drapes beautifully and the fit is just perfect. I get so many compliments every time I wear it." },
  { name: "Ananya R.",  stars: 5, size: "M", date: "1 month ago",  text: "Worth every rupee. The craftsmanship is evident — you can feel how much care went into making this piece." },
  { name: "Kavitha M.", stars: 4, size: "M", date: "6 weeks ago",  text: "Lovely quality and true to size. The packaging alone felt like a gift. Delivery was surprisingly fast." },
];

export const PROMO_CODES = { SOHRO10: 10, WELCOME15: 15, INNER20: 20 };

export function fmt(n) {
  return "₹" + n.toLocaleString("en-IN");
}
