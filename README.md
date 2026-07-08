# CareConnect - AI-Powered Healthcare Website

CareConnect is a modern, responsive, and secure full-stack Healthcare Website designed for digital patient experiences. It allows patients to check medical specialist lists, book consultations, purchase over-the-counter and prescription medicines, schedule lab diagnostics, access emergency contacts, read health articles, and get triage help from an integrated support chatbot.

---

## 🚀 Key Features

1. **Authentication**: Splash intro animation, secure signup, login, and token-based credentials recovery.
2. **Doctor Directory**: Specialties filter, live search, years of experience sorting, profile credentials, and reviews lists.
3. **Appointment Booking**: Virtual consult scheduling, interactive date pickers, available slots selection, patient form entries, and confirmation tickets.
4. **Pharmacy Store**: Pricing range sliders, categories filter, direct add-to-cart badges, dosages instructions, and product feedback list.
5. **Cart & Checkout**: Persistent cart quantities manager, subtotal calculations, secure shipping forms, multi-payment options, and order generation tickets.
6. **Lab Screenings**: Clinical diagnostics bookings, report durations indicators, and slots scheduler modals.
7. **Emergency Contacts**: Paramedics, blood banks, police dispatch numbers, trauma center coordinates, and quick dial buttons.
8. **Simulated Chat Support**: Floating widget running CareBot, a keyword-based AI triage assistant.
9. **Health Blog**: Dynamic health tips, wellness categories, reading times, and disease briefings.
10. **Contact Form**: Interactive query submission, office coordinates, and integrated Google Maps frame.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React (ES Modules), React Router v6, Vanilla CSS (Glassmorphism, scroll reveal, heart-wave ECG pulse SVG path animations, hover scales).
- **Backend**: Node.js, Express.js (REST API, CORS headers, JSON parsers).
- **Database**: MongoDB (via Mongoose) with an **Auto-Fallback JSON Database** (`api/mock_db.json`). If no MongoDB server is connected, the app is 100% functional locally out-of-the-box.
- **Hosting**: Optimized for **Vercel Deployment** (static-asset routes mapped to `/dist` and backend `/api/*` handled as serverless Node functions via `vercel.json`).

---

## 📁 Directory Structure

```text
├── api/                    # Express Backend & DB schemas
│   ├── auth.js             # JWT endpoints for user signin/signup
│   ├── db.js               # Mongoose connect & Mock JSON Db fallback
│   ├── index.js            # Express app entry & API controllers
│   └── mock_db.json        # Auto-seeded local mock database
├── src/                    # React Frontend
│   ├── components/         # Shared navbar, footer, buttons, splash
│   ├── data/               # Local static backup data (blogs)
│   ├── pages/              # 13 primary client views
│   ├── services/           # API fetching scripts
│   ├── App.jsx             # React routing & state contexts provider
│   ├── index.css           # Custom CSS styling system
│   └── main.jsx            # React client mounting script
├── package.json            # Node project configuration
├── vercel.json             # Vercel deployment directives
└── vite.config.js          # Vite assets bundle configurations
```

---

## ⚡ Setup & Execution

### 1. Download Dependencies
```bash
npm install
```

### 2. Run Locally
To run both the **Vite client** (http://localhost:5173) and **Express API** (http://localhost:5000) concurrently with active hot-reload:
```bash
npm run dev:full
```

### 3. Build & Compile Client Assets
```bash
npm run build
```

---

