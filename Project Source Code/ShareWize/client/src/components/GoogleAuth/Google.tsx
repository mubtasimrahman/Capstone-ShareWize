import { GoogleLogin, GoogleCredentialResponse } from "@react-oauth/google";
import axios from "axios";

function Google() {
  const handleLoginSuccess = (credentialResponse: GoogleCredentialResponse) => {
    console.log(credentialResponse);

    if (credentialResponse.credential) {
      // Send the token to the server using POST
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