import api from '../lib/axios'

const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return response?.data
    } catch (error) {
      console.error('Login service error:', error)
      throw error
    }
  },
  //user list
  async listUser() {
    try {
      const response = await api.post('/auth/lists')

      // Return the full response data
      return response.data
    } catch (error) {
      console.error('Login service error:', error)
      throw error
    }
  },

  //user create
  async createUser(credentials) {
    try {
      const response = await api.post('/auth/create', credentials)
      return response.data
    } catch (error) {
      console.error('Create error:', error)
      throw error
    }
  },

  //customer list
  async listCustomer() {
    try {
      const response = await api.post('/auth/lists')
      return response.data
    } catch (error) {
      console.error('List customer error:', error)
      throw error
    }
  },
  async updateUser(data) {
    try {
      const response = await api.post('/auth/update', data)
      return response.data
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  },
  async deleteUser(data) {
    try {
      const response = await api.post('/auth/delete', data)
      return response.data
    } catch (error) {
      console.error('Delete user error:', error)
      throw error
    }
  },

  //update password
  async updatePassword(customerId, credentials) {
    try {
      const token = localStorage.getItem('token')

      const response = await api.put(`/auth/${customerId}/update-password`, credentials, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error) {
      console.error('update password error:', error)
      throw error
    }
  },
}

export default authService
