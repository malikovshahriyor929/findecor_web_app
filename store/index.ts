import { configureStore } from "@reduxjs/toolkit";
import chatmessage from "./chatmessageSlice";
import toogle from "./menubarSlice";
import liked from "./likedSlice"
export const store = configureStore({
  reducer: {
    chatmessage,
    toogle,
    liked
  },
});
export type RootState = ReturnType<typeof store.getState>;
