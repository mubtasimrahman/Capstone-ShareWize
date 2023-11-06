import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className="homepage">
      <header>
        <h1>Expense Manager</h1>
      </header>
      <nav>
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
      </nav>
      <main>
        <section>
          <h2>Welcome to Expense Manager</h2>
          <p>Manage your expenses with ease and transparency. Join or create expense groups, track your spending, and settle up with friends.</p>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Log In</Link>
        </section>
      </main>
    </div>
  );
}

export default Homepage;

