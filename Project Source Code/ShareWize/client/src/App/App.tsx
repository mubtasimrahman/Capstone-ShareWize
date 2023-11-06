import React from "react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import "./App.css";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.darkMode}>
    <BrowserRouter>
      <HomePage></HomePage>
    </BrowserRouter>
    </div>
  );
}

export default App;
