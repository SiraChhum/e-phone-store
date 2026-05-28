<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/axios'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const form = ref({
  fullName: authStore.user?.full_name || '',
  email: authStore.user?.email || '',
  address: '',
  city: '',
  zip: '',
  phone: '',
})

const paymentMethod = ref('COD')

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const errorMessage = ref('')

const totalAmount = computed(() => {
  return cartStore.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0)
})

const formatPrice = (price) => {
  if (price == null) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

const handleCheckout = async () => {
  if (cartStore.items.length === 0) {
    errorMessage.value = 'Your cart is empty!'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const userId = authStore.user?.user_id || authStore.user?.id || authStore.user?.customer_id

    if (!userId) {
      errorMessage.value = 'You must be logged in to checkout.'
      isSubmitting.value = false
      return
    }

    const orderItems = cartStore.items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product?.name || 'Unknown Product',
      qty: item.qty,
      price: item.product?.price || 0,
    }))

    const payload = {
      user_id: userId,
      order_status: 'PENDING',
      order_items: orderItems,
    }

    console.log('Sending order payload:', payload)
    const response = await api.post('/orders/create', payload)
    console.log('Response:', response)

    if (response.status === 201 || response.status === 200) {
      submitSuccess.value = true

      try {
        await api.delete(`/carts/${cartStore.cartId}`)
      } catch (e) {
        console.error('Failed to delete cart after checkout', e)
      }
      cartStore.clear()

      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  } catch (error) {
    console.error('Order creation error:', error)
    if (error.response && error.response.data) {
      console.error('Server message:', error.response.data)
      errorMessage.value = error.response.data.message || 'An error occurred while placing your order.'
    } else {
      errorMessage.value = 'An error occurred while placing your order. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen font-sans antialiased pb-24">
    <div class="h-20 bg-white border-b border-neutral-100"></div>
    <!-- spacing for header -->

    <div class="max-w-7xl mx-auto px-4 py-10">
      <h1 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-8 tracking-tight">
        Secure Checkout
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Billing Details -->
        <div
          class="lg:col-span-7 bg-white p-6 md:p-10 rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <h2 class="text-2xl font-bold mb-8 text-neutral-800">Billing Information</h2>

          <form id="checkoutForm" @submit.prevent="handleCheckout" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-neutral-700 mb-2">Full Name</label>
                <input
                  v-model="form.fullName"
                  type="text"
                  required
                  class="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 px-5 py-4 text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-neutral-700 mb-2"
                  >Email Address</label
                >
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 px-5 py-4 text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2"
                >Shipping Address</label
              >
              <input
                v-model="form.address"
                type="text"
                required
                class="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 px-5 py-4 text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                placeholder="123 Main St, Apt 4B"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-neutral-700 mb-2">City</label>
                <input
                  v-model="form.city"
                  type="text"
                  required
                  class="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 px-5 py-4 text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                  placeholder="New York"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-neutral-700 mb-2">ZIP Code</label>
                <input
                  v-model="form.zip"
                  type="text"
                  required
                  class="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 px-5 py-4 text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                  placeholder="10001"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">Phone Number</label>
              <input
                v-model="form.phone"
                type="tel"
                required
                class="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 px-5 py-4 text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <h2 class="text-2xl font-bold pt-6 pb-2 text-neutral-800 border-t border-neutral-100">
              Payment Method
            </h2>
            <div class="space-y-4">
              <!-- COD Option -->
              <div
                @click="paymentMethod = 'COD'"
                :class="[
                  'border-2 rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-300',
                  paymentMethod === 'COD'
                    ? 'bg-blue-50/80 border-blue-500 shadow-[0_4px_20px_rgba(59,130,246,0.15)]'
                    : 'bg-white border-neutral-200 hover:border-blue-200',
                ]"
              >
                <i
                  :class="[
                    'text-2xl transition-colors',
                    paymentMethod === 'COD'
                      ? 'pi pi-check-circle text-blue-600'
                      : 'pi pi-circle text-neutral-300',
                  ]"
                ></i>
                <div class="flex flex-col">
                  <span
                    :class="[
                      'font-bold text-lg',
                      paymentMethod === 'COD' ? 'text-blue-800' : 'text-neutral-700',
                    ]"
                    >Cash on Delivery (COD)</span
                  >
                  <span class="text-xs text-neutral-500">Pay when you receive your order</span>
                </div>
              </div>

              <!-- KHQR Option -->
              <div
                @click="paymentMethod = 'KHQR'"
                :class="[
                  'border-2 rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-300',
                  paymentMethod === 'KHQR'
                    ? 'bg-blue-50/80 border-blue-500 shadow-[0_4px_20px_rgba(59,130,246,0.15)]'
                    : 'bg-white border-neutral-200 hover:border-blue-200',
                ]"
              >
                <i
                  :class="[
                    'text-2xl transition-colors',
                    paymentMethod === 'KHQR'
                      ? 'pi pi-check-circle text-blue-600'
                      : 'pi pi-circle text-neutral-300',
                  ]"
                ></i>
                <div class="flex flex-col">
                  <span
                    :class="[
                      'font-bold text-lg',
                      paymentMethod === 'KHQR' ? 'text-blue-800' : 'text-neutral-700',
                    ]"
                    >KHQR</span
                  >
                  <span class="text-xs text-neutral-500">Scan to pay instantly</span>
                </div>
              </div>
            </div>

            <!-- KHQR Sample Image -->
            <transition name="fade">
              <div
                v-if="paymentMethod === 'KHQR'"
                class="mt-4 flex flex-col items-center bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm animate-[slideUp_0.3s_ease-out]"
              >
                <p class="text-sm font-bold text-neutral-700 mb-4">Scan the QR Code below to pay</p>
                <div
                  class="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                    alt="KHQR Sample"
                    class="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <p class="text-xs text-neutral-500 mt-4 text-center">
                  This is a dynamic sample QR code for testing purposes.
                </p>
              </div>
            </transition>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-5">
          <div
            class="bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-28"
          >
            <h2 class="text-2xl font-bold mb-8 text-neutral-800">Order Summary</h2>

            <div class="space-y-5 mb-8 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              <div
                v-for="item in cartStore.items"
                :key="item.cart_item_id"
                class="flex gap-4 items-center"
              >
                <div
                  class="w-20 h-20 bg-neutral-50 rounded-2xl flex items-center justify-center p-2 flex-shrink-0 border border-neutral-100"
                >
                  <img
                    v-if="item.product?.image"
                    :src="item.product.image"
                    class="object-contain w-full h-full mix-blend-multiply"
                  />
                  <i v-else class="pi pi-image text-neutral-300 text-xl"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-base font-bold text-neutral-800 truncate">
                    {{ item.product?.name || 'Product' }}
                  </h4>
                  <p class="text-sm text-neutral-500 mt-1 font-medium">Qty: {{ item.qty }}</p>
                </div>
                <div class="text-base font-bold text-neutral-900 flex-shrink-0">
                  {{ formatPrice((item.product?.price || 0) * item.qty) }}
                </div>
              </div>
              <div v-if="cartStore.items.length === 0" class="text-center text-neutral-500 py-10">
                <i class="pi pi-shopping-bag text-5xl text-neutral-200 mb-4 block"></i>
                Your cart is empty.
              </div>
            </div>

            <div class="border-t-2 border-dashed border-neutral-100 pt-6 space-y-4">
              <div class="flex justify-between text-neutral-600 font-medium text-lg">
                <span>Subtotal</span>
                <span>{{ formatPrice(totalAmount) }}</span>
              </div>
              <div class="flex justify-between text-neutral-600 font-medium text-lg">
                <span>Shipping</span>
                <span class="text-green-500 font-bold tracking-wide uppercase">Free</span>
              </div>
              <div class="flex justify-between text-2xl font-black text-neutral-900 pt-4 mt-2">
                <span>Total</span>
                <span class="text-blue-600">{{ formatPrice(totalAmount) }}</span>
              </div>
            </div>

            <div
              v-if="errorMessage"
              class="mt-8 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 flex items-center gap-3"
            >
              <i class="pi pi-exclamation-triangle text-lg"></i>
              {{ errorMessage }}
            </div>

            <button
              form="checkoutForm"
              type="submit"
              :disabled="isSubmitting || cartStore.items.length === 0"
              class="w-full mt-8 bg-black hover:bg-neutral-800 active:scale-[0.98] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:scale-100 disabled:cursor-not-allowed text-white py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] disabled:shadow-none"
            >
              <i v-if="isSubmitting" class="pi pi-spinner animate-spin"></i>
              {{ isSubmitting ? 'Processing...' : 'Place Order' }}
            </button>

            <transition name="fade">
              <div
                v-if="submitSuccess"
                class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
              >
                <div
                  class="bg-white p-10 rounded-[2.5rem] max-w-md w-full mx-4 text-center shadow-2xl animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                >
                  <div
                    class="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                  >
                    <i class="pi pi-check text-5xl font-black"></i>
                  </div>
                  <h2 class="text-3xl font-black text-neutral-900 mb-3 tracking-tight">
                    Order Confirmed!
                  </h2>
                  <p class="text-neutral-500 mb-10 text-lg leading-relaxed">
                    Thank you for your purchase. Your order is being processed.
                  </p>
                  <div class="flex flex-col items-center gap-3">
                    <i class="pi pi-spinner animate-spin text-3xl text-blue-500"></i>
                    <span class="text-sm font-semibold text-neutral-400 uppercase tracking-widest"
                      >Redirecting</span
                    >
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes slideUp {
  0% {
    transform: translateY(30px) scale(0.95);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Custom Scrollbar for Order Summary */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
