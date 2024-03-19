import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserForm.css";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface UserFormProps {
  groupId: number | null;
  userId: number | null;
}

interface User {
  UserId: number;
  Email: string;
}

function UserForm({ groupId, userId }: UserFormProps) {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [groupUsers, setGroupUsers] = useState<User[]>([]);

  const fetchGroupUsers = () => {
    if (groupId) {
      axios
        .get(`http://localhost:8000/groups/${groupId}/users`)
        .then((response) => {
          setGroupUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching group users:", error);
        });
    }
  };

  useEffect(() => {
    fetchGroupUsers();
  }, [groupId]); // Fetch group users when groupId changes

  const sendGroupMembershipRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/sendGroupMembershipRequest/${groupId}`,
        {
          userId,
          userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Group membership request sent:", response.data);
      setSuccess(true);
      // Update group users after successful request
      fetchGroupUsers();
    } catch (error) {
      console.error("Error sending group membership request:", error);
      setError(true);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
        setError(false);
      }, 5000);
    }
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
        <Button
          style={{ backgroundColor: "#198754" }}
          variant="contained"
          className="next-button"
          onClick={sendGroupMembershipRequest}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress color="inherit" size={24} />
          ) : success ? (
            "Sent ✔️"
          ) : error ? (
            "Error ❌"
          ) : (
            "Send Request"
          )}
        </Button>
      </div>
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
