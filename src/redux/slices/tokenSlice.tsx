import { createSlice } from '@reduxjs/toolkit';
const initialState: any = {
  token: '',
  BASE_URL: null,
};
export const tokenSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setBaseUrl: (state, action) => {
      state.BASE_URL = action.payload;
    },
  },
});
export const { setToken, setBaseUrl } = tokenSlice?.actions;
export default tokenSlice?.reducer;
