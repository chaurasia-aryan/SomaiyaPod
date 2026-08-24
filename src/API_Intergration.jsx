import React, { useState, useEffect } from "react";

const SatelliteCard = ({ satelliteData }) => {
  const { satlatitude, satlongitude, sataltitude } = satelliteData;
  return (
    <div className="satellite-card">
      <div className="card-row">
        <strong>Latitude: </strong> {satlatitude}
      </div>
      <div className="card-row">
        <strong>Longitude: </strong> {satlongitude}
      </div>
      <div className="card-row">
        <strong>Altitude: </strong> {sataltitude}
      </div>
    </div>
  );
};

const API_Integration = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [inputKey, setInputKey] = useState(""); 
  const [error, setError] = useState("");
   const fetchData = async (keyToUse) => {
  const activeKey = keyToUse || apiKey;
  if (!activeKey) {
    setError("No API key found.");
    return;
  }
  setIsLoading(true);
  setError("");
    const response = await fetch(
      `/api/rest/v1/satellite/positions/25544/41.702/-76.014/0/2/?apiKey=${activeKey}`
    );
    const json = await response.json();
    if (json.positions) {
      setItems(json.positions);
      setIsLoading(false);
    } else {
      setError("Invalid data format received.");
    }
};

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setError("Please enter a valid API key.");
      return;
    }
    setApiKey(inputKey);
    setError("");
    fetchData(inputKey);
  };

  return (
    <div className="api-integration-container">
      <h3>Satellite Live Location Dashboard</h3>
      <form onSubmit={handleSaveKey} className="api-key-form">
        <label >Enter Dashboard API Key:</label>
        <input
          id="apiKeyInput"
          type="PASSWORD"
          placeholder="Enter your API key here..."
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          className="api-key-input"
        />
        <button type="submit" className="btn btn-primary">
          Load & Save API Key
        </button>
      </form>
      <div className="error-banner">{error}</div>
      {isLoading ? (
        <h1 className="loading-state">Loading satellite tracks...</h1>
      ) : (
        <div className="satellite-grid">
          {items.length > 0 ? (
            items.map((item, index) => (
              <SatelliteCard key={index} satelliteData={item} />
            ))
          ) : (
            <p className="info-message">Please submit your API key.</p>
          )}
        </div>
      )}
        <button className="btn btn-refresh" onClick={() => fetchData()}>
          Refresh Data
        </button>
    </div>
  );
};

export default API_Integration;