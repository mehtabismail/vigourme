import {
  configureStore,
  createSlice,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import loadingSlice from "./slices/loadingSlice";
import tokenSlice from "./slices/tokenSlice";
import currentQuestionSlice from "./slices/currentQuestionSlice";
import surveyAnswerSlice from "./slices/surveyAnswerSlice";
import navigationSlice from "./slices/navigationSlice";
import medicineSlice from "./slices/medicineSlice";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    loadingSlice: loadingSlice,
    tokenSlice: tokenSlice,
    navigationSlice: navigationSlice,
    currentQuestionSlice: currentQuestionSlice,
    surveyAnswerSlice: surveyAnswerSlice,
    medicines: medicineSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
