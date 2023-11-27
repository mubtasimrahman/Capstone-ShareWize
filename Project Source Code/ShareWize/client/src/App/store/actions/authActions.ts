/*import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const backendURL = 'http://127.0.0.1:5000';

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ firstName, email, password }, { rejectWithValue }) => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
        await axios.post(
          `${backendURL}/api/user/register`,
          { firstName, email, password },
          config
        )
      } catch (error) {
      // return custom error message from backend if present
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message)
        } else {
          return rejectWithValue(error.message)
        }
      }
    }
  )*/

import { JwtPayload } from "jwt-decode";

// authActions.ts
export interface LoginSuccessAction {
  type: 'LOGIN_SUCCESS';
  payload: any; // Replace 'any' with the actual type of the user object
}

export interface LogoutAction {
  type: 'LOGOUT';
}

export type AuthAction = LoginSuccessAction | LogoutAction;

export const loginSuccess = (user: JwtPayload): LoginSuccessAction => ({
  type: 'LOGIN_SUCCESS',
  payload: user,
});

export const logout = (): LogoutAction => ({
  type: 'LOGOUT',
});