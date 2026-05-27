import { defineStore } from 'pinia'
import {
  fetchCart as fetchCartApi,
  createCart,
  addItem as addItemApi,
  removeItem as removeItemApi,
} from '@/services/cart'
import { useAuthStore } from '@/stores/auth'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartId: null,
    items: [], // cart items
    loading: false,
  }),
  getters: {
    totalQuantity: (state) => state.items.reduce((sum, i) => sum + (i.qty || i.quantity || 1), 0),
  },
  actions: {
    async fetchCart() {
      const auth = useAuthStore()

      const userId = auth.user?.user_id || auth.user?.id || auth.user?.customer_id

      if (!userId) return

      this.loading = true

      try {
        let response

        try {
          response = await fetchCartApi(userId)
        } catch (error) {
          if (error.response?.status === 404) {
            response = await createCart(userId)
          } else {
            throw error
          }
        }

        const cart = response.data

        this.cartId = cart.cart_id
        this.items = cart.cart_items || []
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        this.loading = false
      }
    },
    async addItem(productId, qty = 1) {
      if (!this.cartId) {
        await this.fetchCart()
      }
      if (!this.cartId) throw new Error('User not logged in or cart creation failed')

      const payload = { product_id: productId, qty }
      await addItemApi(this.cartId, payload)
      await this.fetchCart() // Refresh cart to get new items
    },
    async updateItem(itemId, qty) {
      if (!this.cartId) return
      if (qty <= 0) {
        return this.removeItem(itemId)
      }
      // Assuming updateItemApi takes { qty } as payload
      const { updateItem: updateItemApi } = await import('@/services/cart')
      await updateItemApi(this.cartId, itemId, { qty })
      await this.fetchCart()
    },
    async removeItem(itemId) {
      if (!this.cartId) return
      await removeItemApi(this.cartId, itemId)
      await this.fetchCart()
    },
    clear() {
      this.items = []
      this.cartId = null
    },
  },
})
