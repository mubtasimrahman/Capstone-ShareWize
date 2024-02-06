import React, { useEffect, useState } from "react";
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

function GetStarted() {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<userObject>({
    UserId: 1,
    GoogleId: "placeholder",
    DisplayName: "test",
    Email: "test",
  });
  const [showUserForm, setShowUserForm] = useState(false); // State to control rendering of UserForm
  const [showExpenseForm, setShowExpenseForm] = useState(false); // State to control rendering of ExpenseForm

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
          console.log(
            "Current user wont be logged here as useEffect is async:",
            currentUser
          );
          // Dispatch action to update Redux store with user information
          //dispatch(loginSuccess(user)); // Use your action creator here
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

  return (
    <div className="container-fluid">
      <div style={{ display: "flex" }}>
        <div style={{ flex: "0 0 33%", marginRight: "20px" }}>
          <MyGroups />
        </div>
        <div style={{ flex: 1 }}>
          {!groupId && <GroupForm setGroupId={setGroupId} onNext={handleGroupCreated} />}
          {groupId && (
            <div className="forms-container">
              <div className="form">
                <UserForm groupId={groupId} />
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
