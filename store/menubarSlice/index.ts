import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  open: boolean;
  open2: boolean;
  counter: number;
  booleanSidebar?: boolean;
}

const initialState: initialStateType = {
  open: false,
  open2: false,
  counter: 0,
  booleanSidebar: false,
};
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    toggle: (state) => {
      state.open = !state.open;
    },
    toggleForFilebar: (state) => {
      state.open2 = !state.open2;
    },
    sidebarCounter: (state, { payload }) => {
      state.counter = payload;
    },
    setbooleanSidebar: (state, { payload }) => {
      state.booleanSidebar = payload;
    },
  },
});

export const { toggle, toggleForFilebar, sidebarCounter, setbooleanSidebar } =
  counterSlice.actions;
export default counterSlice.reducer;
