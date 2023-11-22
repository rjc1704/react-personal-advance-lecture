import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: !!localStorage.getItem("accessToken"),
  userId: localStorage.getItem("userId"),
  avatar: localStorage.getItem("avatar"),
  nickname: localStorage.getItem("nickname"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { accessToken, userId, avatar, nickname } = action.payload;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("nickname", nickname);
      state.avatar = avatar;
      state.userId = userId;
      state.isLogin = true;
      state.nickname = nickname;
    },
    logout: (state) => {
      localStorage.clear();
      state.isLogin = false;
    },
    setProfile: (state, action) => {
      const { avatar, nickname } = action.payload;
      if (avatar) {
        localStorage.setItem("avatar", avatar);
        state.avatar = avatar;
      }
      if (nickname) {
        localStorage.setItem("nickname", nickname);
        state.nickname = nickname;
      }
    },
  },
});

export const { login, logout, setProfile } = authSlice.actions;
export default authSlice.reducer;
