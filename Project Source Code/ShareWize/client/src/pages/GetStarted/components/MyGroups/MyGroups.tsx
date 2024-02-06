// MyGroups.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyGroups.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../../App/store/store";

// Define an interface for the group object
interface Group {
  GroupId: number;
  GroupName: string;
}

interface MyGroupsProps {
  onGroupClick: (group: Group) => void; // Callback function to handle group click
}

function MyGroups({ onGroupClick }: MyGroupsProps) {
  const userId = useSelector((state: RootState) => state.auth.user?.sub);
  const [groups, setGroups] = useState<Group[]>([]); // Provide type information for the groups state variable
  const [groupsFound, setGroupsFound] = useState(false); // Track if the group is created

  useEffect(() => {
    // Fetch groups data when component mounts
    if (userId) {
      axios
        .get("http://localhost:8000/myGroups", {
          params: {
            googleId: userId,
          },
        })
        .then((response) => {
          console.log("Groups response:", response.data);

          if (response.data) {
            // Assuming the server directly returns the groups array
            const fetchedGroups: Group[] = response.data; // Cast response.data to Group[]
            setGroups(fetchedGroups); // Update the local state with the groups
            setGroupsFound(true); // Set groupsFound to true
            console.log(fetchedGroups);
          }

          // Handle the success response here
        })
        .catch((error) => {
          console.error("Error finding groups:", error);
          // Handle errors here
        });
    }
  }, [userId]); // Fetch groups data when userId changes

  const handleGroupClick = (group: Group) => {
    // Call the callback function with the selected group
    onGroupClick(group);
  };

  return (
    <div className="container">
      <div className="section">
        <h2>My Groups</h2>
        {groupsFound ? (
          <ul>
            {groups.map((group) => (
              <li key={group.GroupId}>
                <a href="#" onClick={() => handleGroupClick(group)}>
                  {group.GroupName}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No groups found.</p>
        )}
      </div>
    </div>
  );
}

export default MyGroups;
