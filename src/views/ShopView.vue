<script setup>
import { onMounted, ref, defineEmits, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import CategoryProduct from '@/components/products/CategoryProduct.vue'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const productStore = useProductStore()

const openDetail = ref(false)
const openCart = ref(false)
const selectProduct = ref(null)
const switchAddToCart = ref(false)
const selectedCategory = ref(null)
const showMobileCategories = ref(false)
const toggleMobileCategories = () => {
  showMobileCategories.value = !showMobileCategories.value
}

const selectCategory = (category) => {
  console.log('selected category', category)
  selectedCategory.value = category
}

const filteredProducts = computed(() => {
  // Show all products when no category selected or 'All' is chosen
  if (!selectedCategory.value || selectedCategory.value === 'All') return productStore.products
  const selected = selectedCategory.value.toString().toLowerCase()
  // If "All" or empty, show everything
  if (!selectedCategory.value || selectedCategory.value === 'All') {
    return productStore.products
  }
  return productStore.products.filter((product) => {
    const catName = (product.category?.category_name ?? product.category?.name ?? '')
      .toString()
      .toLowerCase()
    return catName.includes(selected)
  })
})

const cartStore = useCartStore()

import { useAuthStore } from '@/stores/auth'

const switchAddToCartAndBuyNow = (product) => {
  if (switchAddToCart.value) {
    switchAddToCart.value = false
  } else {
    switchAddToCart.value = true
  }
}

const authStore = useAuthStore()
const router = useRouter()
const addToCart = async (product) => {
  if (!authStore.user) {
    authStore.showLoginModal = true
    openDetail.value = false
    return false
  }

  try {
    const pId = product.product_id || product.id
    await cartStore.addItem(pId)
    return true
    // optional feedback
    // alert('Added to cart')
  } catch (e) {
    console.error(e)
    return false
  }
}

const buyNow = async (product) => {
  const success = await addToCart(product)
  if (success) {
    router.push('/cart')
  }
}

const showDetail = (product) => {
  selectProduct.value = product
  openDetail.value = true
}

onMounted(async () => {
  await productStore.fetchProducts()
  console.log(productStore.products)
})
</script>

<template>
  <div class="h-18"></div>
  <div class="min-h-screen bg-neutral-50/50 font-sans antialiased">
    <div class="mx-auto px-2 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div class="hidden sm:block md:col-span-2 lg:col-span-2 pl-8 md:pl-12">
          <div class="h-10"></div>
          <CategoryProduct @category-selected="selectCategory($event)" />
        </div>
        <!-- Mobile menu icon -->
        <button
          class="sm:hidden p-2"
          @click="toggleMobileCategories"
          aria-label="Open categories menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <main class="md:col-span-10 lg:col-span-10">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              @click="showDetail(product)"
              class="bg-white border cursor-pointer border-neutral-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div class="flex justify-between items-center mb-4">
                  <span
                    v-if="product.tag"
                    class="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase"
                  >
                    {{ product.name }}
                  </span>
                  <div v-else class="h-6"></div>
                </div>

                <div
                  class="aspect-[4/3] w-full rounded-2xl bg-neutral-50/80 overflow-hidden mb-5 flex items-center justify-center p-4"
                >
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="object-contain max-h-full w-auto mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                <h3
                  class="text-lg font-bold text-neutral-900 tracking-tight mb-4 group-hover:text-neutral-800"
                >
                  {{ product.name }}
                </h3>
              </div>
              <!-- desrciption -->
              <div class="">
                <p>{{ product.description }}</p>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-neutral-50">
                <span class="text-xl font-bold text-neutral-900"> ${{ product.price }} </span>

                <button
                  @click.stop="addToCart(product)"
                  class="bg-[#5138ee] hover:bg-[#4026dd] active:scale-[0.98] text-white font-medium px-5 py-2.5 rounded-xl text-xs tracking-wide shadow-sm hover:shadow active:shadow-none transition-all outline-none"
                >
                  Add Cart
                </button>
              </div>
            </div>
          </div>
        </main>
        <!-- Mobile categories dialog -->
        <Dialog v-model:open="showMobileCategories">
          <DialogContent class="sm:max-w-[400px] p-4">
            <DialogHeader>
              <DialogClose as-child>
                <Button variant="ghost" @click="toggleMobileCategories"></Button>
              </DialogClose>
            </DialogHeader>
            <CategoryProduct
              class="ml-15 mb-10"
              @category-selected="(selectCategory($event), toggleMobileCategories())"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
    <Dialog v-model:open="openDetail">
      <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[900px] p-0 rounded-3xl">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <!-- Image -->
          <div class="bg-gray-100 flex items-center justify-center p-8 relative">
            <img
              :src="selectProduct.image"
              :alt="selectProduct.name"
              class="w-full max-w-[350px] object-contain hover:scale-105 transition duration-300"
            />
          </div>

          <!-- Detail -->
          <div class="p-7 flex flex-col justify-between">
            <div>
              <!-- Title -->
              <div class="space-y-2">
                <p class="text-sm text-gray-500">
                  {{ selectProduct.category?.category_name }}
                </p>

                <h2 class="text-3xl font-bold">
                  {{ selectProduct.name }}
                </h2>

                <p class="text-gray-500 leading-relaxed">
                  {{ selectProduct.description }}
                </p>
              </div>

              <!-- Price -->
              <div class="flex items-center gap-3 mt-6">
                <h1 class="text-3xl font-bold text-red-500">${{ selectProduct.discount_price }}</h1>

                <span class="text-gray-400 line-through text-lg"> ${{ selectProduct.price }} </span>
              </div>

              <!-- Specs -->
              <div class="grid grid-cols-2 gap-4 mt-8">
                <div class="bg-gray-100 rounded-2xl p-4">
                  <p class="text-gray-500 text-sm">RAM</p>
                  <h1 class="font-bold text-lg">{{ selectProduct.ram }} GB</h1>
                </div>

                <div class="bg-gray-100 rounded-2xl p-4">
                  <p class="text-gray-500 text-sm">Storage</p>
                  <h1 class="font-bold text-lg">{{ selectProduct.storage }} GB</h1>
                </div>

                <div class="bg-gray-100 rounded-2xl p-4">
                  <p class="text-gray-500 text-sm">Color</p>
                  <div class="flex items-center gap-2 mt-1">
                    <div
                      class="w-5 h-5 rounded-full border"
                      :style="{ background: selectProduct.color }"
                    ></div>

                    <h1 class="font-semibold capitalize">
                      {{ selectProduct.color }}
                    </h1>
                  </div>
                </div>

                <div class="bg-gray-100 rounded-2xl p-4">
                  <p class="text-gray-500 text-sm">Stock</p>
                  <h1 class="font-bold text-lg">
                    {{ selectProduct.stock }}
                  </h1>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <DialogFooter class="mt-8">
              <DialogClose as-child>
                <Button variant="outline"> Cancel </Button>
              </DialogClose>

              <Button class="bg-black hover:bg-black/90" @click="buyNow(selectProduct)"
                >Buy Now</Button
              >
              <Button class="bg-black hover:bg-black/90" @click="addToCart(selectProduct)"
                >Add Cart</Button
              >
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
<style scoped>
@keyframes slideLeft {
  0% {
    transform: translate(-120px);
    opacity: 0;
  }
  100% {
    transform: translate(0);
    opacity: 1;
  }
}
</style>
