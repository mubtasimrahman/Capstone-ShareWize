import React from 'react'
import { Navbar } from '../../components/Navbar/Navbar'

export default function AboutUs() {
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
            <h3 style={{color: 'white'}}>About Us</h3>
          </div>
        </div>
      </div>
    </>
  )
}
