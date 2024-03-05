import React, { useState, useEffect } from "react";
import GroupForm from "./components/GroupForm/GroupForm";
import UserForm from "./components/UserForm/UserForm";
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
import MyGroups from "./components/MyGroups/MyGroups";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store/store";
import axios from "axios";
import "./GetStarted.css";

interface userObject {
  UserId: number;
  GoogleId: string;
  DisplayName: string;
  Email: string;
}

interface Group {
  GroupId: number;
  GroupName: string;
}

function GetStarted() {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [currentUser, setCurrentUser] = useState<userObject>({
    UserId: 1,
    GoogleId: "placeholder",
    DisplayName: "test",
    Email: "test",
  });

  const [showUserForm, setShowUserForm] = useState(false); // State to control rendering of UserForm
  const [showExpenseForm, setShowExpenseForm] = useState(false); // State to control rendering of ExpenseForm
  const [showGroupForm, setShowGroupForm] = useState(false); // State to control rendering of GroupForm

  const googleId = useSelector((state: RootState) => state.auth.user?.sub);

  useEffect(() => {
    if (googleId) {
      // Move the logic directly into this useEffect
      const fetchUser = async () => {
        try {
          const response = await axios.get<userObject>(
            `http://localhost:8000/getUser/${googleId}`
          );
          setCurrentUser(response.data);
          // console.log(
          //   "Current user wont be logged here as useEffect is async:",
          //   currentUser
          // );
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      fetchUser();
    } else {
      console.log("Error: googleId is undefined");
    }
  }, [googleId]);

  const handleGroupCreated = () => {
    // Set the state to show the next form(s)
    console.log("group created")
    setShowUserForm(true);
  };

  const handleCreateGroupClick = () => {
    setShowGroupForm(true);
  };

  const handleGroupClick = (group: Group) => {
    // Set the currentGroup state when a group is clicked
    setCurrentGroup(group);
    setShowGroupForm(false); // Hide the create group button when a group is clicked
  };

  return (
    <div className="container-fluid">
      <div style={{ display: "flex" }}>
        <div style={{ flex: "0 0 33%", marginRight: "20px" }}>
          <MyGroups onGroupClick={handleGroupClick} userId={currentUser.UserId} />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "green" }}>
          {currentGroup ? (
            <h2>{currentGroup.GroupName}</h2> // Display group name as title
          ) : (
            !groupId && !showGroupForm && (
              <button onClick={handleCreateGroupClick}>Create Group</button>
            )
          )}
          {showGroupForm && (
            <GroupForm
              userId={currentUser.UserId}
              setGroupId={setGroupId}
              onNext={handleGroupCreated}
            />
          )}
          {groupId && (
            <div className="forms-container">
              <div className="form">
                <UserForm groupId={groupId} userId={currentUser.UserId} />
              </div>
              <div className="form">
                <ExpenseForm groupId={groupId} userId={currentUser.UserId} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
