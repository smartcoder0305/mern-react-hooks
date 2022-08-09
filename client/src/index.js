import React from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import App from "./App";
const root = createRoot(document.getElementById("root"));

root.render(
  <Router>
    <main>
      <App />
    </main>
  </Router>
);
