import fakeData from "fakeData.json";
import { createSlice } from "@reduxjs/toolkit";

const initialState = fakeData;

const letterSlice = createSlice({
  name: "letter",
  initialState,
  reducers: {
    addLetter: (state, action) => {
      const newLetter = action.payload;
      state.unshift(newLetter);
    },
    deleteLetter: (state, action) => {
      const id = action.payload;
      return state.filter((letter) => letter.id !== id);
    },
    editLetter: (state, action) => {
      const { id, editingText } = action.payload;
      return state.map((letter) => {
        if (letter.id === id) {
          return { ...letter, content: editingText };
        }
        return letter;
      });
    },
  },
});

export const { addLetter, deleteLetter, editLetter } = letterSlice.actions;
export default letterSlice.reducer;
