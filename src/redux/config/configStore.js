import letters from "redux/modules/letterSlice";
import member from "redux/modules/memberSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  letters,
  member,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
