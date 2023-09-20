import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import dailyEntriesSlice from "./slices/dailyEntriesSlice";
import challengesSlice from "./slices/challengesSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    dailyEntries: dailyEntriesSlice,
    challenges: challengesSlice,
  },
});

export default store;
