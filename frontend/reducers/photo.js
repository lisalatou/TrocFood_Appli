import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    addPhoto: (state, action) => {
      state.value = action.payload;
    },
    removePhoto: (state) => {
      state.value = null;
    },
  },
});

export const { addPhoto, removePhoto } = photoSlice.actions;
export default photoSlice.reducer;
