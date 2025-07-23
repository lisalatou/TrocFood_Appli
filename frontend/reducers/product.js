import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    title: null,
    description: null,
    image: null,
    location: null,
    user: null,
    createdAt: null,
  }
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
        state.value.title = action.payload.title;
        state.value.description = action.payload.description;
        state.value.image = action.payload.image;
        state.value.location = action.payload.location;
        state.value.user = action.payload.user;
        state.value.createdAt = action.payload.createdAt;
    }
}}
);

export const { addProduct } = productsSlice.actions;
export default productsSlice.reducer;