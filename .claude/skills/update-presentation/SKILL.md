---
description: Update presentation screenshots from the running app and regenerate the PPTX
---

# update-presentation skill

Actualizează screenshot-urile din aplicație și/sau regenerează `Licenta-AutoMarketplace.pptx`.

## Reguli obligatorii

- **După orice modificare** în `generate_pptx.py` → rulează `python generate_pptx.py`
- **Dacă PPTX-ul e deschis în PowerPoint** → cere utilizatorului să-l închidă (PermissionError altfel)
- **Actualizează acest SKILL.md** după fiecare schimbare importantă

## Structura prezentării

| Slide | Funcție | Descriere |
|---|---|---|
| 1 | `slide_title` | Copertă — student: Cioara Raul, coordonator: Ș.L.DR.ING. PECHERLE GEORGE-DOMINIC |
| 2 | `slide_tech_grid` | Stiva tehnologică |
| 3 | `slide_text` | Securitate și servicii externe |
| 4 | `slide_architecture` | Arhitectura generală |
| 5 | `slide_erd` | Modelul de date |
| 6 | `slide_modules` | Module backend NestJS |
| 7 | `slide_four_roles` | Tipuri de utilizatori |
| 8 | `slide_two_columns` | Cerințe funcționale și nefuncționale |
| 9 | `slide_auth` | Autentificare și înregistrare (login + register screenshots) |
| 10 | `slide_big_image` | Listarea și filtrarea anunțurilor |
| 11 | `slide_big_image` | Pagina de detaliu vehicul |
| 12 | `slide_with_image` | Sistemul de oferte |
| 13 | `slide_with_image` | Mesagerie cumpărător — vânzător |
| 14 | `slide_with_image` | Portofel digital |
| 15 | `slide_dashboard_split` | Tablouri de bord |
| 16 | `slide_text` | Recomandări vehicule similare |
| 17 | `slide_two_columns` | Concluzii și îmbunătățiri |
| 18 | `slide_thanks` | Mulțumiri |

## Texte importante (verificate)

- Parole: **"scrypt și salt aleatoriu"** (nu "sare" — contextul e tehnic/random)
- Coordonator: **Ș.L.DR.ING. PECHERLE GEORGE-DOMINIC** (size 20)
- Slide 7 badge roluri: lățime **2.0"** (nu 1.75" — "ADMINISTRATOR" nu încăpea), bullets la offset 2.2"
- Slide 8 titlu: **"Cerințe funcționale și tehnice"**, coloana dreaptă: **"Tehnice"** (nu "Nefuncționale")

## Screenshot-uri — reguli critice

### De ce `headless: false` este obligatoriu
Playwright headless nu capturează corect paginile de login/register din cauza unui bug de compositing GPU cu animația `@keyframes grain`. Soluția: browser vizibil.

### Cum se iau screenshots full-width (1440×900)

```javascript
// /tmp/pw-shots/shots_fullwidth.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch({ headless: false, args: ['--window-size=1440,900'] });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

async function capture(url, waitText, outPath) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForFunction(
    (text) => Array.from(document.querySelectorAll('h1,h2')).some(el => el.textContent.includes(text)),
    waitText, { timeout: 10000 }
  );
  // Termină toate animațiile CSS imediat
  await page.evaluate(() => document.getAnimations().forEach(a => { try { a.finish(); } catch(e){} }));
  await page.waitForTimeout(300);
  await page.evaluate(() => document.getAnimations().forEach(a => { try { a.finish(); } catch(e){} }));
  await page.waitForTimeout(200);
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
  writeFileSync(outPath, buf);
}

await capture('http://localhost:5173/auth/login',    'Welcome', 'C:/licenta/licenta_2026/presentation/screenshots/01-login.png');
await capture('http://localhost:5173/auth/register', 'Create',  'C:/licenta/licenta_2026/presentation/screenshots/02-register.png');
await browser.close();
```

### Rute aplicație

| Pagină | Rută | Text de așteptat |
|---|---|---|
| Login | `/auth/login` | `Welcome` |
| Register | `/auth/register` | `Create` |
| Forgot password | `/auth/forgot-password` | — |
| Dashboard | `/dashboard` (logat) | — |
| Find vehicle | `/find-vehicle` | — |

### Instalare Playwright (o singură dată)

```bash
cd /tmp/pw-shots && npm init -y && npm install playwright
npx playwright install chromium
```

## Pornire servere

```bash
# Backend (din backend/)
npm run start:dev   # port 3000

# Frontend (din frontend/)
npm run dev         # port 5173
```

## Skill-uri conexe

- `pptx-agent` — modificare text/layout în slide-uri, referință funcții și culori
- `romanian-formulations` — termeni tehnici corecți în română, formulări academice
- `pptx-best-practices` — reguli de design, anti-pattern-uri, checklist înainte de prezentare
- `github-push` — commit + push pe `dev` după aprobare explicită
