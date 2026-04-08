# Security-First Auth Monorepo 🚀

A production-ready, full-stack, monorepo template built from the ground up prioritizing identity security, RBAC (Role-Based Access Control), and serverless execution boundaries.

🔗 **Live Portal**: [auth-portal-yda123.web.app](https://auth-portal-yda123.web.app/)

---

## 🏗️ Architecture

This repository operates strictly using a **Turborepo** + **PMNP Workspaces** monorepo split:

- **Frontend (`apps/frontend`)**: Fully static Next.js App Router UI (`output: 'export'`) configured to deploy straight to a CDN via **Firebase Hosting**.
- **Backend (`apps/backend`)**: Full Express.js Node API enforcing JWT mapping and Postgres bindings directly wrapped inside **Firebase Functions**.
- **Identity (`Firebase Auth`)**: Intercepts email credentials and safely relays JWT signatures to the backend.
- **Relational Data (`PostgreSQL + Prisma`)**: Handles deterministic relational tables for robust RBAC and session manipulation.
- **Storage (`Firebase Storage`)**: Accepts native form-data Blob streams natively uploaded by the backend.

## 🔐 Security Standards Implemented

- **Backend-Native Authorization**: The frontend operates under a strict Zero-Trust policy. All Firebase authentication handshakes are validated directly across `firebase-admin` on the API layer. 
- **HttpOnly Secure Cookies**: No tokens (`access_token`, `refresh_token`) ever touch `localStorage` or `sessionStorage` in the browser.
- **CSRF Tokens**: All mutating requests are intercepted and verified via server-signed CSRF tokens mapping inherently onto the current session block.
- **Rate-Limiting**: Essential API nodes (especially login/auth paths) are strictly locked through memory rate-limiters.
- **Zod Data Scoping**: Inputs mapped to dynamic logic (like Username updating) are stripped, scrubbed, parsed, and validated cleanly through Zod schemas.
- **Database Session Storage**: The system uses a specialized PostgreSQL `Session` abstraction enforcing cascading termination. The moment an Admin burns a profile natively, their respective cookies die instantaneously.

## 📁 Repository Structure

```txt
project-root/
├── apps/
│   ├── frontend/        # Next.js Static Export App
│   └── backend/         # Express API (Deployed as a Function)
├── packages/
│   ├── shared-types/    # Interface bridges enforcing symmetry
│   └── shared-validation/# Common Zod Schema payloads
├── prisma/
│   └── schema.prisma    # Data models (User, Sessions, RBAC)
├── firebase.json        # Global deployment orchestrator
└── pnpm-workspace.yaml  # Monorepo scoping flags
```

## 🧑‍💻 Local Development

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Supply Environments (`.env`)**
   Create explicit `.env.local` inside `apps/frontend` mapping your Firebase SDK Keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
   NEXT_PUBLIC_FIREBASE_APP_ID="..."
   ```
   Define your Postgres Database URI inside `apps/backend/.env`:
   ```env
   DATABASE_URL="postgres://..."
   JWT_SECRET="..."
   FIREBASE_PROJECT_ID="..."
   FIREBASE_PRIVATE_KEY="..."
   FIREBASE_CLIENT_EMAIL="..."
   ```

3. **Spin up Turborepo Ecosystem**
   ```bash
   pnpm db:generate
   pnpm dev
   ```

## 🚀 Native Deployments

Because `firebase.json` proxies the deployment intelligently, rolling an update to the internet is as simple as:

```bash
npx firebase-tools deploy
```

_This automatically bundles Next.js outputs cleanly to the `us-central1` public network and mounts the Express logic securely._
