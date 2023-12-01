import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../App/store/store';

interface ExpenseFormProps {
  groupId: number;
  userId: number;
}

function ExpenseForm({ groupId, userId }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const addExpense = (description: string, amount: number, userId: number, groupId: number) => {
    axios
      .post(`http://localhost:8000/groups/${groupId}/expenses`, {
        description,
        amount,
        userId,// Assuming datePaid is not required here
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
      )
      .then((response) => {
        console.log(response)// Assuming you want to do something after adding the expense
        console.log('succcesfully added expense')

      })
      .catch((error) => {
        console.error('Error adding expense:', error);
      })
      .finally(() => {
        // Any cleanup or additional logic after success or failure
      });
  };
  

  return (
    <div>
      <h2>Add Expense</h2>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={() => {
            if (!description || !amount) {
              console.error('Description and amount are required.');
              return;
            }
    console.log('Button clicked');
    console.log('description:', description);
    console.log('amount:', parseFloat(amount));
    console.log('userId:', userId || 0);
    console.log('groupId:', groupId);
    addExpense(description, parseFloat(amount), userId || 0, groupId);
  }}>
        Add Expense
      </button>
    </div>
  );
}

export default ExpenseForm;
