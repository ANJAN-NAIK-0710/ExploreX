# Technology Stack: ExploreX Smart Tourism Platform

This document outlines the actual technology stack, libraries, tools, and architecture currently implemented in the ExploreX project, strictly verified against codebase files, manifests, and runtime configurations.

---

## 1. Summary of Technologies

### Currently Implemented

| Domain | Technology / Library | Version / Details | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.0.1` | Core UI component rendering & reactive state |
| **Frontend Language** | TypeScript | `~5.8.2` | Static typing, interface definitions, domain contracts |
| **Build & Bundling** | Vite | `^6.2.3` | Fast dev server, HMR engine, and production client bundler |
| **CSS & Styling** | Tailwind CSS (v4) | `^4.1.14` (`@tailwindcss/vite`) | Modern utility-first responsive styling via `@import "tailwindcss"` |
| **UI Motion & Animation** | Motion (Framer Motion) | `^12.23.24` (`motion/react`) | Fluid modal animations, tab transitions, status badges |
| **Iconography** | Lucide React | `^0.546.0` | Comprehensive travel, UI, and vehicle icon set |
| **Maps & Geospatial** | Leaflet | `^1.9.4` (`@types/leaflet`) | Interactive map rendering, custom markers, polylines, popups |
| **Map Tiles** | OpenStreetMap | Open tile service | Base map layer for routes and landmark markers |
| **State Management** | React Context + Hooks | Built-in React API | `AuthContext`, `ToastContext`, local component state |
| **API Client** | Native `fetch` Wrapper | Custom (`src/services/api.ts`) | Type-safe HTTP client with unified error handling & headers |
| **Backend Runtime** | Node.js (via `tsx` / `node`) | Node LTS (`tsx` `^4.21.0`) | TypeScript execution in dev, fast execution in prod |
| **Backend Framework** | Express.js | `^4.21.2` (`@types/express`) | REST API routing, middleware, static asset delivery |
| **File Upload Handling** | Multer | `^2.3.0` (`@types/multer`) | Multipart form handling & disk storage for Magic Moments |
| **Backend Bundler** | esbuild | `^0.25.0` | Bundles `server.ts` to CommonJS `dist/server.cjs` for production |
| **Database & Persistence** | JSON Document Store | `fs` + `data_store.json` | Custom `DatabaseManager` singleton with synchronous file sync |
| **Media Storage** | Local File Storage | Local `uploads/` directory | User-uploaded trip images with 20MB per-user quota checking |
| **AI / GenAI SDK** | Google Gen AI TypeScript SDK | `@google/genai` `^2.4.0` | Official SDK for Gemini model integration |
| **AI Model (Concierge)** | `gemini-2.5-flash` | Server-side Gemini API | Conversational travel assistant, cultural Q&A, itinerary advice |
| **AI Model (Autopilot)** | `gemini-3.7-flash` | Structured JSON output | Real-time weather/crowd replanning and what-if simulations |
| **Security & Secrets** | Node `process.env` | Server-only secrets | `GEMINI_API_KEY` proxying, request body & upload size limits |
| **Static Verification** | TypeScript Compiler | `tsc --noEmit` | Project linting and static type verification |

---

### Planned / Not Implemented

- **Third-Party Relational/NoSQL ORM**: Prisma, Drizzle, TypeORM, Mongoose (currently utilizing a dedicated JSON-backed `DatabaseManager`).
- **Cloud Database Provisioning**: Cloud SQL (PostgreSQL), Firebase Firestore, MongoDB Atlas, Supabase.
- **External Payment Gateways**: Stripe SDK, Razorpay, PayPal API (currently simulated via internal wallet and transaction ledger).
- **Automated Testing Suites**: Vitest, Jest, Cypress, Playwright, React Testing Library.
- **Third-Party Authentication Providers**: Google OAuth / Firebase Auth / Auth0 (currently token-based simulated user sessions).
- **External Cab / Transit Dispatch APIs**: Uber, Ola, ONDC APIs (currently simulated via internal `Explorer` dispatch engine).

---

## 2. Layer-by-Layer Architectural Breakdown

### 2.1. Frontend Layer
- **Core Framework**: React 19 SPA running in single-page architecture with tabbed routing (`src/App.tsx`).
- **Styling Architecture**: Tailwind CSS v4 loaded through Vite's native `@tailwindcss/vite` plugin without legacy PostCSS configs.
- **Map & Spatial System**:
  - `Leaflet` is embedded via `MapComponent.tsx` using `useRef` and `useEffect` hooks.
  - Dynamically renders itinerary route polylines, pickup/drop-off transit paths, and color-coded landmark categories (Heritage, Nature, Food, Sightseeing).
- **State Management**:
  - `AuthContext`: Tracks user session, preferences, saved destinations, and profile edits.
  - `ToastContext`: Dispatches non-blocking notifications across the application.
  - View-level state handles interactive tabs, booking checkout flows, demand balancing filters, and photo uploads.
- **API Client**:
  - Centralized in `src/services/api.ts`.
  - Routes all client requests to `/api/v1/*` with standardized JSON serialization, `x-user-id` header injection, and consistent error throwing.

### 2.2. Backend & API Layer
- **Server Framework**: Express.js server defined in `server.ts` and modularized in `server/routes/api.ts`.
- **Hybrid Dev/Prod Middleware**:
  - **Development Mode**: Express attaches Vite in middleware mode (`createServer({ server: { middlewareMode: true }, appType: 'spa' })`) to provide seamless single-port (3000) full-stack development.
  - **Production Mode**: Serves pre-compiled assets from `dist/` alongside static uploads from `/uploads`.
- **Route Namespaces**:
  - `/api/v1/auth/*`: Session handling, profile updates, preference updates, saved items.
  - `/api/v1/destinations/*`: Destination querying, hierarchy browsing, administrative filtering.
  - `/api/v1/packages/*`: Curated travel package catalog and details.
  - `/api/v1/bookings/*`: Multi-modal booking creation (Packages, Hotels, Flights, Trains, Buses, Explorer cabs), cancellation, and invoice generation.
  - `/api/v1/explorer/*`: Micro-mobility dispatching (Eco Autos, E-Bikes, Cabs, XL Vans) and ride lifecycle simulation.
  - `/api/v1/magic-moments/*`: Album creation, photo upload (via Multer), quota tracking, and deletion.
  - `/api/v1/group-expenses/*`: Group travel expense logging and greedy debt settlement calculation.
  - `/api/v1/demand-balancer/*`: Algorithmic multi-objective sustainable tourism optimization.
  - `/api/v1/cultural-specialties/*`: GI-tagged handicraft, food, textile, and artisan discovery.
  - `/api/v1/ai/*`: Gemini AI Assistant, Autopilot replan, and What-If scenario simulation.

### 2.3. AI & ML Integration
- **SDK**: `@google/genai` (`GoogleGenAI` client initialized lazily using `process.env.GEMINI_API_KEY`).
- **Server-Side Proxying**: AI keys remain entirely on the server and are never exposed to browser bundles.
- **AI Pipelines**:
  1. **Conversational Concierge (`server/gemini.ts -> askTravelAssistant`)**:
     - Uses `gemini-2.5-flash` with grounded database catalogs and cultural context instructions.
     - Includes deterministic algorithmic fallbacks for offline or unkeyed runs.
  2. **Itinerary Autopilot Re-planning (`server/gemini.ts -> generateAutopilotReplan`)**:
     - Uses `gemini-3.7-flash` with `responseMimeType: 'application/json'` to transform weather alerts (rain, congestion) into structured indoor/outdoor activity schedules.
  3. **What-If Scenario Simulation (`server/gemini.ts -> runWhatIfSimulation`)**:
     - Uses `gemini-3.7-flash` to compute scenario impact scores, crowd reduction percentages, and day-wise adjustments.
  4. **Sustainable Demand Balancer (`server/services/demandBalancerService.ts`)**:
     - Mathematical multi-objective optimization weighting tourist satisfaction (25%), affordability (20%), local economic retention (25%), weather fit (15%), and crowd avoidance (15%).

### 2.4. Data Storage & Persistence
- **Data Engine**: File-backed JSON document store managed by `DatabaseManager` (`server/db.ts`).
- **Persistence Target**: `data_store.json` at root, automatically created and updated with full collections:
  - `users`, `destinations`, `packages`, `bookings`, `explorerRides`, `magicAlbums`, `magicPhotos`, `reviews`, `walletTransactions`, `groupTrips`, `offers`.
- **Media Files**: Uploaded binary images are persisted to the filesystem (`uploads/`) with unique timestamps and referenced via `/uploads/<filename>`.

---

## 3. Architecture Flow Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (CLIENT)                             │
│                                                                        │
│   React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + Motion      │
│   Leaflet Maps (OpenStreetMap) • Context State • View Components       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ HTTP Fetch (/api/v1/*)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          BACKEND SERVER                                │
│                                                                        │
│   Express.js (Node.js LTS / Port 3000)                                 │
│   ├── Middleware: JSON parser, URLencoded, Multer Storage (uploads/)   │
│   ├── API Routes: /api/v1 (Auth, Bookings, Rides, Expenses, AI)        │
│   └── Internal Services: Demand Balancer, Cultural Discovery Engine    │
└──────────┬────────────────────────┬───────────────────────┬────────────┘
           │                        │                       │
           ▼                        ▼                       ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│     AI / ML LAYER    │ │  DATABASE & STORAGE  │ │    EXTERNAL APIS     │
│                      │ │                      │ │                      │
│ • @google/genai SDK  │ │ • data_store.json    │ │ • OpenStreetMap      │
│ • gemini-2.5-flash   │ │   (DatabaseManager)  │ │   (Leaflet Tiles)    │
│ • gemini-3.7-flash   │ │ • /uploads           │ │ • Unsplash Image CDN │
│ • Algorithmic Heur-  │ │   (User Media Store) │ │                      │
│   istics & Fallbacks │ │ • In-Memory Datasets │ │                      │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
```

---

## 4. Build, Scripts & Deployment

### NPM Scripts
- `npm run dev`: Boots server via `tsx server.ts` with Vite development middleware on port 3000.
- `npm run build`: Executes `vite build` for client bundle and `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs` for backend bundle.
- `npm run start`: Runs compiled production backend using `node dist/server.cjs`.
- `npm run lint`: Runs static TypeScript compiler check (`tsc --noEmit`).
- `npm run clean`: Cleans build output directories (`dist/` and `server.cjs`).

### Deployment Environment
- **Platform**: Containerized Google Cloud Run.
- **Port**: Bound strictly to `0.0.0.0:3000`.
- **Permissions**: Defined in `metadata.json` (`geolocation` frame permission).
