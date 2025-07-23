import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const donToToggle = action.payload;
      const existingIndex = state.value.findIndex(
        (fav) => fav._id === donToToggle._id
      );

      if (existingIndex >= 0) {
        // Retirer des favoris
        state.value.splice(existingIndex, 1);
      } else {
        // Ajouter aux favoris
        state.value.push(donToToggle);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
