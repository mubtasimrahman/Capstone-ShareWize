import React from "react";
import Introduction from "../components/Introduction/Introduction";
import { Navbar } from "../components/Navbar/Navbar";
import "./HomePage.css";

function Homepage() {
  return (
    <>
      {/* <header>
          <h1>Expense Manager</h1>
        </header> */}
      {/* <nav>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/expenses">Expenses</Link>
            </li>
            <li>
              <Link to="/groups">Groups</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Navbar></Navbar>
          </div>
        </div>
        <div className="row intro">
          <div className="col">
            <Introduction></Introduction>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;
