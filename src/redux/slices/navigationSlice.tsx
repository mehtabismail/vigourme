import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  navigation: "",
};
export const navigationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setNavigation: (state, action) => {
      state.navigation = action.payload;
    },
  },
});
export const { setNavigation } = navigationSlice?.actions;
export default navigationSlice?.reducer;
