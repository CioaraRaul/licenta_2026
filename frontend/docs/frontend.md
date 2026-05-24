# Frontend - AutoVault

## Tech Stack

- **Framework**: React 19 + React Router v7 (SPA mode)
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (with persist middleware)
- **HTTP Client**: Axios
- **Language**: TypeScript
- **Port**: 5173

---

## Project Structure

```
app/
├── api/            (API service functions)
├── components/     (React components)
│   ├── auth/       (Login, register, OAuth, legal pages)
│   ├── homepage/   (Main app components)
│   │   ├── mainSectionComponent/   (Dashboard, listings, settings, wallet, messages, help)
│   │   └── vehiclesSectionComponent/ (Find vehicles, bids, compare, saved)
│   └── navbar/     (Sidebar, Navbar, NotificationBell)
├── constants/      (Static data, icons, config)
├── hooks/          (Custom React hooks)
├── interface/      (TypeScript interfaces)
├── routes/         (Route page components)
├── store/          (Zustand stores)
├── utils/          (Utility functions)
└── routes.ts       (Route configuration)
```

---

## Routes

```
/auth                    (Auth layout)
├── /auth/login          Login page
├── /auth/register       Register page
├── /auth/verify-email   Email verification
├── /auth/forgot-password Forgot password
├── /auth/reset-password  Reset password
├── /auth/callback       OAuth callback
├── /auth/privacy-policy Privacy policy
└── /auth/terms          Terms of service

/                        (App layout - Sidebar + Navbar)
├── /                    Home (index)
├── /dashboard           Dashboard
├── /messages/:sellerId? Messages (optional seller deep-link)
├── /wallet              Wallet
├── /my-listings         My listings (seller)
├── /my-listings/new     Create new listing (seller)
├── /settings            Settings
├── /help-support        Help & support
├── /find-vehicle        Find vehicles
├── /find-vehicle/:id    Vehicle detail
├── /saved               Saved vehicles
├── /bids                My bids
└── /compare             Compare vehicles
```

---

## Authentication & Auth Flow

### Login (`/auth/login`)
- Email or username + password authentication
- Form validation

### Register (`/auth/register`)
- Sign up with firstName, lastName, email, username, password
- Role selection: buyer, seller, admin, guest

### Email Verification (`/auth/verify-email`)
- Token-based email verification
- Code exchange flow

### Password Reset (`/auth/forgot-password`, `/auth/reset-password`)
- Request reset email
- Token-based password reset with code exchange

### OAuth (`/auth/callback`)
- Google and Facebook OAuth callback handling
- Code-to-token exchange

### Auth State (Zustand)
- Access/refresh token persistence (localStorage)
- Token validation and expiration checking
- User profile storage
- Logout clears all state

---

## Layout & Navigation

### App Layout
- Collapsible sidebar (left) + top navbar + main content area
- Role-based menu items in sidebar

### Sidebar
- **Main**: Dashboard, Messages (unread badge), Wallet
- **Seller only**: My Listings, New Listing
- **Vehicles**: Find Vehicle, Saved, My Bids, Compare
- **Bottom**: Settings, Help & Support
- Collapse/expand toggle

### Navbar
- Notification bell with unread badge and dropdown
- User avatar with dropdown menu (Settings, Logout)

---

## Dashboard (`/dashboard`)

### Seller View
- Stats cards: active listings, total bids received, pending offers, total revenue
- Recent listings with status badges and quick actions
- Recent activity feed
- Seller rating display
- Quick actions: New Listing, Edit Profile

### Buyer View
- Stats cards (collapsible): active bids, saved vehicles, total spent, wallet balance (with frozen balance indicator)
- Recent bids table with vehicle thumbnail, bid amount, status badge, relative date
- Recently saved vehicles grid (2x2 cards with images, price, mileage)
- Bid activity panel: total/pending/accepted/rejected counts with success rate progress bar
- Spending summary: total spent, wallet balance, frozen balance
- Quick actions: Find Vehicles, My Bids, View Saved, Messages

---

## Vehicle Listings

### Find Vehicles (`/find-vehicle`)
- Advanced search with 15+ filter types
- Filter sidebar: search, type, condition, fuel, transmission, color, year range, price range, mileage range
- Sort: newest, price, year, mileage
- Grid and list view toggle
- Active filter chips with removal
- Quick View modal
- Save/unsave toggle
- Pagination (12 per page)

### Vehicle Detail (`/find-vehicle/:id`)
- Full specifications display
- Image gallery
- Similar vehicles carousel (4 vehicles)
- Save/unsave toggle
- Bid placement form (buyers)
- Contact seller button navigates to `/messages/{sellerId}?vehicleId={vehicleId}` (disabled with gray styling for seller accounts, with hint text: "Only buyer accounts can contact sellers.")
- Owner information

### My Listings (`/my-listings`) - Seller Only
- All seller's listings with pagination
- Listing cards: thumbnail, details, price, status badge, bid count
- Actions per listing: edit, deactivate/reactivate, mark as sold, delete
- Empty state

### Create Listing (`/my-listings/new`) - Seller Only
- 5-step form:
  1. **Basic Info** - make, model, year, type, condition, trim, engine specs
  2. **Details** - transmission, drive type, colors, mileage, VIN
  3. **Features** - 20 comfort features + 12 safety features (toggleable), custom features
  4. **Photos** - Multi-image upload (max 20), drag-and-drop, Cloudinary integration
  5. **Pricing** - price input, description

---

## Bidding System (`/bids`)

### Placed Bids Tab (All Users)
- List of placed bids with vehicle info, amount, status, timestamp
- Filter by status: All, Pending, Accepted, Rejected, Withdrawn
- Search bids by vehicle name
- Sort: newest, oldest, highest, lowest amount
- Bid statistics summary
- Withdraw bid action
- Pagination (20 per page)

### Received Bids Tab (Sellers)
- All received bids on seller's listings
- Same filtering, searching, sorting
- Accept bid action
- Reject bid with reason modal
- Buyer information displayed

### Bid Placement
- Quick bid form on vehicle detail page
- Amount input with validation

---

## Saved Vehicles (`/saved`)

- Paginated grid of saved vehicles (12 per page)
- Save/unsave toggle
- Total saved count
- Empty state

---

## Vehicle Comparison (`/compare`)

- Compare up to 4 vehicles side-by-side
- Search modal to add vehicles
- Empty slot cards to add more
- Comparison table: specifications, pricing, features, performance
- Similarity metrics
- Clear all functionality
- Persisted in localStorage

---

## Messages (`/messages/:sellerId?`)

- Conversation list with last message preview, vehicle info, unread badge
- Message thread view (chronological, paginated 50/page)
- Send message / reply form
- Deep-link from vehicle detail: "Contact Seller" navigates to `/messages/{sellerId}?vehicleId={vehicleId}`
  - Auto-selects matching conversation (by sellerId + vehicleId) and focuses the input
  - If no existing conversation, shows "New Conversation" panel; first message creates the conversation via API
  - Error banner displayed above input on send failure
- Unread badge in sidebar
- Refresh on window focus

---

## Wallet (`/wallet`)

### Balance
- Current wallet balance display
- Last updated timestamp

### Deposit & Withdrawal
- Deposit modal (card to wallet)
- Withdrawal modal (wallet to card)
- Balance validation

### Card Management
- Add card modal (card number, holder name, expiry, CVV)
- View connected card details
- Delete card
- Top-up card balance

### Transaction History
- Paginated list (20 per page)
- Types: Deposit, Withdrawal, Top-up
- Amount, timestamp, status

---

## Settings (`/settings`)

### Profile Tab
- Edit: first name, last name, username, email, phone, address, bio
- Personal information values displayed in original case (lowercase)
- Save changes with validation

### Security Tab
- Change password (current + new + confirm)
- Active sessions list
- Logout all sessions

### Notifications Tab
- Toggle preferences: message alerts, bid alerts, newsletter, promotional emails
- Quiet hours (start/end time)

### Preferences Tab
- Currency, language, date format, theme selection
- Privacy and data collection settings

### Danger Zone
- Delete account with password confirmation

---

## Notifications

- Bell icon in navbar with unread count badge
- Dropdown panel (up to 20 notifications)
- Types: new message, bid placed, bid accepted, bid rejected, bid withdrawn
- Mark individual / mark all as read
- Quiet hours support
- Polling: on mount, on window focus, on tab visibility, background interval (60s)
- Persisted in localStorage (max 50)

---

## Help & Support (`/help-support`)

- FAQ section
- Contact form
- Support categories
- Common issues and solutions

---

## State Management (Zustand Stores)

### Auth Store (`auth.store.ts`)
- user, accessToken, refreshToken, isAuthenticated
- setTokens(), setUsers(), logout(), isTokenValid()
- Persisted via localStorage

### Compare Store (`compare.store.ts`)
- Vehicle IDs and details for comparison
- Add/remove/clear operations
- Loading and error states
- Persisted via localStorage

### Notifications Store (`notifications.store.ts`)
- Notifications array (max 50)
- Preferences (message alerts, bid alerts, quiet hours)
- Unread count, mark read, fetch from API

---

## API Services

| File                   | Functions                                                              |
|------------------------|------------------------------------------------------------------------|
| `auth.api.ts`          | login, register, forgotPassword, resetPassword, oauthExchange, verifyEmail, resendVerification |
| `vehicles.api.ts`      | getVehicles, getFeatured, getById, getSimilar, getMyListings, create, update, deactivate, reactivate, markSold, delete |
| `bids.api.ts`          | placeBid, getMyBids, withdrawBid, getVehicleBids, getReceivedBids, acceptBid, rejectBid |
| `messages.api.ts`      | startConversation, reply, getConversations, getMessages              |
| `wallet.api.ts`        | getWallet, deposit, withdraw, getTransactions, getCard, addCard, deleteCard, topUpCard |
| `saved-vehicles.api.ts`| save, unsave, getSaved, checkIsSaved                                  |
| `dashboard.api.ts`     | getDashboardStats, getSellerStats, getBuyerStats                      |
| `users.api.ts`         | getMyProfile, updateProfile, changePassword, deleteAccount            |
| `upload.api.ts`        | uploadImage, uploadImages, deleteImage                                |

---

## Custom Hooks

| Hook                | Purpose                                              |
|---------------------|------------------------------------------------------|
| `useCompareActions` | Manage comparison vehicles, search modal, loading    |
| `useBidActions`     | Accept/reject bids, loading, data revalidation       |
| `useListingActions` | Deactivate/reactivate/sold/delete listings           |
| `useWithdrawBid`    | Withdraw placed bid with loading state               |
| `useSaveVehicle`    | Save/unsave vehicle with optimistic updates          |

---

## Feature Matrix

| Feature                        | Buyer | Seller | Admin |
|--------------------------------|-------|--------|-------|
| Search & filter vehicles       | Yes   | Yes    | Yes   |
| View vehicle details           | Yes   | Yes    | Yes   |
| Save vehicles                  | Yes   | Yes    | Yes   |
| Compare vehicles (up to 4)     | Yes   | Yes    | Yes   |
| Place bids                     | Yes   | No     | Yes   |
| View placed bids               | Yes   | No     | Yes   |
| Withdraw bids                  | Yes   | No     | Yes   |
| Create listings                | No    | Yes    | Yes   |
| Manage listings                | No    | Yes    | Yes   |
| Receive & manage bids          | No    | Yes    | Yes   |
| Messages                       | Yes   | Yes    | Yes   |
| Wallet & transactions          | Yes   | Yes    | Yes   |
| Dashboard stats                | Yes   | Yes    | Yes   |
| Settings & profile             | Yes   | Yes    | Yes   |
| Notifications                  | Yes   | Yes    | Yes   |
