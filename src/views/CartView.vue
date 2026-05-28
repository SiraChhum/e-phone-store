<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4 text-slate-800">Your Shopping Cart</h1>
    <div v-if="cartItems.length === 0" class="text-center text-slate-600">Your cart is empty.</div>
    <ul v-else class="space-y-4">
      <li
        v-for="item in cartItems"
        :key="item.cart_item_id"
        class="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm"
      >
        <div class="flex items-center space-x-4">
          <!-- Placeholder for product image -->
          <div class="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
            <img
              v-if="item.product?.image"
              :src="item.product.image"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <p class="font-medium text-slate-800">
              {{ item.products?.name || 'Product ' + item.product_id }}
            </p>
            <p class="text-sm text-slate-500">
              Price: ${{ item.price || item.products?.price }} x Quantity:
              {{ item.qty || item.quantity }}
            </p>
          </div>
        </div>
        <button
          @click="removeItem(item.cart_item_id)"
          class="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-lg transition-colors"
        >
          <i class="pi pi-trash"></i>
        </button>
      </li>
    </ul>
    <div class="mt-6 flex justify-between items-center" v-if="cartItems.length > 0">
      <div class="flex flex-col gap-1">
        <p class="text-lg font-semibold text-slate-800">Total Items: {{ totalQuantity }}</p>
        <p class="text-xl font-bold text-slate-900">Total Price: ${{ totalPrice }}</p>
      </div>
      <router-link
        to="/checkout"
        class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
      >
        Proceed to Checkout
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.user) {
    cartStore.fetchCart()
  } else {
    router.push('/')
  }
})

const cartItems = computed(() => cartStore.items)
const totalQuantity = computed(() => cartStore.totalQuantity)
const totalPrice = computed(() => {
  return cartItems.value
    .reduce(
      (total, item) =>
        total + parseFloat(item.price || item.products?.price) * (item.qty || item.quantity || 1),
      0,
    )
    .toFixed(2)
})

const removeItem = async (itemId) => {
  try {
    await cartStore.removeItem(itemId)
  } catch (e) {
    console.error('Failed to remove item', e)
  }
}
</script>

<style scoped>
/* No additional styles – using Tailwind utility classes */
</style>
