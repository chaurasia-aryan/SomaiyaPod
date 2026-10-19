# SomaiyaPod - Backend Project Division and Viva Guide

This document defines the formal division of the SomaiyaPod Mission Control backend project equally among three students. Each student owns an independent, full-fledged subsystem accompanied by a comprehensive engineering Problem Statement (PS), operational context, input/output specifications, validation criteria, architectural breakdown, and examiner viva Q&A.

---

## 1. Group Summary (1-Minute Examiner Pitch)

"Our project is the SomaiyaPod Mission Control Ground Station backend, built using Node.js, Express.js, and MongoDB. To ensure a balanced, modular architecture, the system is divided equally into three dedicated engineering problem statements:

1. **Person 1 (Problem Statement 1)**: Architected the **User Authentication, Credential Verification & Operator Profile Subsystem**, delivering Mongoose schema persistence, unique constraint validation, login verification, and sanitized profile endpoints.
2. **Person 2 (Problem Statement 2)**: Engineered the **Telemetry Ingestion, Dynamic Routing & Statistical Analytics Subsystem**, developing dynamic RESTful routing (`/:id`), automated physical threshold classification, and runtime metric calculations.
3. **Person 3 (Problem Statement 3)**: Implemented the **Core Server Infrastructure, External Satellite API Ingestion & Gemini AI Diagnostics Subsystem**, managing MongoDB lifecycle connectivity, WhereTheISS.at orbital tracker ingestion with timeout fallback, and AI flight briefing generation."

---

## 2. Comprehensive Division Matrix

| Student | Assigned Subsystem | Formal Problem Statement (PS) | Owned Files |
| :--- | :--- | :--- | :--- |
| **Person 1** | **User Authentication & Operator Profile Subsystem** | **PS 1**: Design and implement a user authentication and session management subsystem within the SomaiyaPod ground station application that enables mission operators to register, verify credentials, and log into the system using interactive forms with client-side and server-side validation. Upon submission, the system should validate the username, institutional email format, and password criteria, execute atomic credential verification queries against MongoDB collections using Mongoose ODM, dispatch authenticated session tokens upon authorization, and dynamically deliver sanitized operator profile data with comprehensive error handling, duplicate prevention, and operational status indicators. | `backend/models/User.js`<br>`backend/routes/auth.js` |
| **Person 2** | **Telemetry Ingestion, Dynamic Routing & Analytics Subsystem** | **PS 2**: Design and implement a spacecraft telemetry data management and real-time processing engine within the SomaiyaPod application that enables flight operators to log, query, filter, and purge multi-sensor downlink records using dynamic route parameters and interactive controls with client-side and server-side validation. Upon submission or sensor ingestion, the system should validate numerical ranges for battery charge, thermal levels, altitude, velocity, and atmospheric pressure, automatically execute physical health threshold evaluations to assign flight statuses (Nominal, Warning, Critical), perform runtime statistical aggregations across active mission records using functional array reduction, and dynamically render time-series telemetry with comprehensive error handling and status indicators. | `backend/models/Telemetry.js`<br>`backend/routes/telemetry.js` |
| **Person 3** | **Core Server Infrastructure, Satellite Ingestion & Gemini AI Subsystem** | **PS 3**: Design and implement an external Web API integration and artificial intelligence diagnostic subsystem within the SomaiyaPod application that enables flight controllers to ingest real-time orbital tracking coordinates and submit Gemini AI prompts using interactive ground station forms with client-side and server-side validation. Upon submission or scheduled trigger, the system should validate API key authentication and network parameters, execute asynchronous HTTP requests to fetch live orbital satellite telemetry from the target Web API (WhereTheISS.at) or generate automated flight anomaly diagnoses using the Google Gemini SDK, and dynamically render real-time orbital coordinates, pass windows, and diagnostic briefings on screen with fault-tolerant timeout fallbacks, error handling, and server health status indicators. | `backend/server.js`<br>`backend/db.js`<br>`backend/routes/externalApi.js`<br>`backend/routes/ai.js`<br>`backend/.env.example`<br>`backend/vercel.json` |

---

## 3. Person 1: User Authentication & Operator Profile Subsystem

### 3.1 Formal Problem Statement (PS 1)
> "Design and implement a user authentication and session management subsystem within the SomaiyaPod ground station application that enables mission operators to register, verify credentials, and log into the system using interactive forms with client-side and server-side validation. Upon submission, the system should validate the username, institutional email format, and password criteria, execute atomic credential verification queries against MongoDB collections using Mongoose ODM, dispatch authenticated session tokens upon authorization, and dynamically deliver sanitized operator profile data with comprehensive error handling, duplicate prevention, and operational status indicators."

### 3.2 Operational Context & Motivation
In space ground control stations, multiple flight controllers collaborate to monitor payload status, track orbits, and execute flight directives. Uncontrolled or anonymous access introduces mission risks. A robust authentication mechanism is required to verify identity before granting access to critical telemetry controls, track who logged into the ground console, and ensure sensitive security credentials are never exposed over the network.

### 3.3 Scope & Technical Requirements
1. **Operator Data Modeling**: Define a Mongoose `User` schema containing `username` (unique, trimmed), `email` (unique, lowercase, validated), `password` (required, minimum length), and `role` (default: "Mission Operator").
2. **Operator Registration (`POST /api/auth/register`)**:
   - Client-side and server-side input validation for non-empty fields and email syntax.
   - Uniqueness verification using MongoDB `$or` to ensure neither username nor email is already claimed.
   - Persistence of valid operator records to MongoDB.
3. **Credential Verification & Login (`POST /api/auth/login`)**:
   - Dual-identifier login: operators can authenticate using either their username or email address.
   - Database lookup using `User.findOne()` matching credentials.
   - Dispatch of a standardized session token (`somaiya_token_<id>_<timestamp>`) and role metadata upon successful verification.
4. **Sanitized Profile Delivery (`GET /api/auth/me`)**:
   - Token extraction from `Authorization` header.
   - Document lookup using `.select("-password")` so the password field is completely omitted from the network response.

### 3.4 Input & Output Specifications
- **Registration Request (`POST /api/auth/register`)**:
  ```json
  {
    "username": "flight_controller_1",
    "email": "fc1@somaiya.edu",
    "password": "securepassword123",
    "role": "Mission Operator"
  }
  ```
- **Registration Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": "67b4f8a1e2b0...",
      "username": "flight_controller_1",
      "email": "fc1@somaiya.edu",
      "role": "Mission Operator"
    }
  }
  ```
- **Login Request (`POST /api/auth/login`)**:
  ```json
  {
    "username": "flight_controller_1",
    "password": "securepassword123"
  }
  ```
- **Login Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "somaiya_token_67b4f8a1e2b0_1740000000000",
    "user": {
      "id": "67b4f8a1e2b0...",
      "username": "flight_controller_1",
      "email": "fc1@somaiya.edu",
      "role": "Mission Operator"
    }
  }
  ```

### 3.5 Validation & Error Handling Criteria
- **400 Bad Request**: Missing `username`, `email`, or `password` fields; or duplicate username/email collision detected via `{ $or: [{ email }, { username }] }`.
- **401 Unauthorized**: Password mismatch or nonexistent operator during login; or invalid/missing bearer token when accessing `/api/auth/me`.
- **500 Internal Server Error**: Unexpected database connection drop, handled gracefully in `try/catch` with structured JSON error messages.

### 3.6 Viva Examination Q&A
- **Q1: How does your registration route prevent duplicate user accounts?**  
  *Answer:* Before persisting a new user, `POST /api/auth/register` executes `User.findOne({ $or: [{ email }, { username }] })`. If any document matches either the provided username or email, the route immediately responds with HTTP 400 and an informative error message.
- **Q2: Why did you use `.select("-password")` in the `/me` profile route?**  
  *Answer:* The `.select("-password")` projection tells MongoDB to omit the password field from the query projection, ensuring credentials never leave the database server or traverse the HTTP response stream.
- **Q3: Why allow login with either username or email?**  
  *Answer:* Flight controllers may remember either their institutional email address or their callsign username. By using `{ $or: [{ username: id }, { email: id }] }`, our backend supports both transparently in a single query.

---

## 4. Person 2: Telemetry Ingestion, Dynamic Routing & Analytics Subsystem

### 4.1 Formal Problem Statement (PS 2)
> "Design and implement a spacecraft telemetry data management and real-time processing engine within the SomaiyaPod application that enables flight operators to log, query, filter, and purge multi-sensor downlink records using dynamic route parameters and interactive controls with client-side and server-side validation. Upon submission or sensor ingestion, the system should validate numerical ranges for battery charge, thermal levels, altitude, velocity, and atmospheric pressure, automatically execute physical health threshold evaluations to assign flight statuses (Nominal, Warning, Critical), perform runtime statistical aggregations across active mission records using functional array reduction, and dynamically render time-series telemetry with comprehensive error handling and status indicators."

### 4.2 Operational Context & Motivation
During orbital flight passes, spacecraft instruments transmit continuous sensor readings. Flight operators must detect anomalies immediately. An automated telemetry engine is required to persist time-series packets into MongoDB, automatically evaluate critical health thresholds (such as battery depletion or thermal spikes), dynamically serve records by identifier for deep inspection, and compute operational statistical averages to monitor fleet trends.

### 4.3 Scope & Technical Requirements
1. **Telemetry Schema Definition (`models/Telemetry.js`)**:
   - Fields: `podId` (String), `battery` (Number, 0-100), `temperature` (Number, Celsius), `altitude` (Number, km), `speed` (Number, km/h), `pressure` (Number, kPa), `signalQuality` (Number, 0-100), `status` (String enum: Nominal, Warning, Critical), and `timestamp` (Date, indexed).
2. **Ingestion & Automated Threshold Evaluation (`POST /api/telemetry`)**:
   - Parses physical parameters from `req.body`.
   - Automated threshold rules:
     - `battery < 25` OR `temperature > 60` -> marked as **Critical**.
     - `battery < 50` OR `temperature > 40` -> marked as **Warning**.
     - Default -> marked as **Nominal**.
   - Saves record to MongoDB.
3. **Dynamic Routing Engine (`GET /:id` & `DELETE /:id`)**:
   - `GET /api/telemetry/:id`: Dynamic parameter extraction via `req.params.id` and lookup via `Telemetry.findById()`.
   - `DELETE /api/telemetry/:id`: Dynamic parameter extraction and removal via `Telemetry.findByIdAndDelete()`.
4. **Historical Telemetry Query (`GET /api/telemetry`)**:
   - Chronological sort (`.sort({ timestamp: -1 })`) with dynamic limit support (`?limit=N`).
5. **Runtime Statistical Analytics (`GET /api/telemetry/stats`)**:
   - Fetches recent records and calculates fleet averages (average battery, average temperature, and status breakdown) using functional Array `reduce()`.
6. **Bulk Flight Simulation Seeder (`POST /api/telemetry/seed`)**:
   - Injects a multi-cycle array of 12 sequential flight simulation records in a single database transaction using `Telemetry.insertMany()`.

### 4.4 Input & Output Specifications
- **Telemetry Ingestion Request (`POST /api/telemetry`)**:
  ```json
  {
    "podId": "SomaiyaPod-01",
    "battery": 84,
    "temperature": 23.5,
    "altitude": 420.5,
    "speed": 27600,
    "pressure": 101.3,
    "signalQuality": 95
  }
  ```
- **Telemetry Ingestion Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Telemetry record saved",
    "data": {
      "_id": "67b4fa01...",
      "podId": "SomaiyaPod-01",
      "battery": 84,
      "temperature": 23.5,
      "status": "Nominal",
      "timestamp": "2026-10-19T09:45:00.000Z"
    }
  }
  ```
- **Dynamic Lookup Request (`GET /api/telemetry/67b4fa01...`)**:
  - Response (200 OK): Returns single matched document.
  - Response (404 Not Found): `{ "success": false, "message": "Telemetry record not found" }`.

### 4.5 Validation & Error Handling Criteria
- **400 Bad Request**: Missing mandatory numeric fields (`battery`, `temperature`).
- **404 Not Found**: Dynamic route parameter `:id` does not match any document in MongoDB.
- **500 Internal Server Error**: Invalid ObjectID format or database read failure, caught and formatted safely.

### 4.6 Viva Examination Q&A
- **Q1: How did you implement dynamic route handling in Express?**  
  *Answer:* By declaring routes with parameter placeholders prefixed with a colon, such as `router.get("/:id")`. Express parses the path and places the parameter in `req.params.id`, which we pass to Mongoose methods like `Telemetry.findById(req.params.id)`.
- **Q2: Why compute stats using Array `reduce` instead of complex database pipelines?**  
  *Answer:* Array `reduce` executes in-memory with linear O(N) complexity for our active telemetry dataset, making the logic transparent, easy to test, and completely decoupled from database dialect differences during viva demonstrations.
- **Q3: What advantage does `insertMany()` offer over multiple `save()` calls?**  
  *Answer:* `insertMany()` sends a single batched write command over the database connection socket, whereas a loop of `save()` calls creates multiple round-trip network communications.

---

## 5. Person 3: Core Server Infrastructure, Satellite Ingestion & Gemini AI Subsystem

### 5.1 Formal Problem Statement (PS 3)
> "Design and implement an external Web API integration and artificial intelligence diagnostic subsystem within the SomaiyaPod application that enables flight controllers to ingest real-time orbital tracking coordinates and submit Gemini AI prompts using interactive ground station forms with client-side and server-side validation. Upon submission or scheduled trigger, the system should validate API key authentication and network parameters, execute asynchronous HTTP requests to fetch live orbital satellite telemetry from the target Web API (WhereTheISS.at) or generate automated flight anomaly diagnoses using the Google Gemini SDK, and dynamically render real-time orbital coordinates, pass windows, and diagnostic briefings on screen with fault-tolerant timeout fallbacks, error handling, and server health status indicators."

### 5.2 Operational Context & Motivation
Modern mission control centers require two external integrations: real-world orbital satellite positional tracking from third-party APIs, and automated generative AI diagnostics to evaluate flight trends and anomalies. Public third-party APIs can be slow, rate-limited, or temporarily offline; therefore, the server architecture must implement strict request timeouts and automated simulation fallbacks so the ground station never freezes. Furthermore, the core Express server must be production-ready and cloud-deployable on serverless platforms like Vercel.

### 5.3 Scope & Technical Requirements
1. **Core Server Infrastructure (`server.js`)**:
   - Boots Express on configurable `PORT || 5000`.
   - Exposes root `GET /` endpoint returning JSON status and API endpoint map (preventing "Cannot GET /" errors on cloud hosts).
   - Configures `cors()` middleware authorizing cross-origin requests from the React frontend.
   - Mounts `express.json()` body parser and health monitoring route (`GET /api/health`).
   - Configured for both standalone Node execution and Vercel serverless exports (`export default app`).
2. **Database Lifecycle Manager (`db.js`)**:
   - Manages asynchronous Mongoose connection to `process.env.MONGO_URI` with automatic fallback to local MongoDB instance (`mongodb://127.0.0.1:27017/somaiyapod`).
3. **External Satellite API Ingestion (`routes/externalApi.js`)**:
   - Interrogates the open WhereTheISS.at REST API (`https://api.wheretheiss.at/v1/satellites/25544`) to fetch live altitude, velocity, latitude, and longitude.
   - Enforces a 6-second timeout limit using `AbortSignal.timeout(6000)`.
   - Implements a resilient `catch` block that seamlessly generates mathematically consistent orbital trajectory data if the external API times out or is offline, persisting the result to MongoDB.
4. **Google Gemini AI Telemetry Diagnostics (`routes/ai.js`)**:
   - Integrates the official `@google/generative-ai` package using the `gemini-3.8-flash` model.
   - `POST /api/ai/analyze`: Queries the latest 5 telemetry documents from MongoDB, formats them into a structured prompt, and requests Gemini to evaluate operational anomalies and flight recommendations.
   - Includes a deterministic rule-based fallback report if no API key is provided, preventing server crashes during offline vivas.
   - `POST /api/ai/chat`: Interactive conversational engineering assistant providing answers grounded in live telemetry context.

### 5.4 Input & Output Specifications
- **Root Status Request (`GET /`)**:
  ```json
  {
    "project": "SomaiyaPod Mission Control Ground Station API",
    "status": "online",
    "endpoints": {
      "health": "/api/health",
      "auth": "/api/auth",
      "telemetry": "/api/telemetry",
      "external": "/api/external",
      "ai": "/api/ai"
    }
  }
  ```
- **External Satellite Ingestion (`GET /api/external/fetch-and-save`)**:
  ```json
  {
    "success": true,
    "message": "Live satellite coordinates ingested",
    "source": "WhereTheISS.at (Live Orbital Feed)",
    "data": {
      "podId": "ISS-ZARYA-25544",
      "altitude": 418.2,
      "speed": 27580,
      "status": "Nominal"
    }
  }
  ```
- **AI Telemetry Analysis (`POST /api/ai/analyze`)**:
  ```json
  {
    "success": true,
    "source": "Google Gemini 3.8 Flash",
    "recordsAnalyzed": 5,
    "report": "### Mission Telemetry Briefing\n- Battery Bus: Nominal at 84%...\n- Thermal Loop: Equilibrium at 23.5 C...\n- Recommendation: Maintain nominal attitude."
  }
  ```

### 5.5 Validation & Error Handling Criteria
- **Timeout Protection**: `AbortSignal.timeout(6000)` aborts stalled external HTTP requests after 6 seconds.
- **Fail-Safe Fallback**: If the external satellite API fails or Gemini API key is missing, the system gracefully generates calculated telemetry or a rule-based assessment with HTTP 200 rather than crashing the server.
- **Server Health Monitoring**: `GET /api/health` returns `{ "status": "online", "uptime": ... }` to verify runtime availability.

### 5.6 Viva Examination Q&A
- **Q1: How do you prevent third-party satellite API failures from crashing your ground station?**  
  *Answer:* We wrap the `fetch()` call in a `try/catch` block and pass `AbortSignal.timeout(6000)`. If the external API fails, rate-limits, or takes longer than 6 seconds, the catch block triggers an orbital mathematical simulation formula so the database save always completes.
- **Q2: Why is the root route `GET /` important for cloud deployment on Vercel?**  
  *Answer:* Without a root route `GET /`, browsers visiting the base domain receive Express's default `Cannot GET /` 404 error. The root route returns an active operational JSON payload documenting all available endpoints.
- **Q3: How does Gemini AI access telemetry records without querying the database directly?**  
  *Answer:* The Express route acts as a mediator: it queries the latest 5 records from MongoDB using Mongoose, formats them into a clean text summary, and injects that text directly into Gemini's prompt as flight context before requesting generation.

---

## 6. Live Viva Demonstration Commands

### Terminal 1: MongoDB Shell (`mongosh`)
```bash
# Connect to MongoDB
mongosh

# Switch to project database
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
# Test Person 3: Root Status Endpoint
curl http://localhost:5000/

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
