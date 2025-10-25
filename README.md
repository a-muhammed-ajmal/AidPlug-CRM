# AidPlug CRM

**Empowering Banking Sales Professionals with Intelligent CRM Solutions**

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AidPlug CRM is a cutting-edge, mobile-first Progressive Web App (PWA) designed specifically for banking sales professionals. Built with modern web technologies, it delivers a seamless, intuitive experience to manage leads, clients, deals, and tasks efficiently. Whether in the office or on the field, AidPlug CRM ensures you maintain peak productivity and achieve your sales targets with confidence.

## 🚀 Key Features

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
- **Progressive Web App (PWA):** Native app-like experience on any device with offline data access and push notifications.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices with consistent performance across platforms.

## 🛠️ Technology Stack

### Frontend Architecture
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | React 19 | Modern component-based UI development |
| **Language** | TypeScript 5.8 | Type-safe JavaScript with enhanced developer experience |
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
- **Cloud Backend**: Free Supabase account

### Installation Steps

#### 1. Clone and Setup Project
```bash
git clone https://github.com/your_username/aidplug-crm.git
cd aidplug-crm
npm install
```

#### 2. Configure Supabase Backend

1. **Create Supabase Project**
   - Visit [Supabase Dashboard](https://app.supabase.com)
   - Create a new project with your preferred settings

2. **Database Setup**
   - Navigate to **SQL Editor** in your Supabase project
   - Execute the schema from `db-optimizations.sql` to create database tables

3. **Authentication Configuration**
   - Go to **Authentication > Providers**
   - Enable **Google OAuth** and configure credentials
   - Set up email/password authentication if needed

4. **Storage Setup**
   - Navigate to **Storage** section
   - Create a public bucket named `avatars` for profile images

5. **API Credentials**
   - Go to **Project Settings > API**
   - Copy your **Project URL** and **anon public key**

#### 3. Environment Configuration

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 4. Launch Development Server

```bash
npm run dev
```

Access the application at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```
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
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Application entry point
│   ├── index.css            # Global styles and Tailwind imports
│   └── types.ts             # TypeScript type definitions
├── .env.local               # Environment variables (gitignored)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # Project documentation
```

## 🤝 Contributing

We welcome contributions from the community! AidPlug CRM thrives on collaborative development and innovative ideas.

### How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button on GitHub

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style and conventions
   - Add tests for new features
   - Update documentation as needed

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Open a Pull Request with a clear description

### Development Guidelines

- **Code Style**: Follow TypeScript and React best practices
- **Testing**: Ensure all tests pass before submitting
- **Documentation**: Update README and inline comments for complex logic
- **Commits**: Use conventional commit format

## 📋 Roadmap

- [ ] Advanced analytics and reporting dashboard
- [ ] Mobile app development (React Native)
- [ ] Integration with banking APIs
- [ ] Automated email campaigns
- [ ] Advanced lead scoring algorithms
- [ ] Multi-tenant architecture for enterprise clients

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your_username/aidplug-crm/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your_username/aidplug-crm/discussions)
- **Email**: support@aidplug.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for banking sales professionals worldwide**
