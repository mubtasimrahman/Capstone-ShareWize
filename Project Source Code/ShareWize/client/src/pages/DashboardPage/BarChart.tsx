import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { useEffect, useState } from 'react';
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

interface ExpenseSplit {
  ExpenseId: string;
  Percentage: string | number;
}

const dayLabels = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`);

export default function SimpleBarChart() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const googleId = useSelector((state: RootState) => state.auth.user?.sub);
  const [currentUser, setCurrentUser] = useState<UserObject | undefined>();
  const [expenseSplit, setExpenseSplit] = useState<ExpenseSplit[][]>([]);
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

      // Batch expense split requests
      const batchSize = 12; // Define the batch size
      const expenseSplitData: ExpenseSplit[][] = [];
      for (let i = 0; i < formattedExpenses.length; i += batchSize) {
        const batch = formattedExpenses.slice(i, i + batchSize);
        const batchExpenseSplitPromises = batch.map((expense) =>
          axios.get<ExpenseSplit[]>(
            `http://localhost:8000/users/${
              currentUser!.UserId
            }/expenseSplit?expenseIds=${expense.ExpenseId}`
          )
        );
        const batchExpenseSplitResponses = await Promise.all(
          batchExpenseSplitPromises
        );
        const batchExpenseSplitData = batchExpenseSplitResponses.map(
          (response) => response.data
        );
        expenseSplitData.push(...batchExpenseSplitData);
      }
      setExpenseSplit(expenseSplitData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extracting only the amount values
  const expenseAmounts = expenses.map((expense) => expense.Amount);

  if (loading && !fetchAttempted) {
    // Show loading indicator if fetch is not yet attempted
    return <div>Loading...</div>;
  } else if (loading && fetchAttempted) {
    // Show loading indicator if fetch is attempted but not completed
    return <div>Loading expenses...</div>;
  } else if (!loading && expenseAmounts.length === 0) {
    // Show message if expenses are fetched but none are available
    return <div>No expenses available.</div>;
  } else {
    // Render BarChart component once expenses are available
    return (
      <BarChart
        width={800} // Adjust width as needed
        height={400} // Adjust height as needed
        series={[
          { data: expenseAmounts, label: 'Total Spent', id: 'totalSpend' }, // Use expenseAmounts instead of expenses
        ]}
        xAxis={[{ data: dayLabels, scaleType: 'band' }]}
        yAxis={[{ scaleType: 'linear' }]} // Use linear scale for total spend
      />
    );
  }
}
