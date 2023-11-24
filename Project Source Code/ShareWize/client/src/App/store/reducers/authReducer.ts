import { createSlice } from '@reduxjs/toolkit'
import { IAuthState } from '../state/IAuthState'

const initialState: IAuthState = {
  loading: false,
  userInfo: {}, // for user object
  userToken: '', // for storing the JWT
  error: '',
  success: false, // for monitoring the registration process.
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {},
})

export default authSlice.reducer