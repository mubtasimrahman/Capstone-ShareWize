import React, { useState } from "react";
import axios from "axios";

interface GroupFormProps {
  setGroupId: React.Dispatch<React.SetStateAction<number | null>>;
}

function GroupForm({ setGroupId }: GroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [creatorToken, setCreatorToken] = useState(""); // Assuming you have a way to get the creator's token

  const handleCreateGroup = () => {
    axios
      .post(
        "http://localhost:8000/createGroup",
        {
          groupName: groupName,
          creatorToken: creatorToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Group creation response:", response.data);
        const groupId = response.data; // Assuming the server directly returns the groupId
        setGroupId(groupId); // Update the local state with the groupId
        // Handle the success response here
      })
      .catch((error) => {
        console.error("Error creating group:", error);
        // Handle the error here
      });
  };

  return (
    <div>
      <h2>Create a New Group</h2>
      <label>
        Group Name:
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </label>
      {/* Assuming you have a way to get the creator's token */}
      <label>
        Creator Token:
        <input
          type="text"
          value={creatorToken}
          onChange={(e) => setCreatorToken(e.target.value)}
        />
      </label>
      <button onClick={handleCreateGroup}>Create Group</button>
    </div>
  );
}

export default GroupForm;
