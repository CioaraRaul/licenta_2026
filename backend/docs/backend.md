# Backend - AutoVault API

## Tech Stack

- **Framework**: NestJS
- **Database**: SQLite (TypeORM, better-sqlite3)
- **Auth**: JWT (access + refresh tokens), Passport.js
- **OAuth**: Google, Facebook
- **Email**: Nodemailer (SMTP)
- **Image Upload**: Cloudinary
- **Port**: 3000

---

## Module Structure

```
src/
├── users/          (User management & authentication)
├── vehicles/       (Vehicle listings)
├── bids/           (Bidding system)
├── messages/       (Messaging between buyers & sellers)
├── wallet/         (Wallet, cards & transactions)
├── saved-vehicles/ (Favorites / wishlist)
├── upload/         (Image upload via Cloudinary)
├── dashboard/      (Analytics & statistics)
└── app.module.ts   (Root module)
```

---

## Authentication (auth)

### Endpoints

| Method | Route                          | Auth | Description                        |
|--------|--------------------------------|------|------------------------------------|
| POST   | /auth/signup                   | No   | Register new account               |
| POST   | /auth/signin                   | No   | Login with email/username          |
| POST   | /auth/verify-email             | No   | Verify email with token            |
| POST   | /auth/resend-verification      | No   | Resend verification email          |
| GET    | /auth/verify/exchange          | No   | Exchange verification code         |
| GET    | /auth/me                       | JWT  | Get current user                   |
| POST   | /auth/logout                   | JWT  | Logout (blacklist token)           |
| POST   | /auth/refresh                  | RT   | Refresh JWT tokens                 |
| POST   | /auth/revoke-sessions          | JWT  | Revoke all sessions                |
| POST   | /auth/forgot-password          | No   | Request password reset             |
| POST   | /auth/reset-password           | No   | Reset password with token          |
| POST   | /auth/verify-reset-token       | No   | Validate reset token               |
| GET    | /auth/reset/exchange           | No   | Exchange reset code                |
| POST   | /auth/change-password          | JWT  | Change password                    |
| PATCH  | /auth/account/deactivate       | JWT  | Deactivate account                 |
| POST   | /auth/account/reactivate       | No   | Reactivate by email                |
| PATCH  | /auth/account/reactivate       | JWT  | Reactivate (authenticated)         |
| DELETE | /auth/account/delete           | JWT  | Delete account (rate-limited)      |
| GET    | /auth/google                   | No   | Initiate Google OAuth              |
| GET    | /auth/google/callback          | No   | Google OAuth callback              |
| GET    | /auth/facebook                 | No   | Initiate Facebook OAuth            |
| GET    | /auth/facebook/callback        | No   | Facebook OAuth callback            |
| GET    | /auth/oauth/exchange           | No   | Exchange OAuth code for tokens     |

### Guards

- **JwtAuthGuard** - Validates JWT bearer token, checks blacklist and session revocation
- **RefreshJWTAuthGuard** - Validates refresh token
- **GoogleAuthGuard** - Passport strategy for Google OAuth
- **FacebookAuthGuard** - Passport strategy for Facebook OAuth

### Security Features

- JWT access + refresh tokens
- Token blacklisting on logout
- Session revocation
- Bcrypt (scrypt) password hashing
- Email verification with temporary code exchange
- Rate limiting on account deletion (1/min)

---

## User Management (user)

### Endpoints

| Method | Route          | Auth | Description          |
|--------|----------------|------|----------------------|
| PATCH  | /user/profile  | JWT  | Update user profile  |

### User Roles

`ADMIN`, `BUYER`, `SELLER`, `GUEST`

### Role-Specific Entities

- **Buyer** - walletBalance, currency, bankAccountIBAN, totalSpent, totalCarsBought, favoriteCarBrands, receiveCarAlerts
- **Seller** - walletBalance, currency, bankAccountIBAN, totalEarnings, pendingBalance, totalCarsSold, sellerRating, totalReviews, companyName, isVerifiedSeller, commissionRate
- **Admin** - Admin role entity
- **Guest** - Guest role entity

---

## Vehicles (vehicles)

### Endpoints

| Method | Route                       | Auth | Description              |
|--------|-----------------------------|------|--------------------------|
| POST   | /vehicles                   | JWT  | Create listing           |
| GET    | /vehicles                   | No   | Get all (with filters)   |
| GET    | /vehicles/:id               | No   | Get single vehicle       |
| PATCH  | /vehicles/:id               | JWT  | Update listing           |
| PATCH  | /vehicles/:id/deactivate    | JWT  | Deactivate listing       |
| PATCH  | /vehicles/:id/sold          | JWT  | Mark as sold             |
| DELETE | /vehicles/:id               | JWT  | Delete listing           |
| GET    | /vehicles/featured          | No   | Get featured vehicles    |
| GET    | /vehicles/my/listings       | JWT  | Get seller's listings    |
| GET    | /vehicles/:id/similar       | No   | Get similar vehicles     |

### Filtering

Search, make, model, type, year range, price range, mileage range, fuel type, transmission, drive type, location, exterior color, condition, pagination, sorting.

### Enums

- **VehicleType**: CAR, SUV, TRUCK, VAN, MOTORCYCLE, SPORTS_CAR
- **VehicleCondition**: NEW, USED, CERTIFIED_PRE_OWNED
- **VehicleStatus**: AVAILABLE, PENDING, SOLD, RESERVED
- **FuelType**: GASOLINE, DIESEL, ELECTRIC, HYBRID, PLUGIN_HYBRID
- **Transmission**: MANUAL, AUTOMATIC, SEMI_AUTOMATIC
- **DriveType**: FWD, RWD, AWD, 4WD

---

## Bids (bids)

### Endpoints

| Method | Route                     | Auth | Description                |
|--------|---------------------------|------|----------------------------|
| POST   | /bids/:vehicleId          | JWT  | Place bid                  |
| GET    | /bids/received            | JWT  | Get received bids (seller) |
| GET    | /bids/my                  | JWT  | Get placed bids (buyer)    |
| GET    | /bids/vehicle/:vehicleId  | JWT  | Get bids on vehicle        |
| PATCH  | /bids/:bidId/accept       | JWT  | Accept bid                 |
| PATCH  | /bids/:bidId/reject       | JWT  | Reject bid with reason     |
| PATCH  | /bids/:bidId/withdraw     | JWT  | Withdraw bid               |

### Bid Status

`PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`, `EXPIRED`

---

## Messages (messages)

### Endpoints

| Method | Route                              | Auth | Description                     |
|--------|-------------------------------------|------|---------------------------------|
| POST   | /messages/vehicle/:vehicleId       | JWT  | Send first message to seller    |
| POST   | /messages/:conversationId/reply    | JWT  | Reply in conversation           |
| GET    | /messages                          | JWT  | Get all conversations           |
| GET    | /messages/:conversationId          | JWT  | Get messages in conversation    |

### Entities

- **Conversation** - buyerId, sellerId, vehicleId, unreadCount, lastMessage, unique constraint per (buyer, seller, vehicle)
- **Message** - content, status (SENT/READ), senderId, conversationId

---

## Saved Vehicles (saved-vehicles)

### Endpoints

| Method | Route                            | Auth | Description              |
|--------|----------------------------------|------|--------------------------|
| POST   | /saved-vehicles/:vehicleId      | JWT  | Save vehicle             |
| DELETE | /saved-vehicles/:vehicleId      | JWT  | Unsave vehicle           |
| GET    | /saved-vehicles                 | JWT  | Get saved (paginated)    |
| GET    | /saved-vehicles/check/:vehicleId| JWT  | Check if saved           |

---

## Wallet (wallet)

### Endpoints

| Method | Route                 | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| GET    | /wallet               | JWT  | Get wallet balance       |
| POST   | /wallet/deposit       | JWT  | Deposit from card        |
| POST   | /wallet/withdraw      | JWT  | Withdraw to card         |
| GET    | /wallet/transactions  | JWT  | Transaction history      |
| GET    | /wallet/card          | JWT  | Get saved card           |
| POST   | /wallet/card          | JWT  | Add card                 |
| DELETE | /wallet/card          | JWT  | Delete card              |
| POST   | /wallet/card/topup    | JWT  | Top up card balance      |

### Entities

- **Wallet** - balance, frozenBalance (for pending bids)
- **Card** - last4, cardHolderName, expiryMonth/Year, cardType (visa/mastercard), balance
- **Transaction** - amount, type, status, description, referenceId

### Enums

- **TransactionType**: DEPOSIT, WITHDRAWAL, PAYMENT, REFUND, COMMISSION
- **TransactionStatus**: PENDING, COMPLETED, FAILED, CANCELLED

---

## Upload (upload)

### Endpoints

| Method | Route                       | Auth | Description                    |
|--------|-----------------------------|------|--------------------------------|
| POST   | /upload/image               | JWT  | Upload single image            |
| POST   | /upload/images              | JWT  | Upload multiple (max 20)       |
| POST   | /upload/images/:vehicleId   | JWT  | Upload for specific vehicle    |
| DELETE | /upload/:publicId           | JWT  | Delete image                   |

- Validates MIME types (JPEG, PNG, WebP)
- Max file size: 10MB
- Auto-transforms: 1920x1080 limit, auto quality, WebP conversion
- Cloudinary folder organization: `autovault/vehicles/{vehicleId}`

---

## Dashboard (dashboard)

### Endpoints

| Method | Route                     | Auth | Description              |
|--------|---------------------------|------|--------------------------|
| GET    | /dashboard/stats          | JWT  | Role-aware stats         |
| GET    | /dashboard/stats/seller   | JWT  | Seller stats             |
| GET    | /dashboard/stats/buyer    | JWT  | Buyer stats              |

### Seller Stats

Total listings (by status), active/sold/pending listings, total bids received, pending bids, total views, total revenue.

### Buyer Stats

Total saved vehicles, total bids placed, pending/accepted/rejected bids, total spending.

---

## Database Relationships

```
User (1:1) → Buyer | Seller | Admin | Guest
User (1:N) → Vehicle (sellerId)
User (1:N) → Bid (buyerId)
User (1:N) → Message (senderId)
User (1:N) → Conversation (buyerId, sellerId)
User (1:N) → SavedVehicle (userId)
User (1:1) → Wallet
User (1:1) → Card
User (1:N) → Transaction (userId)
Vehicle (1:N) → Bid (vehicleId)
Vehicle (1:N) → SavedVehicle (vehicleId)
Vehicle (1:N) → Conversation (vehicleId)
Conversation (1:N) → Message
```

---

## Global Configuration

- **ValidationPipe** - whitelist, transform, forbid non-whitelisted
- **CORS** - configurable origin, credentials enabled
- **Database** - SQLite with WAL mode, auto-sync in dev
