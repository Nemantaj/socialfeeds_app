import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth-slice";
import postReducer from "./posts-slice";
import appReducer from "./app-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    app: appReducer,
  },
});

export default store;
