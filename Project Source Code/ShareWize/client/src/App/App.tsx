import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import "./App.css";
import styles from "./App.module.css";
import AboutUs from "../pages/AboutUs/AboutUs";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { Navbar } from "../components/Navbar/Navbar";
import LogInPage from "../pages/LogInPage/LogInPage";


function App() {
  
  return (
    <div className={styles.darkMode}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/login" element={<LogInPage />} />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
