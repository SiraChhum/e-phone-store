<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/axios'
import Dialog from 'primevue/dialog'
const authStore = useAuthStore()
const orders = ref([])
const loading = ref(true)
const showOrderDialog = ref(false)
const selectedOrder = ref(null)

const openOrderDialog = async (order) => {
  try {
    const orderId = order.order_id || order.id
    // If order does not contain full details (e.g., order_items), fetch them
    if (!order.order_items) {
      const response = await api.get(`/orders/${orderId}`)
      selectedOrder.value = response.data
    } else {
      selectedOrder.value = order
    }
    showOrderDialog.value = true
  } catch (err) {
    console.error('Failed to load order details', err)
  }
}

watch(showOrderDialog, (newVal) => {
  if (!newVal) {
    selectedOrder.value = null
  }
})

const fetchUserOrders = async () => {
  loading.value = true
  try {
    const userId = authStore.user?.user_id || authStore.user?.id || authStore.user?.customer_id
    if (userId) {
      const response = await api.get(`/orders/user/${userId}`)
      orders.value = response.data
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserOrders()
})

const formatPrice = (price) => {
  if (price == null) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen font-sans antialiased pb-24">
    <div class="h-20 bg-white border-b border-neutral-100"></div>
    <!-- spacing for header -->

    <div class="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <h1 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-8 tracking-tight">
        My Profile
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 items-start">
        <!-- Profile Info Sidebar -->
        <div
          class="md:col-span-1 bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:top-28"
        >
          <!-- Profile Info Sidebar -->
          <div
            class="md:col-span-1 bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:top-28"
          >
            <div class="flex flex-col items-center text-center">
              <!-- Avatar -->
              <div
                class="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl sm:text-3xl font-bold uppercase shadow-sm flex-shrink-0"
              >
                {{
                  authStore.user?.full_name?.charAt(0) || authStore.user?.username?.charAt(0) || 'U'
                }}
              </div>

              <!-- Name -->
              <h2 class="text-lg sm:text-xl font-bold text-neutral-800 mb-1 break-words max-w-full">
                {{ authStore.user?.full_name || authStore.user?.username || 'User' }}
              </h2>

              <!-- Email -->
              <p
                class="text-xs sm:text-sm text-neutral-500 font-medium mb-5 sm:mb-6 break-all max-w-full"
              >
                {{ authStore.user?.email || 'No email provided' }}
              </p>

              <!-- Stats -->
              <div class="w-full border-t border-neutral-100 pt-4 sm:pt-6 space-y-3">
                <!-- Role -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span class="text-sm text-neutral-500">Role</span>

                  <span
                    class="text-sm font-bold text-neutral-800 capitalize bg-neutral-100 px-3 py-1 rounded-full text-center"
                  >
                    {{ authStore.user?.role || 'Customer' }}
                  </span>
                </div>

                <!-- Orders -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span class="text-sm text-neutral-500">Total Orders</span>

                  <span class="text-sm font-bold text-neutral-800">
                    {{ orders.length }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order History -->
        <div class="md:col-span-2 space-y-6">
          <h2 class="text-2xl font-bold text-neutral-800 mb-2">Order History</h2>

          <div
            v-if="loading"
            class="bg-white p-10 rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[300px]"
          >
            <i class="pi pi-spinner animate-spin text-4xl text-blue-500 mb-4"></i>
            <p class="text-neutral-500 font-medium">Loading your orders...</p>
          </div>

          <div
            v-else-if="orders.length === 0"
            class="bg-white p-10 rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[300px] text-center"
          >
            <i class="pi pi-box text-6xl text-neutral-200 mb-6 block"></i>
            <h3 class="text-xl font-bold text-neutral-800 mb-2">No orders yet</h3>
            <p class="text-neutral-500 mb-6">
              Looks like you haven't placed any orders. Start shopping to see your history here!
            </p>
            <router-link
              to="/shop"
              class="bg-black hover:bg-neutral-800 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg hover:shadow-xl"
              >Browse Shop</router-link
            >
          </div>

          <div v-else>
            <div
              v-for="order in orders"
              :key="order.order_id"
              class="bg-white p-5 md:p-6 rounded-2xl border border-neutral-200 shadow-sm mb-6"
            >
              <div class="flex justify-between items-center mb-4">
                <div>
                  <span class="text-sm font-medium text-neutral-500"
                    >Order #{{ order.order_id }}</span
                  >
                  <span class="ml-2 text-sm text-neutral-500">{{
                    formatDate(order.createdAt)
                  }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      getStatusColor(order.order_status),
                    ]"
                  >
                    {{ order.order_status }}
                  </span>
                  <!-- <button
                    @click="openOrderDialog(order)"
                    class="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View Details
                  </button> -->
                </div>
              </div>
              <div
                v-for="item in order.order_items"
                :key="item.product_id"
                class="flex items-center gap-4 bg-neutral-50 rounded-xl p-3 mb-3"
              >
                <div
                  class="w-16 h-16 bg-white border border-neutral-200 flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="item.product?.image"
                    :src="item.product.image"
                    class="object-contain w-full h-full"
                  />
                  <i v-else class="pi pi-image text-neutral-300 text-lg"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-bold text-neutral-800 truncate">
                    {{ item.product_name || item.product?.name || 'Unknown Product' }}
                  </h4>
                  <p class="text-xs text-neutral-500 mt-1">
                    Qty: {{ item.qty }} × {{ formatPrice(item.price) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-neutral-900">
                    {{ formatPrice(item.subtotal || item.price * item.qty) }}
                  </p>
                </div>
              </div>
              <div class="text-right font-bold text-lg mt-2 text-blue-600">
                Total: {{ formatPrice(order.total_amount) }}
              </div>
            </div>
          </div>

          <!-- Order Detail Dialog -->
          <Dialog
            v-model:visible="showOrderDialog"
            modal
            :header="'Order #' + (selectedOrder?.order_id || '')"
            class="w-full max-w-md sm:max-w-lg"
            :style="{ maxHeight: '80vh' }"
          >
            <div v-if="selectedOrder" class="overflow-y-auto" style="max-height: 70vh">
              <div class="space-y-4">
                <div
                  v-for="item in selectedOrder.order_items"
                  :key="item.product_id"
                  class="flex items-center gap-4"
                >
                  <div
                    class="w-16 h-16 bg-neutral-50 rounded-xl flex items-center justify-center p-2 border border-neutral-100 flex-shrink-0"
                  >
                    <img
                      v-if="item.product?.image"
                      :src="item.product.image"
                      class="object-contain w-full h-full mix-blend-multiply"
                    />
                    <i v-else class="pi pi-image text-neutral-300 text-lg"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-bold text-neutral-800 truncate">
                      {{ item.product_name || item.product?.name || 'Unknown Product' }}
                    </h4>
                    <p class="text-xs text-neutral-500 mt-1 font-medium">
                      Qty: {{ item.qty }} x {{ formatPrice(item.price) }}
                    </p>
                  </div>
                  <div class="text-sm font-bold text-neutral-900">
                    {{ formatPrice(item.subtotal || item.price * item.qty) }}
                  </div>
                </div>
              </div>
              <div class="mt-4 text-right font-bold text-lg text-blue-600">
                Total: {{ formatPrice(selectedOrder.total_amount) }}
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
</template>
