# SomaiyaPod Backend

Node.js, Express, and MongoDB backend for the SomaiyaPod Mission Control platform.

## Features
- User Authentication: Register and login with bcrypt password hashing and JWT tokens.
- Telemetry Storage: MongoDB storage for battery, temperature, altitude, speed, pressure, and status.
- External Satellite Ingestion: Live ISS / satellite telemetry fetch with simulation fallback.
- AI Diagnostics: Automated mission analysis and chat powered by Google Gemini API.

## Folder Structure
```text
backend/
|-- models/
|   |-- Telemetry.js       # Sensor and flight telemetry Mongoose schema
|   `-- User.js            # User authentication Mongoose schema
|-- routes/
|   |-- ai.js              # Gemini AI telemetry analysis & chat
|   |-- auth.js            # User registration, login, and /me profile
|   |-- externalApi.js     # Satellite API fetch & save with fallback
|   `-- telemetry.js       # Telemetry CRUD, dynamic routes & stats
|-- .env.example           # Environment template
|-- db.js                  # MongoDB Mongoose connection
|-- division.md            # 3-person viva breakdown and guide
|-- package.json           # Dependencies and scripts
|-- README.md              # Documentation
`-- server.js              # Express app entry point
```

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (.env)
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/somaiyapod
JWT_SECRET=somaiyapod_jwt_secret_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Server
```bash
npm run dev
```
Server runs on: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (`{ username, email, password }`)
- `POST /api/auth/login` - Authenticate user and return JWT (`{ username, password }`)
- `GET /api/auth/me` - Get profile using Bearer token

### Telemetry
- `GET /api/telemetry` - Get all records (query parameter: `?limit=100`)
- `POST /api/telemetry` - Add a new record
- `GET /api/telemetry/stats` - Calculated averages and latest metrics
- `POST /api/telemetry/seed` - Seed 12 sample historical records
- `DELETE /api/telemetry/:id` - Delete record by ID

### External Ingestion
- `GET /api/external/fetch-and-save` - Pulls live orbital coordinates and saves to MongoDB

### AI Diagnostics
- `POST /api/ai/analyze` - Generates flight diagnostic briefing from database records
- `POST /api/ai/chat` - Flight assistant question answering (`{ question }`)

---

## Backend Team Viva Division

### Person 1: Server Architecture, Security & Authentication
- Files Owned: `server.js`, `db.js`, `models/User.js`, `routes/auth.js`
- Core Topics:
  1. Express server setup, CORS configuration, JSON body parsing.
  2. MongoDB connection using Mongoose in `db.js`.
  3. User model definition with uniqueness constraints and timestamps.
  4. Password hashing with bcrypt using 10 salt rounds.
  5. Stateless authentication via JWT tokens with 7-day expiration.
  6. Protected route implementation (`/me`) with Bearer token decoding and excluding password.

Viva Questions & Answers:
1. Q: Why use JWT instead of sessions?
   A: JWT is stateless and requires no server memory for session storage, making it lightweight and scalable.
2. Q: Why use bcrypt instead of plain hashing like MD5?
   A: Bcrypt includes a random salt and a configurable cost factor, preventing rainbow table and brute-force attacks.
3. Q: What does CORS middleware do?
   A: It allows the frontend on port 5173 to send HTTP requests to the backend on port 5000 without browser cross-origin blocks.

### Person 2: Telemetry Data Pipeline, Aggregations & External Ingestion
- Files Owned: `models/Telemetry.js`, `routes/telemetry.js`, `routes/externalApi.js`
- Core Topics:
  1. Telemetry schema design (battery validation 0-100, status enum: Nominal, Warning, Critical).
  2. Automated health calculation (e.g. battery < 25% or temperature > 60 C flags Critical).
  3. Sorting and pagination (`.sort({ timestamp: -1 }).limit(limit)`).
  4. Aggregate stats endpoint using JavaScript reduce to compute averages.
  5. Real-time satellite ingestion from WhereTheISS.at API with 6-second timeout.
  6. Resilient fallback generator calculating orbital curves when external APIs are unreachable.

Viva Questions & Answers:
1. Q: Why sort telemetry by timestamp -1?
   A: To fetch the latest sensor readings first so the dashboard displays current metrics.
2. Q: How is failure handled when the external satellite API is down?
   A: The fetch is wrapped with an AbortSignal timeout and try-catch block that activates an orbital simulation fallback so database writes never fail.
3. Q: Why use insertMany for seeding?
   A: It inserts all documents in a single bulk operation rather than making multiple round-trip calls.

### Person 3: AI Intelligence Engine & LLM Integration
- Files Owned: `routes/ai.js`, `server.js` (Health endpoint), Frontend AI bridge (`src/AIPredictor.jsx`)
- Core Topics:
  1. Google Gemini SDK (`@google/generative-ai`) integration using `gemini-3.8-flash`.
  2. Grounded prompt engineering: feeding recent MongoDB sensor readings into the LLM prompt.
  3. Autonomous local fallback engine (`generateLocalDiagnostics`) if API key is missing or quota is exhausted.
  4. Context-aware interactive flight chat endpoint (`/api/ai/chat`).
  5. Server health check endpoint (`/api/health`).

Viva Questions & Answers:
1. Q: Why use an LLM for telemetry analysis?
   A: While rules catch hard limits, an LLM synthesizes multiple variables over time, explains potential root causes, and delivers structured briefings.
2. Q: How do you prevent hallucinations in AI reports?
   A: Grounding. The backend queries MongoDB first, extracts exact numerical readings, and injects them directly into the prompt as strict context.
3. Q: What happens if there is no internet connection or no Gemini API key?
   A: The route detects missing keys or network errors and runs local heuristic rules to return a clean diagnostic report without throwing a 500 error.
