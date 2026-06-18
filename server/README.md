# 🏛️ Pavilion — API Server

> **A production-grade REST API** powering India's premium travel platform.  
> Built on a secure-by-default, fail-fast architecture with JWT authentication, role-based access control, and full Mongoose ODM integration.

---

## ⚡ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Runtime** | Node.js (ESM) | ≥ 18 |
| **Framework** | Express | ^4.19 |
| **Database** | MongoDB + Mongoose | ^9.5 |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | ^9.0 |
| **Password Hashing** | bcryptjs | ^3.0 |
| **Security Headers** | Helmet | ^8.2 |
| **Rate Limiting** | express-rate-limit | ^8.5 |
| **Validation** | express-validator | ^7.3 |
| **Cookie Parsing** | cookie-parser | ^1.4 |
| **Dev Server** | Nodemon | ^3.1 |

---

## 🔒 Core Security Features

### 1 — Fail-Fast JWT Architecture

The `JWT_SECRET` environment variable is validated **at module load time** inside [`middleware/authMiddleware.js`](./middleware/authMiddleware.js), before any request is processed:

```js
// authMiddleware.js — top-level guard (server crashes immediately if missing)
if (!process.env.JWT_SECRET) {
  throw new Error('CRITICAL CONFIG ERROR: JWT_SECRET environment variable is missing!');
}
```

The `protect` middleware enforces a strict **4-step verification chain** on every protected route:

| Step | Check |
|---|---|
| **1** | Extract Bearer token from `Authorization` header |
| **2** | Verify signature & expiry with `jwt.verify()` |
| **3** | Confirm the user still exists in the database |
| **4** | Detect password changes after token issuance via `changedPasswordAfter()` |

Any failure at any step short-circuits the chain and returns a `401 Unauthorized` response — **no silent pass-throughs**.

---

### 2 — Helmet HTTP Security Headers

[Helmet](https://helmetjs.github.io/) is mounted globally in [`server.js`](./server.js) and automatically sets **15+ secure HTTP headers** on every response, including:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (HSTS)
- `X-XSS-Protection`

```js
// server.js
app.use(helmet());
```

---

### 3 — Rate Limiting — Brute-Force Protection

A sliding-window rate limiter is applied to the **entire `/api/` namespace**:

```js
// server.js
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', apiLimiter);
```

| Parameter | Value | Effect |
|---|---|---|
| `windowMs` | 15 minutes | Rolling time window |
| `max` | 200 requests | Hard ceiling per IP |
| Scope | `/api/*` | All API routes protected |

When a client exceeds the limit they receive a `429 Too Many Requests` response automatically — no custom handler required.

---

### 4 — Role-Based Access Control (RBAC)

The `restrictTo(...roles)` middleware factory enforces granular RBAC at the route level:

```js
// Usage in any route file
router.use(protect, restrictTo('admin'));
```

All write operations (`POST`, `PATCH`, `DELETE`) on sensitive resources (`/api/tours`, `/api/destinations`, `/api/stats`) are gated behind the `admin` role.

---

## 🗺️ API Architecture & Endpoint Map

> **Base URL:** `http://localhost:5000/api`  
> **Content-Type:** `application/json`  
> **Auth header:** `Authorization: Bearer <access_token>`

---

### 🔑 `/api/auth` — Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Create a new user account |
| `POST` | `/login` | Public | Authenticate and receive access token |
| `POST` | `/logout` | Public | Clear the httpOnly refresh-token cookie |
| `POST` | `/refresh-token` | Public | Issue a new access token via refresh cookie |
| `GET` | `/me` | 🔒 User | Fetch the currently authenticated user profile |
| `PATCH` | `/update-me` | 🔒 User | Update name, email, or password for current user |

---

### 🗺️ `/api/tours` — Tour Packages

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | List all tours with filtering, sorting & pagination |
| `GET` | `/featured` | Public | Retrieve up to 6 featured/highlighted tours |
| `GET` | `/id/:id` | Public | Fetch a single tour by its MongoDB `_id` |
| `GET` | `/:slug` | Public | Fetch tour detail by URL-friendly slug |
| `POST` | `/` | 🛡️ Admin | Create a new tour package |
| `PATCH` | `/:id` | 🛡️ Admin | Update an existing tour's details |
| `DELETE` | `/:id` | 🛡️ Admin | Soft-delete a tour (marks inactive) |

---

### 📍 `/api/destinations` — Destinations

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | List all destinations with filtering & pagination |
| `GET` | `/search?q=` | Public | Full-text search across destination names & tags |
| `GET` | `/region/:region` | Public | Filter destinations by geographic region |
| `GET` | `/:slug` | Public | Destination detail page including nearby tours |
| `POST` | `/` | 🛡️ Admin | Create a new destination |
| `PATCH` | `/:id` | 🛡️ Admin | Update destination metadata |
| `DELETE` | `/:id` | 🛡️ Admin | Remove a destination |

---

### 🗓️ `/api/bookings` — Bookings

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | 🔒 User | Create a new booking for a tour |
| `GET` | `/my` | 🔒 User | Retrieve all bookings for the logged-in user |
| `PATCH` | `/:id/cancel` | 🔒 User | Cancel an active booking |
| `GET` | `/` | 🛡️ Admin | Retrieve all platform bookings |
| `PATCH` | `/:id/status` | 🛡️ Admin | Update booking status (confirmed / cancelled / completed) |

---

### ⭐ `/api/reviews` — Reviews

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/tour/:tourId` | Public | Fetch all reviews for a specific tour |
| `POST` | `/` | 🔒 User | Submit a new review for a completed tour |
| `PATCH` | `/:id` | 🔒 User | Edit your own review |
| `DELETE` | `/:id` | 🔒 User | Delete your own review |

---

### 📊 `/api/stats` — Admin Dashboard

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | 🛡️ Admin | Aggregate dashboard stats (total bookings, revenue, top tours, users) |

---

### 🩺 `/api/health` — Health Check

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Server uptime & mode check — safe for load-balancer pings |

---

## 🛡️ Robust Error Handling

The error handling system consists of three co-operating layers.

### Layer 1 — `AppError` Factory Class (`utils/AppError.js`)

`AppError` extends the native `Error` class with HTTP semantics. Every thrown error carries a `statusCode`, `status` (`'fail'` for 4xx / `'error'` for 5xx), an `errorCode` slug, and an `isOperational` flag that distinguishes **known, safe errors** from programming bugs.

**Factory methods** make call-sites expressive and consistent:

```js
AppError.notFound('Tour')           // → 404 NOT_FOUND
AppError.unauthorized('Login.')     // → 401 UNAUTHORIZED
AppError.forbidden('Admins only.')  // → 403 FORBIDDEN
AppError.badRequest('Invalid ID.')  // → 400 BAD_REQUEST
AppError.validationError('…', {})   // → 422 VALIDATION_ERROR (with field map)
AppError.conflict('Email taken.')   // → 409 CONFLICT
AppError.internal('Uh oh.')         // → 500 INTERNAL_ERROR
```

---

### Layer 2 — `handleMongooseErrors` Middleware

Sits directly before the main error handler in `server.js`. Transparently converts low-level Mongoose errors into `AppError`-compatible operational errors so they reach the client cleanly:

| Mongoose Error | HTTP Status | Message |
|---|---|---|
| `CastError` (bad ObjectId) | `400` | `Invalid <path>: <value>` |
| `code 11000` (duplicate key) | `409` | `Duplicate value for field: <field>` |
| `ValidationError` | `422` | Concatenated validation messages |
| `JsonWebTokenError` | `401` | `Invalid token. Please log in again.` |
| `TokenExpiredError` | `401` | `Your session has expired. Please log in again.` |

---

### Layer 3 — `errorHandler` Central Middleware

The terminal error handler applies **environment-aware responses**:

| Environment | Operational Error | Programming Error |
|---|---|---|
| **Development** | Full detail: message, stack, errorCode, fields | Full detail (same) |
| **Production** | Safe JSON: `{ status, message, errorCode? }` | Generic `500` — details hidden from client |

This ensures **no internal stack traces or implementation details ever leak** to production clients.

---

### Unhandled Route Catch-All

Any request that falls through all registered routes hits a global wildcard handler:

```js
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server.`, 404));
});
```

---

## 🚀 Local Setup & Development

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 18 (ESM support required) |
| MongoDB | Local ≥ 6.x **or** a MongoDB Atlas URI |
| npm | ≥ 9 |

---

### Step 1 — Clone & Install

```bash
# From the repository root
cd server
npm install
```

---

### Step 2 — Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Port the Express server listens on (default: `5000`) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `MONGODB_URI` | ✅ | Local (`mongodb://localhost:27017/pavilion`) or Atlas URI |
| `JWT_SECRET` | ✅ | Long, random secret string — **minimum 32 characters** |
| `JWT_EXPIRES_IN` | ✅ | Token lifetime e.g. `7d`, `90d` |
| `GOOGLE_API_KEY` | ⬜ Optional | Enables Google Geocoding API for accurate coordinates |
| `CLOUDINARY_*` | ⬜ Optional | Image upload support (future feature) |
| `EMAIL_*` | ⬜ Optional | SMTP config for booking confirmation emails (future feature) |

> [!CAUTION]
> **Never commit your `.env` file.** It is already listed in `.gitignore`. Use strong, randomly-generated values for `JWT_SECRET` in production — never use the placeholder from `.env.example`.

---

### Step 3 — Run the Development Server

```bash
npm run dev
```

A successful startup prints:

```
════════════════════════════════════════════════════════════
  🏛️  Pavilion API Server — Starting...
────────────────────────────────────────────────────────────
  ✅ MongoDB connected [🏠  Local MongoDB]: 127.0.0.1
     Database : pavilion
────────────────────────────────────────────────────────────
  Port:      5000
  Mode:      development
  Geocoding: ✅ Google API
────────────────────────────────────────────────────────────
  Routes:
    POST   /api/auth/register
    POST   /api/auth/login
    ...
════════════════════════════════════════════════════════════
```

---

### Available Scripts

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Starts server with Nodemon hot-reload |
| Production | `npm start` | Runs `node server.js` directly |

---

## 📁 Project Structure

```
server/
├── controllers/
│   ├── authController.js         # Register, login, logout, token refresh
│   ├── bookingController.js      # Create, view, cancel, status-update bookings
│   ├── destinationController.js  # CRUD + text search + region filter
│   ├── reviewController.js       # Tour reviews — create, update, delete
│   ├── statsController.js        # Admin dashboard aggregations
│   ├── tourController.js         # CRUD + featured + slug lookup
│   └── userController.js         # User management helpers
├── middleware/
│   ├── authMiddleware.js         # protect() + restrictTo() RBAC guards
│   ├── errorMiddleware.js        # Mongoose error normaliser + global handler
│   └── validationMiddleware.js   # express-validator request validation
├── models/
│   ├── Booking.js                # Booking schema with status lifecycle
│   ├── Destination.js            # Destination schema with geo + region
│   ├── Review.js                 # Review schema (1 review per user per tour)
│   ├── Tour.js                   # Tour schema with slug + soft-delete
│   └── User.js                   # User schema with password change tracking
├── routes/
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── destinationRoutes.js
│   ├── reviewRoutes.js
│   ├── statsRoutes.js
│   ├── tourRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── AppError.js               # Custom error class with factory methods
│   ├── HttpError.js              # Lightweight HTTP error helper
│   └── geocode.js                # Google Geocoding API integration
├── seeds/                        # Database seed scripts
├── db.js                         # MongoDB connection with retry logic
├── server.js                     # Application entry point
├── .env.example                  # Environment variable template
└── package.json
```

---

## 🔄 Graceful Shutdown

The server handles `SIGINT` and `SIGTERM` signals by closing the MongoDB connection cleanly before exiting — safe for containerised and cloud deployments:

```bash
# Ctrl+C or kill signal → triggers:
📴  SIGINT received. Shutting down gracefully...
🔌  MongoDB connection closed gracefully.
```

Unhandled promise rejections are also caught globally and cause an **immediate, logged `process.exit(1)`** to prevent silent undefined states in production.

---

<div align="center">

**Pavilion API v2.0.0** · Built with Express & MongoDB · ISC License

</div>
