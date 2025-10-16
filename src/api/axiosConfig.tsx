import axios, { AxiosInstance } from 'axios';
import Config from 'react-native-config';
import { useDispatch } from 'react-redux';
import {
  setIsLoading,
  setIsLoadingIndividual,
} from '../redux/slices/loadingSlice';
import store from '../redux/store';
import LogoutFunction from '../utils/logout';
import Toast from 'react-native-simple-toast';

export const HTTP_CLIENT = axios.create({
  baseURL: store.getState().tokenSlice.BASE_URL || 'http://104.248.37.217:6089',
  // baseURL: 'http://104.248.37.217:6089',
});

// This code is used for token in headers for the protected route
HTTP_CLIENT.interceptors.request.use(
  config => {
    if (!store?.getState()?.loadingSlice?.isLoadingIndividual) {
      store.dispatch(setIsLoading(true));
    }

    let authToken = store.getState().tokenSlice.token;
    config.headers.Authorization = authToken ? `Bearer ${authToken}` : '';
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);
HTTP_CLIENT.interceptors.response.use(
  response => {
    store.dispatch(setIsLoading(false));
    store.dispatch(setIsLoadingIndividual(false));
    return response;
  },
  err => {
    // ["data", "status", "statusText", "headers", "config", "request"]
    console.log('status: ', err?.response?.status);
    if (err?.response?.status === 401 || err?.response?.status === 500) {
      LogoutFunction().then(res => {
        console.log('\nLogout with the reason of token is invalid or expire.');
        Toast.show('Logout with the reason of token is invalid or expire.');
      });
    }
    store.dispatch(setIsLoading(false));
    store.dispatch(setIsLoadingIndividual(false));
    return Promise.reject(err.response.data.error);
  },
);
export default HTTP_CLIENT;
