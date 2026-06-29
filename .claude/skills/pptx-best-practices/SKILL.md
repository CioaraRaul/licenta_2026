---
description: Bune practici de design PowerPoint pentru prezentări tehnice de licență
---

# pptx-best-practices

Reguli de design aplicate în prezentarea `Licenta-AutoMarketplace.pptx`.

## Reguli de bază

### Text
- **Max 6 bullet-uri per slide** — dacă sunt mai multe, împarte în 2 slide-uri
- **Max 10 cuvinte per bullet** — un bullet = o idee
- **Nu citi slide-ul** — slide-ul e suport vizual, nu script
- **Font minim 18pt** pentru corp, 24pt+ pentru titluri
- **Bold** doar pentru cuvinte cheie, nu fraze întregi

### Imagini
- Screenshot-uri **1440×900px** pentru consistență
- Întotdeauna cu **caption** (legendă) sub imagine
- Nu stretch — menține aspect ratio
- Fundal întunecat pe screenshots → border ușor sau shadow

### Culori (paleta prezentare)
```
Header/accent: NAVY #0F234E
Footer: NAVY_DARK #07142F
Accent/gold: #F59E0B
Text: #1F2937
Muted/gri: #6B7280
Fundal carduri: #F3F4F6
Verde succes: #10B981
Roșu eroare: #EF4444
Albastru info: #3B82F6
```
- **Nu adăuga culori noi** — menține paleta
- **Contrast suficient** — text deschis pe fundal întunecat și invers

### Layout 16:9 (13.333" × 7.5")
- **Header** (albastru navy): titlu + subtitlu + număr pagină
- **Footer** (albastru închis): fix la baza slide-ului
- **Zona de conținut**: Inches(1.85) → Inches(6.9) vertical
- **Margini laterale**: min 0.35" stânga/dreapta

## Tipuri de slide-uri și când le folosești

| Tip | Funcție | Când |
|---|---|---|
| `slide_text` | Bullet list | Explicații, liste de funcționalități |
| `slide_two_columns` | 2 coloane egale | Comparații, funcțional vs tehnic |
| `slide_with_image` | Imagine + bullets | Demo feature cu explicații |
| `slide_big_image` | Imagine dominantă | Screenshot principal al unui ecran |
| `slide_auth` | 2 imagini side-by-side | Pagini de autentificare |
| `slide_dashboard_split` | Split orizontal | Comparație buyer vs seller |

## Anti-pattern-uri de evitat

- ❌ **Wall of text** — dacă textul umple >60% din slide, taie
- ❌ **Font size sub 16pt** — nu se vede în sală
- ❌ **Prea multe culori** — max 3-4 din paleta definită
- ❌ **Imagini pixelate** — folosește screenshot-uri la rezoluție nativă
- ❌ **Titlu duplicat** pe slide cu header deja existent
- ❌ **Animații în PPTX** — nu sunt redate consistent pe proiectoare diferite
- ❌ **Slide fără număr de pagină** — comisia pierde șirul
- ❌ **Bullet-uri fără verb** — „JWT tokens" → „Autentificare prin JWT tokens"

## Fluxul de verificare înainte de prezentare

1. Deschide PPTX și verifică slide cu slide:
   - [ ] Titluri lizibile (font ≥ 28pt)
   - [ ] Screenshots clare, nu albe/negre
   - [ ] Diacritice corecte (ș ț â î ă)
   - [ ] Numărul de pagini corect (ex: 9 / 18)
   - [ ] Slide de copertă cu „LUCRARE DE DIPLOMĂ"
   - [ ] Numele coordonatorului complet și corect
2. Exportă ca PDF și verifică din nou
3. Testează pe proiectorul din sală dacă posibil

## Slide de copertă — câmpuri obligatorii

```
LUCRARE DE DIPLOMĂ  •  SESIUNEA IULIE 2026
Universitatea din Oradea  •  Specializarea Calculatoare
[Titlul lucrării]
ABSOLVENT: Cioara Raul
COORDONATOR ȘTIINȚIFIC: Ș.L.DR.ING. PECHERLE GEORGE-DOMINIC
```

## Numărul optim de slide-uri

- **Prezentare 10-15 min**: 12-18 slide-uri (1-1.5 min/slide)
- Prezentarea curentă: **18 slide-uri** ← ok pentru 15 min
- Nu adăuga slide-uri „de umplutură" — mai bine mai puține, mai clare
