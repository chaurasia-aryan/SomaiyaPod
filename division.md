# SomaiyaPod - Backend Project Division and Viva Guide

This document divides the backend project equally among 3 students with distinct, realistic, and believable Problem Statements (PS). The implementation is kept clean and simple so every student can easily explain their code during viva evaluation.

---

## 1. Group Summary (1-Minute Intro for Examiner)

"Our project is SomaiyaPod Mission Control. The backend is built using Node.js, Express.js, and MongoDB. We divided the backend into three equal, independent modules:

1. Person 1 implemented the User Authentication and Profile Management module using Mongoose and Express routes.
2. Person 2 developed the Telemetry CRUD Engine, dynamic route parameter handling, and real-time statistical calculations.
3. Person 3 configured the Express server architecture, MongoDB database connectivity, external live satellite API ingestion, and Google Gemini AI telemetry analysis."

---

## 2. Division Table

| Student | Assigned Module | Dedicated Problem Statement (PS) | Owned Files |
| :--- | :--- | :--- | :--- |
| **Person 1** | **User Authentication & Profile Module** | Problem Statement 1: Design and implement a user authentication and profile management module in Express.js with MongoDB to handle user registration, credential verification for login, and protected user profile retrieval. | `backend/models/User.js`<br>`backend/routes/auth.js` |
| **Person 2** | **Telemetry CRUD Engine & Analytics** | Problem Statement 2: Develop a RESTful API in Express.js and Mongoose to perform CRUD operations on space mission telemetry records, implement dynamic route handling (`/:id`), and calculate runtime statistical averages. | `backend/models/Telemetry.js`<br>`backend/routes/telemetry.js` |
| **Person 3** | **Server Setup, Database, Satellite API & AI** | Problem Statement 3: Configure the Express server architecture with MongoDB connectivity, implement live orbital satellite data ingestion with timeout fallback, and integrate Google Gemini AI for automated telemetry diagnostics. | `backend/server.js`<br>`backend/db.js`<br>`backend/routes/externalApi.js`<br>`backend/routes/ai.js`<br>`backend/.env.example` |

---

## 3. Person 1: User Authentication & Profile Module

### Problem Statement (PS 1)
"Design and implement a user authentication and profile management module in Express.js with MongoDB to handle user registration, credential verification for login, and protected user profile retrieval."

### Files Owned
- `backend/models/User.js`
- `backend/routes/auth.js`

### What I Built (How to Explain in Viva)
1. **User Schema (`models/User.js`)**:
   - Created the Mongoose schema for users with fields: `username` (unique, required), `email` (unique, required), `password` (required), and `role` (default: "Mission Operator").
2. **Registration Route (`POST /api/auth/register`)**:
   - Checks if the required fields (`username`, `email`, `password`) are provided.
   - Runs a check using `$or: [{ email }, { username }]` to verify that the username or email does not already exist.
   - Saves the new user directly to MongoDB using `user.save()`.
3. **Login Route (`POST /api/auth/login`)**:
   - Takes `username` (or email) and `password` from `req.body`.
   - Queries MongoDB using `User.findOne()` to find a record with matching credentials.
   - If found, returns success status and a user token. If not, returns 401 Unauthorized.
4. **Current Profile Route (`GET /api/auth/me`)**:
   - Reads the token from the `Authorization` header, extracts the user ID, and fetches the profile excluding the password (`.select("-password")`).

### Viva Questions & Answers
- **Q1: How does your login check work?**  
  *Answer:* In `POST /api/auth/login`, we extract the username and password from `req.body` and run `User.findOne({ $or: [{ username }, { email: username }], password })`. If a match is found in the database, login succeeds; otherwise, we return a 401 error.
- **Q2: Why use `$or` in registration?**  
  *Answer:* `$or` allows checking both the username and email in a single MongoDB query, ensuring no duplicate accounts are created.
- **Q3: Why use `.select("-password")` when returning the profile?**  
  *Answer:* It excludes the password field from the database query result so the password is never sent back over the network to the frontend.

---

## 4. Person 2: Telemetry CRUD Engine & Analytics

### Problem Statement (PS 2)
"Develop a RESTful API in Express.js and Mongoose to perform CRUD operations on space mission telemetry records, implement dynamic route handling (`/:id`), and calculate runtime statistical averages."

### Files Owned
- `backend/models/Telemetry.js`
- `backend/routes/telemetry.js`

### What I Built (How to Explain in Viva)
1. **Telemetry Schema (`models/Telemetry.js`)**:
   - Defined sensor fields: `battery` (Number), `temperature` (Number), `altitude` (Number), `speed` (Number), `pressure` (Number), `signalQuality` (Number), `status` ("Nominal", "Warning", "Critical"), and `timestamp` (Date).
2. **Read Operations (`GET /api/telemetry` & `GET /api/telemetry/:id`)**:
   - `GET /api/telemetry`: Reads records from MongoDB, accepts a `?limit` query parameter, and sorts by newest first (`.sort({ timestamp: -1 })`).
   - `GET /api/telemetry/:id`: Dynamic route that extracts `req.params.id` and queries a single record using `Telemetry.findById(id)`.
3. **Create & Autonomous Health Tagging (`POST /api/telemetry`)**:
   - Saves new sensor readings. Automatically calculates status:
     - `battery < 25` or `temperature > 60` -> Critical
     - `battery < 50` or `temperature > 40` -> Warning
     - Default -> Nominal
4. **Delete Operation (`DELETE /api/telemetry/:id`)**:
   - Deletes a specific telemetry record using `Telemetry.findByIdAndDelete(req.params.id)`.
5. **Statistical Averages (`GET /api/telemetry/stats`)**:
   - Pulls recent records and uses Array `reduce()` to calculate average battery and average temperature.
6. **Sample Data Seeder (`POST /api/telemetry/seed`)**:
   - Generates 12 historical time-series data points and saves them in one operation using `Telemetry.insertMany()`.

### Viva Questions & Answers
- **Q1: What is dynamic routing and how did you implement it?**  
  *Answer:* Dynamic routes contain variable parameters prefixed with a colon (`/:id`). In `router.get("/:id")`, Express stores the value in `req.params.id`, which we pass to `Telemetry.findById()`.
- **Q2: How do you calculate the average battery in `/stats`?**  
  *Answer:* We sum all battery values using Array `reduce` and divide by the array length: `records.reduce((acc, r) => acc + r.battery, 0) / total`.
- **Q3: What is the benefit of `Telemetry.insertMany()`?**  
  *Answer:* `insertMany()` executes a single batch write command to MongoDB rather than sending separate network requests in a loop.

---

## 5. Person 3: Server Setup, Database, Satellite API & AI

### Problem Statement (PS 3)
"Configure the Express server architecture with MongoDB connectivity, implement live orbital satellite data ingestion with timeout fallback, and integrate Google Gemini AI for automated telemetry diagnostics."

### Files Owned
- `backend/server.js`
- `backend/db.js`
- `backend/routes/externalApi.js`
- `backend/routes/ai.js`
- `backend/.env.example`

### What I Built (How to Explain in Viva)
1. **Server Architecture & Middleware (`server.js`)**:
   - Initialized Express on port 5000.
   - Configured `cors()` so the React frontend on port 5173 can connect.
   - Added `express.json()` to parse JSON bodies.
   - Created the `/api/health` monitoring endpoint.
2. **MongoDB Connection (`db.js`)**:
   - Wrote the `connectDB()` async function using `mongoose.connect()`. Reads `process.env.MONGO_URI` with a local fallback (`mongodb://127.0.0.1:27017/somaiyapod`).
3. **Live Satellite API Ingestion (`routes/externalApi.js`)**:
   - `GET /api/external/fetch-and-save`: Calls the open WhereTheISS.at REST API to get live ISS altitude and velocity, and saves it into MongoDB.
   - Wrapped with `AbortSignal.timeout(6000)` and a try/catch block. If the external API fails or is offline, it activates a mathematical simulation so the database save always succeeds.
4. **Gemini AI Diagnostics (`routes/ai.js`)**:
   - Uses the official `@google/generative-ai` library with the `gemini-3.8-flash` model.
   - `POST /api/ai/analyze`: Reads the latest 5 telemetry documents from MongoDB, formats them into a prompt, and asks Gemini to generate a flight briefing. If no API key is provided, it returns a local rule-based report so the server never crashes.
   - `POST /api/ai/chat`: Answers natural language questions from the operator with live telemetry attached as context.

### Viva Questions & Answers
- **Q1: How do you connect Express to MongoDB?**  
  *Answer:* We use Mongoose. In `db.js`, we call `mongoose.connect(MONGO_URI)` inside an async function and call it before starting `app.listen()` in `server.js`.
- **Q2: How do you handle third-party satellite API failures?**  
  *Answer:* We use a `try/catch` block with `AbortSignal.timeout(6000)`. If the request takes longer than 6 seconds or fails, the catch block triggers an orbital simulation formula to generate valid telemetry, keeping the endpoint reliable.
- **Q3: How does Gemini AI know the current status of the pod?**  
  *Answer:* In `/api/ai/analyze`, we query the latest 5 records from MongoDB first, format them into plain text, and pass them directly into Gemini's prompt as context.

---

## 6. Live Viva Demonstration Commands

### Terminal 1: MongoDB Shell
```bash
# Open MongoDB shell
mongosh

# Switch to project database
use somaiyapod

# View saved collections
show collections

# View recent telemetry records
db.telemetries.find().sort({ timestamp: -1 }).limit(3).pretty()

# View registered users
db.users.find()
```

### Terminal 2: Backend API Endpoints (cURL)
```bash
# 1. Health check (Person 3)
curl http://localhost:5000/api/health

# 2. Register user (Person 1)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"student1\",\"email\":\"student1@somaiya.edu\",\"password\":\"pass123\"}"

# 3. Login user (Person 1)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"student1\",\"password\":\"pass123\"}"

# 4. Get telemetry data (Person 2)
curl http://localhost:5000/api/telemetry?limit=3

# 5. Get telemetry statistics (Person 2)
curl http://localhost:5000/api/telemetry/stats

# 6. Fetch live satellite coordinates (Person 3)
curl http://localhost:5000/api/external/fetch-and-save

# 7. Run AI telemetry analysis (Person 3)
curl -X POST http://localhost:5000/api/ai/analyze
```
