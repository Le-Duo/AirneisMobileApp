import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {API_BASE_URL} from '@env'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    const userInfo = await AsyncStorage.getItem('userInfo')
    if (userInfo)
      config.headers.Authorization = `Bearer ${
        JSON.parse(userInfo).token
      }`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient