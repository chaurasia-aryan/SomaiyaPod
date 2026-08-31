import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

import data from "./data.json";

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