import React from "react";
import  { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import "./App.css";
import styles from "./App.module.css";
import AboutUs from "../pages/AboutUs/AboutUs";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { Navbar } from "../components/Navbar/Navbar";

function App() {
  return (
    <div className={styles.darkMode}>
    <Router>
      <Navbar/>{
        //chamge this to header
      }
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/aboutUs' element={<AboutUs/>}/>

        <Route path='*' element={<ErrorPage/>}/>
        {
        //<Route path='/aboutUs' element={<AboutUs/>}/>
        //<Route path='/login' element={<LogIn/>}/>
        } 
      </Routes>
    </Router>
    </div>
  );
}

export default App;
