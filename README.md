# ShopSphere

A full-stack e-commerce web application built as a portfolio project. Features a product catalog, shopping cart, Stripe checkout, JWT authentication, and order history with email confirmation.

**Live demo:** https://shop-sphere-eight-zeta.vercel.app

---

## Features

- Browse product catalog with individual product pages
- Add items to cart (persisted in localStorage)
- Secure checkout powered by Stripe (test mode)
- JWT-based authentication — register, login, logout
- Order history in user account
- Order confirmation email via Resend
- Responsive design

## Tech Stack

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication (jsonwebtoken)
- Input validation with Zod
- Stripe for payments
- Resend for transactional email
- Jest + Supertest + mongodb-memory-server for tests

**Frontend**
- React + TypeScript + Vite
- React Query for server state
- Context API for auth and cart
- Axios
- CSS Modules

**Infrastructure**
- Backend: [Render](https://render.com)
- Frontend: [Vercel](https://vercel.com)
- Database: [MongoDB Atlas](https://cloud.mongodb.com)

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (test keys)

### Installation

```bash
# Clone the repository
git clone https://github.com/vitalychernov/shop-sphere.git
cd shop-sphere

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopsphere
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=re_...        # optional — emails are skipped if not set
```

Create `frontend/.env.local`:

```env
VITE_API_URL=                # leave empty to use Vite proxy in development
```

### Seed the Database

```bash
cd backend
npm run seed
```

This creates 4 demo products in the database.

### Run Locally

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev
```

### Stripe Webhook (local)

To test Stripe payments locally, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to http://localhost:5000/api/stripe/webhook
```

Use Stripe test card `4242 4242 4242 4242` with any future expiry and any CVC.

---

## Running Tests

```bash
cd backend
npm test
```

Test suite includes:
- **Unit tests** — `AuthService` (register, login, error cases)
- **Integration tests** — Auth endpoints, Products API, Order flow

Tests use an in-memory MongoDB instance (no real database required).

---

## Project Structure

```
shop-sphere/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Express app factory
│   │   ├── server.ts           # Entry point
│   │   ├── config/             # env, database
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth, error handling
│   │   └── validators/         # Zod schemas
│   ├── tests/
│   │   ├── unit/               # Service-level unit tests
│   │   ├── integration/        # HTTP endpoint tests
│   │   └── helpers/            # Test DB helpers
│   └── scripts/
│       └── seed.ts             # Database seed script
└── frontend/
    └── src/
        ├── api/                # Axios API clients
        ├── components/         # Shared components
        ├── context/            # Auth and Cart context
        ├── hooks/              # Custom React hooks
        └── pages/              # Page components
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| PUT | `/api/auth/password` | JWT | Change password |
| GET | `/api/products` | — | List all products |
| GET | `/api/products/:slug` | — | Get product by slug |
| POST | `/api/orders` | JWT | Create order |
| GET | `/api/orders/my` | JWT | Get my orders |
| POST | `/api/stripe/checkout` | JWT | Create Stripe payment intent |
| POST | `/api/stripe/webhook` | Stripe | Handle payment events |

---

## Deployment

The app is deployed with zero-downtime automatic deploys on every push to `main`.

- **Render** (backend): connect GitHub repo → set environment variables → deploy
- **Vercel** (frontend): connect GitHub repo → set `VITE_API_URL` to the Render URL → deploy
- **MongoDB Atlas**: free M0 cluster, whitelist `0.0.0.0/0` for Render compatibility
