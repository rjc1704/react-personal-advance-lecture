import axios from "axios";
import store from "redux/config/configStore";
import { logout } from "redux/modules/authSlice";

export const jsonApi = axios.create({
  baseURL: process.env.REACT_APP_JSON_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = axios.create({
  baseURL: process.env.REACT_APP_AUTH_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

jsonApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    store.dispatch(logout());
    return Promise.reject(error);
  }
);

jsonApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.data.message ===
      "토큰이 만료되었습니다. 다시 로그인 해주세요."
    ) {
      store.dispatch(logout());
      return alert(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

authApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    if (config.isFile) {
      config.headers["Content-Type"] = "multipart/form-data";
      delete config.isFile;
    }
    return config;
  },
  (error) => {
    store.dispatch(logout());
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.data.message ===
      "토큰이 만료되었습니다. 다시 로그인 해주세요."
    ) {
      store.dispatch(logout());
      return alert(error.response.data.message);
    }
    return Promise.reject(error);
  }
);
