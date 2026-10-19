# SomaiyaPod - Backend Project Division and Viva Guide

This document defines the formal division of the SomaiyaPod mission control backend project equally among three students. Each student owns an independent, full-fledged subsystem accompanied by an engineering Problem Statement (PS), detailed implementation breakdown, and comprehensive viva preparation answers. The implementation is purposefully kept clean, standard, and believable for undergraduate academic evaluation.

---

## 1. Group Summary (1-Minute Examiner Pitch)

"Our project is SomaiyaPod Mission Control Ground Station. The backend is built using Node.js, Express.js, and MongoDB. To ensure a balanced, modular architecture, the system is divided equally into three dedicated engineering problem statements:

1. **Person 1 (Problem Statement 1)**: Architected the **User Authentication & Mission Operator Profile Subsystem**, delivering schema persistence, credential verification, and sanitized profile endpoints.
2. **Person 2 (Problem Statement 2)**: Engineered the **Telemetry CRUD & Statistical Analytics Subsystem**, developing dynamic RESTful routing, autonomous threshold tagging, and runtime metric calculations.
3. **Person 3 (Problem Statement 3)**: Implemented the **Core Server Architecture, Satellite API Ingestion & Gemini AI Diagnostics Subsystem**, managing MongoDB lifecycle connectivity, external orbital tracker ingestion with timeout fallback, and AI flight briefing generation."

---

## 2. Comprehensive Division Matrix

| Student | Assigned Subsystem | Formal Problem Statement (PS) | Owned Files |
| :--- | :--- | :--- | :--- |
| **Person 1** | **User Authentication & Operator Profile Subsystem** | **PS 1**: Design, implement, and validate a secure, lightweight mission operator authentication and authorization backend service using Node.js, Express.js, and MongoDB to manage operator onboarding, credential verification, and sanitized profile delivery. | `backend/models/User.js`<br>`backend/routes/auth.js` |
| **Person 2** | **Telemetry Ingestion, Dynamic Routing & Analytics Subsystem** | **PS 2**: Develop a high-throughput RESTful telemetry processing engine in Express.js and Mongoose to handle full CRUD operations on multi-parameter spacecraft downlink records, dynamic record lookups (`/:id`), autonomous operational status tagging, and statistical aggregation. | `backend/models/Telemetry.js`<br>`backend/routes/telemetry.js` |
| **Person 3** | **Core Server Infrastructure, Satellite Ingestion & Gemini AI Subsystem** | **PS 3**: Architect the central Express application framework and MongoDB connectivity, build a fault-tolerant live orbital satellite ingestion pipeline interfacing with external REST APIs, and integrate Google Gemini AI for automated telemetry diagnostics. | `backend/server.js`<br>`backend/db.js`<br>`backend/routes/externalApi.js`<br>`backend/routes/ai.js`<br>`backend/.env.example` |

---

## 3. Person 1: User Authentication & Operator Profile Subsystem

### Detailed Problem Statement (PS 1)
"Design, implement, and validate a secure, lightweight mission operator authentication and authorization backend service using Node.js, Express.js, and MongoDB. In multi-operator ground control environments, operational safety demands that every telemetry injection, command sequence, and configuration change be attributed to an authorized ground operator. The objective is to construct a persistent Mongoose data model (`User`) enforcing unique constraints on operator handles and institutional email addresses, build robust RESTful onboarding endpoints (`POST /api/auth/register`) that guard against identity collisions, establish a streamlined credential verification mechanism (`POST /api/auth/login`) returning standardized session tokens, and develop a protected identity inspection endpoint (`GET /api/auth/me`) that safely strips password hashes prior to payload delivery. The service must handle edge cases such as missing parameters, duplicate registrations, and invalid credentials with clean HTTP status codes and structured JSON error responses without introducing over-engineered external dependencies."

### Subsystem Deliverables & Owned Code
- `backend/models/User.js`: Persistent schema with validation constraints (`username`, `email`, `password`, `role`).
- `backend/routes/auth.js`: Modular Express router exposing `/register`, `/login`, and `/me`.

### Technical Architecture & Viva Walkthrough
1. **User Schema Definition (`models/User.js`)**:
   - Configured schema fields: `username` (String, required, unique, trimmed), `email` (String, required, unique, lowercase, trimmed), `password` (String, required, minimum length 6), and `role` (String, enum: Mission Operator, Payload Specialist, Flight Director; default: Mission Operator).
   - Utilizes Mongoose timestamps to record registration audit dates.
2. **Operator Registration (`POST /api/auth/register`)**:
   - Performs incoming request validation to ensure all required fields are present.
   - Executes a unified uniqueness check using MongoDB `$or` operator: `{ $or: [{ email }, { username }] }`.
   - Saves the verified operator document directly to MongoDB via `new User(...).save()`.
3. **Operator Login & Verification (`POST /api/auth/login`)**:
   - Accepts operator identifier (`username` or `email`) and `password`.
   - Performs atomic credential lookup using `User.findOne({ $or: [{ username }, { email: username }], password })`.
   - If verified, dispatches an authentication token (`somaiya_token_<id>_<timestamp>`) alongside user role and display metadata. Returns 401 Unauthorized if verification fails.
4. **Sanitized Profile Delivery (`GET /api/auth/me`)**:
   - Intercepts bearer token from `req.headers.authorization`.
   - Retrieves the operator profile using `User.findById(userId).select("-password")`, ensuring password data never traverses the HTTP response stream.

### Viva Examination Q&A
- **Q1: How does your registration route prevent duplicate user accounts?**  
  *Answer:* Before persisting a new user, `POST /api/auth/register` executes `User.findOne({ $or: [{ email }, { username }] })`. If any existing document matches either the provided username or email, the route terminates immediately and returns an HTTP 400 Bad Request response with an explanatory message.
- **Q2: Why did you use `.select("-password")` in the `/me` profile route?**  
  *Answer:* The `.select("-password")` projection tells MongoDB to omit the password field when reading the document from storage. This guarantees sensitive authentication secrets are not exposed to client-side code or network sniffers.
- **Q3: How are authentication errors communicated to the client?**  
  *Answer:* The route uses standard HTTP status codes: 400 for malformed input payloads, 401 for unauthorized credentials or missing tokens, 404 for missing user records, and 500 for unexpected internal database exceptions, all packaged in a uniform `{ success: false, message: ... }` JSON structure.

---

## 4. Person 2: Telemetry Ingestion, Dynamic Routing & Analytics Subsystem

### Detailed Problem Statement (PS 2)
"Architect and implement an end-to-end RESTful spacecraft telemetry processing, dynamic routing, and statistical analytics engine using Express.js and Mongoose ODM. Real-time satellite operations require ground systems to ingest high-frequency downlink packets containing physical telemetry (battery level, operating temperatures, orbital altitude, velocity, cabin pressure, and RF signal quality) while empowering flight controllers to filter, inspect, and purge individual transmission events. The objective is to define a multi-sensor Mongoose schema with automated health threshold classification (marking transmissions as Nominal, Warning, or Critical based on live voltage and thermal thresholds), implement complete CRUD operations including dynamic URL parameter lookup (`GET /api/telemetry/:id`) and target document deletion (`DELETE /api/telemetry/:id`), calculate runtime analytical averages (`GET /api/telemetry/stats`) across active mission records using functional array reduction, and build a deterministic batch seeder (`POST /api/telemetry/seed`) using MongoDB bulk insertion to populate simulated flight histories during mission rehearsals."

### Subsystem Deliverables & Owned Code
- `backend/models/Telemetry.js`: Spacecraft telemetry schema with multi-sensor parameters and status tracking.
- `backend/routes/telemetry.js`: RESTful router implementing full CRUD, dynamic routing, statistical analytics, and bulk seeding.

### Technical Architecture & Viva Walkthrough
1. **Telemetry Schema Definition (`models/Telemetry.js`)**:
   - Defined sensor fields: `battery` (Number, 0-100%), `temperature` (Number, Celsius), `altitude` (Number, km), `speed` (Number, km/h), `pressure` (Number, kPa), `signalQuality` (Number, 0-100%), `status` (String enum: Nominal, Warning, Critical), `podId` (String), and `timestamp` (Date, indexed).
2. **Telemetry Ingestion & Autonomous Status Classification (`POST /api/telemetry`)**:
   - Parses sensor inputs from `req.body`.
   - Applies an automated health heuristics engine:
     - If `battery < 25` OR `temperature > 60` -> marked as **Critical**.
     - If `battery < 50` OR `temperature > 40` -> marked as **Warning**.
     - Otherwise -> marked as **Nominal**.
   - Persists the evaluated packet to MongoDB.
3. **Dynamic Route Operations (`GET /:id` & `DELETE /:id`)**:
   - `GET /api/telemetry/:id`: Extracts `req.params.id` and executes `Telemetry.findById(id)` to retrieve a single specific mission packet.
   - `DELETE /api/telemetry/:id`: Extracts `req.params.id` and executes `Telemetry.findByIdAndDelete(id)` to remove erroneous or test telemetry.
4. **Historical Telemetry Query (`GET /api/telemetry`)**:
   - Reads documents sorted chronologically by newest first (`.sort({ timestamp: -1 })`), supporting dynamic pagination via the `?limit` query parameter.
5. **Runtime Statistical Analytics (`GET /api/telemetry/stats`)**:
   - Aggregates recent telemetry records and uses Array `reduce()` to compute mean battery voltage, mean system temperature, and operational status distribution across the active fleet.
6. **Bulk Flight Simulation Seeder (`POST /api/telemetry/seed`)**:
   - Constructs an array of 12 sequential flight telemetry records reflecting orbital pass conditions and executes a single atomic write using `Telemetry.insertMany()`.

### Viva Examination Q&A
- **Q1: What is dynamic route matching and how is it handled in your module?**  
  *Answer:* Dynamic routes in Express use path parameters prefixed with a colon, such as `/api/telemetry/:id`. Express automatically captures the variable segment from the URL and makes it available under `req.params.id`, which we validate and pass directly to Mongoose queries like `findById` or `findByIdAndDelete`.
- **Q2: Why compute statistics in JavaScript using Array `reduce` instead of complex database aggregates?**  
  *Answer:* For student ground stations and lightweight time-series samples (latest 50 records), Array `reduce` provides predictable, transparent O(N) in-memory computation that can easily be audited and debugged during viva demonstrations without database dialect dependencies.
- **Q3: What makes `insertMany()` preferable over a loop of `save()` calls?**  
  *Answer:* `insertMany()` issues a single batch insert command over the MongoDB connection socket. A loop of `save()` calls creates multiple round-trip network communications, which causes overhead and latency.

---

## 5. Person 3: Core Server Infrastructure, Satellite Ingestion & Gemini AI Subsystem

### Detailed Problem Statement (PS 3)
"Configure and maintain the central Node.js/Express runtime infrastructure, manage scalable MongoDB lifecycle connectivity, and implement external API ingestion alongside generative artificial intelligence diagnostics for mission operations. Space ground stations depend on a resilient web application pipeline capable of cross-origin resource sharing (CORS), asynchronous JSON middleware parsing, and uninterrupted database persistence with automated local fallbacks. The objective is to engineer the central application server (`server.js`) with structured routing mounts and health telemetry (`/api/health`), develop the asynchronous database connector (`db.js`) supporting cloud and local connection strings, build an automated live orbital satellite data pipeline (`GET /api/external/fetch-and-save`) that pulls real-time ISS orbital coordinates from external REST endpoints with timeout guards and simulated trajectory fallbacks, and integrate the Google Gemini Generative AI SDK (`POST /api/ai/analyze` and `POST /api/ai/chat`) to perform automated anomaly detection and conversational flight briefing with graceful local heuristic fallback when API keys are not supplied."

### Subsystem Deliverables & Owned Code
- `backend/server.js`: Master application entry point, middleware pipeline, route mounts, and server listener.
- `backend/db.js`: Mongoose connection manager with lifecycle event handling and local failover.
- `backend/routes/externalApi.js`: External satellite tracking API integration with network timeout and simulation fallback.
- `backend/routes/ai.js`: Google Gemini Generative AI SDK integration with diagnostic prompts and local heuristic fallbacks.
- `backend/.env.example`: Configuration template for environment variables (`PORT`, `MONGO_URI`, `GEMINI_API_KEY`).

### Technical Architecture & Viva Walkthrough
1. **Server Architecture & Middleware Pipeline (`server.js`)**:
   - Boots Express on configurable `process.env.PORT || 5000`.
   - Configures `cors()` middleware to enable secure cross-origin communication from the React frontend running on port 5173.
   - Mounts `express.json()` for parsing incoming application/json request payloads.
   - Exposes the `/api/health` diagnostic endpoint reporting server uptime and timestamp.
   - Mounts child routers at `/api/auth`, `/api/telemetry`, `/api/external`, and `/api/ai`.
2. **MongoDB Connection Manager (`db.js`)**:
   - Defines the asynchronous `connectDB()` function utilizing `mongoose.connect()`.
   - Evaluates `process.env.MONGO_URI` with automatic fallback to local MongoDB instance (`mongodb://127.0.0.1:27017/somaiyapod`).
3. **External Satellite Tracker Pipeline (`routes/externalApi.js`)**:
   - `GET /api/external/fetch-and-save`: Interrogates the public WhereTheISS.at REST API to retrieve real-time latitude, longitude, altitude, and velocity.
   - Enforces a 6-second timeout limit using `AbortSignal.timeout(6000)` to prevent hanging sockets.
   - Implements a resilient `catch` block that seamlessly generates mathematically consistent orbital trajectory data if the third-party API is unreachable or rate-limited.
4. **Google Gemini Generative AI Diagnostics (`routes/ai.js`)**:
   - Integrates the official `@google/generative-ai` package using the `gemini-3.8-flash` model.
   - `POST /api/ai/analyze`: Queries the latest 5 telemetry packets from MongoDB, formats them into a structured operational briefing prompt, and requests Gemini to assess anomalies and provide maintenance recommendations.
   - Provides a rule-based deterministic fallback report if no `GEMINI_API_KEY` is present, guaranteeing zero server crashes during offline vivas.
   - `POST /api/ai/chat`: Answers natural language questions from flight controllers with live telemetry context appended to the prompt.

### Viva Examination Q&A
- **Q1: Why is CORS configuration necessary in `server.js`?**  
  *Answer:* Because the React frontend runs on port 5173 and the Express backend runs on port 5000, modern web browsers enforce the Same-Origin Policy and block requests between different origins. The `cors()` middleware adds appropriate `Access-Control-Allow-Origin` headers to authorize frontend requests.
- **Q2: How do you prevent third-party API failures from freezing your backend server?**  
  *Answer:* We pass `AbortSignal.timeout(6000)` to the `fetch()` call. If WhereTheISS.at does not respond within 6 seconds, the request aborts, throwing an error that is caught by our `try/catch` block, which activates our orbital physics simulation fallback so the database save always completes.
- **Q3: How does Gemini AI access telemetry records without querying the database directly?**  
  *Answer:* The Express route acts as a mediator. It fetches the latest 5 records from MongoDB using Mongoose, extracts the sensor readings into a human-readable text block, and injects that context directly into the Gemini prompt before calling `model.generateContent()`.

---

## 6. Live Viva Demonstration Commands

### Terminal 1: MongoDB Shell (`mongosh`)
```bash
# Connect to local MongoDB instance
mongosh

# Switch to the project database
use somaiyapod

# Verify persisted collections
show collections

# View newest telemetry records
db.telemetries.find().sort({ timestamp: -1 }).limit(3).pretty()

# View registered mission operators
db.users.find({}, { password: 0 })
```

### Terminal 2: Subsystem Verification via cURL

```bash
# Test Person 3: Core Server Health Check
curl http://localhost:5000/api/health

# Test Person 1: Register New Mission Operator
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"operator_alpha\",\"email\":\"alpha@somaiya.edu\",\"password\":\"pass123\"}"

# Test Person 1: Verify Operator Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"operator_alpha\",\"password\":\"pass123\"}"

# Test Person 2: Retrieve Recent Telemetry Records
curl http://localhost:5000/api/telemetry?limit=3

# Test Person 2: Calculate Runtime Fleet Statistics
curl http://localhost:5000/api/telemetry/stats

# Test Person 2: Seed Telemetry Flight Records
curl -X POST http://localhost:5000/api/telemetry/seed

# Test Person 3: Trigger Live Satellite Ingestion
curl http://localhost:5000/api/external/fetch-and-save

# Test Person 3: Execute Gemini AI Telemetry Analysis
curl -X POST http://localhost:5000/api/ai/analyze
```
