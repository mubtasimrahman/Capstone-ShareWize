import React from 'react';
import './Introduction.css'; // Import your CSS file

function Introduction() {
  return (
    <section className="introduction">
      <div className="feature-container">
        <div className="feature">
          <div className="icon">Icon 1</div>
          <h3>Split Expenses with Ease</h3>
          <p>Share bills with friends and roommates effortlessly, ensuring everyone pays their fair share.</p>
        </div>
        <div className="feature">
          <div className="icon">Icon 2</div>
          <h3>Track Your Spending</h3>
          <p>Keep a close eye on your expenses and gain insights into your spending patterns.</p>
        </div>
        <div className="feature">
          <div className="icon">Icon 3</div>
          <h3>Seamless Expense Sharing</h3>
          <p>Create and manage shared expense groups for various purposes, making financial interactions transparent.</p>
        </div>
      </div>
      <button className="cta-button">Get Started</button>
    </section>
  );
}

export default Introduction;


