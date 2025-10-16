import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoading: false,
  isLoadingIndividual: false,
};
export const loading = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsLoadingIndividual: (state, action) => {
      state.isLoadingIndividual = action.payload;
    },
  },
});
export const { setIsLoading, setIsLoadingIndividual } = loading?.actions;
export default loading?.reducer;
