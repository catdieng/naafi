Project Summary – “Naafi” (frontend)

Purpose:
A full‑stack SaaS application that lets small‑business owners manage customers, vehicles, appointments, invoices, expenses, items, and settings. The frontend is a React‑TypeScript SPA that consumes a type‑safe OpenAPI‑TS client and uses Chakra‑UI for styling.

Tech Stack

Layer	Technology
Framework	Vite + React (TS)
Routing	Vite Router (React‑Router 6 style)
UI	Chakra‑UI + custom ui/ primitives
State / Logic	Custom hooks (useAuth, useCustomToast, etc.)
API Client	Auto‑generated OpenAPI‑TS client (src/client/)
Build	Vite (production bundle), Dockerfiles, Playwright tests
Testing	Playwright integration tests for auth flows
High‑level Project Structure


Apply
frontend/
├─ src/
│  ├─ main.tsx            # App bootstrap & router
│  ├─ routes/             # Vite‑Router files – each folder is a feature
│  │   ├─ _layout/…       # Shared layout per domain (dashboard, invoices, settings)
│  │   └─ *.tsx           # Individual pages
│  ├─ components/         # Feature UI (Appointments, Invoices, Customers, etc.)
│  │   ├─ Appointments/   # CRUD + calendar view
│  │   ├─ Invoices/       # Invoice creation/editing, totals
│  │   ├─ Customers/      # Customer CRUD + vehicle linking
│  │   ├─ Expenses/       # Expense CRUD
│  │   ├─ Items/          # Product catalog
│  │   ├─ Vehicles/       # Vehicle CRUD + brands/models
│  │   ├─ Brands/         # Brand/model CRUD
│  │   ├─ Categories/     # Category CRUD
│  │   ├─ Taxes/          # Tax rule CRUD
│  │   ├─ Users/          # User management
│  │   ├─ Settings/       # Org/billing/settings
│  │   ├─ Profile/        # User profile & settings
│  │   ├─ Pending/        # Overview of pending actions
│  │   ├─ Common/         # Reusable UI (navbar, sidebar, tables, pagination)
│  │   └─ ui/             # Chakra‑UI wrappers (button, dialog, etc.)
│  ├─ hooks/              # Custom hooks (auth, toast, calendar, table)
│  ├─ client/             # OpenAPI‑TS generated API client
│  ├─ utils.ts            # Shared helpers
│  └─ theme/              # Design tokens & recipe
├─ tests/                 # Playwright integration tests (auth, password flow)
├─ vite.config.ts         # Vite build config
├─ package.json           # Dependencies, scripts
└─ Dockerfile / Dockerfile.playwright   # Docker images for dev & test
Core Functionalities

Customer & Vehicle Management – CRUD, vehicle association, brand/model linking.
Appointment Scheduling – calendar view, booking, editing, canceling.
Invoice Lifecycle – create, edit, add line items, compute taxes, totals, preview PDF.
Expense & Item Tracking – CRUD, categorization, totals.
Users & Organization Settings – auth, role‑based access, billing, organization, appearance.
Pending Actions Dashboard – consolidated view of items that need attention.
Key Architectural Concepts

Routing – Filesystem‑based Vite Router (src/routes/…), each domain has its own /_layout for shared UI.
API Client – OpenAPI‑TS generated services in src/client/.
Global State – Custom hooks for auth (useAuth), toasts (useCustomToast), calendar helpers, paginated tables (useDrfTable).
UI Layer – Chakra‑UI primitives (ui/) + higher‑level common components (Common/).
Testing – Playwright tests for authentication flows.
Build – Vite production build, Docker image, playwright Dockerfile for test runs.
How to Extend / Add a Feature

Add a new route in src/routes/… or a component in src/components/….
Use the src/client/… service for API calls.
Leverage hooks (useAuth, useCustomToast) for common logic.
Add UI primitives or reuse existing ui/ components.
(Optional) Write Playwright tests in tests/.
Takeaway for an AI Agent

Provide this high‑level summary to give the agent context on the architecture, tech stack, and functional domains, enabling it to understand your project, suggest enhancements, or troubleshoot specific modules.