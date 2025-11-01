# AidPlug CRM

A comprehensive Sales Pipeline and CRM application tailored for banking salespersons in the UAE. AidPlug-CRM provides a Kanban-style sales pipeline, task and activity management, reporting and analytics, and secure client data management to help sales teams track leads, convert more customers, and stay organized.

Table of contents
- [Key features](#key-features)
- [Technology stack](#technology-stack)
- [Architecture overview](#architecture-overview)
- [Getting started (developer)](#getting-started-developer)
  - [Prerequisites](#prerequisites)
  - [Local setup](#local-setup)
  - [Environment variables](#environment-variables)
  - [Running the app](#running-the-app)
  - [Testing](#testing)
- [Deployment](#deployment)
- [Data model & database](#data-model--database)
- [Common workflows](#common-workflows)
- [Contributing](#contributing)
- [Troubleshooting & tips](#troubleshooting--tips)
- [License & contact](#license--contact)

## Key features
- Kanban sales pipeline with drag-and-drop stage transitions
- Lead and contact management (client profiles, interactions, notes)
- Task and activity tracking with reminders and ownership
- Role-based access control and user management for sales teams
- Reporting and dashboards (conversion rates, stage durations, performance)
- Audit logs and basic history for client changes and pipeline updates
- Configurable pipeline stages and custom fields
- Exporting reports and client lists (CSV/Excel)

## Technology stack
- Primary language: TypeScript
- Frontend: React 19 / Vite (build tool), TSX for UI components
- Backend: Supabase (PostgreSQL database, Auth, Storage)
- Database: PostgreSQL (via Supabase)
- Auth: Supabase Auth (JWT-based, with Google OAuth)
- Tooling: ESLint, Prettier, TypeScript, Husky, lint-staged
- Styling: Tailwind CSS
- State Management: TanStack Query (React Query)
- Deployment: Vercel
- PWA: Yes, with service worker

## Architecture overview
AidPlug-CRM is a full-stack TypeScript application:
- frontend/ (src/) — UI components, pages, kanban board, dashboards
- backend/ — Supabase (serverless functions if any, but primarily client-side with Supabase client)
- shared/ — types and interfaces in src/types/
- infra/ — Vercel deployment config (vercel.json)
- scripts/, migrations/ — SQL files for database setup

This separation enables strong typing across client and server boundaries.

## Getting started (developer)

### Prerequisites
- Node.js (LTS) — e.g., 18.x or newer
- npm or yarn
- Git
- Supabase account (free tier available)

### Local setup
1. Fork and clone the repo
   ```bash
   git clone https://github.com/a-muhammed-ajmal/AidPlug-CRM.git
   cd AidPlug-CRM
   ```
2. Install dependencies
   - Using npm:
     ```bash
     npm install
     ```
3. Create and configure environment
   - Create .env.local and set the required variables (Supabase URL and anon key)
4. Initialize database
   - Create a Supabase project
   - Run the SQL files in the repo (e.g., db-optimizations.sql) in Supabase SQL Editor
   - Generate types: `npx supabase gen types typescript --linked > src/types/supabase.ts`
5. Seed data (if seed scripts are provided)
   No seed scripts in package.json, but you can manually add data via Supabase dashboard.

### Environment variables
Typical variables to set in .env.local (gitignored):
- VITE_SUPABASE_URL=your_supabase_project_url
- VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

### Running the app
- Start development server:
  ```bash
  npm run dev
  ```
  Access at http://localhost:3001

### Testing
- Unit tests: No tests configured yet (Jest not in dependencies)
- Linting:
  ```bash
  npm run lint
  ```
- Type checking:
  ```bash
  npm run typecheck
  ```

## Deployment
Suggested deployment flow:
- Build frontend: `npm run build`
- Deploy to Vercel: Connect GitHub repo to Vercel, it auto-deploys on push to main.
- For production: Use environment variables in Vercel dashboard.

## Data model & database
Core entities (from Supabase schema):
- User (roles, auth)
- Client / Contact (profile, contact details)
- Lead / Opportunity (amount, stage)
- Pipeline Stage (order, name)
- Task / Activity (due date, assigned_to)
- Notes and AuditLog

Look into the SQL files (e.g., db-optimizations.sql) for concrete table definitions.

## Common workflows
- Add a new lead: Create client/contact → create opportunity → assign to pipeline stage → add follow-up tasks.
- Move opportunity in Kanban: drag from one stage column to another → update stage, add activity log.
- Reporting: select date range and team → view conversion rates, average time in stage.
- Team management: create users, assign role, set permissions.

## Contributing
Thank you for considering contributing!
1. Read CONTRIBUTING.md (if present)
2. Create an issue describing the bug or feature.
3. Fork the repo and create a branch: feature/short-description
4. Run tests and linters locally before creating a PR
5. Open a PR with a clear description

## Troubleshooting & tips
- If TypeScript types fail, run `npm run typecheck`
- If Supabase connection fails, verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- For CORS errors, ensure Supabase project allows your domain
- If migrations are out of sync, re-run SQL in Supabase

## License & contact
- License: MIT (add LICENSE file if not present)
- Author / Contact: a-muhammed-ajmal (https://github.com/a-muhammed-ajmal)

---

Built with ❤️ for banking sales professionals.
