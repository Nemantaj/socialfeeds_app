import { createSlice } from "@reduxjs/toolkit";

const initialAuth = {
  isAuth: false,
  token: null,
  userId: null,
  profileData: {},
  popUp: false,
  errorData: {
    title: "Error",
    msg: "Error Occured!",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuth,
  reducers: {
    setAuth(state) {
      state.isAuth = !state.isAuth;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setProfileData(state, action) {
      state.profileData = action.payload;
    },
    setPopOpen(state) {
      state.popUp = true;
    },
    setPopClose(state) {
      state.popUp = false;
    },
    setErrorData(state, action) {
      state.errorData = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
