import { defineStore } from 'pinia'
import { ref } from 'vue'
import productService from '../services/product'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
  }),

  actions: {
    async fetchProducts() {
      try {
        const data = await productService.listProduct()

        console.log('DATA:', data)

        this.products = data
      } catch (error) {
        console.log(error)
      }
    },
  },
})
