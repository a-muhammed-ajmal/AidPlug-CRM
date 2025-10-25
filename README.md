# AidPlug CRM

### A Strategic Partner for Banking Sales Professionals

[![React Version](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.io/)
[![Vite](https://img.shields.io/badge/Vite-5.3-purple?logo=vite)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-yellowgreen)](https://web.dev/progressive-web-apps/)

AidPlug CRM is a modern, mobile-first Progressive Web App (PWA) built to empower banking sales professionals. It provides an intuitive and powerful suite of tools to manage leads, clients, deals, and tasks, ensuring you stay organized, efficient, and ahead of your targets.

---

## 🚀 Live Demo

Check out the live application deployed on Vercel:

**[https://aidplug-crm-aid-plug.vercel.app/](https://aidplug-crm-aid-plug.vercel.app/)**

---

## ✨ Key Features

*   **Dynamic Dashboard**: Get a complete, at-a-glance overview of your sales performance with key metrics, a list of tasks to be done, and a feed of your recent activities.
*   **Efficient Lead Management**: Capture, track, and qualify leads with detailed information. Filter and search through prospects with ease.
*   **360° Client View**: Maintain a comprehensive and centralized database of your clients, including personal, contact, and financial details.
*   **Visual Deal Pipeline**: Track your sales journey with an intuitive Kanban board. Drag and drop deals through customizable stages, from application to completion.
*   **Actionable Task Management**: Stay on top of your schedule with a powerful task manager. Create, prioritize, and track tasks to ensure nothing falls through the cracks.
*   **In-Depth Product Hub**: Access a detailed repository of banking products. View features, benefits, fee structures, and eligibility criteria.
*   **Secure Authentication**: Robust and secure authentication system supporting both email/password and Google OAuth.
*   **Progressive Web App (PWA)**: Installable on any device (desktop or mobile) for a native-app experience, including offline access to cached data.

---

## 🛠️ Tech Stack

| Category                  | Technology                                               |
| ------------------------- | -------------------------------------------------------- |
| **Frontend**              | React 19, TypeScript, Vite                               |
| **Styling**               | Tailwind CSS                                             |
| **Backend & Database**    | Supabase (Auth, PostgreSQL, Storage, Edge Functions)     |
| **Data Fetching & State** | TanStack Query (React Query)                             |
| **Routing**               | React Router                                             |
| **Form Management**       | React Hook Form & Zod (for validation)                   |
| **Code Quality**          | ESLint & Prettier                                        |
| **UI Icons**              | Lucide React                                             |

---

## 🏁 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

*   Node.js (v18.x or later)
*   npm, yarn, or pnpm
*   Git
*   A free [Supabase](https://supabase.com/) account
*   [Supabase CLI](https://supabase.com/docs/guides/cli) installed locally (`npm install supabase --save-dev`)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/a-muhammed-ajmal/AidPlug-CRM.git
    cd AidPlug-CRM
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up your Supabase backend:**
    *   Go to [Supabase](https://supabase.com/) and create a new project.
    *   Inside your project, go to the **SQL Editor** and execute the entire contents of the `db-optimizations.sql` file from this repository.
    *   Navigate to **Authentication > Providers** and enable the **Google** provider (optional, but recommended).
    *   Navigate to **Storage** and create a new public bucket named `avatars`.

4.  **Configure environment variables:**
    *   Create a new file named `.env.local` in the root of the project.
    *   Add your Supabase Project URL and Anon Key to it. You can find these in **Project Settings > API**.
    ```env
    VITE_SUPABASE_URL=YOUR_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
    ```

5.  **Generate TypeScript types from your Supabase schema:**
    *   Log in to the Supabase CLI:
        ```sh
        npx supabase login
        ```
    *   Link your local project to your Supabase project and generate the types:
        ```sh
        npx supabase link --project-ref YOUR_PROJECT_ID
        npx supabase gen types typescript --linked > src/types/supabase.ts
        ```
    *(This step is crucial for TypeScript to understand your database schema.)*


6.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application should now be running on **http://localhost:3001**.

---

## Available Scripts

In the project directory, you can run:

-   `npm run dev`: Starts the development server.
-   `npm run build`: Type-checks and builds the app for production.
-   `npm run preview`: Serves the production build locally.
-   `npm run lint`: Runs ESLint to find and fix code quality issues.
-   `npm run format`: Formats all files with Prettier.
-   `npm run typecheck`: Checks the entire project for TypeScript errors without building.

---

## 📁 Project Structure

```
/
├── public/               # Static assets and PWA icons
└── src/
    ├── components/       # UI components organized by feature
    │   ├── auth/
    │   ├── clients/
    │   ├── common/       # Shared components (Modals, Spinners, etc.)
    │   └── ...
    ├── contexts/         # React Context for global state (Auth, UI)
    ├── hooks/            # Custom hooks for data fetching and business logic
    ├── lib/              # Library configurations (Supabase client)
    ├── services/         # API service functions for Supabase tables
    ├── types/            # TypeScript definitions
    ├── App.tsx           # Main App component with routing setup
    ├── index.css         # Global styles
    ├── index.tsx         # Application entry point
    └── ...
├── .env.local            # Local environment variables (untracked)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build configuration
```

---

## ❤️ Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
