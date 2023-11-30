import letters from "redux/modules/letterSlice";
import member from "redux/modules/memberSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import auth from "redux/modules/authSlice";

const rootReducer = combineReducers({
  letters,
  member,
  auth,
});

const store = configureStore({
  reducer: rootReducer,
});

const getStore = () => store;
export default getStore;
