import axios from 'axios'
import auth0 from './auth0'

const baseURL = process.env.EXPO_PUBLIC_API_URL

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const credential = await auth0.credentialsManager.getCredentials()
    if (credential.accessToken) {
      config.headers.Authorization = `Bearer ${credential.accessToken}`
    }
    return config
  } catch (error) {
    return config
  }
})

export default axiosInstance
