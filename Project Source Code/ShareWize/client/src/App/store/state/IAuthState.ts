//import { GoogleCredentialResponse } from "@react-oauth/google";
import { JwtPayload } from "jwt-decode";

export interface IAuthState {
    readonly authenticated: boolean;
    readonly user: JwtPayload | null;
  }