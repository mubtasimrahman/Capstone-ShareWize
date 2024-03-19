import React, { useState } from "react";
import axios from "axios";
import "./GroupForm.css";
import Button from '@mui/material/Button';

interface GroupFormProps {
  setGroupId: React.Dispatch<React.SetStateAction<number | null>>;
  onNext: () => void; // Callback function to switch to the next form
  userId: number; // Add userId prop
  onGroupNameChange: (name: string) => void; // Add a callback for handling groupName change
}

function GroupForm({ setGroupId, onNext, userId, onGroupNameChange }: GroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [groupCreated, setGroupCreated] = useState(false); // Track if the group is created

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/createGroup",
        {
          groupName: groupName,
          userId: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Group creation response:", response);
  
      if (response.data) {
        const groupId = response.data.groupID;
        setGroupId(groupId);
        setGroupCreated(true);
        onGroupNameChange(groupName); // Pass groupName back to parent
        onNext();
        console.log(groupId);
  
        axios
          .post(
            `http://localhost:8000/addUserToGroup`,
            {
              groupId: groupId,
              userId: userId,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((addUserResponse) => {
            console.log("User added to group response:", addUserResponse.data);
          })
          .catch((addUserError) => {
            console.error("Error adding user to group:", addUserError);
          })
          .finally(() => {
            // Any cleanup or additional logic after success or failure
          });
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };
  

  if (groupCreated) {
    return null; // If the group is created, hide the GroupForm component
  }

  return (
    <div className="container">
      <div className="section">
        <h2>Create a New Group</h2>
        <label>
          Group Name:
          <input
            className="input"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </label>
        <Button style={{backgroundColor:"#198754"}} variant="contained" onClick={handleCreateGroup}>Create Group</Button>
      </div>
    </div>
  );
}

export default GroupForm;