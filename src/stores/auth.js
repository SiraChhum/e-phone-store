import { defineStore } from 'pinia'
import { ref } from 'vue'
import authService from '../services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref()
  const users = ref(JSON.parse(localStorage.getItem('users')) || [])
  const customers = ref(JSON.parse(localStorage.getItem('customers')) || [])
  const showLoginModal = ref(false)

  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const payload = {
        email: credentials.email || credentials.username || credentials.customer_id,
        password: credentials.password,
      }

      const response = await authService.login(payload)

      // Save user
      user.value = response.user || response.data

      if (response.token) {
        localStorage.setItem('token', response.token)
      }

      localStorage.setItem('user', JSON.stringify(user.value))

      return {
        success: true,
        data: response,
        message: 'Login successful',
      }
    } catch (err) {
      console.error('Login error:', err)

      error.value = err.response?.data?.message || err.message || 'Login failed'

      return {
        success: false,
        message: error.value,
        error: err,
      }
    } finally {
      loading.value = false
    }
  }

  //list User
  const listUser = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.listUser()

      // Handle different response structures: response.data or response itself if it's an array
      users.value = Array.isArray(response) ? response : response.data || []
      console.log('Populated users list:', users.value)
      localStorage.setItem('users', JSON.stringify(users.value))

      return {
        success: true,
        data: response,
        message: 'User list successful',
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'User list failed'

      return {
        success: false,
        message: error.value,
        error: err,
      }
    } finally {
      loading.value = false
    }
  }
  const listCustomer = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.listCustomer()
      console.log(response.data)

      // Handle different response structures: response.data or response itself if it's an array
      customers.value = Array.isArray(response) ? response : response.data
      console.log('Populated customers list:', customers.value)
      localStorage.setItem('customers', JSON.stringify(customers.value))

      return {
        success: true,
        data: response,
        message: 'Customer list successful',
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Customer list failed'

      return {
        success: false,
        message: error.value,
        error: err,
      }
    } finally {
      loading.value = false
    }
  }

  //create user
  const createUser = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.createUser(credentials)
      return {
        success: true,
        data: response,
        message: 'User created successfully',
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'User creation failed'

      return {
        success: false,
        message: error.value,
        error: err,
      }
    } finally {
      loading.value = false
    }
  }
  //update user
  const updateUser = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      // Ensure the payload uses 'id' which is expected by the backend
      const payload = { ...credentials }
      if (payload.user_id && !payload.id) {
        payload.id = payload.user_id
      }

      const response = await authService.updateUser(payload)
      return {
        success: true,
        data: response,
        message: 'User updated successfully',
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'User update failed'

      return {
        success: false,
        message: error.value,
        error: err,
      }
    } finally {
      loading.value = false
    }
  }
  //delete user
  const deleteUser = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      // Ensure the payload uses 'id' which is expected by the backend
      const payload = { ...credentials }
      if (payload.user_id && !payload.id) {
        payload.id = payload.user_id
      }

      const response = await authService.deleteUser(payload)
      return {
        success: true,
        data: response,
        message: 'User deleted successfully',
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'User delete failed'

      return {
        success: false,
        message: error.value,
        error: err,
      }
    } finally {
      loading.value = false
    }
  }

  // ---------------- UPDATE PASSWORD ----------------
  const updatePassword = async (credentials) => {
    loading.value = true
    error.value = null
    successMessage.value = null

    try {
      // ✅ Get customerId from store or localStorage
      const storedUser = user.value || JSON.parse(localStorage.getItem('user'))
      const customerId = storedUser?.customer_id

      if (!customerId) {
        throw new Error('Customer ID not found')
      }

      // credentials: { old_password, new_password, confirm_password }
      const response = await authService.updatePassword(customerId, credentials)

      successMessage.value = response.message || 'Password updated successfully'

      return {
        success: true,
        data: response,
      }
    } catch (err) {
      console.error('Password update error:', err)
      error.value = err.response?.data?.message || err.message || 'Password update failed'

      return {
        success: false,
        message: error.value,
      }
    } finally {
      loading.value = false
    }
  }

  // ---------------- LOGOUT ----------------
  const logout = () => {
    user.value = null
    error.value = null
    successMessage.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('users')
    localStorage.removeItem('customers')
    users.value = []
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    successMessage,
    updatePassword,
    listUser,
    listCustomer,
    users,
    customers,
    createUser,
    updateUser,
    deleteUser,
    showLoginModal,
  }
})
