# SomaiyaPod Mission Control Ground Station

Full-stack spacecraft mission control and telemetry monitoring workstation for SomaiyaPod.

## Tech Stack
- **Frontend**: React 19, Vite, Vanilla CSS Design System (Scientific Workstation UI)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Intelligence**: Google Gemini AI (`gemini-3.8-flash`) with offline heuristic diagnostics
- **External Feeds**: WhereTheISS.at Public Satellite API with orbital physics fallback

---

## Clean Project Structure
```text
SomaiyaPod/
├── backend/                   # Node.js + Express + MongoDB Backend
│   ├── models/                # Mongoose Models (User, Telemetry)
│   ├── routes/                # RESTful Express Routers (auth, telemetry, externalApi, ai)
│   ├── db.js                  # Direct MongoDB Connection Manager
│   ├── server.js              # Express Server, Middleware & Route Mounts
│   ├── vercel.json            # Vercel Serverless Function Config
│   ├── .env.example           # Backend Environment Variables Template
│   └── package.json           # Backend Dependencies
│
├── frontend/                  # React + Vite Scientific Dashboard
│   ├── public/                # Static assets and icons
│   ├── src/                   # React Components & Views
│   │   ├── App.jsx            # Main Ground Station Shell & Ribbon Bar
│   │   ├── Navbar.jsx         # Station Navigation Strip
│   │   ├── DataTab.jsx        # Telemetry Data CRUD Table
│   │   ├── TelemetryCharts.jsx# High-Density Sensor Graphs & Metrics
│   │   ├── AIPredictor.jsx    # Gemini AI Flight Diagnostics & Engineering Assistant
│   │   ├── API_Intergration.jsx # Live Satellite Tracker Panel
│   │   ├── Forms.jsx          # Mission Operator Authentication Form
│   │   └── MissionInfo.jsx    # Ground Station Architecture Information
│   ├── index.html             # HTML5 Entry Point
│   ├── vite.config.js         # Vite Bundler Configuration
│   └── package.json           # Frontend Dependencies
│
├── division.md                # 3-Person Project Division & Viva Guide
├── README.md                  # Project Overview & Setup Instructions
├── package.json               # Root Orchestrator Scripts
└── .gitignore                 # Comprehensive Git Ignore Rules
```

---

## Running Locally

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on: `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 3. Root Orchestration (From Root Directory)
```bash
# Start Frontend
npm run dev:frontend

# Start Backend
npm run dev:backend

# Build Frontend Bundle
npm run build
```

---

## Viva Documentation
For viva preparation, problem statements, and examiner Q&A walkthroughs, see [`division.md`](./division.md).
