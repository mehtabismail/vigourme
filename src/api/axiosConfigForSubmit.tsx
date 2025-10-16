import axios, { AxiosInstance } from "axios";
import Config from "react-native-config";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../redux/slices/loadingSlice";
import store from "../redux/store";
export const HTTP_CLIENT_SUBMIT = axios.create({
  // baseURL: Config.BASE_URL,
  baseURL: "http://46.101.210.71:6089",
});

// This code is used for token in headers for the protected route
HTTP_CLIENT_SUBMIT.interceptors.request.use(
  (config) => {
    let authToken = store.getState().tokenSlice.token;
    config.headers.Authorization = authToken ? `Bearer ${authToken}` : "";
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
HTTP_CLIENT_SUBMIT.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    return Promise.reject(err.response.data.error);
  }
);
export default HTTP_CLIENT_SUBMIT;
