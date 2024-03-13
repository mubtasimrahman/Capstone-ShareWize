import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpenseForm.css";

interface ExpenseFormProps {
  groupId: number | null;
  userId: number;
}

interface Expense {
    ExpenseId: string;
    Description: string,
    Amount: number,
    UserName: string,
    GroupId: number | null
    DatePaid: string;
}

function ExpenseForm({ groupId, userId }: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (groupId) {
      fetchExpenses(groupId);
    }
  }, [groupId]);

  const fetchExpenses = (groupId: number) => {
    axios
      .get(`http://localhost:8000/groups/${groupId}/expenses`)
      .then((response) => {
        setExpenses(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
      });
  };

  const addExpense = (
    description: string,
    amount: number,
    userId: number,
    groupId: number | null
  ) => {
    axios
      .post(
        `http://localhost:8000/groups/${groupId}/expenses`,
        {
          description,
          amount,
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response); // Assuming you want to do something after adding the expense
        console.log("successfully added expense");
        // After adding the expense, fetch expenses again to update the list
        fetchExpenses(groupId || 0);
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
      })
      .finally(() => {
        // Any cleanup or additional logic after success or failure
      });
  };

  return (
    <div className={`container-expense ${groupId === null ? "hidden" : ""}`}>
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
        <button
          onClick={() => {
            addExpense(description, parseFloat(amount), userId || 0, groupId);
          }}
        >
          {" "}
          Add Expense
        </button>
      </div>

      <div className="section">
        <h2>Expenses</h2>
        <ul>
          {expenses.map((expense) => (
            <li key={expense.ExpenseId}>
              Description: {expense.Description} <br />
              Amount: ${expense.Amount} <br />
              Expense Maker: {expense.UserName} <br /><br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExpenseForm;
