import React, { useState } from 'react';
import axios from 'axios';

interface UserFormProps {
  groupId: number;
}

function UserForm({ groupId }: UserFormProps) {
  const [userName, setUserName] = useState('');

  const addUserToGroup = () => {
    axios
      .post(`http://localhost:8000/api/groups/${groupId}/users`, {
        userName,
      })
      .then(() => {
        // Assuming you want to do something after adding the user to the group
      })
      .catch((error) => {
        console.error('Error adding user to group:', error);
      })
      .finally(() => {
        // Any cleanup or additional logic after success or failure
      });
  };

  return (
    <div>
      <h2>Add User to Group</h2>
      <input
        type="text"
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={addUserToGroup}>Add User to Group</button>
    </div>
  );
}

export default UserForm;
