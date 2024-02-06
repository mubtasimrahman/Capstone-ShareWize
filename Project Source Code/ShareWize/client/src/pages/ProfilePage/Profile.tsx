import React, { useEffect, useState } from "react";
import { RootState } from "../../App/store/store";
import { useSelector } from "react-redux";
import axios from "axios";
import LogoutButton from "../../components/Logout/Logout";

interface userObject {
  UserId: number;
  GoogleId: string;
  DisplayName: string;
  Email: string;
}

export default function Profile() {
  const googleId = useSelector((state: RootState) => state.auth.user?.sub);
  const image = useSelector((state: RootState) => state.auth.user?.picture);
  const [currentUser, setCurrentUser] = useState<userObject>();

  useEffect(() => {
    if (googleId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get<userObject>(
            `http://localhost:8000/getUser/${googleId}`
          );
          setCurrentUser(response.data);
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
    <div className="container-fluid" style={{ color: "white", textAlign: "center" }}>
      <h1>Profile</h1>
      <div style={{ color: "white", display: "inline-block" }}>
        <table style={{ margin: "auto" }}>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}><img src={image} alt="Profile" style={{ width: "100px", borderRadius: "50%" }} /></td>
            </tr>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{currentUser?.DisplayName}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{currentUser?.Email}</td>
            </tr>
            <tr>
              <td><strong>Google ID:</strong></td>
              <td>{currentUser?.GoogleId}</td>
            </tr>
            <tr>
              <td><strong>User ID:</strong></td>
              <td>{currentUser?.UserId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "20px" }}>
        <LogoutButton/>
      </div>
    </div>
  );
}
