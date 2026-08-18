/**
 * main.jsx - The Entry Point of the React Application
 * 
 * In a React app, this is typically the first JavaScript/JSX file that runs.
 * It is responsible for grabbing the root container from index.html and rendering
 * the top-level React component (App) inside it.
 */

// 1. Import React library and ReactDOM library.
// ReactDOM is specifically used to interact with the browser's Document Object Model (DOM).
import React from "react";
import ReactDOM from "react-dom/client";

// 2. Import global styles.
// In Vite projects, you can import CSS files directly into JavaScript!
import "./index.css";

// 3. Import the main App component.
// We import it as 'App' from the './App.jsx' file.
import App from "./App";

// 4. Import raw data from a local JSON file.
// This simulated satellite telemetry data will be passed to App as props.
import data from "./data.json";

/**
 * 5. Render the Application
 * 
 * - `document.getElementById("root")` finds the empty <div id="root"></div> in index.html.
 * - `ReactDOM.createRoot()` creates a React root container at that location.
 * - `.render(...)` renders the JSX elements inside that root container.
 * 
 * - `<React.StrictMode>` is a helper component that activates checks and warnings during development.
 * - We pass properties (props) like `name`, `satelliteid`, `orbit`, and `frequency` to the <App /> component.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App
      name={data.name}
      satelliteid={data.satelliteid}
      orbit={data.orbit}
      frequency={data.frequency}
    />
  </React.StrictMode>
);