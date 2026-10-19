import React, { useState, useEffect } from "react";

function DataTab() {
  const [telemetryList, setTelemetryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for adding custom record
  const [newBattery, setNewBattery] = useState(85);
  const [newTemp, setNewTemp] = useState(24.5);
  const [newAltitude, setNewAltitude] = useState(500);
  const [newSpeed, setNewSpeed] = useState(27500);
  const [newStatus, setNewStatus] = useState("Nominal");

  // Fetch telemetry records from backend MongoDB
  const fetchTelemetryData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telemetry?limit=50");
      const data = await res.json();
      if (data.success) {
        setTelemetryList(data.data);
      }
    } catch (err) {
      console.error("Error fetching telemetry from MongoDB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetryData();
  }, []);

  // 1. Fetch live data from API and save directly to MongoDB
  const handleFetchFromLiveAPI = async () => {
    setLoading(true);
    setActionMessage("Connecting to external satellite API & saving to MongoDB...");
    try {
      const res = await fetch("/api/external/fetch-and-save");
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        // Refresh the list to include the newly saved record
        fetchTelemetryData();
      } else {
        setActionMessage("Failed to fetch live API data.");
      }
    } catch (err) {
      console.error("Fetch & Save error:", err);
      setActionMessage("Error connecting to backend API.");
    } finally {
      setLoading(false);
      setTimeout(() => setActionMessage(""), 5000);
    }
  };

  // 2. Seed 12 sample telemetry data points
  const handleSeedData = async () => {
    setLoading(true);
    setActionMessage("Generating 12 realistic telemetry points in MongoDB...");
    try {
      const res = await fetch("/api/telemetry/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        fetchTelemetryData();
      }
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setActionMessage(""), 5000);
    }
  };

  // 3. Delete a record from MongoDB
  const handleDeleteRecord = async (id) => {
    try {
      const res = await fetch(`/api/telemetry/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTelemetryList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 4. Submit manual telemetry record
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          podId: "SomaiyaPod-01",
          battery: Number(newBattery),
          temperature: Number(newTemp),
          altitude: Number(newAltitude),
          speed: Number(newSpeed),
          status: newStatus,
          source: "Manual Entry",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddForm(false);
        fetchTelemetryData();
        setActionMessage("New telemetry record saved to MongoDB!");
        setTimeout(() => setActionMessage(""), 4000);
      }
    } catch (err) {
      console.error("Add record error:", err);
    }
  };

  // Filtering records
  const filteredList = telemetryList.filter((item) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      item.status.toUpperCase() === statusFilter.toUpperCase();
    const matchesSearch =
      (item.podId && item.podId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.source && item.source.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="data-tab-container">
      <div className="page-header flex-between">
        <div>
          <h2>Telemetry Data Records (MongoDB)</h2>
          <p className="subtitle">
            Dedicated Telemetry Data Explorer &middot; Live API Sync &amp; Database Store
          </p>
        </div>

        <div className="flex-between" style={{ gap: "8px", flexWrap: "wrap" }}>
          <button
            className="primary-btn"
            onClick={handleFetchFromLiveAPI}
            disabled={loading}
          >
            {loading ? "Syncing..." : "Fetch & Save Live API"}
          </button>
          <button
            className="secondary-btn"
            onClick={handleSeedData}
            disabled={loading}
          >
            Seed Sample Data
          </button>
          <button
            className="secondary-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Close Form" : "Add Custom Data"}
          </button>
          <button
            className="secondary-btn"
            onClick={fetchTelemetryData}
            title="Refresh Table"
          >
            Refresh
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="notification-banner">
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Add Telemetry Form */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3>Add Manual Telemetry Entry to MongoDB</h3>
          <form onSubmit={handleAddSubmit} className="add-telemetry-form">
            <div className="form-row">
              <div className="form-group">
                <label>Battery (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newBattery}
                  onChange={(e) => setNewBattery(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Temperature (°C):</label>
                <input
                  type="number"
                  step="0.1"
                  value={newTemp}
                  onChange={(e) => setNewTemp(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Altitude (km):</label>
                <input
                  type="number"
                  value={newAltitude}
                  onChange={(e) => setNewAltitude(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Speed (km/h):</label>
                <input
                  type="number"
                  value={newSpeed}
                  onChange={(e) => setNewSpeed(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Nominal">Nominal</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <button type="submit" className="primary-btn">
                Save to Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card search-filter-bar" style={{ marginBottom: "16px" }}>
        <div className="flex-between">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by Pod ID or Source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-buttons">
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginRight: "6px" }}>
              Status Filter:
            </span>
            {["ALL", "NOMINAL", "WARNING", "CRITICAL"].map((st) => (
              <button
                key={st}
                className={`filter-btn ${statusFilter === st ? "active" : ""}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card table-card">
        <div className="flex-between" style={{ marginBottom: "12px" }}>
          <span style={{ fontWeight: 600, color: "var(--text-subtle)" }}>
            Showing {filteredList.length} of {telemetryList.length} Records in MongoDB
          </span>
          <span className="code-tag">Collection: telemetry</span>
        </div>

        {loading && telemetryList.length === 0 ? (
          <div className="loading-container">
            <p>Loading telemetry data from MongoDB...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="empty-state">
            <p>No telemetry records found matching your filters.</p>
            <button
              className="primary-btn"
              style={{ marginTop: "10px" }}
              onClick={handleFetchFromLiveAPI}
            >
              Fetch Live API Data
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="telemetry-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Pod / Target</th>
                  <th>Battery</th>
                  <th>Temperature</th>
                  <th>Altitude</th>
                  <th>Speed</th>
                  <th>Status</th>
                  <th>Data Source</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => {
                  const dateStr = item.timestamp
                    ? new Date(item.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "N/A";

                  return (
                    <tr key={item._id}>
                      <td style={{ whiteSpace: "nowrap" }}>{dateStr}</td>
                      <td style={{ fontWeight: 600 }}>{item.podId}</td>
                      <td>
                        <span
                          className={
                            item.battery < 40
                              ? "warning-text"
                              : "green-text"
                          }
                          style={{ fontWeight: 600 }}
                        >
                          {item.battery}%
                        </span>
                      </td>
                      <td>{item.temperature} °C</td>
                      <td>{item.altitude} km</td>
                      <td>{item.speed ? `${item.speed} km/h` : "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "Nominal"
                              ? "badge-nominal"
                              : item.status === "Warning"
                              ? "badge-warning"
                              : "badge-critical"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <span className="source-tag">{item.source}</span>
                      </td>
                      <td>
                        <button
                          className="delete-icon-btn"
                          title="Delete record from MongoDB"
                          onClick={() => handleDeleteRecord(item._id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTab;
