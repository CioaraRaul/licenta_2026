# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

MAIN — Managementul contului tău

Dashboard — Pagina principală după login. Seller-ul vede statistici (câte anunțuri active, câte vizualizări, câți bani a câștigat). Buyer-ul vede mașinile recent vizualizate, bidurile active, vehiculele salvate. E "centrul de comandă" personalizat pe rol.
Messages — Inbox-ul aplicației. Buyer-ul trimite mesaj seller-ului despre o mașină ("Mai e disponibilă?", "Accept $75,000?"). Seller-ul răspunde. Ca un chat integrat, similar cu OLX sau Airbnb messaging.
My Listings (doar seller) — Seller-ul își gestionează anunțurile: vede care sunt active, care sunt în așteptare (pending review), care s-au vândut. Poate edita prețul, adăuga poze, dezactiva un anunț. E "magazinul" seller-ului.
Wallet — Istoricul tranzacțiilor. Seller-ul vede banii primiți din vânzări. Buyer-ul vede plățile efectuate, depozitele escrow, refund-urile. Ca un mini statement bancar al activității tale pe platformă.

VEHICLES — Descoperire și cumpărare

Find Vehicle — Pagina principală de browse. Filtre (marcă, model, an, preț, km, locație, tip combustibil), sortare, grid de carduri cu mașini. E core-ul aplicației — aici petrece buyer-ul cel mai mult timp.
Saved — Wishlist. Buyer-ul dă bookmark pe mașinile care îi plac și le regăsește aici. Poate compara prețuri, vedea dacă s-a schimbat ceva.
My Bids — Ofertele tale active. Dacă un anunț acceptă bidding, buyer-ul face o ofertă (ex: mașina e $80,000, tu oferi $75,000). Aici vezi statusul: pending, accepted, rejected, outbid (cineva a oferit mai mult).
Compare — Compară 2-3 mașini side by side: preț, km, an, specificații, condiție. Ajută buyer-ul să decidă între opțiuni similare.

BOTTOM

Help & Support — FAQ, contact support, ghid de utilizare.
Settings — Profil, securitate (schimbare parolă, 2FA), notificări, preferințe.
