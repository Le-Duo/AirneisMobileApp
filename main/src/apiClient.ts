import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '@env';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      console.log('Token retrieved from AsyncStorage:', token);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No user info found in AsyncStorage');
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default apiClient;
