import { GoogleLogin, GoogleCredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../App/store/store";
import { LoginSuccessAction, loginSuccess } from "../../App/store/actions/authActions";
import { jwtDecode } from "jwt-decode";

function Google() {
  const dispatch = useDispatch();
  const handleLoginSuccess = (credentialResponse: GoogleCredentialResponse) => {
    console.log(credentialResponse);

    if (credentialResponse.credential) {
      // Send the token to the server using POST
      const userObject = jwtDecode(credentialResponse.credential);
      axios
        .post(
          `http://localhost:8000/api`,
          {
            token: credentialResponse.credential,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Server response:", response.data);
          console.log(userObject);
          dispatch(loginSuccess(userObject));
        })
        .catch((error) => {
          console.error("Error sending token to server:", error);
        });
    } else {
      console.error("Credential is undefined");
    }
  };


  return (
    <GoogleLogin
      useOneTap
      onSuccess={handleLoginSuccess}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}

export default Google;

function dispatch(arg0: LoginSuccessAction) {
  throw new Error("Function not implemented.");
}
