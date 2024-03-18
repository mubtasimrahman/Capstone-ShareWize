// MyGroups.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyGroups.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../../App/store/store";
import Button from "@mui/material/Button";

// Define an interface for the group object
interface Group {
  GroupId: number;
  GroupName: string;
}
interface groupRequests {
  RequestId: number;
  GroupId: number;
  GroupName: string;
}

interface MyGroupsProps {
  onGroupClick: (group: Group) => void; // Callback function to handle group click
  userId: number;
}

function MyGroups({ onGroupClick, userId }: MyGroupsProps) {
  const googleId = useSelector((state: RootState) => state.auth.user?.sub);
  const [groupRequests, setGroupRequests] = useState<groupRequests[]>([]); // Modify the type based on your response structure
  const [groups, setGroups] = useState<Group[]>([]); // Provide type information for the groups state variable

  useEffect(() => {
    // Fetch group requests data when component mounts
    if (userId) {
      axios
        .get("http://localhost:8000/groupRequests", {
          params: {
            userId,
          },
        })
        .then((response) => {
          console.log("Group requests response:", response.data);

          if (response.data) {
            const fetchedRequests = response.data;
            setGroupRequests(fetchedRequests);
            console.log(fetchedRequests);
          }
        })
        .catch((error) => {
          console.error("Error finding group requests:", error);
        });
    }
  }, [userId]);

  useEffect(() => {
    // Fetch groups data when component mounts
    if (googleId) {
      axios
        .get("http://localhost:8000/myGroups", {
          params: {
            googleId: googleId,
          },
        })
        .then((response) => {
          console.log("Groups response:", response.data);

          if (response.data) {
            // Assuming the server directly returns the groups array
            const fetchedGroups: Group[] = response.data; // Cast response.data to Group[]
            setGroups(fetchedGroups); // Update the local state with the groups
            console.log(fetchedGroups);
          }

          // Handle the success response here
        })
        .catch((error) => {
          console.error("Error finding groups:", error);
          // Handle errors here
        });
    }
  }, [googleId]); // Fetch groups data when userId changes

  const respondToGroupMembershipRequest = async (
    requestId: number,
    response: string
  ) => {
    try {
      const apiResponse = await axios.post(
        "http://localhost:8000/respondToGroupMembershipRequest",
        {
          requestId: requestId,
          response: response,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Group membership request response processed:",
        apiResponse.data
      );

      // Remove the processed request from the state
      setGroupRequests((prevRequests) =>
        prevRequests.filter((request) => request.RequestId !== requestId)
      );
    } catch (error) {
      console.error("Error responding to group membership request:", error);
    }
  };

  const handleGroupClick = (group: Group) => {
    // Call the callback function with the selected group
    onGroupClick(group);
  };

  return (
    <div className="container">
      <div className="section">
        <h2>Groups</h2>
        <h5> Requests </h5>
        {groupRequests.length ? (
          <ul>
            {groupRequests.map((request) => (
              <li key={request.RequestId}>
                <p>{request.GroupName}</p>
                <button
                  onClick={() =>
                    respondToGroupMembershipRequest(
                      request.RequestId,
                      "Accepted"
                    )
                  }
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    respondToGroupMembershipRequest(
                      request.RequestId,
                      "Declined"
                    )
                  }
                >
                  Decline
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No group requests found.</p>
        )}
        <h5>My Groups</h5>
        {groups.length ? (
          <div className="group-buttons">
            {groups.map((group) => (
              <Button
                key={group.GroupId}
                style={{
                  backgroundColor: "#198754",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
                variant="contained"
                onClick={() => handleGroupClick(group)}
              >
                {group.GroupName}
              </Button>
            ))}
          </div>
        ) : (
          <p>No groups found.</p>
        )}
      </div>
    </div>
  );
}

export default MyGroups;
