/**
 * API_Intergration.jsx - Asynchronous Data Ingestion and Rendering
 * 
 * This component demonstrates how React applications load dynamic data
 * from external sources (APIs/Web Services) and update the UI once the data arrives.
 */

import React, { useState, useEffect } from "react";

const API_Integration = () => {
  // --- STATE DECLARATIONS ---
  // `items` holds the array of position records received from the API.
  const [items, setItems] = useState([]);
  
  // `dataIsLoaded` controls showing a "Loading..." message while wait times occur.
  const [dataIsLoaded, setDataIsLoaded] = useState(false);

  /**
   * Fetch Position Data from API
   * 
   * Declares a function that initiates an HTTP request.
   */
  const fetchData = () => {
    // 1. Set loading to false so the user gets feedback that new data is loading
    setDataIsLoaded(false);

    // 2. Fetch API request
    // Standard JS `fetch` returns a "Promise" (asynchronous placeholder object).
    fetch("/api/rest/v1/satellite/positions/25544/41.702/-76.014/0/2/&apiKey=NCDLWM-WMLKTR-4CJXPV-5TGN")
      .then((res) => res.json()) // 3. Once response headers arrive, convert the raw response stream to a JSON object
      .then((json) => {
        // 4. Update the state with positions list array retrieved from JSON
        setItems(json.positions || []);
        // 5. Toggle loading state off
        setDataIsLoaded(true);
      })
      .catch((err) => {
        // 6. Handle errors in case server is down or requests block
        console.error("Error fetching data:", err);
        setDataIsLoaded(true); 
      });
  };

  /**
   * Trigger Initial Data Fetch
   * 
   * Triggered when the component renders for the first time.
   * Equivalent to `componentDidMount` in legacy React class components.
   */
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this effect runs exactly once on load.

  // --- CONDITIONAL LOADING STATE RENDER ---
  if (!dataIsLoaded) {
    return <h1>Loading...</h1>;
  }

  // --- COMPONENT CONTENT RENDER ---
  return (
    <div className="App">
      <h3>Fetching Live location</h3>
      
      {/* Click handler to trigger reload fetch requests manually */}
      <button className="toggle-btn" onClick={fetchData}>
        Refresh Data
      </button>

      <div className="container">
        {/* 
          Renders lists in React using standard JavaScript Array `.map()` method.
          `.map()` iterates over the array and outputs a JSX block for each item.
          
          IMPORTANT: React needs a unique 'key' attribute (e.g. key={index})
          on the outermost element of each item in a list. This allows React to match
          rendered elements with items in the list efficiently when changes occur.
        */}
        {items.map((item, index) => (
          <div className="item" key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <div><strong>Latitude: </strong> {item.satlatitude}</div>
            <div><strong>Longitude: </strong> {item.satlongitude}</div>
            <div><strong>Altitude: </strong> {item.sataltitude}</div>
          </div>    
        ))}
      </div>
    </div>
  );
};

export default API_Integration;