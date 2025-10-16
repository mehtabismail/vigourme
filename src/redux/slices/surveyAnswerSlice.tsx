import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  finalAnswer: [],
};
export const surveyAnswer = createSlice({
  name: "surveyAnswer",
  initialState,
  reducers: {
    setFinalAnswer: (state, action) => {
      state.finalAnswer = action.payload;
    },
    removeItemFromAnswer: (state) => {
      state.finalAnswer = state.finalAnswer.slice(0, -1);
    },
  },
});
export const { setFinalAnswer, removeItemFromAnswer } = surveyAnswer?.actions;
export default surveyAnswer?.reducer;
