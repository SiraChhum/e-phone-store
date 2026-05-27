import api from '../lib/axios'

// Utility to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const fetchCart = async (userId) => {
  return api.get(`/carts/${userId}`, { headers: getAuthHeaders() })
}

/** Create a new cart for a user */
export const createCart = async (userId) => {
  return api.post(`/carts/${userId}`, {}, { headers: getAuthHeaders() })
}

/** Add an item to a cart */
export const addItem = async (cartId, item) => {
  return api.post(`/carts/${cartId}/items`, item, { headers: getAuthHeaders() })
}

/** Update an existing cart item (e.g., quantity) */
export const updateItem = async (cartId, itemId, payload) => {
  return api.put(`/carts/${cartId}/items/${itemId}`, payload, { headers: getAuthHeaders() })
}

/** Remove an item from a cart */
export const removeItem = async (cartId, itemId) => {
  return api.delete(`/carts/${cartId}/items/${itemId}`, { headers: getAuthHeaders() })
}
