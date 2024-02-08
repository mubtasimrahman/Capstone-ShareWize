import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/store/store';

interface Expense {
  ExpenseId: string;
  Description: string;
  Amount: number;
  UserName: string;
  GroupId: number | null;
  DatePaid: string;
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

  const handleFetchExpenses = async () => {
    if (currentUser) {
      try {
        const response = await axios.get<Expense[]>(`http://localhost:8000/users/${currentUser.UserId}/expenses`);
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    }
  };

  return (
    <div className="container-fluid" style={{ color: 'white' }}>
      <h2>Expenses</h2>
      <button onClick={handleFetchExpenses}>Fetch Expenses</button>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.ExpenseId}>
            Description: {expense.Description}, Amount: {expense.Amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
