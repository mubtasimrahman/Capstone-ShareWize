import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

function Google() {
  const [user, setUser] = useState({});
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log(credentialResponse);
        if (credentialResponse.credential) {
          // Check if credentialResponse.credential is defined
          const userObject = jwtDecode(credentialResponse.credential);
          console.log(userObject);
          setUser(userObject)
          console.log(user)
        } else {
          // Handle the case where credentialResponse.credential is undefined
          console.error("Credential is undefined");
        }
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}

export default Google;
