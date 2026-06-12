# PAVILION

Welcome to **PAVILION** — a polished travel web platform built with a modern MERN-style stack.

> A destination discovery and booking experience with React, Vite, Express, MongoDB, JWT auth, and admin-ready APIs.

---

## 🚀 Why Pavilion?

PAVILION is designed to showcase a full-stack travel application:

- **Sleek React frontend** with TypeScript and Vite
- **Robust Express backend** with clean REST APIs
- **MongoDB data models** for tours, destinations, bookings, and users
- **JWT-based authentication** with refresh tokens in secure cookies
- **Admin-ready stat/report endpoints** for easy dashboarding

---

## 🌟 What’s included

### Frontend (`client/`)

- React + TypeScript + Vite
- Responsive UI for tours, destinations, booking flow, and user profile
- Public assets in `client/public/`
- Local development with HMR

### Backend (`server/`)

- Express API routes for auth, tours, destinations, bookings, stats, and more
- Mongoose models with validation and relations
- Error handling middleware and graceful shutdown
- Seed data and helper scripts for demo content

### Root repo

- `package.json` with convenience scripts
- Monorepo-style workflow for client + server
- Standard `.gitignore` rules to keep secrets and generated files out of GitHub

---

## ⚡ Quick start

```bash
npm run install:all
npm run dev
```

Then open the client app in your browser at:

- `http://localhost:5173`

The backend listens on:

- `http://localhost:5000`

---

## 🧰 Run only one service

```bash
# Server only
cd server
npm install
npm run dev

# Client only
cd client
npm install
npm run dev
```

---

## 🔧 Build for production

```bash
npm run build
```

This compiles the frontend into `client/dist/`.

---

## 🔐 Environment variables

Create local `.env` files and do not commit them. The server needs at least:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — access token secret
- `JWT_REFRESH_SECRET` — refresh token secret
- `GOOGLE_API_KEY` — optional geocoding support
- `PORT` — optional server port (default `5000`)

Client: no required env variables for the demo. See `client/.env.example`.

---

## ✅ GitHub-ready notes

Keep these files in the repository:

- `client/src/`
- `client/public/`
- `client/package.json`
- `server/` source files
- `data/`, `seeds/`
- root `package.json`
- `README.md`
- docs like `MAPMODAL_COMPLETE.md` and `MAPMODAL_SUMMARY.md`

Ignore these via `.gitignore`:

- `node_modules/`
- `client/dist/`
- `*.tsbuildinfo`
- local `.env` files
- editor caches and OS junk

---

## 💡 Want to share this project?

This repo is ready for GitHub presentation. To make it even stronger, add:

- `LICENSE` (MIT or similar)
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- Screenshots or demo GIFs

---

## 📌 Notes

- This is a demo/prototype platform for travel listings and booking workflows.
- The backend includes JWT auth and secure refresh token handling.
- The frontend is built for fast iteration with Vite hot reload.

---

## 📝 Summary

PAVILION is a modern travel app stack with frontend, backend, auth, and content management ready for a GitHub showcase.

> Developer-ready. Share-ready. Showcase-ready.

