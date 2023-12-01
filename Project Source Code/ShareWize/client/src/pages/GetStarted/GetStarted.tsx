import React, { useEffect, useState } from "react";
import GroupForm from "./components/GroupForm/GroupForm";
import UserForm from "./components/UserForm/UserForm";
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
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

  return (
    <div className="container-fluid">
      <GroupForm setGroupId={setGroupId} />

      <UserForm groupId={groupId} />
      <ExpenseForm groupId={groupId} userId={currentUser.UserId} />
    </div>
  );
}

export default GetStarted;
