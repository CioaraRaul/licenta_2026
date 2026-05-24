# -*- coding: utf-8 -*-
"""Generate the thesis PowerPoint for the AutoVault marketplace project."""

import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(ROOT, "screenshots")
OUT = os.path.join(ROOT, "Licenta-AutoMarketplace.pptx")

# 16:9 widescreen
SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

# Brand palette
NAVY = RGBColor(0x0F, 0x23, 0x4E)
NAVY_DARK = RGBColor(0x07, 0x14, 0x2F)
ACCENT = RGBColor(0xF5, 0x9E, 0x0B)   # warm amber
TEXT = RGBColor(0x1F, 0x29, 0x37)
MUTED = RGBColor(0x6B, 0x72, 0x80)
LIGHT = RGBColor(0xF3, 0xF4, 0xF6)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
GREEN = RGBColor(0x10, 0xB9, 0x81)
RED = RGBColor(0xEF, 0x44, 0x44)
BLUE = RGBColor(0x3B, 0x82, 0xF6)


def set_solid(shape, rgb):
    shape.fill.solid()
    shape.fill.fore_color.rgb = rgb
    shape.line.fill.background()


def add_rect(slide, x, y, w, h, fill=None, line=None):
    shp = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    if fill is not None:
        shp.fill.solid()
        shp.fill.fore_color.rgb = fill
    else:
        shp.fill.background()
    if line is None:
        shp.line.fill.background()
    else:
        shp.line.color.rgb = line
        shp.line.width = Pt(0.75)
    shp.shadow.inherit = False
    return shp


def add_text(slide, x, y, w, h, text, *, size=18, bold=False, color=TEXT,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, font="Calibri",
             line_spacing=None):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Emu(0)
    tf.margin_right = Emu(0)
    tf.margin_top = Emu(0)
    tf.margin_bottom = Emu(0)
    tf.vertical_anchor = anchor
    lines = text.split("\n") if isinstance(text, str) else text
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        if line_spacing is not None:
            p.line_spacing = line_spacing
        run = p.add_run()
        run.text = line
        run.font.name = font
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.color.rgb = color
    return tb


def add_bullets(slide, x, y, w, h, items, *, size=20, color=TEXT, bullet_color=ACCENT,
                line_spacing=1.15, space_after=10):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Emu(0)
    tf.margin_top = Emu(0)
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        p.space_after = Pt(space_after)
        p.line_spacing = line_spacing
        r1 = p.add_run()
        r1.text = "●  "
        r1.font.name = "Calibri"
        r1.font.size = Pt(size)
        r1.font.color.rgb = bullet_color
        r1.font.bold = True
        r2 = p.add_run()
        r2.text = item
        r2.font.name = "Calibri"
        r2.font.size = Pt(size)
        r2.font.color.rgb = color
    return tb


def header(slide, title, subtitle=None, page=None, total=None):
    # Top color band - taller for bigger header
    add_rect(slide, 0, 0, SLIDE_W, Inches(1.25), fill=NAVY)
    add_rect(slide, 0, Inches(1.25), SLIDE_W, Inches(0.08), fill=ACCENT)
    add_text(slide, Inches(0.5), Inches(0.2), Inches(10.5), Inches(0.6),
             title, size=32, bold=True, color=WHITE)
    if subtitle:
        add_text(slide, Inches(0.5), Inches(0.82), Inches(10.5), Inches(0.4),
                 subtitle, size=16, color=RGBColor(0xCB, 0xD5, 0xE1))
    # Page indicator
    if page is not None and total is not None:
        add_text(slide, Inches(11.4), Inches(0.45), Inches(1.7), Inches(0.5),
                 f"{page} / {total}", size=16, bold=True,
                 color=RGBColor(0xCB, 0xD5, 0xE1), align=PP_ALIGN.RIGHT)


def footer(slide):
    add_rect(slide, 0, Inches(7.1), SLIDE_W, Inches(0.4), fill=NAVY_DARK)
    add_text(slide, Inches(0.5), Inches(7.15), Inches(8), Inches(0.3),
             "Licență 2026  •  AutoVault Marketplace",
             size=13, color=RGBColor(0xCB, 0xD5, 0xE1))
    add_text(slide, Inches(9.5), Inches(7.15), Inches(3.3), Inches(0.3),
             "NestJS  •  React Router 7  •  TypeORM",
             size=13, color=RGBColor(0xCB, 0xD5, 0xE1), align=PP_ALIGN.RIGHT)


def add_image_safe(slide, image_name, x, y, w, h, *, caption=None):
    """Add an image if it exists, otherwise a placeholder."""
    path = os.path.join(SHOTS, image_name) if image_name else None
    border = add_rect(slide, x, y, w, h, fill=LIGHT, line=RGBColor(0xD1, 0xD5, 0xDB))
    if path and os.path.isfile(path):
        try:
            with Image.open(path) as im:
                iw, ih = im.size
            target_ratio = w / h
            img_ratio = iw / ih
            if img_ratio > target_ratio:
                # image wider -> fit width
                new_w = w
                new_h = int(w / img_ratio)
                nx = x
                ny = y + (h - new_h) // 2
            else:
                new_h = h
                new_w = int(h * img_ratio)
                ny = y
                nx = x + (w - new_w) // 2
            slide.shapes.add_picture(path, nx, ny, width=new_w, height=new_h)
        except Exception as e:
            add_text(slide, x + Inches(0.3), y + Inches(0.3), w - Inches(0.6), Inches(0.5),
                     f"[Eroare imagine: {e}]", size=12, color=MUTED)
    else:
        add_text(slide, x, y + h / 2 - Inches(0.4), w, Inches(0.4),
                 f"[Captura ecran: {image_name or 'placeholder'}]",
                 size=14, color=MUTED, align=PP_ALIGN.CENTER)
        add_text(slide, x, y + h / 2 + Inches(0.1), w, Inches(0.4),
                 "Inserati aici imaginea din aplicatie",
                 size=11, color=MUTED, align=PP_ALIGN.CENTER)
    if caption:
        add_text(slide, x, y + h + Inches(0.05), w, Inches(0.3),
                 caption, size=11, color=MUTED, align=PP_ALIGN.CENTER)


# ---------- slide builders ----------

def new_slide(prs):
    return prs.slides.add_slide(prs.slide_layouts[6])  # blank


def slide_title(prs):
    s = new_slide(prs)
    # Full-bleed navy background
    add_rect(s, 0, 0, SLIDE_W, SLIDE_H, fill=NAVY)

    # Top label centered
    add_text(s, 0, Inches(0.7), SLIDE_W, Inches(0.5),
             "LUCRARE DE LICENȚĂ  •  SESIUNEA IULIE 2026", size=20, bold=True,
             color=ACCENT, align=PP_ALIGN.CENTER)
    add_text(s, 0, Inches(1.2), SLIDE_W, Inches(0.4),
             "Universitatea din Oradea  •  Specializarea Calculatoare",
             size=18, color=RGBColor(0xCB, 0xD5, 0xE1), align=PP_ALIGN.CENTER)

    # Decorative accent bar (centered)
    add_rect(s, Inches(5.92), Inches(2.05), Inches(1.5), Inches(0.1), fill=ACCENT)

    # Centered main title
    add_text(s, 0, Inches(2.4), SLIDE_W, Inches(1.0),
             "Platformă web pentru vânzarea și",
             size=46, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(s, 0, Inches(3.3), SLIDE_W, Inches(1.0),
             "cumpărarea automobilelor",
             size=46, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(s, 0, Inches(4.45), SLIDE_W, Inches(0.7),
             "utilizând NestJS și React",
             size=30, color=RGBColor(0xCB, 0xD5, 0xE1), align=PP_ALIGN.CENTER)

    # Bottom info bar
    add_rect(s, 0, Inches(6.0), SLIDE_W, Inches(1.5), fill=NAVY_DARK)

    # Two columns inside bottom bar
    add_text(s, Inches(0.8), Inches(6.18), Inches(6), Inches(0.45),
             "ABSOLVENT", size=13, bold=True, color=ACCENT)
    add_text(s, Inches(0.8), Inches(6.55), Inches(6), Inches(0.6),
             "Cioara Raul", size=24, bold=True, color=WHITE)

    add_text(s, Inches(7), Inches(6.18), Inches(5.8), Inches(0.45),
             "COORDONATOR ȘTIINȚIFIC", size=13, bold=True, color=ACCENT,
             align=PP_ALIGN.RIGHT)
    add_text(s, Inches(7), Inches(6.55), Inches(5.8), Inches(0.6),
             "Pecherle George-Dominic", size=24, bold=True, color=WHITE,
             align=PP_ALIGN.RIGHT)


def slide_toc(prs, total):
    s = new_slide(prs)
    header(s, "Cuprins", subtitle="Structura prezentării", page=2, total=total)
    items_left = [
        "1.  Introducere",
        "2.  Cerințe și utilizatori",
        "3.  Tehnologii utilizate",
        "4.  Proiectare și arhitectură",
    ]
    items_right = [
        "5.  Implementarea aplicației",
        "6.  Funcționalități avansate",
        "7.  Concluzii și dezvoltări viitoare",
    ]
    add_bullets(s, Inches(0.9), Inches(2.0), Inches(6), Inches(5),
                items_left, size=30, line_spacing=1.5, space_after=18)
    add_bullets(s, Inches(7.0), Inches(2.0), Inches(6), Inches(5),
                items_right, size=30, line_spacing=1.5, space_after=18)
    footer(s)


def section_divider(prs, number, title, subtitle, page, total):
    s = new_slide(prs)
    add_rect(s, 0, 0, SLIDE_W, SLIDE_H, fill=NAVY)
    # centered accent bar above the chapter label
    add_rect(s, Inches(6.17), Inches(2.5), Inches(1), Inches(0.12), fill=ACCENT)
    add_text(s, 0, Inches(2.75), SLIDE_W, Inches(0.6),
             f"CAPITOLUL {number}", size=26, bold=True, color=ACCENT,
             align=PP_ALIGN.CENTER)
    add_text(s, 0, Inches(3.5), SLIDE_W, Inches(1.4),
             title, size=56, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(s, 0, Inches(4.95), SLIDE_W, Inches(0.7),
             subtitle, size=24, color=RGBColor(0xCB, 0xD5, 0xE1),
             align=PP_ALIGN.CENTER)
    add_text(s, Inches(11.4), Inches(7.0), Inches(1.7), Inches(0.4),
             f"{page} / {total}", size=16, bold=True,
             color=RGBColor(0xCB, 0xD5, 0xE1), align=PP_ALIGN.RIGHT)


def slide_text(prs, title, bullets, *, page, total, subtitle=None, body_size=24):
    s = new_slide(prs)
    header(s, title, subtitle=subtitle, page=page, total=total)
    add_bullets(s, Inches(0.9), Inches(1.95), Inches(11.5), Inches(5.0),
                bullets, size=body_size, line_spacing=1.25, space_after=14)
    footer(s)
    return s


def slide_two_columns(prs, title, left_title, left_items, right_title, right_items,
                       *, page, total, subtitle=None, body_size=18):
    s = new_slide(prs)
    header(s, title, subtitle=subtitle, page=page, total=total)
    card_y = Inches(1.85)
    card_h = Inches(5.15)
    # left card with subtle shadow
    add_rect(s, Inches(0.54), card_y + Inches(0.05), Inches(6.1), card_h,
             fill=RGBColor(0xE5, 0xE7, 0xEB), line=None)
    add_rect(s, Inches(0.5), card_y, Inches(6.1), card_h,
             fill=WHITE, line=RGBColor(0xE5, 0xE7, 0xEB))
    add_rect(s, Inches(0.5), card_y, Inches(6.1), Inches(0.8), fill=NAVY)
    add_text(s, Inches(0.5), card_y, Inches(6.1), Inches(0.8),
             left_title, size=22, bold=True, color=WHITE,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_bullets(s, Inches(0.85), card_y + Inches(1.0), Inches(5.5), Inches(4.0),
                left_items, size=body_size, line_spacing=1.2, space_after=10)
    # right card with subtle shadow
    add_rect(s, Inches(6.77), card_y + Inches(0.05), Inches(6.1), card_h,
             fill=RGBColor(0xE5, 0xE7, 0xEB), line=None)
    add_rect(s, Inches(6.73), card_y, Inches(6.1), card_h,
             fill=WHITE, line=RGBColor(0xE5, 0xE7, 0xEB))
    add_rect(s, Inches(6.73), card_y, Inches(6.1), Inches(0.8), fill=NAVY)
    add_text(s, Inches(6.73), card_y, Inches(6.1), Inches(0.8),
             right_title, size=22, bold=True, color=WHITE,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_bullets(s, Inches(7.08), card_y + Inches(1.0), Inches(5.5), Inches(4.0),
                right_items, size=body_size, line_spacing=1.2, space_after=10)
    footer(s)


def slide_with_image(prs, title, image_name, bullets, *, page, total, subtitle=None,
                     image_left=False, image_caption=None):
    s = new_slide(prs)
    header(s, title, subtitle=subtitle, page=page, total=total)
    img_x = Inches(0.5) if image_left else Inches(6.85)
    bul_x = Inches(7.0) if image_left else Inches(0.7)
    add_image_safe(s, image_name, img_x, Inches(1.95), Inches(6.0), Inches(4.3),
                   caption=image_caption)
    add_bullets(s, bul_x, Inches(2.0), Inches(5.85), Inches(4.5),
                bullets, size=19, line_spacing=1.2, space_after=12)
    footer(s)


def slide_big_image(prs, title, image_name, *, page, total, subtitle=None, caption=None):
    s = new_slide(prs)
    header(s, title, subtitle=subtitle, page=page, total=total)
    add_image_safe(s, image_name, Inches(1.0), Inches(1.95), Inches(11.33), Inches(4.7),
                   caption=caption)
    footer(s)


def slide_tech_grid(prs, *, page, total):
    s = new_slide(prs)
    header(s, "Stack tehnologic complet",
           subtitle="Tehnologii moderne pentru un marketplace web full-stack",
           page=page, total=total)
    # 8 boxes 4x2
    items = [
        ("BACKEND", "NestJS 11", "Framework Node.js modular cu dependency injection"),
        ("LIMBAJ", "TypeScript", "Tipare statice, decoratori și DTO-uri validate"),
        ("BAZĂ DATE", "SQLite + TypeORM", "ORM cu sincronizare automată în development"),
        ("AUTH", "JWT + OAuth2", "Access + refresh tokens, Google și Facebook"),
        ("FRONTEND", "React 19 + RR 7", "SSR cu React Router în framework mode"),
        ("STATE", "Zustand 5", "Store-uri persistente în localStorage"),
        ("STYLING", "Tailwind CSS 4", "Utility-first cu design tokens"),
        ("MEDIA", "Cloudinary + Multer", "Upload optimizat de imagini"),
    ]
    cols = 4
    box_w = Inches(3.05)
    box_h = Inches(2.45)
    gap = Inches(0.12)
    x0 = Inches(0.42)
    y0 = Inches(1.85)
    for i, (badge, name, desc) in enumerate(items):
        r, c = divmod(i, cols)
        x = x0 + c * (box_w + gap)
        y = y0 + r * (box_h + Inches(0.2))
        # shadow for depth
        add_rect(s, x + Inches(0.04), y + Inches(0.05), box_w, box_h,
                 fill=RGBColor(0xE5, 0xE7, 0xEB), line=None)
        add_rect(s, x, y, box_w, box_h, fill=WHITE, line=RGBColor(0xE5, 0xE7, 0xEB))
        add_rect(s, x, y, box_w, Inches(0.55), fill=NAVY)
        add_text(s, x, y + Inches(0.1), box_w, Inches(0.4),
                 badge, size=15, bold=True, color=ACCENT, align=PP_ALIGN.CENTER)
        add_text(s, x + Inches(0.15), y + Inches(0.78), box_w - Inches(0.3), Inches(0.7),
                 name, size=26, bold=True, color=NAVY, align=PP_ALIGN.CENTER)
        add_text(s, x + Inches(0.25), y + Inches(1.6), box_w - Inches(0.5), Inches(0.9),
                 desc, size=15, color=MUTED, align=PP_ALIGN.CENTER)
    footer(s)


def slide_architecture(prs, *, page, total):
    s = new_slide(prs)
    header(s, "Arhitectura generală a aplicației",
           subtitle="Flux de date: client → API → ORM → bază de date",
           page=page, total=total)
    boxes = [
        ("CLIENT", "Browser (React 19, Vite, Tailwind CSS 4)",
         "Pagini SSR/SPA, Zustand stores cu persistență în localStorage", BLUE),
        ("TRANSPORT", "Axios + interceptori HTTP",
         "Bearer token automat, auto-refresh la 401, request queue", ACCENT),
        ("API", "NestJS Controllers + Guards",
         "ValidationPipe global, JWT Auth, Throttling, CORS configurat", NAVY),
        ("DATA", "TypeORM → SQLite în mod WAL",
         "Entități, relații tipate, sincronizare automată în development", GREEN),
    ]
    y = Inches(1.85)
    box_h = Inches(1.18)
    gap = Inches(0.1)
    for badge, title, desc, color in boxes:
        # subtle shadow
        add_rect(s, Inches(0.74), y + Inches(0.04), Inches(11.9), box_h,
                 fill=RGBColor(0xE5, 0xE7, 0xEB), line=None)
        add_rect(s, Inches(0.7), y, Inches(11.9), box_h,
                 fill=WHITE, line=RGBColor(0xE5, 0xE7, 0xEB))
        add_rect(s, Inches(0.7), y, Inches(2.1), box_h, fill=color)
        add_text(s, Inches(0.7), y, Inches(2.1), box_h,
                 badge, size=20, bold=True, color=WHITE, align=PP_ALIGN.CENTER,
                 anchor=MSO_ANCHOR.MIDDLE)
        add_text(s, Inches(3.0), y + Inches(0.18), Inches(9.55), Inches(0.5),
                 title, size=22, bold=True, color=NAVY)
        add_text(s, Inches(3.0), y + Inches(0.7), Inches(9.55), Inches(0.45),
                 desc, size=15, color=MUTED)
        y += box_h + gap
    footer(s)


def slide_erd(prs, *, page, total):
    s = new_slide(prs)
    header(s, "Modelul de date — entități și relații",
           subtitle="Diagrama ER cu cele 9 entități principale",
           page=page, total=total)

    def entity(x, y, w, h, name, fields, color=NAVY):
        # subtle shadow for depth
        add_rect(s, x + Inches(0.04), y + Inches(0.05), w, h,
                 fill=RGBColor(0xE5, 0xE7, 0xEB), line=None)
        add_rect(s, x, y, w, h, fill=WHITE, line=color)
        add_rect(s, x, y, w, Inches(0.55), fill=color)
        add_text(s, x + Inches(0.2), y + Inches(0.08), w - Inches(0.3), Inches(0.45),
                 name, size=20, bold=True, color=WHITE)
        for i, f in enumerate(fields):
            add_text(s, x + Inches(0.2), y + Inches(0.7) + i * Inches(0.33),
                     w - Inches(0.3), Inches(0.33),
                     f, size=15, color=TEXT)

    # 3x3 layout with bigger boxes and more breathing room
    col_w = Inches(3.95)
    row_h = Inches(1.65)
    gap_x = Inches(0.2)
    gap_y = Inches(0.13)
    x0 = Inches(0.45)
    y0 = Inches(1.85)
    cols = [x0, x0 + col_w + gap_x, x0 + 2 * (col_w + gap_x)]
    rows = [y0, y0 + row_h + gap_y, y0 + 2 * (row_h + gap_y)]

    # Row 1
    entity(cols[0], rows[0], col_w, row_h, "Buyer",
           ["walletBalance, currency", "totalSpent, receiveCarAlerts"], color=BLUE)
    entity(cols[1], rows[0], col_w, row_h, "User",
           ["id, email, password", "role, firstName, lastName",
            "isEmailVerified, createdAt"], color=NAVY)
    entity(cols[2], rows[0], col_w, row_h, "Vehicle",
           ["make, model, year", "price, mileage, fuelType",
            "images, viewsCount, status"], color=GREEN)

    # Row 2
    entity(cols[0], rows[1], col_w, row_h, "Seller",
           ["walletBalance, IBAN", "commissionRate, sellerRating"], color=BLUE)
    entity(cols[1], rows[1], col_w, row_h, "Conversation",
           ["buyerId, sellerId, vehicleId",
            "unreadByBuyer, unreadBySeller",
            "lastMessage, lastMessageAt"], color=ACCENT)
    entity(cols[2], rows[1], col_w, row_h, "Bid",
           ["amount, status, message",
            "expiresAt, rejectionReason",
            "buyerId, vehicleId"], color=ACCENT)

    # Row 3
    entity(cols[0], rows[2], col_w, row_h, "SavedVehicle",
           ["userId, vehicleId", "unique (userId, vehicleId)"], color=BLUE)
    entity(cols[1], rows[2], col_w, row_h, "Message",
           ["content, status", "senderId, conversationId",
            "createdAt"], color=ACCENT)
    entity(cols[2], rows[2], col_w, row_h, "Transaction",
           ["amount, type, status", "userId, referenceId",
            "description, createdAt"], color=GREEN)

    footer(s)


def slide_modules(prs, *, page, total):
    s = new_slide(prs)
    header(s, "Module backend NestJS",
           subtitle="9 module principale, fiecare cu controller, service, entity si DTO",
           page=page, total=total)
    modules = [
        ("users / auth", "Inregistrare, autentificare, JWT, OAuth, verificare email, reset parola"),
        ("vehicles", "CRUD anunturi cu 40+ campuri tehnice; filtrare si sortare avansata"),
        ("bids", "Plasare oferte de catre cumparatori, acceptare/respingere de vanzatori"),
        ("messages", "Conversatii persistente buyer-seller-vehicle cu unread tracking"),
        ("saved-vehicles", "Lista de favorite per cumparator cu constrangere unica"),
        ("wallet", "Carduri, depozite, retrageri, soldi blocati pentru bid-uri"),
        ("dashboard", "Agregare metrici in functie de rol (BUYER / SELLER)"),
        ("upload", "Incarcare imagini pe Cloudinary cu Multer middleware"),
        ("common", "Guards, decorators, exception filters, throttler config"),
    ]
    y0 = Inches(1.75)
    for i, (name, desc) in enumerate(modules):
        r, c = divmod(i, 3)
        x = Inches(0.5) + c * Inches(4.2)
        y = y0 + r * Inches(1.65)
        add_rect(s, x, y, Inches(4.0), Inches(1.5),
                 fill=WHITE, line=RGBColor(0xE5, 0xE7, 0xEB))
        add_text(s, x + Inches(0.2), y + Inches(0.18), Inches(3.8), Inches(0.4),
                 name, size=18, bold=True, color=NAVY)
        add_text(s, x + Inches(0.2), y + Inches(0.68), Inches(3.8), Inches(0.8),
                 desc, size=13, color=MUTED)
    footer(s)


def slide_four_roles(prs, *, page, total):
    s = new_slide(prs)
    header(s, "Tipuri de utilizatori",
           subtitle="Patru roluri cu acces granular pe resurse",
           page=page, total=total)
    roles = [
        ("BUYER", BLUE, "cumpărător",
         ["Caută și filtrează vehicule.",
          "Salvează favorite, compară mașini.",
          "Plasează oferte (bids) pe vehicule.",
          "Comunică prin mesagerie.",
          "Wallet cu sume blocate."]),
        ("SELLER", GREEN, "vânzător",
         ["Adaugă anunțuri detaliate.",
          "Editează / marchează ca SOLD.",
          "Acceptă sau respinge oferte.",
          "Comunică cu cumpărători.",
          "Vede câștiguri și comisioane."]),
        ("GUEST", ACCENT, "vizitator",
         ["Acces public la anunțuri.",
          "Vede detalii complete.",
          "Nu poate salva sau oferta.",
          "Invitat să se autentifice."]),
        ("ADMIN", NAVY, "administrator",
         ["Rapoarte agregate.",
          "Pregătit la nivel de entitate.",
          "Extensibil pentru moderare."]),
    ]
    box_w = Inches(6.2)
    box_h = Inches(2.45)
    gap_x = Inches(0.13)
    gap_y = Inches(0.18)
    x0 = Inches(0.45)
    y0 = Inches(1.85)
    for i, (badge, color, sub, items) in enumerate(roles):
        r, c = divmod(i, 2)
        x = x0 + c * (box_w + gap_x)
        y = y0 + r * (box_h + gap_y)
        # shadow
        add_rect(s, x + Inches(0.04), y + Inches(0.05), box_w, box_h,
                 fill=RGBColor(0xE5, 0xE7, 0xEB), line=None)
        add_rect(s, x, y, box_w, box_h, fill=WHITE, line=RGBColor(0xE5, 0xE7, 0xEB))
        # left strip
        add_rect(s, x, y, Inches(1.75), box_h, fill=color)
        add_text(s, x, y + Inches(0.55), Inches(1.75), Inches(0.55),
                 badge, size=22, bold=True, color=WHITE,
                 align=PP_ALIGN.CENTER)
        add_text(s, x, y + Inches(1.15), Inches(1.75), Inches(0.4),
                 sub, size=14, color=RGBColor(0xE5, 0xE7, 0xEB),
                 align=PP_ALIGN.CENTER)
        # bullets — more room, bigger text
        add_bullets(s, x + Inches(1.95), y + Inches(0.25),
                    box_w - Inches(2.1), box_h - Inches(0.4),
                    items, size=16, line_spacing=1.22, space_after=8)
    footer(s)


def slide_dashboard_split(prs, *, page, total):
    s = new_slide(prs)
    header(s, "Dashboard-uri personalizate pe rol",
           subtitle="Vedere adaptată automat la rolul utilizatorului autentificat",
           page=page, total=total)
    # Buyer dash on left
    add_image_safe(s, "10-buyer-dashboard.png",
                   Inches(0.5), Inches(1.85), Inches(6.0), Inches(4.15),
                   caption="Dashboard BUYER — bid-uri, salvări, wallet")
    # Seller dash on right
    add_image_safe(s, "20-seller-dashboard.png",
                   Inches(6.8), Inches(1.85), Inches(6.0), Inches(4.15),
                   caption="Dashboard SELLER — anunțuri, vânzări, câștiguri")
    # short note below both
    add_text(s, Inches(0.5), Inches(6.4), Inches(12.3), Inches(0.55),
             "Comparator dedicat pentru 2-5 vehicule (route /compare) — "
             "evidențiază cea mai bună valoare în fiecare categorie.",
             size=16, color=MUTED, align=PP_ALIGN.CENTER)
    footer(s)


def slide_thanks(prs, *, page, total):
    s = new_slide(prs)
    add_rect(s, 0, 0, SLIDE_W, SLIDE_H, fill=NAVY)
    add_rect(s, Inches(5.67), Inches(2.3), Inches(2), Inches(0.14), fill=ACCENT)
    add_text(s, 0, Inches(2.65), SLIDE_W, Inches(1.5),
             "Vă mulțumesc!", size=80, bold=True, color=WHITE,
             align=PP_ALIGN.CENTER)
    add_text(s, 0, Inches(4.2), SLIDE_W, Inches(0.9),
             "Întrebări?", size=40, color=ACCENT, align=PP_ALIGN.CENTER)
    add_text(s, 0, Inches(5.45), SLIDE_W, Inches(0.6),
             "Cioara Raul  •  Licență 2026",
             size=22, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(s, 0, Inches(6.05), SLIDE_W, Inches(0.5),
             "Universitatea din Oradea  •  Specializarea Calculatoare",
             size=18, color=RGBColor(0xCB, 0xD5, 0xE1), align=PP_ALIGN.CENTER)


# -------------- assemble presentation --------------

def build():
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H

    # 25 slides total (1 = title cover, 25 = thanks)
    TOTAL = 25

    # 1. Title
    slide_title(prs)
    # 2. TOC
    slide_toc(prs, TOTAL)

    # ----- CAPITOLUL 1: INTRODUCERE -----
    section_divider(prs, 1, "Introducere",
                    "Context, motivație și obiective", 3, TOTAL)

    slide_text(prs, "Context și motivație",
        [
            "Piața auto second-hand din România depășește 1,5 miliarde EUR/an.",
            "Tranzacțiile online cresc cu 20-30% anual.",
            "Piața rămâne fragmentată, fără un standard clar.",
            "Cumpărătorii caută transparență și comunicare directă.",
            "Vânzătorii au nevoie de vizibilitate și gestiune simplă.",
        ], page=4, total=TOTAL,
        subtitle="De ce un marketplace dedicat automobilelor")

    slide_text(prs, "Obiectivele proiectului",
        [
            "Platformă web full-stack funcțională end-to-end.",
            "Suport pentru patru roluri distincte cu acces granular.",
            "Autentificare securizată: JWT, OAuth, verificare email.",
            "Sistem complet de bid-uri, mesagerie și portofel.",
            "Arhitectură modulară, testată și extensibilă.",
        ], page=5, total=TOTAL)

    # ----- CAPITOLUL 2: CERINTE -----
    section_divider(prs, 2, "Cerințe și utilizatori",
                    "Roluri, cerințe funcționale și nefuncționale", 6, TOTAL)

    slide_four_roles(prs, page=7, total=TOTAL)

    slide_two_columns(prs, "Cerințe funcționale și nefuncționale",
        "Funcționale",
        [
            "Autentificare locală + OAuth.",
            "CRUD complet pe anunțuri.",
            "Bid-uri cu stări multiple.",
            "Mesagerie cu unread tracking.",
            "Wallet cu sume blocate.",
            "Recomandări vehicule similare.",
        ],
        "Nefuncționale",
        [
            "Securitate: JWT, scrypt, CORS.",
            "Throttling pe endpoint-uri sensibile.",
            "Performanță: paginare și SSR.",
            "Disponibilitate: SQLite WAL.",
            "Uzabilitate: responsive, limba română.",
            "Mentenabilitate: arhitectură modulară.",
        ], page=8, total=TOTAL)

    # ----- CAPITOLUL 3: TEHNOLOGII -----
    section_divider(prs, 3, "Tehnologii utilizate",
                    "Stack-ul full-stack și măsurile de securitate", 9, TOTAL)

    slide_tech_grid(prs, page=10, total=TOTAL)

    slide_text(prs, "Securitate și servicii externe",
        [
            "JWT cu 2 secrete: access (15 min) + refresh (7 zile).",
            "TokenBlacklist pentru invalidare sesiuni la logout.",
            "Parole hash-uite cu scrypt și sare aleatorie.",
            "Throttling: max 5 încercări de login pe minut.",
            "OAuth2 prin Passport.js (Google și Facebook).",
            "Cloudinary pentru imagini, Mailtrap SMTP pentru email.",
        ], page=11, total=TOTAL,
        subtitle="Cum am asigurat protecția datelor utilizatorilor")

    # ----- CAPITOLUL 4: PROIECTARE -----
    section_divider(prs, 4, "Proiectare și arhitectură",
                    "Straturi, module și modelul de date", 12, TOTAL)

    slide_architecture(prs, page=13, total=TOTAL)
    slide_erd(prs, page=14, total=TOTAL)

    # ----- CAPITOLUL 5: IMPLEMENTARE -----
    section_divider(prs, 5, "Implementarea aplicației",
                    "Capturi din aplicație și fluxuri reale", 15, TOTAL)

    slide_big_image(prs, "Autentificare și înregistrare",
        "01-login.png", page=16, total=TOTAL,
        subtitle="Login local + OAuth Google/Facebook, cu throttling contra brute-force",
        caption="/auth/login — formular cu validare și redirect după rol")

    slide_big_image(prs, "Listarea și filtrarea anunțurilor",
        "11-find-vehicle.png", page=17, total=TOTAL,
        subtitle="Filtrare după marcă, model, preț, an, combustibil, transmisie și localitate",
        caption="/find-vehicle — 200 de vehicule din 10 producători")

    slide_big_image(prs, "Pagina de detaliu vehicul",
        "12-vehicle-detail.png", page=18, total=TOTAL,
        subtitle="Peste 40 de câmpuri tehnice, galerie imagini și contact direct cu vânzătorul",
        caption="/find-vehicle/:id")

    slide_with_image(prs, "Sistemul de bid-uri",
        "15-bids.png",
        [
            "Ofertă cu sumă și mesaj de negociere.",
            "Stări: pending, accepted, rejected, withdrawn.",
            "La acceptare → vehiculul devine SOLD.",
            "Suma cumpărătorului este blocată (frozen).",
            "Doar rolul BUYER poate plasa bid-uri.",
        ], page=19, total=TOTAL,
        image_caption="/bids — bid-uri active și istoric")

    slide_with_image(prs, "Mesagerie buyer ↔ seller",
        "16b-messages-thread.png",
        [
            "Conversații peer-to-peer buyer-seller.",
            "Editare și ștergere de mesaje individuale.",
            "Ștergere completă a conversației.",
            "Unread tracking separat per participant.",
            "Inițiere din pagina de detaliu vehicul.",
        ], page=20, total=TOTAL,
        image_caption="/messages — thread complet",
        image_left=True)

    slide_with_image(prs, "Portofel digital și tranzacții",
        "17-wallet.png",
        [
            "Sold disponibil + sold blocat (frozen).",
            "Card asociat cu depozite și retrageri.",
            "Tipuri: deposit, withdrawal, payment.",
            "Istoric paginat și filtrat pe tip/status.",
            "Comision 5% reținut automat la vânzare.",
        ], page=21, total=TOTAL,
        image_caption="/wallet — sold, card și istoric")

    slide_dashboard_split(prs, page=22, total=TOTAL)

    # ----- CAPITOLUL 6: AVANSAT + CONCLUZII -----
    slide_text(prs, "Recomandări de vehicule similare",
        [
            "Endpoint dedicat: GET /vehicles/:id/similar.",
            "Filtrare după aceeași marcă + interval preț ±15%.",
            "Sortare după distanța absolută față de preț.",
            "Returnează top 5 pe pagina de detaliu.",
            "Extensibil cu model ML (KNN, embeddings).",
        ], page=23, total=TOTAL,
        subtitle="„Mașini asemănătoare\" sugerate pe pagina de detaliu")

    slide_two_columns(prs, "Concluzii și dezvoltări viitoare",
        "Ce am realizat",
        [
            "Platformă full-stack funcțională.",
            "Autentificare OAuth + verificare email.",
            "Sistem complet de bid-uri.",
            "Mesagerie peer-to-peer.",
            "Wallet cu tranzacții și sume blocate.",
            "Recomandări de vehicule similare.",
        ],
        "Îmbunătățiri viitoare",
        [
            "Recomandări ML (KNN + embeddings).",
            "Integrare plată: Stripe / MobilPay.",
            "Migrare pe PostgreSQL.",
            "Reviews și rating buyer-seller.",
            "Aplicație mobilă React Native.",
            "Notificări push în timp real.",
        ], page=24, total=TOTAL)

    slide_thanks(prs, page=25, total=TOTAL)

    prs.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    build()
