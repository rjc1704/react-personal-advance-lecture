import { authApi } from "api";
import { toast } from "react-toastify";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  isLogin: !!localStorage.getItem("accessToken"),
  avatar: localStorage.getItem("avatar"),
  nickname: localStorage.getItem("nickname"),
  userId: localStorage.getItem("userId"),
  isLoading: false,
  isError: false,
  error: null,
};

export const __login = createAsyncThunk(
  "login",
  async ({ id, password }, thunkAPI) => {
    try {
      const { data } = await authApi.post("/login?expiresIn=10s", {
        id,
        password,
      });
      const { accessToken, avatar, nickname, userId } = data;
      if (data.success) {
        toast.success("로그인 성공");
        return { accessToken, avatar, nickname, userId };
      }
    } catch (err) {
      toast.error(err.response.data.message);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { accessToken, avatar, nickname, userId } = action.payload;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("userId", userId);
      state.isLogin = true;
      state.avatar = avatar;
      state.nickname = nickname;
      state.userId = userId;
    },
    logout: (state, action) => {
      state.isLogin = false;
      localStorage.clear();
    },
  },
  extraReducers: {
    [__login.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__login.fulfilled]: (state, action) => {
      const { accessToken, avatar, nickname, userId } = action.payload;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("userId", userId);
      state.isLogin = true;
      state.avatar = avatar;
      state.nickname = nickname;
      state.userId = userId;
      state.isLoading = false;
    },
    [__login.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
