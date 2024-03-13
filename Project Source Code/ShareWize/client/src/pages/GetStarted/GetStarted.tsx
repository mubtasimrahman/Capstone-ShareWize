import React, { useState, useEffect } from "react";
import GroupForm from "./components/GroupForm/GroupForm";
import UserForm from "./components/UserForm/UserForm";
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
import MyGroups from "./components/MyGroups/MyGroups";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store/store";
import axios from "axios";
import "./GetStarted.css";

interface Group {
  GroupId: number;
  GroupName: string;
}


interface userObject {
  UserId: number;
  GoogleId: string;
  DisplayName: string;
  Email: string;
}


function GetStarted() {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<userObject>({
    UserId: 1,
    GoogleId: "placeholder",
    DisplayName: "test",
    Email: "test",
  });

  const [showUserForm, setShowUserForm] = useState(false); // State to control rendering of UserForm

  const [showGroupForm, setShowGroupForm] = useState(false); // State to control rendering of GroupForm
  const [showForms, setShowForms] = useState(false); 
  const [groupName, setGroupName] = useState(""); // Lifted state for groupName

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
    console.log("group created");
    setShowUserForm(true);
  };

  const handleCreateGroupClick = () => {
    setShowGroupForm(true);
  };

  const handleGroupClick = (group: Group) => {
    setShowForms(true);
    setGroupId(group.GroupId) 
    setGroupName(group.GroupName)
  };

  const handleGroupNameChange = (name: string) => {
    setGroupName(name); // Update groupName in the parent component
  };

  return (
    <div className="container-fluid">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ flex: "0 0 33%", marginRight: "20px" }}>
          <MyGroups
            onGroupClick={handleGroupClick}
            userId={currentUser.UserId}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "green",
          }}
        >
          { (
            !groupId &&
            !showGroupForm && !showForms && (
              <button onClick={handleCreateGroupClick}>Create Group</button>
            )
          )}
          {showGroupForm && (
            <GroupForm
              userId={currentUser.UserId}
              setGroupId={setGroupId}
              onNext={handleGroupCreated}
              onGroupNameChange={handleGroupNameChange}
            />
          )}
          {(groupId||showForms) && (
            <div className="top-centered-content">
              Group {groupName}
            </div>
          )}
          {(groupId||showForms) && (
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
