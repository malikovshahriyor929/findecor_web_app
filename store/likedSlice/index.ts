import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateType {
  liked: string[];
}

const initialState: InitialStateType = {
  liked: [],
};

const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    initializeLikes: (state, action: PayloadAction<string[]>) => {
      state.liked = action.payload;
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.liked.includes(id)) {
        state.liked = state.liked.filter((item) => item !== id);
      } else {
        state.liked.push(id);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("liked", JSON.stringify(state.liked));
      }
    },
  },
});

export const { toggleLike, initializeLikes } = likeSlice.actions;
export default likeSlice.reducer;
