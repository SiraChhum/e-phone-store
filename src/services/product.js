import api from '../lib/axios'
const productService = {
  async listProduct() {
    try {
      const response = await api.post('/product/lists')
      return response.data
    } catch (error) {
      console.error('List customer error:', error)
      throw error
    }
  },
}
export default productService
