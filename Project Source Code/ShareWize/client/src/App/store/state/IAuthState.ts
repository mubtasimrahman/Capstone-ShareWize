import { GoogleCredentialResponse } from "@react-oauth/google";

export interface IAuthState {
    readonly loading: boolean;
    readonly userInfo: {};
    readonly userToken: String;
    readonly error?: string;
    readonly success: boolean;
  }