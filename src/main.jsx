import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import "./pravi-redesign.css";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basePath || undefined}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);