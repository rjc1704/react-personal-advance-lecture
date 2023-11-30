import axios from "axios";
import { toast } from "react-toastify";
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
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    // 모든 json-server api는 accessToken이 유효한 경우에만 이용 가능하게 합니다.
    const { data } = await authApi.get("/user");
    if (data.success) return config;
  },
  (error) => {
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
      return toast.warn(error.response.data.message);
    }
    return Promise.reject(error);
  }
);
