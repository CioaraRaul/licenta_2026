# -*- coding: utf-8 -*-
"""Seed realistic Romanian demo data into the marketplace DB for nice screenshots."""

import sqlite3
import os
from datetime import datetime, timedelta

DB = r"c:\licenta\licenta_2026\backend\database.sqlite"
assert os.path.isfile(DB), f"DB not found: {DB}"

conn = sqlite3.connect(DB)
conn.execute("PRAGMA foreign_keys = ON")
cur = conn.cursor()

def find_user(email):
    cur.execute("SELECT id, role FROM users WHERE email = ?", (email,))
    return cur.fetchone()

# ---- Pick our actors ----
buyer = find_user("seed.buyer1@automarket.test")
assert buyer, "buyer1 not found"
BUYER_ID = buyer[0]
print(f"Buyer1 -> id={BUYER_ID}")

# Find several sellers (any seed.sellerN)
cur.execute("SELECT id, email FROM users WHERE role='seller' ORDER BY id LIMIT 5")
sellers = cur.fetchall()
print(f"Sellers: {sellers}")

# Pick a set of nice vehicles (different makes for variety)
cur.execute("""
    SELECT id, make, model, year, price, sellerId
    FROM vehicles
    WHERE isActive = 1
      AND make IN ('BMW','Mercedes-Benz','Audi','Porsche','Tesla','Volvo')
    ORDER BY price DESC
    LIMIT 30
""")
vehicles = cur.fetchall()
print(f"Found {len(vehicles)} candidate vehicles")

# ---------- 1. Update existing bid messages to Romanian ----------
print("\n[1/6] Updating bid messages to Romanian...")
ro_bid_messages = [
    "Buna ziua! Sunt foarte interesat de aceasta masina. Pot programa o vizionare?",
    "Salut! Pretul propus se incadreaza in bugetul meu. Acceptati negocierea?",
    "Buna! Masina arata excelent. Care e starea reala a anvelopelor?",
    "Sunt serios in privinta cumpararii. Putem discuta despre extragerea actelor?",
    "Salutare! Sper sa va convina oferta. Pot achita pe loc.",
    "Buna ziua! As dori sa fac un test drive saptamana aceasta. E posibil?",
    "Salut! Pretul e bun, dar pot oferi atat cu plata cash imediat.",
    "Buna! Am verificat istoricul VIN-ului. Putem incheia tranzactia in zilele urmatoare?",
]

cur.execute("SELECT id FROM bids WHERE buyerId = ? ORDER BY id", (BUYER_ID,))
bid_ids = [r[0] for r in cur.fetchall()]
for i, bid_id in enumerate(bid_ids):
    msg = ro_bid_messages[i % len(ro_bid_messages)]
    cur.execute("UPDATE bids SET message = ? WHERE id = ?", (msg, bid_id))
print(f"   Updated {len(bid_ids)} bid messages")

# Vary the bid statuses so the screen looks alive
cur.execute("SELECT COUNT(*) FROM bids WHERE buyerId=?", (BUYER_ID,))
n_bids = cur.fetchone()[0]
if n_bids >= 4:
    # Make the oldest 2 accepted/rejected, keep rest pending
    cur.execute("SELECT id FROM bids WHERE buyerId=? ORDER BY createdAt ASC LIMIT 2", (BUYER_ID,))
    older = [r[0] for r in cur.fetchall()]
    if len(older) >= 1:
        cur.execute("UPDATE bids SET status='accepted' WHERE id=?", (older[0],))
    if len(older) >= 2:
        cur.execute("UPDATE bids SET status='rejected', rejectionReason='Pretul oferit este sub minimul acceptat.' WHERE id=?", (older[1],))
    print("   Diversified bid statuses (1 accepted, 1 rejected, rest pending)")

# ---------- 2. Saved vehicles ----------
print("\n[2/6] Inserting saved vehicles...")
cur.execute("DELETE FROM saved_vehicles WHERE userId = ?", (BUYER_ID,))
saved_picks = vehicles[:7]
for i, v in enumerate(saved_picks):
    saved_at = (datetime.now() - timedelta(days=i+1)).isoformat()
    cur.execute(
        "INSERT INTO saved_vehicles (userId, vehicleId, savedAt) VALUES (?, ?, ?)",
        (BUYER_ID, v[0], saved_at),
    )
print(f"   Saved {len(saved_picks)} vehicles")

# ---------- 3. Conversations with realistic Romanian messages ----------
print("\n[3/6] Creating conversations with Romanian messages...")
# Delete existing convos for buyer
cur.execute("DELETE FROM messages WHERE conversationId IN (SELECT id FROM conversations WHERE buyerId = ?)", (BUYER_ID,))
cur.execute("DELETE FROM conversations WHERE buyerId = ?", (BUYER_ID,))

# Pick 3 vehicles owned by 3 different sellers
chosen = []
seen_sellers = set()
for v in vehicles:
    vehicle_id, make, model, year, price, seller_id = v
    if seller_id not in seen_sellers:
        chosen.append(v)
        seen_sellers.add(seller_id)
    if len(chosen) >= 3:
        break

conv_templates = [
    # Each tuple: list of (sender_role, content). The first message creates the convo.
    [
        ("buyer", "Buna ziua! Sunt interesat de aceasta masina. Mai este disponibila?"),
        ("seller", "Buna ziua! Da, masina este in continuare disponibila. Cu ce va pot ajuta?"),
        ("buyer", "Multumesc pentru raspuns rapid. Care a fost ultima revizie facuta la service?"),
        ("seller", "Ultima revizie a fost in luna martie, la 78.000 km. Am toate documentele de la reprezentanta."),
        ("buyer", "Excelent. Pot programa o vizionare in week-end-ul acesta?"),
        ("seller", "Sigur, sambata dimineata sunt disponibil. Va astept la showroom in Cluj-Napoca."),
        ("buyer", "Perfect, ne vedem sambata la 10:30. Va multumesc!"),
    ],
    [
        ("buyer", "Salut! Am vazut anuntul tau. Masina arata in stare excelenta in poze."),
        ("seller", "Salut! Multumesc, este intr-adevar bine intretinuta. Doar 2 proprietari pana acum."),
        ("buyer", "Accepti negocierea pretului? Pot oferi 28.500 euro plata cash."),
        ("seller", "Mai pot lasa putin, dar nu sub 29.000 euro. E sub pretul pietei pentru anul si starea ei."),
        ("buyer", "OK, e o oferta corecta. Cum procedam mai departe cu actele?"),
    ],
    [
        ("buyer", "Buna! Care este consumul real al masinii in oras?"),
        ("seller", "Buna! In oras consuma in jur de 7.5 litri / 100km, iar pe sosea 5.8 litri."),
        ("buyer", "Multumesc pentru informatii. Are istoric de daune?"),
        ("seller", "Niciuna. Pot trimite raport AutoDataCheck daca doriti."),
        ("buyer", "Ar fi util, da. As vrea sa vad si filmari ale interiorului."),
    ],
]

now = datetime.now()
for i, (v, tpl) in enumerate(zip(chosen, conv_templates)):
    vehicle_id, make, model, year, price, seller_id = v
    base_time = now - timedelta(days=(2 + i), hours=2)

    # Create conversation
    cur.execute("""
        INSERT INTO conversations
        (buyerId, sellerId, vehicleId, unreadByBuyer, unreadBySeller, lastMessage, lastMessageAt, lastMessageSenderId, createdAt, updatedAt)
        VALUES (?, ?, ?, 0, 0, ?, ?, ?, ?, ?)
    """, (
        BUYER_ID, seller_id, vehicle_id,
        tpl[-1][1][:80],
        (base_time + timedelta(minutes=10*len(tpl))).isoformat(),
        BUYER_ID if tpl[-1][0] == "buyer" else seller_id,
        base_time.isoformat(),
        (base_time + timedelta(minutes=10*len(tpl))).isoformat(),
    ))
    conv_id = cur.lastrowid

    last_sender = None
    for j, (who, content) in enumerate(tpl):
        sender_id = BUYER_ID if who == "buyer" else seller_id
        msg_time = (base_time + timedelta(minutes=10*j)).isoformat()
        status = "read" if j < len(tpl) - 1 else "sent"
        cur.execute("""
            INSERT INTO messages (content, status, senderId, conversationId, createdAt)
            VALUES (?, ?, ?, ?, ?)
        """, (content, status, sender_id, conv_id, msg_time))
        last_sender = sender_id

    # unreadByBuyer should be 1 if last sender was seller
    cur.execute("""
        UPDATE conversations
        SET unreadByBuyer = ?, unreadBySeller = ?
        WHERE id = ?
    """, (
        1 if last_sender != BUYER_ID else 0,
        1 if last_sender == BUYER_ID else 0,
        conv_id,
    ))
    print(f"   Created conversation {conv_id}: {make} {model} ({len(tpl)} messages)")

# ---------- 4. Wallet card ----------
print("\n[4/6] Setting up card for buyer1...")
cur.execute("DELETE FROM cards WHERE userId = ?", (BUYER_ID,))
cur.execute("""
    INSERT INTO cards (last4, cardHolderName, expiryMonth, expiryYear, cardType, balance, userId)
    VALUES ('4242', 'CIOARA RAUL', 12, 2028, 'visa', 18500, ?)
""", (BUYER_ID,))
print("   Added Visa **** 4242")

# ---------- 5. Wallet balance + transactions ----------
print("\n[5/6] Setting wallet and transactions...")
# Ensure wallet exists
cur.execute("SELECT id, balance, frozenBalance FROM wallets WHERE userId = ?", (BUYER_ID,))
w = cur.fetchone()
if not w:
    cur.execute("INSERT INTO wallets (balance, frozenBalance, userId) VALUES (12500, 0, ?)", (BUYER_ID,))
else:
    cur.execute("UPDATE wallets SET balance = 12500, frozenBalance = 0 WHERE id = ?", (w[0],))

cur.execute("DELETE FROM transactions WHERE userId = ?", (BUYER_ID,))
tx_log = [
    (3500, "deposit",   "completed", "Reincarcare portofel de pe cardul Visa ****4242", 28),
    (2000, "deposit",   "completed", "Reincarcare portofel inainte de licitatie BMW M3", 24),
    (4500, "deposit",   "completed", "Top-up wallet de pe card",                          18),
    (1200, "deposit",   "completed", "Reincarcare portofel",                              14),
    ( 750, "withdrawal","completed", "Retragere catre IBAN RO49AAAA1B31007593840000",      8),
    (5500, "deposit",   "completed", "Reincarcare pentru oferta Audi A5",                  4),
    (3200, "payment",   "completed", "Plata pentru BMW iX (oferta acceptata)",             2),
]
for amount, ttype, status, desc, days_ago in tx_log:
    created = (datetime.now() - timedelta(days=days_ago)).isoformat()
    cur.execute("""
        INSERT INTO transactions (amount, type, status, description, userId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (amount, ttype, status, desc, BUYER_ID, created))
print(f"   Inserted {len(tx_log)} transactions")

# ---------- 6. Seller1 also gets some transactions for the seller wallet screenshot ----------
seller1 = find_user("seed.seller1@automarket.test")
if seller1:
    S1 = seller1[0]
    print(f"\n[6/6] Seller1 (id={S1}) wallet + earnings...")
    cur.execute("SELECT id FROM wallets WHERE userId = ?", (S1,))
    if not cur.fetchone():
        cur.execute("INSERT INTO wallets (balance, frozenBalance, userId) VALUES (24800, 0, ?)", (S1,))
    else:
        cur.execute("UPDATE wallets SET balance = 24800, frozenBalance = 0 WHERE userId = ?", (S1,))

    cur.execute("DELETE FROM transactions WHERE userId = ?", (S1,))
    seller_tx = [
        (28500, "deposit",    "completed", "Vanzare BMW iX (comision 5% retinut)",         12),
        ( 1425, "commission", "completed", "Comision platforma 5% pentru vanzare BMW iX", 12),
        (15400, "deposit",    "completed", "Vanzare Audi A4 - oferta acceptata",            6),
        (  770, "commission", "completed", "Comision platforma 5% pentru vanzare Audi A4",  6),
        ( 5000, "withdrawal", "completed", "Retragere catre cont bancar - IBAN ****0123",   3),
    ]
    for amount, ttype, status, desc, days_ago in seller_tx:
        created = (datetime.now() - timedelta(days=days_ago)).isoformat()
        cur.execute("""
            INSERT INTO transactions (amount, type, status, description, userId, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (amount, ttype, status, desc, S1, created))
    print(f"   Inserted {len(seller_tx)} seller transactions")

conn.commit()
conn.close()
print("\nDone. Demo data seeded.")
