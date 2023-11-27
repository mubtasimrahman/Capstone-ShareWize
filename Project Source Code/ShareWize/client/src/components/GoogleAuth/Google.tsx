/*import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

function Google() {
  const [user, setUser] = useState({});
  return (
    <GoogleLogin
      useOneTap
      onSuccess={(credentialResponse) => {
        console.log(credentialResponse);
        if (credentialResponse.credential) {
          // Check if credentialResponse.credential is defined
          const userObject = jwtDecode(credentialResponse.credential);
          console.log(userObject);
          setUser(userObject);
          console.log(user);
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
*/

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from '../../App/store/actions/authActions'; // Replace with the actual path

function Google() {
  const dispatch = useDispatch();

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
    if (credentialResponse.credential) {
      const userObject = jwtDecode(credentialResponse.credential);
      console.log(userObject);
      dispatch(loginSuccess(userObject)); // Dispatch the login success action
    } else {
      console.error("Credential is undefined");
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <GoogleLogin
      useOneTap
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
    />
  );
}

export default Google;

