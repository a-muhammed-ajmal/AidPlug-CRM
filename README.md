
# AidPlug CRM

**A Strategic Partner for Banking Sales Professionals**

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Ready-purple)

AidPlug CRM is a modern, mobile-first Progressive Web App (PWA) built to empower banking sales professionals. It provides an intuitive and powerful suite of tools to manage leads, clients, deals, and tasks, ensuring you stay organized, efficient, and ahead of your targets, whether you're at your desk or on the go.



## ✨ Key Features

-   **Dynamic Dashboard:** Get a complete, at-a-glance overview of your sales performance with key metrics, a list of tasks to be done, upcoming client events like birthdays and anniversaries, and a feed of your recent activities.
-   **Efficient Lead Management:** Capture, track, and qualify leads with detailed information. Filter and search through prospects with ease, and seamlessly convert qualified leads into active deals.
-   **360° Client View:** Maintain a comprehensive and centralized database of your clients. Access personal, contact, employment, and financial details in a well-organized and easily accessible format.
-   **Visual Deal Pipeline:** Track your sales journey with an intuitive Kanban board. Drag and drop deals through customizable stages, from initial application to successful completion.
-   **Actionable Task Management:** Stay on top of your schedule with a powerful task manager. Create, prioritize, and track tasks to ensure nothing falls through the cracks.
-   **In-Depth Product Hub:** Access a detailed repository of banking products. View features, benefits, fee structures, and eligibility criteria for offerings like credit cards, helping you provide accurate information to clients instantly.
-   **Secure Authentication:** Robust and secure authentication system supporting both email/password and Google OAuth for quick and easy access.
-   **Progressive Web App (PWA):** Installable on any device (desktop or mobile) for a native-app experience, including offline access to cached data.

## 🛠️ Tech Stack

| Category          | Technology                                       |
| ----------------- | ------------------------------------------------ |
| **Frontend**      | React 19, TypeScript, Vite                       |
| **Styling**       | Tailwind CSS                                     |
| **Backend**       | Supabase (Auth, PostgreSQL, Storage)             |
| **Data Fetching** | TanStack Query (React Query)                     |
| **Routing**       | React Router                                     |
| **UI Icons**      | Lucide React                                     |

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

-   Node.js (v18.x or later)
-   npm, yarn, or pnpm
-   Git
-   A free [Supabase](https://supabase.com/) account

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username/aidplug-crm.git
    cd aidplug-crm
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up your Supabase backend:**
    -   Go to [Supabase](https://app.supabase.com) and create a new project.
    -   Inside your project, go to the **SQL Editor** and run the contents of `schema.sql` (you will need to create this file based on the table structure in `types.ts`) to set up your database tables.
    -   Navigate to **Project Settings > API** to find your **Project URL** and `anon` **public key**.
    -   Navigate to **Authentication > Providers** and enable the **Google** provider. Follow the instructions to add your Google OAuth credentials.
    -   Navigate to **Storage** and create a new **public bucket** named `avatars`.

4.  **Configure environment variables:**
    -   Create a new file named `.env.local` in the root of the project.
    -   Add your Supabase credentials to it:
        ```env
        VITE_SUPABASE_URL=YOUR_PROJECT_URL
        VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
        ```

5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application should now be running on `http://localhost:5173`.

## 📂 Project Structure

```
/
├── public/              # Static assets and PWA icons
├── src/
│   ├── components/      # UI components organized by feature
│   │   ├── auth/
│   │   ├── clients/
│   │   ├── common/      # Shared components (Modals, Spinners, etc.)
│   │   ├── dashboard/
│   │   ├── deals/
│   │   ├── leads/
│   │   ├── navigation/
│   │   └── ...
│   ├── contexts/        # React Context for global state (Auth, UI)
│   ├── hooks/           # Custom hooks for data fetching and business logic
│   ├── lib/             # Core libraries, constants, and Supabase client
│   ├── services/        # API service functions for Supabase tables
│   ├── App.tsx          # Main app component with routing setup
│   ├── index.css        # Global styles
│   ├── index.tsx        # Application entry point
│   └── types.ts         # TypeScript definitions and Supabase schema types
├── .gitignore
├── index.html           # Main HTML entry file
├── package.json
├── README.md            # You are here!
└── tsconfig.json
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
