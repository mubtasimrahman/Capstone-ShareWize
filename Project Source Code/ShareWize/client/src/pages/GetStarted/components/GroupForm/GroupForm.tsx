import React, { useState } from "react";
import axios from "axios";
import "./GroupForm.css";

interface GroupFormProps {
  setGroupId: React.Dispatch<React.SetStateAction<number | null>>;
  onNext: () => void; // Callback function to switch to the next form
}

function GroupForm({ setGroupId, onNext }: GroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [groupCreated, setGroupCreated] = useState(false); // Track if the group is created

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
          setGroupCreated(true); // Set groupCreated to true
          onNext();
          console.log(groupId);
        }

        // Handle the success response here
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
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
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
    </div>
  );
}

export default GroupForm;
