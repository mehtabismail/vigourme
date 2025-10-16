import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  selected_medicines: [],
  latest_prescription: null,
};
export const medicineSlice = createSlice({
  name: "medicines",
  initialState,
  reducers: {
    selectedMedicinesList: (state, action) => {
      state.selected_medicines = action.payload;
    },
    latestPrescription: (state, action) => {
      state.latest_prescription = action.payload;
    },
  },
});
export const { selectedMedicinesList, latestPrescription } =
  medicineSlice?.actions;
export default medicineSlice?.reducer;
