import React, { useState } from "react";
import axios from "axios";

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
    <div>
      <h2 style={{ color: "white" }}>Add User to Group</h2>
      <input
        type="text"
        placeholder="User Email" // Change placeholder to reflect using email
        value={userEmail} // Change variable name to reflect using email
        onChange={(e) => setUserEmail(e.target.value)} // Change variable name to reflect using email
      />
      <button onClick={addUserToGroup}>Add User to Group</button>
    </div>
  );
}

export default UserForm;
