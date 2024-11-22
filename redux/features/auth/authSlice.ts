import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  lab: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action) => {
      
      state.token = action.payload.verificationToken;
    },
    userLoggedIn: (state, action) => {
      state.token = action.payload.accessToken;
      state.lab = action.payload.lab;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.lab = "";
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer