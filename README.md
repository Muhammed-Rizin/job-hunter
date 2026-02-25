# Job Hunter - Client 💻

A high-fidelity, mobile-first Progress Web Application (PWA) built to streamline career growth and application tracking.

## 🚀 Key Features

- **Dashboard Intelligence**: Real-time stats on successful applications, bounces, and lead conversion.
- **Lead Pipeline (Planning)**: Advanced planning board with strategic fields (The Hook, Winning Move) to prepare for global roles.
- **Application Tracker**: Full-lifecycle tracking of your job applications from initial contact to offer.
- **Mail Wizard**: Modular email composition system with template support and markdown conversion.
- **Modern UI/UX**: Engineering-grade interface powered by Tailwind CSS 4 and Framer Motion.
- **PWA Ready**: Fully installable as a standalone application on iOS, Android, and Desktop.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **State Management**: React Context API (Modular Architecture)
- **Routing**: React Router 7
- **Utility**: Lucide Icons, React Hot Toast, Axios

## 📂 Modular Architecture

The project follows a high-fidelity feature-based structure for maximum scalability:

- `src/app/`: Core app logic, global providers, and unified routing.
- `src/features/`: Modular business logic (Auth, Applications, Planning, Dashboard, Profile, Mail). Each module contains its own components and services.
- `src/shared/`: Reusable UI components, layout wrappers, and global utility functions.
- `src/assets/`: Global static assets and styles.

## 🚀 Getting Started

### 1. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME="Job Hunter"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## 📱 Mobile-First Design
This application is designed with a "Mobile-First" philosophy. It includes:
- A responsive floating `NavBar` for mobile touch targets.
- Touch-optimized data grids and cards.
- Full offline support and standalone display via PWA.

---
*Developed with precision for Muhammed Rizin* 🛸
