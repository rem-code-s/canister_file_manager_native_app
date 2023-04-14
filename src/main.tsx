import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import GlobalContextProvider from "./context/GlobalContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalContextProvider>
      <App />
    </GlobalContextProvider>
  </React.StrictMode>
);
