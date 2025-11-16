// src/index.js
import "./App.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// app bude vždy žiť v /shopping-list-app
const basename = "/shopping-list-app";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);