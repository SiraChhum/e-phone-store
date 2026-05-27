import axios from 'axios'

const api = axios.create({
  // baseURL already includes '/api'
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Attach Bearer token from localStorage to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default api
