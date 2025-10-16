import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  role: "",
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});
export const { setRole } = authSlice?.actions;
export default authSlice?.reducer;
