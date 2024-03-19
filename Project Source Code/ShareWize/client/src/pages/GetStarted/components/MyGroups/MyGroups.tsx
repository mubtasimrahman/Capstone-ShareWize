import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

// Define an interface for the group object
interface Group {
  GroupId: number;
  GroupName: string;
}
interface GroupRequest {
  RequestId: number;
  GroupId: number;
  GroupName: string;
}

interface MyGroupsProps {
  onGroupClick: (group: Group) => void; // Callback function to handle group click
  userId: number;
}

function MyGroups({ onGroupClick, userId }: MyGroupsProps) {
  const googleId = useSelector((state: any) => state.auth.user?.sub);
  const [groupRequests, setGroupRequests] = useState<GroupRequest[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingAccept, setLoadingAccept] = useState(false); // Loading state for accepting requests
  const [loadingDecline, setLoadingDecline] = useState(false); // Loading state for accepting requests

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
          if (response.data) {
            setGroupRequests(response.data);
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
          if (response.data) {
            setGroups(response.data);
          }
        })
        .catch((error) => {
          console.error("Error finding groups:", error);
        });
    }
  }, [googleId]);

  const respondToGroupMembershipRequest = async (
    requestId: number,
    response: string
  ) => {
    setLoadingAccept(true); // Set loading state to true when accepting request
    try {
      await axios.post(
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

      // Remove the processed request from the state
      setGroupRequests((prevRequests) =>
        prevRequests.filter((request) => request.RequestId !== requestId)
      );

      // Fetch updated groups after accepting the request
      if (googleId) {
        const response = await axios.get("http://localhost:8000/myGroups", {
          params: {
            googleId: googleId,
          },
        });
        if (response.data) {
          setGroups(response.data);
        }
      }
    } catch (error) {
      console.error("Error responding to group membership request:", error);
    } finally {
      setLoadingAccept(false); // Set loading state back to false after request is processed
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
        <h5>Requests</h5>
        {groupRequests.length ? (
          <div>
            {groupRequests.map((request) => (
              <div key={request.RequestId} className="request-container">
                <div>{request.GroupName}</div>
                <div className="button-container">
                  <Button
                    style={{
                      backgroundColor: "#198754",
                      flex: 1,
                      marginRight: "5px",
                    }}
                    variant="contained"
                    disabled={loadingAccept} // Disable button when loading
                    onClick={() =>
                      respondToGroupMembershipRequest(
                        request.RequestId,
                        "Accepted"
                      )
                    }
                  >
                    {loadingAccept ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Accept"
                    )}
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#DC3545",
                      flex: 1,
                      marginLeft: "5px",
                    }}
                    variant="contained"
                    disabled={loadingDecline} // Disable button when loading
                    onClick={() =>
                      respondToGroupMembershipRequest(
                        request.RequestId,
                        "Declined"
                      )
                    }
                  >
                    {loadingDecline ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Decline"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No group requests found.</p>
        )}
        <h5>My Groups</h5>
        {groups.length ? (
          <div>
            {groups.map((group) => (
              <div key={group.GroupId} style={{ marginBottom: "10px" }}>
                <Button
                  style={{
                    backgroundColor: "#198754",
                    width: "100%",
                  }}
                  variant="contained"
                  onClick={() => handleGroupClick(group)}
                >
                  {group.GroupName}
                </Button>
              </div>
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
