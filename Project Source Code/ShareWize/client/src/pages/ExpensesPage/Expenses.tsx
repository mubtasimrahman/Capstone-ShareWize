import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store/store";
import "./Expenses.css";

interface Expense {
  ExpenseId: string;
  Description: string;
  Amount: number;
  DatePaid: Date;
  GroupName: string;
}

interface UserObject {
  UserId: number;
  GoogleId: string;
  DisplayName: string;
  Email: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const googleId = useSelector((state: RootState) => state.auth.user?.sub);
  const [currentUser, setCurrentUser] = useState<UserObject | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchAttempted, setFetchAttempted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("Date"); // Default sorting by Date

  useEffect(() => {
    if (googleId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get<UserObject>(
            `http://localhost:8000/getUser/${googleId}`
          );
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      fetchUser();
    } else {
      console.log("Error: googleId is undefined");
    }
  }, [googleId]);

  useEffect(() => {
    if (currentUser) {
      handleFetchExpenses();
    }
  }, [currentUser]);

  const handleFetchExpenses = async () => {
    setLoading(true);
    setFetchAttempted(true);
    try {
      const response = await axios.get<Expense[]>(
        `http://localhost:8000/users/${currentUser!.UserId}/expenses`
      );
      const formattedExpenses = response.data.map((expense) => ({
        ...expense,
        DatePaid: new Date(expense.DatePaid),
      }));
      setExpenses(formattedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const sortExpenses = (expenses: Expense[]) => {
    switch (sortBy) {
      case "Group":
        return expenses.sort((a, b) => a.GroupName.localeCompare(b.GroupName));
      case "Amount: Ascending":
        return expenses.sort((a, b) => a.Amount - b.Amount);
      case "Amount: Descending":
        return expenses.sort((a, b) => b.Amount - a.Amount);
      case "Date":
      default:
        return expenses.sort(
          (a, b) => b.DatePaid.getTime() - a.DatePaid.getTime()
        );
    }
  };

  return (
    <div className="container-fluid expense-container">
      <h2 className="text-white">Expenses</h2>
      <div className="d-flex flex-row mb-3">
        <div className="dropdown">
          <button
            type="button"
            className="btn btn-success dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Sort By: {sortBy}
          </button>
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => handleSortChange("Date")}
            >
              Date
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleSortChange("Group")}
            >
              Group
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleSortChange("Amount: Ascending")}
            >
              Amount: Ascending
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleSortChange("Amount: Descending")}
            >
              Amount: Descending
            </button>
          </div>
        </div>
      </div>
      <ul className="list-unstyled">
        {loading && <h3 style={{ color: "white" }}>Loading...</h3>}
        {!loading && expenses.length === 0 && fetchAttempted && (
          <h3 style={{ color: "white" }}>No expenses found</h3>
        )}
        {!loading &&
          expenses.length > 0 &&
          sortExpenses(expenses).map((expense) => (
            <li key={expense.ExpenseId} className="expense-item">
              <div className="expense-details">
                <p className="expense-description">
                  Description: {expense.Description}
                </p>
                <p className="expense-amount">Amount: ${expense.Amount}</p>
                <p className="expense-group">Group: {expense.GroupName}</p>
                <p className="expense-date">
                  Date Made: {new Date(expense.DatePaid).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
