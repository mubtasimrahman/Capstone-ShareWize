import React, { useState } from "react";
import axios from "axios";
import "./ExpenseForm.css";

interface ExpenseFormProps {
  groupId: number;
}

function ExpenseForm({ groupId }: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const addExpense = () => {
    axios
      .post(`http://localhost:8000/groups/${groupId}/expenses`, {
        description,
        amount: parseFloat(amount),
      })
      .then(() => {
        // Assuming you want to do something after adding the expense
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
      })
      .finally(() => {
        // Any cleanup or additional logic after success or failure
      });
  };

  return (
    <div className="container">
      <div className="section">
        <h2>Add Expense</h2>
        <input
          className="input"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>
    </div>
  );
}

export default ExpenseForm;
