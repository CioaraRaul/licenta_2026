'use strict';
/**
 * Comprehensive data seed.
 *
 * - Replaces placeholder vehicle images with real Unsplash images
 * - Sets up wallet, card, transactions for the `testbuyer` account
 * - Saves vehicles, places bids (mixed statuses), opens conversations + messages
 * - Adds bid activity from seeded buyers so sellers also see traffic
 *
 * Run: docker cp this file into the container then `docker exec ... node /app/seed-app-data.js`
 */
const Database = require('better-sqlite3');
const { promisify } = require('util');
const { scrypt: _scrypt, randomBytes } = require('crypto');
const scrypt = promisify(_scrypt);

const DB_PATH = process.env.DB_PATH || '/app/database.sqlite';

// ── Real Unsplash car photos that resolve (verified working URLs). ────────────
const Q = '?auto=format&fit=crop&w=1200&q=80';
const PHOTOS = {
  BMW: [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e' + Q,
    'https://images.unsplash.com/photo-1556189250-72ba954cfc2b' + Q,
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068' + Q,
    'https://images.unsplash.com/photo-1607853554439-0069ec0f29b6' + Q,
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537' + Q,
  ],
  'Mercedes-Benz': [
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068' + Q,
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8' + Q,
    'https://images.unsplash.com/photo-1563720223185-11003d516935' + Q,
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888' + Q,
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6' + Q,
  ],
  Audi: [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6' + Q,
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a' + Q,
    'https://images.unsplash.com/photo-1592198084033-aade902d1aae' + Q,
    'https://images.unsplash.com/photo-1614026480209-936e44f04ec5' + Q,
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d' + Q,
  ],
  Toyota: [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb' + Q,
    'https://images.unsplash.com/photo-1559416523-140ddc3d238c' + Q,
    'https://images.unsplash.com/photo-1623869675781-80aa31012a5a' + Q,
    'https://images.unsplash.com/photo-1590510869491-cd23c00e5f91' + Q,
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2' + Q,
  ],
  Ford: [
    'https://images.unsplash.com/photo-1612825173281-9a193fc4b304' + Q,
    'https://images.unsplash.com/photo-1551830820-330a71b99659' + Q,
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d' + Q,
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2' + Q,
    'https://images.unsplash.com/photo-1563720223809-7b9e77fcf3d6' + Q,
  ],
  Volkswagen: [
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46' + Q,
    'https://images.unsplash.com/photo-1622820288469-b06d6c52d39d' + Q,
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89' + Q,
    'https://images.unsplash.com/photo-1602025882379-e01cf08baa51' + Q,
    'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5' + Q,
  ],
  Porsche: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70' + Q,
    'https://images.unsplash.com/photo-1611821064430-0d40291922d3' + Q,
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e' + Q,
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023' + Q,
    'https://images.unsplash.com/photo-1580274455191-1c62238fa333' + Q,
  ],
  Tesla: [
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89' + Q,
    'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3' + Q,
    'https://images.unsplash.com/photo-1617704548623-340376564e68' + Q,
    'https://images.unsplash.com/photo-1620891549027-942faed8d0c1' + Q,
    'https://images.unsplash.com/photo-1617788138017-80ad40651399' + Q,
  ],
  Volvo: [
    'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c' + Q,
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2' + Q,
    'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f' + Q,
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6' + Q,
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888' + Q,
  ],
  Honda: [
    'https://images.unsplash.com/photo-1568844293986-8d0400bd4745' + Q,
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2' + Q,
    'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5' + Q,
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a' + Q,
    'https://images.unsplash.com/photo-1550355291-bbee04a92027' + Q,
  ],
};
const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8' + Q,
  'https://images.unsplash.com/photo-1493238792000-8113da705763' + Q,
  'https://images.unsplash.com/photo-1502877338535-766e1452684a' + Q,
  'https://images.unsplash.com/photo-1542362567-b07e54358753' + Q,
  'https://images.unsplash.com/photo-1601362840469-51e4d8d58785' + Q,
];

function pickPhotos(make, id) {
  const pool = PHOTOS[make] || FALLBACK_PHOTOS;
  const a = pool[id % pool.length];
  const b = pool[(id + 2) % pool.length];
  const c = pool[(id + 4) % pool.length];
  return [a, b, c].join(',');
}

async function hashPassword(password) {
  const salt = randomBytes(8).toString('hex');
  const hash = await scrypt(password, salt, 32);
  return salt + '.' + hash.toString('hex');
}

async function main() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // ── 1. Update vehicle images ────────────────────────────────────────────────
  console.log('[1/7] Updating vehicle images...');
  const allVehicles = db.prepare('SELECT id, make FROM vehicles').all();
  const updateImages = db.prepare('UPDATE vehicles SET images = ? WHERE id = ?');
  const updateImagesTx = db.transaction(() => {
    for (const v of allVehicles) updateImages.run(pickPhotos(v.make, v.id), v.id);
  });
  updateImagesTx();
  console.log(`   ${allVehicles.length} vehicles updated`);

  // ── 2. testbuyer wallet + card + transactions ───────────────────────────────
  const buyer = db.prepare("SELECT id FROM users WHERE email = 'testbuyer@test.com'").get();
  if (!buyer) {
    console.error('testbuyer not found — run signup first');
    process.exit(1);
  }
  const BUYER_ID = buyer.id;
  console.log(`[2/7] testbuyer (id=${BUYER_ID}) wallet, card, transactions...`);

  const now = new Date().toISOString();

  // Wallet
  db.prepare('DELETE FROM wallets WHERE userId = ?').run(BUYER_ID);
  db.prepare(`
    INSERT INTO wallets (balance, frozenBalance, userId, createdAt, updatedAt)
    VALUES (?, 0, ?, ?, ?)
  `).run(12500, BUYER_ID, now, now);

  // Card
  db.prepare('DELETE FROM cards WHERE userId = ?').run(BUYER_ID);
  db.prepare(`
    INSERT INTO cards (last4, cardHolderName, expiryMonth, expiryYear, cardType, balance, userId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('4242', 'Test Buyer', 12, 2029, 'visa', 50000, BUYER_ID, now, now);

  // Wipe transactions for this user, then add deposits totalling 12500
  db.prepare('DELETE FROM transactions WHERE userId = ?').run(BUYER_ID);
  const insertTx = db.prepare(`
    INSERT INTO transactions (amount, type, status, description, referenceId, userId, recipientId, createdAt)
    VALUES (?, ?, 'completed', ?, NULL, ?, NULL, ?)
  `);
  const txEntries = [
    { amount: 5000, type: 'deposit', desc: 'Initial deposit via card ending 4242', daysAgo: 22 },
    { amount: 2500, type: 'deposit', desc: 'Top-up before BMW M3 bid', daysAgo: 14 },
    { amount: 3000, type: 'deposit', desc: 'Wallet refill', daysAgo: 9 },
    { amount: 1500, type: 'deposit', desc: 'Quick deposit', daysAgo: 4 },
    { amount: 500,  type: 'deposit', desc: 'Top-up', daysAgo: 1 },
  ];
  for (const t of txEntries) {
    const created = new Date(Date.now() - t.daysAgo * 86400000).toISOString();
    insertTx.run(t.amount, t.type, t.desc, BUYER_ID, created);
  }
  console.log(`   wallet=$12,500 + card ****4242 + ${txEntries.length} transactions`);

  // ── 3. Pick a working set of vehicles owned by seeded sellers ───────────────
  // Use seeded sellers (10 of them — emails seed.seller1...seed.seller10) for fresh placeholder
  // images already replaced above; pick a variety across makes.
  console.log('[3/7] Selecting target vehicles...');
  const targetVehicles = db.prepare(`
    SELECT v.id, v.make, v.model, v.year, v.price, v.sellerId
    FROM vehicles v
    INNER JOIN users u ON u.id = v.sellerId
    WHERE u.email LIKE 'seed.seller%' AND v.status = 'available'
    ORDER BY v.make, v.year DESC
    LIMIT 50
  `).all();
  console.log(`   ${targetVehicles.length} candidate vehicles`);

  // ── 4. Saved vehicles for testbuyer ─────────────────────────────────────────
  console.log('[4/7] testbuyer saved vehicles...');
  db.prepare('DELETE FROM saved_vehicles WHERE userId = ?').run(BUYER_ID);
  const insertSaved = db.prepare(`
    INSERT INTO saved_vehicles (userId, vehicleId, savedAt)
    VALUES (?, ?, ?)
  `);
  const savedPicks = [0, 5, 11, 17, 23, 29, 35].map(i => targetVehicles[i]).filter(Boolean);
  for (let i = 0; i < savedPicks.length; i++) {
    const v = savedPicks[i];
    const savedAt = new Date(Date.now() - (i + 1) * 86400000).toISOString();
    insertSaved.run(BUYER_ID, v.id, savedAt);
    db.prepare('UPDATE vehicles SET savesCount = savesCount + 1 WHERE id = ?').run(v.id);
  }
  console.log(`   saved ${savedPicks.length} vehicles`);

  // ── 5. Bids by testbuyer (mixed statuses) ───────────────────────────────────
  console.log('[5/7] testbuyer bids...');
  db.prepare('DELETE FROM bids WHERE buyerId = ?').run(BUYER_ID);
  const insertBid = db.prepare(`
    INSERT INTO bids (amount, status, message, rejectionReason, buyerId, vehicleId, createdAt, updatedAt, expiresAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const bidPlan = [
    { idx: 0,  status: 'pending',   discount: 0.95, msg: 'Very interested. Would you accept this offer?', daysAgo: 1 },
    { idx: 3,  status: 'pending',   discount: 0.90, msg: 'Cash buyer, ready to close this week.', daysAgo: 2 },
    { idx: 7,  status: 'accepted',  discount: 0.97, msg: 'Final offer — looking forward to taking delivery.', daysAgo: 6 },
    { idx: 13, status: 'rejected',  discount: 0.80, msg: 'A bit aggressive but worth asking.', reason: 'Below my minimum.', daysAgo: 10 },
    { idx: 19, status: 'rejected',  discount: 0.85, msg: 'How about this?', reason: 'I already have a higher offer.', daysAgo: 12 },
    { idx: 25, status: 'withdrawn', discount: 0.92, msg: 'Initial offer.', daysAgo: 15 },
    { idx: 31, status: 'pending',   discount: 0.93, msg: 'I can transfer the funds immediately.', daysAgo: 4 },
    { idx: 8,  status: 'pending',   discount: 0.94, msg: 'Serious offer.', daysAgo: 3 },
  ];
  let frozenAmount = 0;
  for (const b of bidPlan) {
    const v = targetVehicles[b.idx];
    if (!v) continue;
    const amount = Math.round(v.price * b.discount);
    const created = new Date(Date.now() - b.daysAgo * 86400000).toISOString();
    const expires = new Date(Date.now() + 7 * 86400000).toISOString();
    insertBid.run(amount, b.status, b.msg, b.reason || null, BUYER_ID, v.id, created, created, expires);
    if (b.status === 'pending') frozenAmount += amount;
  }
  console.log(`   ${bidPlan.length} bids placed (frozen=${frozenAmount})`);

  // Move some balance into frozen (capped so balance never goes negative)
  const freezeNow = Math.min(frozenAmount, 8000);
  db.prepare('UPDATE wallets SET balance = balance - ?, frozenBalance = ? WHERE userId = ?')
    .run(freezeNow, freezeNow, BUYER_ID);

  // Update buyer aggregate stats: totalSpent counts accepted bids
  const acceptedTotal = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS s FROM bids WHERE buyerId = ? AND status = 'accepted'
  `).get(BUYER_ID).s;
  db.prepare('UPDATE buyers SET totalSpent = ?, totalCarsBought = ?, walletBalance = ? WHERE userId = ?')
    .run(acceptedTotal, 1, 12500 - freezeNow, BUYER_ID);

  // ── 6. Conversations and messages between testbuyer and sellers ─────────────
  console.log('[6/7] conversations + messages...');
  db.prepare('DELETE FROM messages WHERE senderId = ? OR conversationId IN (SELECT id FROM conversations WHERE buyerId = ?)').run(BUYER_ID, BUYER_ID);
  db.prepare('DELETE FROM conversations WHERE buyerId = ?').run(BUYER_ID);

  const insertConv = db.prepare(`
    INSERT INTO conversations (buyerId, sellerId, vehicleId, unreadByBuyer, unreadBySeller, lastMessage, lastMessageAt, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMsg = db.prepare(`
    INSERT INTO messages (content, status, senderId, conversationId, createdAt)
    VALUES (?, 'sent', ?, ?, ?)
  `);

  const convPlan = [
    {
      vIdx: 0,
      thread: [
        { from: 'buyer',  text: 'Hi, is the BMW still available?', minsAgo: 120 },
        { from: 'seller', text: 'Yes, it is. Service book is up to date.', minsAgo: 115 },
        { from: 'buyer',  text: 'Great. Could we schedule a test drive this Saturday?', minsAgo: 90 },
        { from: 'seller', text: 'Saturday 11 AM works for me. I will send the address.', minsAgo: 60 },
      ],
      unreadByBuyer: 1,
    },
    {
      vIdx: 3,
      thread: [
        { from: 'buyer',  text: 'Would you consider €' + (Math.round(targetVehicles[3].price * 0.9)) + '?', minsAgo: 60 * 24 },
        { from: 'seller', text: 'A bit low. Let me think about it.', minsAgo: 60 * 23 },
        { from: 'buyer',  text: 'I can close this week if we agree.', minsAgo: 60 * 22 },
      ],
      unreadByBuyer: 0,
    },
    {
      vIdx: 7,
      thread: [
        { from: 'buyer',  text: 'Hello, I placed a bid. Any chance you accept?', minsAgo: 60 * 24 * 6 },
        { from: 'seller', text: 'Accepted — congrats! Payment details incoming.', minsAgo: 60 * 24 * 5 },
        { from: 'buyer',  text: 'Perfect, transferring funds today.', minsAgo: 60 * 24 * 4 },
      ],
      unreadByBuyer: 0,
    },
    {
      vIdx: 11,
      thread: [
        { from: 'buyer',  text: 'Are the tyres new? Any extras included?', minsAgo: 30 },
      ],
      unreadByBuyer: 0,
    },
  ];

  for (const cp of convPlan) {
    const v = targetVehicles[cp.vIdx];
    if (!v) continue;
    const last = cp.thread[cp.thread.length - 1];
    const lastAt = new Date(Date.now() - last.minsAgo * 60000).toISOString();
    const firstAt = new Date(Date.now() - cp.thread[0].minsAgo * 60000).toISOString();
    const sellerUnread = cp.thread.filter(m => m.from === 'buyer').length > 0 ? 1 : 0;
    const info = insertConv.run(
      BUYER_ID, v.sellerId, v.id,
      cp.unreadByBuyer, sellerUnread,
      last.text, lastAt, firstAt, lastAt,
    );
    const convId = info.lastInsertRowid;
    for (const m of cp.thread) {
      const senderId = m.from === 'buyer' ? BUYER_ID : v.sellerId;
      const createdAt = new Date(Date.now() - m.minsAgo * 60000).toISOString();
      insertMsg.run(m.text, senderId, convId, createdAt);
    }
    db.prepare('UPDATE vehicles SET contactsCount = contactsCount + 1 WHERE id = ?').run(v.id);
  }
  console.log(`   ${convPlan.length} conversations + ${convPlan.reduce((s, c) => s + c.thread.length, 0)} messages`);

  // ── 7. Background bid activity from seeded buyers ───────────────────────────
  console.log('[7/7] background bid activity from seed buyers...');
  const seedBuyers = db.prepare("SELECT id FROM users WHERE email LIKE 'seed.buyer%' ORDER BY id").all();
  const ownBidVehicleIds = bidPlan.map(b => targetVehicles[b.idx]?.id).filter(Boolean);
  const broaderTargets = db.prepare(`
    SELECT v.id, v.price, v.sellerId
    FROM vehicles v INNER JOIN users u ON u.id = v.sellerId
    WHERE u.email LIKE 'seed.seller%' AND v.status = 'available'
    ORDER BY v.id LIMIT 80
  `).all();

  let extraBids = 0;
  for (let i = 0; i < broaderTargets.length; i++) {
    const v = broaderTargets[i];
    const numBids = (i % 4); // 0..3 bids per vehicle
    for (let k = 0; k < numBids; k++) {
      const buyer = seedBuyers[(i + k) % seedBuyers.length];
      if (!buyer) continue;
      const discount = 0.82 + ((i + k) % 8) * 0.025; // 0.82..1.00
      const amount = Math.round(v.price * discount);
      const daysAgo = 1 + ((i * 3 + k * 7) % 25);
      const created = new Date(Date.now() - daysAgo * 86400000).toISOString();
      const expires = new Date(Date.now() + 7 * 86400000).toISOString();
      let status = 'pending';
      if (k === 2) status = 'rejected';
      if (ownBidVehicleIds.includes(v.id) && k === 0) status = 'pending';
      // Skip if a pending already exists from this buyer
      const dup = db.prepare("SELECT 1 FROM bids WHERE buyerId = ? AND vehicleId = ? AND status = 'pending'").get(buyer.id, v.id);
      if (dup && status === 'pending') continue;
      insertBid.run(
        amount, status,
        'Interested in your listing.',
        status === 'rejected' ? 'Below asking.' : null,
        buyer.id, v.id, created, created, expires,
      );
      extraBids++;
    }
  }
  console.log(`   ${extraBids} background bids added`);

  // Force WAL checkpoint so disk reflects everything
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.close();
  console.log('\n✓ Seed complete.');
}

main().catch((e) => { console.error(e); process.exit(1); });
