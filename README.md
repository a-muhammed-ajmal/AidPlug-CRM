# AidPlug Banking CRM

AidPlug Banking CRM is a progressive web application designed as a strategic partner for banking sales professionals. It helps manage leads, clients, deals, and tasks with a mobile-first interface.

## Features

- **Authentication:** Secure user sign-up, sign-in, and password management.
- **Dashboard:** At-a-glance overview of key performance indicators, upcoming events, and recent activities.
- **Lead Management:** Create, track, and manage sales leads with detailed information and status updates.
- **Client Management:** Maintain a comprehensive database of clients and their profiles.
- **Deal Pipeline:** Visualize and manage deals through a Kanban-style board representing different sales stages.
- **Task Management:** Organize daily tasks, set priorities, and track completion.
- **Mobile-First Design:** A fully responsive UI optimized for on-the-go access from mobile devices.
- **PWA Ready:** Installable on any device for an app-like experience and offline capabilities.
- **Real-time Notifications:** Stay updated with important events and reminders.

## Tech Stack

- **Frontend:** [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **State Management:** [TanStack Query (React Query)](https://tanstack.com/query/latest) for server state management.
- **Backend & Database:** [Supabase](https://supabase.io/) (PostgreSQL)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm (or yarn/pnpm)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/your_project_name.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Set up your Supabase backend:
    - Go to [Supabase](https://supabase.io) and create a new project.
    - Go to the SQL Editor and run the schema definitions to create your tables.
    - In your project settings, find your API URL and `anon` key.

4.  Create a `.env.local` file in the root of your project and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
    *Note: The current `lib/supabase.ts` has hardcoded credentials for demonstration purposes. It's recommended to use environment variables for production.*

5.  Run the development server:
    ```sh
    npm run dev
    ```

## Folder Structure

```
/
├── public/
├── src/
│   ├── components/      # Reusable UI components (auth, dashboard, leads, etc.)
│   ├── contexts/        # React Context providers (Auth, UI)
│   ├── hooks/           # Custom React hooks for data fetching and logic
│   ├── lib/             # Helper libraries and constants (supabase client, query client)
│   ├── services/        # API service layers for interacting with Supabase
│   ├── App.tsx          # Main application component with routing
│   ├── index.css        # Global CSS styles
│   ├── index.tsx        # Application entry point
│   └── types.ts         # TypeScript type definitions
├── .gitignore
├── index.html
├── package.json
├── README.md
└── tsconfig.json
```
