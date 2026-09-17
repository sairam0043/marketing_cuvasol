# ☀️ Cuvasol Growth & Marketing Platform

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Theme](https://img.shields.io/badge/Theme-Tuto_Cuvasol-1B9382)](https://tutor.cuvasol.com)

A high-yield growth, marketing, and affiliate infrastructure platform designed for clean energy agents and educators. Built with real-time attribution, token-based authentication, a full Kanban CRM pipeline, 24-hour commission settlement, and the **Teach • Grow • Guide** ecosystem inspired by [tutor.cuvasol.com](https://tutor.cuvasol.com).

---

## 🌟 Key Features

### 🎓 1. Teach • Grow • Guide Institutional Ecosystem
- **Teach (Mastery)**: High-converting TikTok UGC hooks, video masterclasses, Meta video ad frameworks, and B2B CFO pitch swipe files.
- **Grow (Scaling)**: Sub-second UTM click attribution, AI lead viability scoring (98%+ accuracy), and tiered milestone bonuses (10% to 15%).
- **Guide (Mentorship)**: 1-on-1 pairing with solar engineering specialists who handle technical site surveys, ROI models, and commercial closings.

### 🎨 2. Design System & Theme Engine
- **Day Mode (Default)**: Warm cream palette (`#FAF8F5`), crisp white cards, **Cuvasol Tutor Teal (`#1B9382`)** primary branding, and **Solar Coral (`#F06A43`)** accents.
- **Typography**: Editorial **`DM Serif Display`** for headlines and brand titles; modern **`DM Sans`** for UI and controls.
- **9 Theme Presets**: Day Mode ☀️, Midnight Blue 🌙, OLED Black 🖤, Forest Green 🌲, Royal Purple 👑, Sunset Terracotta 🌅, Ocean Wave 🌊, Nordic Frost ❄️, Cyberpunk Neon ⚡.

### ⚡ 3. End-to-End Functional Architecture
- **Multi-User Token Auth**: Password hashing (`SHA-256 HMAC`), session persistence in `localStorage`, and instant 1-click test reviewer login.
- **Persistent Database**: File-backed JSON store at `server/data/store.json` with user-isolated records surviving server restarts.
- **Dynamic Kanban CRM**: Live lead advancement (`new_inquiry` ➔ `contacted` ➔ `site_survey` ➔ `proposal_sent` ➔ `closed_won`).
- **Automated Commission Ledger**: Instant wallet ledger crediting 10%–15% commission upon deal closure, with instant payout request processing.
- **Public Lead Capture & Tracking**: Public solar quote submission modal (`POST /api/public/lead`) with sub-second UTM click logging (`GET /api/track/click`).

---

## 📁 Repository Structure

```
marketing@cuvasol/
├── public/
│   ├── assets/
│   │   ├── logo.png          # High-resolution pixel-perfect logo
│   │   ├── favicon.png       # Browser tab favicon
│   │   └── logo.svg          # Vector asset
│   └── favicon.ico
├── server/
│   ├── data/
│   │   └── store.json        # Persistent JSON data store
│   ├── db.js                 # Database engine & commission calculator
│   └── index.js              # Express REST API backend
├── src/
│   ├── components/
│   │   ├── Modals/           # Inquiry, Lead, Campaign, Payout modals
│   │   ├── EarningsCalculator.jsx
│   │   └── Navbar.jsx        # Responsive navigation & theme switcher
│   ├── context/
│   │   ├── AuthContext.jsx   # User auth & token state
│   │   ├── DataContext.jsx   # Live API state & mutations
│   │   ├── ThemeContext.jsx  # 9-preset theme provider
│   │   └── ToastContext.jsx  # Notification toasts
│   ├── pages/
│   │   ├── Dashboard/        # Overview, Leads, Campaigns, Payouts, Assets, Settings
│   │   ├── LandingPage.jsx   # Rich public website
│   │   ├── LoginPage.jsx
│   │   └── SignupPage.jsx
│   ├── App.jsx
│   ├── index.css             # Theme design tokens & utilities
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/sairam0043/marketing_cuvasol.git
cd marketing_cuvasol
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Concurrently starts:
- **Frontend (Vite React)**: [http://localhost:3000](http://localhost:3000)
- **Backend (Express API)**: [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Build for Production

```bash
npm run build
```

---

## 📄 License
MIT License © 2026 Cuvasol Technologies, Inc. All rights reserved.
