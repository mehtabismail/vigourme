import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentIndex: 0,
  questionsLength: 0,
};
export const currentIndexSlice = createSlice({
  name: "currentIndex",
  initialState,
  reducers: {
    incrementCurrentIndex: (state, {payload}) => {
      if (state.currentIndex < state.questionsLength) {
        state.currentIndex = state.currentIndex + payload;
      }
    },
    decrementCurrentIndex: (state, {payload}) => {
      if (state.currentIndex != 0) {
        state.currentIndex = state.currentIndex - payload;
      }
    },
    setQuestionLength: (state, action) => {
      state.questionsLength = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentIndex = action.payload;
    },
  },
});
export const {
  incrementCurrentIndex,
  decrementCurrentIndex,
  setQuestionLength,
  setCurrentQuestion,
} = currentIndexSlice?.actions;
export default currentIndexSlice?.reducer;
