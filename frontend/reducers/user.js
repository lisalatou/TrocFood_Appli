import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    username: null,
    prenom: null,
    email: null,
    token: null,
  },
};

export const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signUp: (state, action) => {
      state.value.username = action.payload.username;
      state.value.prenom = action.payload.prenom;
    },
    login: (state, action) => {
      state.value.username = action.payload.username;
      state.value.prenom = action.payload.prenom;
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
    },
    logout: (state, action) => {
      state.value.token = null;
      state.value.username = null;
    },
    updateEmail: (state, action) => {
      state.value.email = action.payload;
    },
  },
});

export const { login, logout, signUp, updateEmail } = usersSlice.actions;
export default usersSlice.reducer;
