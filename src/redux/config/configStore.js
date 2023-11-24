import member from "redux/modules/memberSlice";
import auth from "redux/modules/authSlice";

import { configureStore, combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({ member, auth });

const store = configureStore({
  reducer: rootReducer,
});

export default store;
