import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-icons";
import { BrowserRouter as Router } from "react-router-dom";
import ToastNotification from "./components/ToastNotification";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <App />
    <ToastNotification />
  </Router>
);
