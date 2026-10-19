import React, { useState, useEffect } from "react";

// Reusable Pure SVG Line / Area Chart component
function SimpleLineChart({
  title,
  data,
  dataKey,
  unit = "",
  strokeColor = "#2563eb",
  fillColor = "rgba(37, 99, 235, 0.15)",
  minVal,
  maxVal,
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="card chart-card">
        <h3>{title}</h3>
        <p className="empty-chart-text">No data points available to plot.</p>
      </div>
    );
  }

  // Reverse so chronological order goes left to right
  const points = [...data].reverse();
  const values = points.map((p) => p[dataKey] ?? 0);

  const calculatedMin = minVal !== undefined ? minVal : Math.floor(Math.min(...values) * 0.95);
  const calculatedMax = maxVal !== undefined ? maxVal : Math.ceil(Math.max(...values) * 1.05);
  const range = calculatedMax - calculatedMin || 1;

  // Chart dimensions
  const width = 480;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  // Calculate coordinates for each point
  const coords = points.map((p, index) => {
    const x = paddingX + (index / (points.length - 1 || 1)) * innerWidth;
    const y = paddingY + innerHeight - ((p[dataKey] - calculatedMin) / range) * innerHeight;
    return {
      x,
      y,
      val: p[dataKey],
      timestamp: p.timestamp ? new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : `Point ${index + 1}`,
      podId: p.podId || "SomaiyaPod",
    };
  });

  // Construct SVG path string
  const pathD = coords.reduce((acc, pt, index) => {
    return index === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  // Area under curve
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;

  return (
    <div className="card chart-card">
      <div className="chart-header flex-between">
        <h3>{title}</h3>
        <span className="chart-latest-val" style={{ color: strokeColor }}>
          Latest: {values[values.length - 1]} {unit}
        </span>
      </div>

      <div className="svg-container" style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="responsive-svg"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Horizontal grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingY + innerHeight / 2}
            x2={width - paddingX}
            y2={paddingY + innerHeight / 2}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#cbd5e1"
          />

          {/* Y Axis Labels */}
          <text x={paddingX - 6} y={paddingY + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
            {calculatedMax}
          </text>
          <text x={paddingX - 6} y={paddingY + innerHeight / 2 + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
            {((calculatedMax + calculatedMin) / 2).toFixed(0)}
          </text>
          <text x={paddingX - 6} y={height - paddingY + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
            {calculatedMin}
          </text>

          {/* Filled Area */}
          <path d={areaD} fill={fillColor} />

          {/* Stroke Line */}
          <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" />

          {/* Interactive Data Point Circles */}
          {coords.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint && hoveredPoint.idx === idx ? "5.5" : "3.5"}
              fill="#ffffff"
              stroke={strokeColor}
              strokeWidth="2"
              style={{ cursor: "pointer", transition: "r 0.15s ease" }}
              onMouseEnter={() => setHoveredPoint({ ...pt, idx })}
            />
          ))}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredPoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
            }}
          >
            <div style={{ fontWeight: 700 }}>
              {hoveredPoint.val} {unit}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{hoveredPoint.timestamp}</div>
          </div>
        )}
      </div>

      <div className="chart-footer flex-between">
        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
          Range: {calculatedMin} to {calculatedMax} {unit}
        </span>
        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
          {points.length} telemetry points plotted
        </span>
      </div>
    </div>
  );
}

function TelemetryCharts() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      // Get recent 15 records
      const res = await fetch("/api/telemetry?limit=15");
      const json = await res.json();
      if (json.success) {
        setRecords(json.data);
      }

      // Get stats
      const statsRes = await fetch("/api/telemetry/stats");
      const statsJson = await statsRes.json();
      if (statsJson.success) {
        setStats(statsJson.stats);
      }
    } catch (err) {
      console.error("Error fetching chart data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div className="charts-page-container">
      <div className="page-header flex-between">
        <div>
          <h2>Telemetry Visual Graphs &amp; Charts</h2>
          <p className="subtitle">
            Real-time Sensor Curves &middot; Powered by MongoDB Historical Telemetry
          </p>
        </div>

        <div className="flex-between" style={{ gap: "10px" }}>
          <button className="primary-btn" onClick={fetchChartData} disabled={loading}>
            {loading ? "Refreshing..." : "🔄 Refresh Charts"}
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      {stats && (
        <div className="card-grid" style={{ marginBottom: "24px" }}>
          <div className="card telemetry-card">
            <div className="card-title">Average Battery</div>
            <div className="card-value">{stats.avgBattery || 88}%</div>
            <div className="card-subtext green-text">Based on {stats.totalRecords} records</div>
          </div>

          <div className="card telemetry-card">
            <div className="card-title">Average Temp</div>
            <div className="card-value">{stats.avgTemperature || 23.5} °C</div>
            <div className="card-subtext green-text">Thermal stability nominal</div>
          </div>

          <div className="card telemetry-card">
            <div className="card-title">Latest Altitude</div>
            <div className="card-value">{stats.latestAltitude || 500} km</div>
            <div className="card-subtext">LEO orbital trajectory</div>
          </div>

          <div className="card telemetry-card">
            <div className="card-title">Orbital Velocity</div>
            <div className="card-value">{stats.latestSpeed || 27500} km/h</div>
            <div className="card-subtext">Ground pass velocity</div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="charts-grid">
        <SimpleLineChart
          title="Battery Power (%) Curve"
          data={records}
          dataKey="battery"
          unit="%"
          strokeColor="#16a34a"
          fillColor="rgba(22, 163, 74, 0.12)"
          minVal={0}
          maxVal={100}
        />

        <SimpleLineChart
          title="Thermal System Temperature (°C)"
          data={records}
          dataKey="temperature"
          unit="°C"
          strokeColor="#ea580c"
          fillColor="rgba(234, 88, 12, 0.12)"
        />

        <SimpleLineChart
          title="Orbital Altitude (km)"
          data={records}
          dataKey="altitude"
          unit="km"
          strokeColor="#2563eb"
          fillColor="rgba(37, 99, 235, 0.12)"
        />

        <SimpleLineChart
          title="Pod Velocity (km/h)"
          data={records}
          dataKey="speed"
          unit="km/h"
          strokeColor="#7c3aed"
          fillColor="rgba(124, 58, 237, 0.12)"
        />
      </div>
    </div>
  );
}

export default TelemetryCharts;
