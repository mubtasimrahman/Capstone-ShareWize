import React, { useState } from "react";
import axios from "axios";
import "./UserForm.css";

interface UserFormProps {
  groupId: number;
}

function UserForm({ groupId }: UserFormProps) {
  const [userEmail, setUserEmail] = useState(""); // Change variable name to reflect using email

  const addUserToGroup = () => {
    axios
      .post(
        `http://localhost:8000/groups/${groupId}/users`,
        {
          userEmail, // Change variable name to reflect using email
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("User added response:", response);
      })
      .catch((error) => {
        console.error("Error adding user to group:", error);
      })
      .finally(() => {
        console.log(userEmail);
        // Any cleanup or additional logic after success or failure
      });
  };

  return (
    <div className="container">
      <div className="section">
        <h2>Add User to Group</h2>
        <input
          className="input"
          type="text"
          placeholder="User Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <button onClick={addUserToGroup}>Add User to Group</button>
      </div>
    </div>
  );
}

export default UserForm;
