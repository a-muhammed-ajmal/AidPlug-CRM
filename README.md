# AidPlug CRM

**Empowering Banking Sales Professionals with Intelligent CRM Solutions**

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AidPlug CRM is a cutting-edge, mobile-first Progressive Web App (PWA) designed specifically for banking sales professionals. Built with modern web technologies, it delivers a seamless, intuitive experience to manage leads, clients, deals, and tasks efficiently. Whether in the office or on the field, AidPlug CRM ensures you maintain peak productivity and achieve your sales targets with confidence.

## 🚀 Live Demo

**Experience AidPlug CRM in action:**

**[https://aidplug-crm-aid-plug.vercel.app/](https://aidplug-crm-aid-plug.vercel.app/)**

## ✨ Key Features

### Core Functionality
- **Intelligent Dashboard:** Comprehensive overview of sales performance with real-time KPIs, pending tasks, upcoming client milestones (birthdays/anniversaries), and activity feeds.
- **Advanced Lead Management:** Streamlined lead capture, qualification, and conversion workflows with powerful filtering and search capabilities.
- **Comprehensive Client Profiles:** 360-degree client view with personal, contact, employment, and financial information in a structured, accessible format.
- **Visual Deal Pipeline:** Interactive Kanban board for tracking sales progress through customizable stages from prospect to completion.

### Productivity Tools
- **Task Management System:** Prioritized task creation, assignment, and tracking to maintain productivity and meet deadlines.
- **Product Knowledge Base:** Detailed banking product catalog with features, benefits, pricing, and eligibility criteria for instant client consultations.
- **Quick Actions:** One-click access to frequently used functions for rapid workflow execution.

### Security & Accessibility
- **Multi-Factor Authentication:** Secure login with email/password and Google OAuth integration.
- **Progressive Web App (PWA):** Native app-like experience on any device with offline data access.
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

### Backend & Infrastructure
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Database** | Supabase PostgreSQL | Scalable relational database with real-time capabilities |
| **Authentication** | Supabase Auth | Secure user authentication with OAuth support |
| **File Storage** | Supabase Storage | Secure file upload and management |
| **API Layer** | Supabase Client | Type-safe API interactions |
| **State Management** | TanStack Query | Efficient server state management and caching |
| **Deployment** | Vercel | Global CDN deployment with automatic scaling |

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
# FIX: Using the correct repository URL
git clone https://github.com/a-muhammed-ajmal/AidPlug-CRM.git
cd AidPlug-CRM
npm install
```

#### 2. Configure Supabase Backend

1.  **Create Supabase Project**
    - Visit [Supabase Dashboard](https://app.supabase.com) and create a new project.

2.  **Database Setup**
    - Navigate to **SQL Editor** in your Supabase project.
    - Execute the entire contents of `db-optimizations.sql` to create the necessary tables and policies.

3.  **Authentication & Storage**
    - Go to **Authentication > Providers** and enable **Google**.
    - Go to **Storage** and create a new **public** bucket named `avatars`.

4.  **API Credentials**
    - Go to **Project Settings > API**.
    - Copy your **Project URL** and **anon public key**.

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
2.  **Link your project:**
    ```bash
    # Replace YOUR_PROJECT_ID with the 'Project Ref' from your Supabase URL
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

<!-- FIX: Corrected port number -->
Access the application at **`http://localhost:3001`**

### Build for Production

```bash
# Checks for TypeScript errors and builds the app
npm run build

# Serves the production build locally for testing
npm run preview
```
## 📁 Project Architecture

```
aidplug-crm/
├── public/                    # Static assets, manifest.json, PWA icons
├── src/
│   ├── components/            # Reusable UI components by feature
│   ├── contexts/              # Global React Context providers (Auth, UI)
│   ├── hooks/                 # Custom React hooks for data fetching
│   ├── lib/                   # Core utilities (Supabase client, constants)
│   ├── services/              # API service layer (data access logic)
│   ├── types/                 # TypeScript definitions
│   │   └── supabase.ts        # Auto-generated types from Supabase schema
│   ├── App.tsx                # Main application component with routing
│   └── index.tsx              # Application entry point
├── package.json               # Dependencies and scripts
└── ...                        # Configuration files (vite, tsconfig, etc.)
```

## 🤝 Contributing

We welcome contributions! AidPlug CRM thrives on collaborative development.

1.  **Fork the Repository**
2.  **Create a Feature Branch**: `git checkout -b feature/your-amazing-feature`
3.  **Commit Your Changes**: `git commit -m "feat: Add some amazing feature"`
4.  **Push to the Branch**: `git push origin feature/your-amazing-feature`
5.  **Open a Pull Request**

Please follow conventional commit formats and ensure all linting and type checks pass.

## 📋 Roadmap

- [ ] Advanced analytics and reporting dashboard
- [ ] Integration with banking APIs for real-time data
- [ ] Automated email/SMS follow-up campaigns
- [ ] Advanced lead scoring and prioritization algorithms
- [ ] Multi-tenant architecture for enterprise clients

## 📞 Support

- **Bugs & Feature Requests**: [GitHub Issues](https://github.com/a-muhammed-ajmal/AidPlug-CRM/issues)
- **General Questions**: [GitHub Discussions](https://github.com/a-muhammed-ajmal/AidPlug-CRM/discussions)

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

**Built with ❤️ for banking sales professionals worldwide.**
