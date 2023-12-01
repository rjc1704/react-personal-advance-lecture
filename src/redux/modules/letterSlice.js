import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jsonApi } from "api";

const initialState = {
  letters: [],
  isLoading: true,
  isError: false,
  error: null,
};

const getLettersFromDB = async () => {
  const { data } = await jsonApi.get("/letters?_sort=createdAt&_order=desc");
  return data;
};

export const __editLetter = createAsyncThunk(
  "editLetter",
  async ({ id, editingText }, thunkAPI) => {
    try {
      await jsonApi.patch(`/letters/${id}`, { content: editingText });
      const letters = await getLettersFromDB();
      return letters;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const __deleteLetter = createAsyncThunk(
  "deleteLetter",
  async (id, thunkAPI) => {
    try {
      await jsonApi.delete(`/letters/${id}`);
      const letters = await getLettersFromDB();
      return letters;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const __getLetters = createAsyncThunk(
  "getLetters",
  async (payload, thunkAPI) => {
    try {
      const letters = await getLettersFromDB();
      return letters;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const __addLetter = createAsyncThunk(
  "addLetter",
  async (newLetter, thunkAPI) => {
    try {
      await jsonApi.post("/letters", newLetter);
      const letters = await getLettersFromDB();
      return letters;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const letterSlice = createSlice({
  name: "letter",
  initialState,
  reducers: {},
  extraReducers: {
    [__addLetter.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__addLetter.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.letters = action.payload;
      state.isError = false;
      state.error = null;
    },
    [__addLetter.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },
    [__getLetters.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__getLetters.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.letters = action.payload;
      state.isError = false;
      state.error = null;
    },
    [__getLetters.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },
    [__deleteLetter.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__deleteLetter.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.letters = action.payload;
      state.isError = false;
      state.error = null;
    },
    [__deleteLetter.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },
    [__editLetter.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__editLetter.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.letters = action.payload;
      state.isError = false;
      state.error = null;
    },
    [__editLetter.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },
  },
});

export default letterSlice.reducer;
