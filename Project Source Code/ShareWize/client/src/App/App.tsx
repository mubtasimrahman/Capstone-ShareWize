import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import "./App.css";
import styles from "./App.module.css";
import AboutUs from "../pages/AboutUs/AboutUs";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { Navbar } from "../components/Navbar/Navbar";
import LogInPage from "../pages/LogInPage/LogInPage";
import { Provider } from "react-redux";
import { store } from "./store/store";
import GetStarted from "../pages/GetStarted/GetStarted";

function App() {
  return (
    <div className={styles.lightMode}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/getStarted" element={<GetStarted />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
