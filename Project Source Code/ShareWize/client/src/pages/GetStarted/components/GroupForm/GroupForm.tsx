import React, { useState } from "react";
import axios from "axios";
import "./GroupForm.css";

interface GroupFormProps {
  setGroupId: React.Dispatch<React.SetStateAction<number | null>>;
}

function GroupForm({ setGroupId }: GroupFormProps) {
  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = () => {
    axios
      .post(
        "http://localhost:8000/createGroup",
        {
          groupName: groupName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Group creation response:", response);

        if (response.data) {
          const groupId = response.data.groupID; // Assuming the server directly returns the groupId
          setGroupId(groupId); // Update the local state with the groupId
          console.log(groupId);
        }

        // Handle the success response here
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  };

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
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
    </div>
  );
}

export default GroupForm;
