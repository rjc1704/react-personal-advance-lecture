import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  letters: [],
  isLoading: false,
  isError: false,
  error: null,
};

const getLettersFromDB = async () => {
  const { data: letters } = await axios.get(
    "http://localhost:5000/letters?_sort=createdAt&_order=desc"
  );
  return letters;
};

export const __getLetters = createAsyncThunk(
  "getLetters",
  async (payload, thunkAPI) => {
    try {
      const letters = await getLettersFromDB();
      return letters;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const __addLetter = createAsyncThunk(
  "addLetter",
  async (newLetter, thunkAPI) => {
    try {
      await axios.post("http://localhost:5000/letters", newLetter);
      const letters = await getLettersFromDB();
      return letters;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const __deleteLetter = createAsyncThunk(
  "deleteLetter",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`http://localhost:5000/letters/${id}`);
      const letters = await getLettersFromDB();
      return letters;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const __editLetter = createAsyncThunk(
  "editLetter",
  async ({ id, editingText }, thunkAPI) => {
    try {
      await axios.patch(`http://localhost:5000/letters/${id}`, {
        content: editingText,
      });
      const letters = await getLettersFromDB();
      return letters;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const letterSlice = createSlice({
  name: "letter",
  initialState,
  reducers: {},
  extraReducers: {
    [__getLetters.pending]: (state) => {
      state.isLoading = true;
    },
    [__getLetters.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.letters = action.payload;
    },
    [__getLetters.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },
    [__addLetter.pending]: (state) => {
      state.isLoading = true;
    },
    [__addLetter.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.letters = action.payload;
    },
    [__addLetter.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },
    [__deleteLetter.pending]: (state) => {
      state.isLoading = true;
    },
    [__deleteLetter.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.letters = action.payload;
    },
    [__deleteLetter.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },
    [__editLetter.pending]: (state) => {
      state.isLoading = true;
    },
    [__editLetter.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.letters = action.payload;
    },
    [__editLetter.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },
  },
});

export const { addLetter, deleteLetter, editLetter, setLetters } =
  letterSlice.actions;
export default letterSlice.reducer;
