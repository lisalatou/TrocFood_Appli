import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const donsSlice = createSlice({
  name: "dons",
  initialState,
  reducers: {
    // Ajouter un don
    addDon: (state, action) => {
      state.value.unshift(action.payload); // Ajouter en premier (plus récent)
    },

    // Supprimer un don
    removeDon: (state, action) => {
      state.value = state.value.filter((don) => don._id !== action.payload);
    },
  },
});

export const { addDon, removeDon } = donsSlice.actions;
export default donsSlice.reducer;
