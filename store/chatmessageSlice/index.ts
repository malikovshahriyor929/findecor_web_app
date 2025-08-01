import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  chatId?: string;
  filebarSearchImage: boolean;
  refetchForFileBar: boolean;
}

const initialState: initialStateType = {
  chatId: "",
  filebarSearchImage: false,
  refetchForFileBar: false,
};
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setMessage: (state, { payload }) => {
      state.chatId = payload;
    },
    setFilebarSearchImage: (state, { payload }) => {
      state.filebarSearchImage = payload ? payload : !state.filebarSearchImage;
    },
    setRefetchForFileBar: (state, { payload }) => {
      state.refetchForFileBar = payload;
    },
  },
});

export const { setMessage, setFilebarSearchImage, setRefetchForFileBar } =
  counterSlice.actions;
export default counterSlice.reducer;
