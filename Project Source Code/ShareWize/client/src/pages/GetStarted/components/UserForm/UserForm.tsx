import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserForm.css";

interface UserFormProps {
  groupId: number | null;
}

interface User {
  UserId: number;
  Email: string;
}

function UserForm({ groupId }: UserFormProps) {
  const [userEmail, setUserEmail] = useState("");
  const [userAdded, setUserAdded] = useState(false); // State to track whether user is added
  const [groupUsers, setGroupUsers] = useState<User[]>([]); // State to store group users

  // Function to fetch and update group users
  const fetchGroupUsers = () => {
    axios
      .get(`http://localhost:8000/groups/${groupId}/users`)
      .then((response) => {
        setGroupUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching group users:", error);
      });
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupUsers(); // Fetch group users when groupId changes
    }
  }, [groupId]);

  const addUserToGroup = () => {
    axios
      .post(
        `http://localhost:8000/groups/${groupId}/users`,
        {
          userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("User added response:", response);
        setUserAdded(true); // Set userAdded state to true
        fetchGroupUsers(); // Fetch updated group users after adding user
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
    <div className="container-user">
      <div className="section">
        <h2>Add User to Group</h2>
        <input
          className="input"
          type="text"
          placeholder="User Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <button className="next-button" onClick={addUserToGroup}>
          Add User to Group
        </button>
      </div>
      {/* Display list of group users */}
      <div className="section">
        <h2>Group Users</h2>
        <ul>
          {groupUsers.map((user) => (
            <li key={user.UserId}>{user.Email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserForm;
