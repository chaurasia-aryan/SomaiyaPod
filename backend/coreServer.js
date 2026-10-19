// Core Node.js Web Server (No Express, Built-in Modules Only)
import http from "http";
import url from "url";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "data", "telemetry.json");
const PORT = process.env.CORE_PORT || 5001;

// Helper: Send JSON response
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
};

// Create Core HTTP Server
const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  // Parse URL with url module
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // 1. Home endpoint
    if (pathname === "/" && method === "GET") {
      return sendJSON(res, 200, {
        status: "online",
        server: "Core Node.js HTTP Server",
        endpoints: ["GET /api/file-telemetry", "POST /api/file-telemetry"],
      });
    }

    // 2. GET /api/file-telemetry - Asynchronously read JSON file using fs
    if (pathname === "/api/file-telemetry" && method === "GET") {
      const fileData = await fs.readFile(DATA_FILE, "utf-8");
      const json = JSON.parse(fileData);
      return sendJSON(res, 200, { success: true, count: json.length, data: json });
    }

    // 3. POST /api/file-telemetry - Asynchronously write JSON to file using fs
    if (pathname === "/api/file-telemetry" && method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          if (!body) {
            return sendJSON(res, 400, { success: false, message: "Empty request body" });
          }

          const newEntry = JSON.parse(body);
          const fileData = await fs.readFile(DATA_FILE, "utf-8");
          const list = JSON.parse(fileData);

          const record = {
            id: String(Date.now()),
            podId: newEntry.podId || "SomaiyaPod-01",
            battery: Number(newEntry.battery) || 85,
            temperature: Number(newEntry.temperature) || 24,
            altitude: Number(newEntry.altitude) || 500,
            speed: Number(newEntry.speed) || 27500,
            status: newEntry.status || "Nominal",
            source: "Core Node.js FS Write",
            timestamp: new Date().toISOString(),
          };

          list.unshift(record);
          await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");

          return sendJSON(res, 201, {
            success: true,
            message: "Record saved via Core Node.js fs.writeFile!",
            data: record,
          });
        } catch (parseError) {
          return sendJSON(res, 400, { success: false, message: "Invalid JSON format" });
        }
      });
      return;
    }

    // 4. 404 Route Not Found
    return sendJSON(res, 404, {
      success: false,
      message: `Cannot ${method} ${pathname} on Core HTTP Server`,
    });
  } catch (error) {
    console.error("Core Server Error:", error);
    return sendJSON(res, 500, { success: false, message: "Internal Server Error" });
  }
});

server.listen(PORT, () => {
  console.log(`Core Node.js server running on http://localhost:${PORT}`);
});
