# SomaiyaPod Backend 🛰️

A clean, beginner-friendly Node.js + Express + MongoDB backend for the SomaiyaPod Mission Control platform.

## Features
- **User Authentication**: Register & Login with password encryption (bcryptjs) and JWT tokens.
- **MongoDB Telemetry Storage**: Stores sensor readings (battery, temperature, altitude, speed, status).
- **External API Fetch & Save**: Fetches real-time satellite telemetry (WhereTheISS.at / N2YO) and saves it into MongoDB.
- **Gemini AI Integration**: Autonomous telemetry diagnostics and AI chat powered by Google Gemini (`@google/generative-ai`).

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables (.env)
Create or edit `.env` in the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/somaiyapod
JWT_SECRET=somaiyapod_super_secret_jwt_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Backend Server
```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

Server runs on: `http://localhost:5000`

## API Endpoints

### 🔐 User Auth
- `POST /api/auth/register` - Create new user account `{ username, email, password }`
- `POST /api/auth/login` - Authenticate user `{ username, password }`
- `GET /api/auth/me` - Get logged-in user profile (Bearer token)

### 📊 Telemetry Data
- `GET /api/telemetry` - Get all telemetry records from MongoDB (supports `?limit=50`)
- `POST /api/telemetry` - Insert custom telemetry record
- `GET /api/telemetry/stats` - Summary aggregates (averages, latest status)
- `POST /api/telemetry/seed` - Populate 12 sample telemetry records
- `DELETE /api/telemetry/:id` - Delete record by ID

### 🛰️ Live API Fetch
- `GET /api/external/fetch-and-save` - Fetches live satellite position and writes directly to MongoDB

### ✨ Gemini AI
- `POST /api/ai/analyze` - Analyzes latest MongoDB telemetry with Gemini AI
- `POST /api/ai/chat` - Ask Gemini flight engineer questions `{ question }`
