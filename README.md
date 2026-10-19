# SomaiyaPod Mission Control

Full-stack mission control and telemetry monitoring platform for SomaiyaPod.

## Tech Stack
- Frontend: React, Vite, Chart.js / Recharts, Lucide Icons
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt
- Intelligence: Google Gemini API (gemini-3.8-flash)
- Real-time Data: WhereTheISS.at Public API / Ground Station Simulation

## Project Structure
```text
SomaiyaPod/
|-- backend/               # Express + MongoDB backend
|   |-- models/            # Mongoose schemas (User, Telemetry)
|   |-- routes/            # API endpoints (auth, telemetry, external, ai)
|   |-- db.js              # MongoDB database connection
|   |-- server.js          # Express app entry point
|   `-- package.json       # Backend dependencies
|-- src/                   # React frontend application
|   |-- App.jsx            # Main dashboard shell
|   |-- AIPredictor.jsx    # Gemini AI diagnostics and chat interface
|   |-- API_Intergration.jsx # Live external feed panel
|   |-- TelemetryCharts.jsx# Real-time charts
|   `-- DataTab.jsx        # Telemetry database viewer
`-- package.json           # Frontend dependencies
```

## Running Locally

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Runs on: `http://localhost:5000`

### 2. Frontend Setup
In the project root directory:
```bash
npm install
npm run dev
```
Runs on: `http://localhost:5173`
