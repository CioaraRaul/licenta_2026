---
description: Agent pentru modificări în prezentarea PowerPoint (texte, slide-uri, layout)
---

# pptx-agent

Agent specializat pentru orice modificare în `presentation/generate_pptx.py` și regenerarea PPTX-ului.

## Când să-l folosești

- Modifici un text dintr-un slide
- Adaugi sau ștergi un slide
- Schimbi layout-ul unui slide
- Schimbi culori, fonturi, dimensiuni
- Adaugi o imagine nouă

## Flux de lucru

1. Citește `presentation/generate_pptx.py`
2. Identifică funcția/slide-ul afectat din tabelul de mai jos
3. Aplică modificarea
4. Rulează `python generate_pptx.py` din folderul `presentation/`
5. Dacă apare `PermissionError` → cere utilizatorului să închidă PPTX-ul din PowerPoint
6. Actualizează `update-presentation/SKILL.md` dacă modificarea e importantă

## Arhitectura fișierului generate_pptx.py

### Funcții helper (nu modifica fără motiv)

| Funcție | Rol |
|---|---|
| `set_solid(shape, rgb)` | Setează culoare solidă pe shape |
| `add_rect(slide, x,y,w,h, fill, line)` | Adaugă dreptunghi |
| `add_text(slide, x,y,w,h, text, ...)` | Adaugă textbox |
| `add_bullets(slide, x,y,w,h, items, ...)` | Adaugă listă cu bullet-uri |
| `header(slide, title, subtitle, page, total)` | Header albastru navy standard |
| `footer(slide)` | Footer întunecat standard |
| `add_image_safe(slide, image_name, x,y,w,h)` | Inserează imagine din `screenshots/` |

### Constructori slide-uri

| Funcție | Parametri cheie |
|---|---|
| `slide_title(prs)` | Copertă — hardcodat cu nume și titlu |
| `slide_text(prs, title, bullets, page, total)` | Slide cu bullet list |
| `slide_two_columns(prs, title, left_title, left_items, right_title, right_items, page, total)` | Două coloane |
| `slide_with_image(prs, title, image_name, bullets, page, total, image_left)` | Imagine + bullets |
| `slide_big_image(prs, title, image_name, page, total, caption)` | Imagine mare |
| `slide_tech_grid(prs, page, total)` | Grid 4×2 cu tehnologii |
| `slide_architecture(prs, page, total)` | Boxes arhitectură |
| `slide_erd(prs, page, total)` | Diagrama entitate-relație |
| `slide_modules(prs, page, total)` | Module NestJS 3×3 |
| `slide_four_roles(prs, page, total)` | 4 roluri utilizatori |
| `slide_auth(prs, page, total)` | Login + Register side-by-side |
| `slide_dashboard_split(prs, page, total)` | Buyer + Seller dashboard |
| `slide_thanks(prs, page, total)` | Slide final |

## Paleta de culori

```python
NAVY      = RGBColor(0x0F, 0x23, 0x4E)   # albastru închis — header
NAVY_DARK = RGBColor(0x07, 0x14, 0x2F)   # albastru foarte închis — footer
ACCENT    = RGBColor(0xF5, 0x9E, 0x0B)   # portocaliu/auriu
TEXT      = RGBColor(0x1F, 0x29, 0x37)   # text principal
MUTED     = RGBColor(0x6B, 0x72, 0x80)   # text subtitlu/gri
LIGHT     = RGBColor(0xF3, 0xF4, 0xF6)   # fundal cărți
WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
GREEN     = RGBColor(0x10, 0xB9, 0x81)
RED       = RGBColor(0xEF, 0x44, 0x44)
BLUE      = RGBColor(0x3B, 0x82, 0xF6)
```

## Dimensiuni slide

```python
SLIDE_W = Inches(13.333)   # lățime 16:9
SLIDE_H = Inches(7.5)      # înălțime 16:9
```

## Comenzi rapide

```bash
# Regenerare PPTX
cd C:\licenta\licenta_2026\presentation
python generate_pptx.py

# Verificare erori Python înainte de regenerare
python -m py_compile generate_pptx.py && echo "OK"
```

## Erori frecvente

| Eroare | Cauză | Soluție |
|---|---|---|
| `PermissionError` pe .pptx | Fișierul e deschis în PowerPoint | Închide PowerPoint |
| Imagine albă în slide | Screenshot-ul lipsește din `screenshots/` | Rulează scriptul Playwright |
| Text trunchiat | Textbox prea mic | Mărește `h` sau micșorează `size` |
| Caractere speciale (ș, ț, â) | Encoding Python | Fișierul are `# -*- coding: utf-8 -*-` deja |
