import axios from "axios";
import { toast } from "react-toastify";
// import store from "redux/config/configStore";
import { logout } from "redux/modules/authSlice";

let store;
import("redux/config/configStore").then((module) => {
  store = module.default();
});

export const authApi = axios.create({
  baseURL: "https://moneyfulpublicpolicy.co.kr",
  headers: {
    "Content-Type": "application/json",
  },
});
export const jsonApi = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use(
  (config) => {
    // 헤더에 토큰 넣기
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    toast.error(err.response.data.message);
    if (
      err.response.data.message ===
      "토큰이 만료되었습니다. 다시 로그인 해주세요."
    ) {
      // 로그아웃처리
      return store.dispatch(logout());
    }
    return Promise.reject(err);
  }
);

jsonApi.interceptors.request.use(
  async (config) => {
    const { data } = await authApi.get("/user");
    if (data.success) return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
