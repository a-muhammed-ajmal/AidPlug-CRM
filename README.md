# AidPlug CRM

**Empowering Banking Sales Professionals with Intelligent CRM Solutions**

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple?logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-yellowgreen)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AidPlug CRM is a cutting-edge, mobile-first Progressive Web App (PWA) designed specifically for banking sales professionals. Built with modern web technologies, it delivers a seamless, intuitive experience to manage leads, clients, deals, and tasks efficiently. Whether in the office or on the field, AidPlug CRM ensures you maintain peak productivity and achieve your sales targets with confidence.

## 🚀 Live Demo

**Experience AidPlug CRM in action:**

**[https://aidplug-crm-aid-plug.vercel.app/](https://aidplug-crm-aid-plug.vercel.app/)**

## ✨ Key Features

### Core Functionality
- **Intelligent Dashboard:** Comprehensive overview of sales performance with real-time KPIs, pending tasks, and recent activity feeds.
- **Advanced Lead Management:** Streamlined lead capture, qualification, and conversion workflows with powerful filtering and search capabilities.
- **Comprehensive Client Profiles:** 360-degree client view with personal, contact, employment, and financial information in a structured, accessible format.
- **Visual Deal Pipeline:** Interactive Kanban board for tracking sales progress through customizable stages from prospect to completion.

### Productivity Tools
- **Task Management System:** Prioritized task creation, assignment, and tracking to maintain productivity and meet deadlines.
- **Product Knowledge Base:** Detailed banking product catalog with features, benefits, pricing, and eligibility criteria for instant client consultations.
- **Quick Actions:** One-click access to frequently used functions for rapid workflow execution.

### Security & Accessibility
- **Secure Authentication:** Robust login with email/password and Google OAuth integration.
- **Progressive Web App (PWA):** Installable, native app-like experience on any device with offline data access.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices with consistent performance across platforms.

## 🛠️ Technology Stack

### Frontend Architecture
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | React 19 | Modern component-based UI development |
| **Language** | TypeScript | Type-safe JavaScript with enhanced developer experience |
| **Build Tool** | Vite | Fast development server and optimized production builds |
| **Styling** | Tailwind CSS | Utility-first CSS framework for responsive design |
| **Routing** | React Router | Client-side navigation and route management |
| **Icons** | Lucide React | Consistent, scalable icon library |
| **Forms** | React Hook Form & Zod | Performant form handling and schema validation |

### Backend & Infrastructure
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Database** | Supabase PostgreSQL | Scalable relational database with real-time capabilities |
| **Authentication** | Supabase Auth | Secure user authentication with OAuth support |
| **File Storage** | Supabase Storage | Secure file upload and management for avatars |
| **State Management** | TanStack Query | Efficient server state management, caching, and optimistic updates |
| **Deployment** | Vercel | Global CDN deployment with automatic scaling and CI/CD |

## 🚀 Quick Start Guide

Get AidPlug CRM up and running on your local machine in minutes.

### System Requirements

- **Node.js**: Version 18.x or higher
- **Package Manager**: npm, yarn, or pnpm
- **Version Control**: Git
- **Cloud Backend**: Free [Supabase](https://supabase.com/) account
- **Supabase CLI**: `npm install -g supabase`

### Installation Steps

#### 1. Clone and Setup Project
```bash
git clone https://github.com/a-muhammed-ajmal/AidPlug-CRM.git
cd AidPlug-CRM
npm install
```

#### 2. Configure Supabase Backend

1.  **Create Supabase Project**: Go to the [Supabase Dashboard](https://app.supabase.com) and create a new project.

2.  **Database Setup**: Navigate to **SQL Editor** in your new project and execute the entire contents of `db-optimizations.sql` to create the database schema.

3.  **Authentication & Storage**:
    *   Go to **Authentication > Providers** and enable **Google**.
    *   Go to **Storage** and create a new **public** bucket named `avatars`.

4.  **API Credentials**: Go to **Project Settings > API** and copy your **Project URL** and **anon public key**.

#### 3. Environment Configuration

Create a file named `.env.local` in the project root and add your keys:

```env
VITE_SUPABASE_URL=YOUR_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

#### 4. Generate TypeScript Types (Crucial Step)

This command connects to your Supabase project and creates a type definition file, which is essential for TypeScript to work correctly.

1.  **Log in to the Supabase CLI:**
    ```bash
    npx supabase login
    ```
2.  **Link your project (replace `YOUR_PROJECT_ID`):**
    ```bash
    npx supabase link --project-ref YOUR_PROJECT_ID
    ```
3.  **Generate the types:**
    ```bash
    npx supabase gen types typescript --linked > src/types/supabase.ts
    ```

#### 5. Launch Development Server

```bash
npm run dev
```

Access the application at **`http://localhost:3001`**.

## ⚙️ Available Scripts

-   `npm run dev`: Starts the development server with Hot Module Replacement.
-   `npm run build`: Type-checks and builds the app for production.
-   `npm run preview`: Serves the production build locally for testing.
-   `npm run lint`: Runs ESLint to find and fix code quality issues.
-   `npm run format`: Formats all files with Prettier.
-   `npm run typecheck`: Checks the entire project for TypeScript errors without building.

## 📁 Project Architecture

```
aidplug-crm/
├── public/                    # Static assets and PWA resources
│   ├── manifest.json         # PWA configuration
│   └── logo.svg              # Application logo
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── clients/         # Client management UI
│   │   ├── common/          # Shared components (modals, loaders)
│   │   ├── dashboard/       # Dashboard widgets and views
│   │   ├── deals/           # Deal pipeline components
│   │   ├── leads/           # Lead management interface
│   │   ├── navigation/      # Navigation and routing components
│   │   ├── products/        # Product catalog components
│   │   ├── settings/        # User settings and configuration
│   │   └── tasks/           # Task management UI
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── UIContext.tsx    # UI state management
│   ├── hooks/               # Custom React hooks
│   │   ├── useClients.ts    # Client data operations
│   │   ├── useDeals.ts      # Deal management hooks
│   │   └── ...              # Additional business logic hooks
│   ├── lib/                 # Core utilities and configurations
│   │   ├── supabase.ts      # Supabase client setup
│   │   ├── constants.ts     # Application constants
│   │   └── queryClient.ts   # TanStack Query configuration
│   ├── services/            # API service layer
│   │   ├── clientsService.ts # Client CRUD operations
│   │   ├── dealsService.ts   # Deal management services
│   │   └── ...              # Additional service modules
│   ├── App.tsx              # Main application component with routing
│   ├── index.tsx            # Application entry point
│   ├── index.css            # Global styles and Tailwind imports
│   └── types/               # TypeScript type definitions (incl. supabase.ts)
├── .env.local               # Environment variables (gitignored)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # Project documentation
```

## 🤝 Contributing

Contributions are welcome! AidPlug CRM thrives on collaborative development and innovative ideas.

1.  **Fork the Repository**
2.  **Create a Feature Branch**: `git checkout -b feature/your-feature-name`
3.  **Commit Your Changes**: Use conventional commit format (e.g., `feat: Add amazing feature`)
4.  **Push and Create Pull Request**: `git push origin feature/your-feature-name`

Please ensure all linting checks and tests pass before submitting a pull request.

## 📋 Roadmap

- [ ] Advanced analytics and reporting dashboard
- [ ] Integration with banking APIs for real-time data
- [ ] Automated email/SMS follow-up campaigns
- [ ] Advanced lead scoring and prioritization algorithms
- [ ] Multi-tenant architecture for enterprise clients

## 📞 Support

-   **Bugs & Feature Requests**: [GitHub Issues](https://github.com/a-muhammed-ajmal/AidPlug-CRM/issues)
-   **General Questions**: [GitHub Discussions](https://github.com/a-muhammed-ajmal/AidPlug-CRM/discussions)

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

**Built with ❤️ for banking sales professionals worldwide.**
