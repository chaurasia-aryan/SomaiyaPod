# SomaiyaPod Backend Work Division & Viva Preparation Guide

This document outlines an equal, feature-based distribution of the backend codebase among three developers for viva and technical evaluation.

---

## 1. Feature Division Summary

| Developer | Core Domain | Feature Modules | Owned Files |
| :--- | :--- | :--- | :--- |
| **Person 1** | **Core Node.js & Security** | - Low-level HTTP Server (no frameworks)<br>- Asynchronous File Management (fs module)<br>- User Authentication & Bcrypt Hashing<br>- JWT Token Generation & Verification | `coreServer.js`<br>`data/telemetry.json`<br>`models/User.js`<br>`controllers/authController.js`<br>`routes/auth.js` |
| **Person 2** | **Express MVC & Telemetry Engine** | - Express Application Lifecycle & Middleware<br>- Telemetry Data Schema & Auto-Classification<br>- Full RESTful CRUD (Basic & Dynamic Routing `/:id`)<br>- Aggregate Statistics Engine & Data Seeding | `server.js`<br>`models/Telemetry.js`<br>`controllers/telemetryController.js`<br>`routes/telemetry.js` |
| **Person 3** | **Database, External Ingestion & AI** | - MongoDB Connection & `mongosh` CLI Administration<br>- Live External Satellite Ingestion (WhereTheISS.at)<br>- Failover Orbital Simulation Engine<br>- Google Gemini AI Diagnostics & Interactive Chat | `db.js`<br>`routes/externalApi.js`<br>`routes/ai.js`<br>`.env.example`<br>`mongosh` scripts |

---

## 2. Person 1: Core Node.js Engine & Authentication Security

### Role & Features Owned
Person 1 is responsible for the foundational Node.js protocols and application security:
1. **Core Node.js Web Server (`coreServer.js`)**:
   - Built entirely with native Node.js standard modules (`http`, `url`, `fs/promises`, `path`).
   - Uses `http.createServer` to handle raw request and response streams without any third-party framework.
   - Extracts URL paths and query parameters using the `url` module.
   - Implements manual HTTP response headers (`Content-Type: application/json`, CORS headers) and error codes (200, 201, 400, 404, 500).
2. **File-Based Telemetry Storage (`data/telemetry.json`)**:
   - Manages asynchronous file read (`fs.readFile`) and file write (`fs.writeFile`) operations.
   - Parses incoming request stream chunks (`req.on('data')`, `req.on('end')`), validates JSON, and updates the JSON file.
3. **User Authentication & Cryptography (`controllers/authController.js`, `models/User.js`, `routes/auth.js`)**:
   - Mongoose User schema with unique constraints, trimmed strings, and default roles.
   - Registration: Validates duplicate email/username with `$or` query, hashes passwords with `bcrypt.genSalt(10)` and `bcrypt.hash`.
   - Login: Validates credentials with `bcrypt.compare`, signs a JWT token with `jwt.sign` (7-day expiry).
   - Protected Route (`/api/auth/me`): Parses `Authorization: Bearer <token>`, verifies the signature with `jwt.verify`, and returns user profile without password (`.select("-password")`).

### Code Snippets to Highlight
- Native HTTP Request Processing: `coreServer.js`
- Password Hashing & Salt: `controllers/authController.js`
- Token Generation: `jwt.sign({ id, username }, secret, { expiresIn: '7d' })`

### High-Yield Viva Questions & Answers
- **Q1: Why did you build a server in Core Node.js when Express exists?**  
  *Answer:* Core Node.js illustrates how the fundamental event loop, HTTP request/response streams, and URL routing work under the hood without abstraction layers.
- **Q2: What is the difference between synchronous and asynchronous fs operations?**  
  *Answer:* Synchronous operations (`fs.readFileSync`) block the single-threaded Node.js event loop, preventing other requests from being processed. Asynchronous operations (`fs.promises.readFile`) run in libuv's thread pool, allowing the server to handle concurrent traffic.
- **Q3: What does the salt in bcrypt do?**  
  *Answer:* A salt is a random string concatenated with the password before hashing. It prevents attackers from using precomputed rainbow tables to reverse passwords and ensures identical passwords result in different hashes.
- **Q4: Why use JWT instead of cookies/session storage?**  
  *Answer:* JWT is stateless. The server does not allocate memory for session records. The client stores the signed token and transmits it in the `Authorization` header.
- **Q5: What happens when an invalid token is sent to `/api/auth/me`?**  
  *Answer:* `jwt.verify()` throws a `JsonWebTokenError`, which is caught by the catch block and returns a `401 Unauthorized` status with `{ success: false, message: "Invalid or expired token." }`.

---

## 3. Person 2: Express MVC RESTful Engine & Telemetry Pipeline

### Role & Features Owned
Person 2 is responsible for the Express server architecture, MVC design pattern, and telemetry data processing:
1. **Express Server Lifecycle & Middleware (`server.js`)**:
   - Initializing Express, loading environment variables via `dotenv`, enabling CORS, and configuring JSON body parsing (`express.json()`).
   - Mounting modular routes (`/api/auth`, `/api/telemetry`, `/api/external`, `/api/ai`).
   - Root health check endpoint (`/api/health`) returning operational status.
2. **Telemetry Data Schema (`models/Telemetry.js`)**:
   - Sensor fields: `battery` (0-100), `temperature`, `altitude`, `speed`, `pressure`, `signalQuality`, `source`, `status`, and `timestamp`.
   - Strict status enums: `["Nominal", "Warning", "Critical"]`.
3. **Telemetry Controller & Dynamic Routing (`controllers/telemetryController.js`, `routes/telemetry.js`)**:
   - **Create (`POST /api/telemetry`)**: Autonomous threshold engine automatically tags status:
     - `battery < 25` or `temperature > 60` -> `Critical`
     - `battery < 50` or `temperature > 40` -> `Warning`
     - Default -> `Nominal`
   - **Read All (`GET /api/telemetry`)**: Query parameter handling (`?limit=50`), sorted descending by timestamp.
   - **Dynamic Read (`GET /api/telemetry/:id`)**: Uses `req.params.id` to query specific documents via `Telemetry.findById()`.
   - **Aggregations (`GET /api/telemetry/stats`)**: Computes runtime mathematical averages (`avgBattery`, `avgTemperature`) using Array `reduce()`.
   - **Seed (`POST /api/telemetry/seed`)**: Synthesizes 12 historical time-series entries with trigonometric waves using `Telemetry.insertMany()`.
   - **Delete (`DELETE /api/telemetry/:id`)**: Deletes records by dynamic ID using `Telemetry.findByIdAndDelete()`.
   - **Core File Bridge (`GET /api/telemetry/file-based`)**: Exposes file-based telemetry to the Express API using `fs.readFile()`.

### Code Snippets to Highlight
- Dynamic parameter extraction: `const { id } = req.params;` in `telemetryController.js`
- Statistical calculations with Array reduce: `telemetryController.js`
- Autonomous status classifier logic: `telemetryController.js`

### High-Yield Viva Questions & Answers
- **Q1: Explain the MVC architecture in your project.**  
  *Answer:* Models (`models/Telemetry.js`) define the data structure and schema. Controllers (`controllers/telemetryController.js`) execute business logic, validations, and database queries. Routes (`routes/telemetry.js`) map HTTP methods and endpoints to their respective controller functions. The React frontend serves as the View layer.
- **Q2: What is the difference between `req.params`, `req.query`, and `req.body`?**  
  *Answer:* `req.params` extracts dynamic URL segments (e.g., `/api/telemetry/:id`). `req.query` extracts URL query string parameters (e.g., `?limit=50`). `req.body` contains the parsed JSON payload submitted in POST/PUT requests.
- **Q3: Why sort telemetry by `{ timestamp: -1 }`?**  
  *Answer:* Sorting by `-1` orders records from newest to oldest, ensuring the dashboard gets the latest mission data first.
- **Q4: Why use `insertMany()` for seeding instead of a loop with `.save()`?**  
  *Answer:* `insertMany()` issues a single batch database command over the network rather than sending multiple individual network round-trips.
- **Q5: How does your backend validate numerical ranges?**  
  *Answer:* Through Mongoose schema validators (`min: 0, max: 100` on battery) and controller checks prior to database persistence.

---

## 4. Person 3: MongoDB Architecture, External Ingestion & Gemini AI

### Role & Features Owned
Person 3 is responsible for database connectivity, external RESTful data pipelines, and artificial intelligence integration:
1. **Database Architecture & mongosh CLI (`db.js`, MongoDB)**:
   - Configures Mongoose connection in `db.js` with fallback error handling.
   - Demonstrates database management directly in the terminal via `mongosh`.
2. **External Satellite Ingestion Pipeline (`routes/externalApi.js`)**:
   - Consumes live satellite telemetry from the WhereTheISS.at REST API (`https://api.wheretheiss.at/v1/satellites/25544`).
   - Uses `AbortSignal.timeout(6000)` to prevent hanging requests.
   - Derives orbital temperature and solar battery states from daylight/eclipsed visibility flags.
   - **Orbital Simulation Fallback**: If external network fails or rate-limits, a mathematical orbital calculation generates realistic flight data so data persistence never fails.
   - Saves records directly to MongoDB collection `telemetries`.
3. **Google Gemini Generative AI Engine (`routes/ai.js`)**:
   - Integrates official `@google/generative-ai` SDK using `gemini-3.8-flash`.
   - **Grounded In-Context Prompting (`POST /api/ai/analyze`)**: Queries the last 5 MongoDB records, builds a chronological log, and prompts the model to deliver a flight diagnostics report.
   - **Autonomous Local Fallback**: If the Gemini API key is missing or quota is exhausted, `generateLocalDiagnostics()` generates a rule-based evaluation report without throwing a 500 error.
   - **Interactive Chat (`POST /api/ai/chat`)**: Provides context-aware answers to mission control operator questions.

### Code Snippets to Highlight
- Mongoose connection: `db.js`
- External API fetch with AbortSignal: `routes/externalApi.js`
- Gemini AI prompt grounding: `routes/ai.js`
- Rule-based fallback generator: `generateLocalDiagnostics()` in `routes/ai.js`

### High-Yield Viva Questions & Answers
- **Q1: How do you query MongoDB directly using mongosh?**  
  *Answer:* Open terminal, type `mongosh`, switch to database via `use somaiyapod`, and query with `db.telemetries.find().sort({ timestamp: -1 }).limit(5).pretty()`.
- **Q2: How do you prevent external API timeouts from crashing your backend?**  
  *Answer:* We use `AbortSignal.timeout(6000)` inside `fetch()`. If the signal triggers or an error occurs, the catch block calls the orbital simulation engine to compute fallback telemetry, ensuring 100% route uptime.
- **Q3: What model did you choose for AI diagnostics and why?**  
  *Answer:* `gemini-3.8-flash` for low latency, low token consumption, and fast response times required for mission telemetry.
- **Q4: How do you prevent hallucinations in Gemini's flight reports?**  
  *Answer:* Grounding. We extract real sensor readings from MongoDB and inject them as explicit factual context into the prompt before querying the LLM.
- **Q5: What happens if there is no internet connection or Gemini API key is not configured?**  
  *Answer:* The route catches the condition and delegates to `generateLocalDiagnostics()`, an internal heuristic function that produces a structured diagnostic briefing without server interruption.

---

## 5. MongoDB mongosh CLI Verification Commands

To demonstrate direct database operations during the viva:

```bash
# 1. Start mongosh
mongosh

# 2. View all databases
show dbs

# 3. Switch to project database
use somaiyapod

# 4. View collections
show collections

# 5. Count telemetry records
db.telemetries.countDocuments()

# 6. View the 3 most recent telemetry documents
db.telemetries.find().sort({ timestamp: -1 }).limit(3).pretty()

# 7. Query only Critical records
db.telemetries.find({ status: "Critical" }).pretty()

# 8. View registered users (passwords are hashed)
db.users.find({}, { username: 1, email: 1, role: 1, createdAt: 1 })
```

---

## 6. API Testing Reference (cURL / Thunder Client)

### Core Node.js Server (Port 5001)
```bash
# Read JSON file via Core Node.js fs module
curl http://localhost:5001/api/file-telemetry

# Write to JSON file via Core Node.js fs module
curl -X POST http://localhost:5001/api/file-telemetry \
  -H "Content-Type: application/json" \
  -d "{\"battery\":90,\"temperature\":21,\"altitude\":515,\"speed\":27510}"
```

### Express Server (Port 5000)
```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"pilot1\",\"email\":\"pilot1@somaiya.edu\",\"password\":\"flight123\"}"

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"pilot1\",\"password\":\"flight123\"}"

# Read telemetry records
curl http://localhost:5000/api/telemetry?limit=5

# Read aggregate statistics
curl http://localhost:5000/api/telemetry/stats

# Fetch and save live satellite position
curl http://localhost:5000/api/external/fetch-and-save

# Run Gemini AI diagnostics
curl -X POST http://localhost:5000/api/ai/analyze
```
