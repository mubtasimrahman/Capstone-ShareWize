import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/store/store';

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

interface GroupExpense {
  label: string;
  value: number;
}

export default function PieActiveArc() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const googleId = useSelector((state: RootState) => state.auth.user?.sub);
  const [currentUser, setCurrentUser] = useState<UserObject | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchAttempted, setFetchAttempted] = useState<boolean>(false);

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

  useEffect(() => {
    if (googleId) {
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

  const calculateGroupExpenses = (): GroupExpense[] => {
    const groupExpensesMap: { [key: string]: number } = {};

    // Calculate total expenses for each group
    expenses.forEach((expense) => {
      if (expense.GroupName in groupExpensesMap) {
        groupExpensesMap[expense.GroupName] += expense.Amount;
      } else {
        groupExpensesMap[expense.GroupName] = expense.Amount;
      }
    });

    // Format data into GroupExpense array
    const groupExpenses: GroupExpense[] = [];
    for (const groupName in groupExpensesMap) {
      groupExpenses.push({
        label: groupName,
        value: groupExpensesMap[groupName],
      });
    }

    return groupExpenses;
  };

  const groupExpenses = calculateGroupExpenses();

  return (
    <PieChart
      series={[
        {
          data: groupExpenses,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={200}
    />
  );
}
