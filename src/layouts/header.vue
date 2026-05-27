<template>
  <!-- NAVBAR -->
  <header
    class="fixed top-0 left-0 w-full z-50 backdrop-blur-lg shadow-md bg-white/60 border-b border-slate-200"
  >
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <router-link to="/">
        <h1 class="text-2xl font-extrabold">E-PHONE</h1>
      </router-link>
      <!-- Desktop Menu -->
      <nav class="hidden md:flex gap-8 font-medium">
        <router-link
          to="/"
          class="text-slate-800 hover:text-blue-600 transition"
          active-class="text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
        >
          Home
        </router-link>

        <router-link
          to="/shop"
          class="text-slate-800 hover:text-blue-600 transition"
          active-class="text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
        >
          Shops
        </router-link>

        <router-link
          to="/about"
          class="text-slate-800 hover:text-blue-600 transition"
          active-class="text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
        >
          About Us
        </router-link>

        <router-link
          to="/contact"
          class="text-slate-800 hover:text-blue-600 transition"
          active-class="text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
        >
          Contact
        </router-link>
        <a
          href="#"
          @click.prevent="handleCartClick"
          class="relative flex items-center justify-center mr-2 text-slate-800 hover:text-blue-600 transition duration-300 z-10"
        >
          <i class="pi pi-cart-plus text-xl"></i>
          <span
            v-if="cartStore.totalQuantity > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-bold min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full border-2 border-white"
          >
            {{ cartStore.totalQuantity }}
          </span>
        </a>
        <!-- Logged Out Icons -->
        <template v-if="!authStore.user">
          <button
            @click="openLogin = true"
            class="text-slate-800 hover:text-blue-600 transition cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-slate-100/50"
            title="Sign In"
          >
            <i class="pi pi-sign-in text-lg"></i>
          </button>
          <button
            @click="openRegister = true"
            class="text-slate-800 hover:text-blue-600 transition cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-slate-100/50"
            title="Register"
          >
            <i class="pi pi-user-plus text-lg"></i>
          </button>
        </template>

        <!-- Logged In User Dropdown -->
        <template v-else>
          <div class="relative user-menu-container flex items-center">
            <button
              @click="showDropdown = !showDropdown"
              class="flex items-center gap-2 focus:outline-none hover:bg-slate-100/80 px-3 py-1.5 rounded-full transition cursor-pointer border border-slate-100 bg-slate-50/50"
            >
              <!-- Avatar placeholder -->
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                :class="authStore.user.role === 'ADMIN' ? 'bg-purple-600' : 'bg-blue-600'"
              >
                {{ authStore.user.full_name?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <span class="text-xs font-semibold max-w-[100px] truncate text-slate-700">
                {{ authStore.user.full_name }}
              </span>
              <i
                class="pi pi-chevron-down text-[10px] text-slate-400 transition-transform duration-300"
                :class="{ 'rotate-180': showDropdown }"
              ></i>
            </button>

            <!-- Dropdown Menu -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0 -translate-y-2"
              enter-to-class="transform scale-100 opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="transform scale-100 opacity-100 translate-y-0"
              leave-to-class="transform scale-95 opacity-0 -translate-y-2"
            >
              <div
                v-if="showDropdown"
                class="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-slate-100 shadow-xl py-2 z-50 text-slate-800"
              >
                <div class="px-4 py-2 border-b border-slate-50">
                  <p class="text-[10px] text-slate-400 font-medium">Logged in as</p>
                  <p class="text-xs font-bold truncate text-slate-700">
                    {{ authStore.user.email }}
                  </p>
                </div>

                <router-link
                  to="/"
                  @click="showDropdown = false"
                  class="flex items-center gap-3 px-4 py-2 text-xs hover:bg-slate-50 transition font-medium text-slate-600 hover:text-blue-600"
                >
                  <i class="pi pi-home text-slate-400 text-sm"></i>
                  <span>Home</span>
                </router-link>

                <router-link
                  to="/profile"
                  @click="showDropdown = false"
                  class="flex items-center gap-3 px-4 py-2 text-xs hover:bg-slate-50 transition font-medium text-slate-600 hover:text-blue-600"
                >
                  <i class="pi pi-user text-slate-400 text-sm"></i>
                  <span>My Profile</span>
                </router-link>

                <router-link
                  v-if="authStore.user.role === 'ADMIN'"
                  to="/admin"
                  @click="showDropdown = false"
                  class="flex items-center gap-3 px-4 py-2 text-xs hover:bg-slate-50 transition font-medium text-slate-600 hover:text-purple-600"
                >
                  <i class="pi pi-sliders-h text-slate-400 text-sm"></i>
                  <span>Admin Dashboard</span>
                </router-link>

                <hr class="border-slate-50 my-1" />

                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-2 text-xs hover:bg-red-50 transition text-red-600 font-bold cursor-pointer text-left"
                >
                  <i class="pi pi-sign-out text-sm"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            </transition>
          </div>
        </template>
      </nav>
      <div class="md:hidden flex flex-row gap-4">
        <!-- Burger -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden flex flex-col gap-1 z-10">
          <span class="w-6 h-0.5 bg-black"></span>
          <span class="w-6 h-0.5 bg-black"></span>
          <span class="w-6 h-0.5 bg-black"></span>
        </button>
        <a
          href="#"
          @click.prevent="handleCartClick"
          class="relative flex items-center justify-center mr-2 text-slate-800 hover:text-blue-600 transition duration-300 z-10"
        >
          <i class="pi pi-cart-plus text-xl"></i>
          <span
            v-if="cartStore.totalQuantity > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-bold min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full border-2 border-white"
          >
            {{ cartStore.totalQuantity }}
          </span>
        </a>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-gray-100">
      <div class="flex flex-col p-4 gap-4">
        <router-link
          to="/"
          @click="isMenuOpen = false"
          class="text-slate-800 hover:text-blue-600 transition"
          >Home</router-link
        >
        <router-link
          to="/shop"
          @click="isMenuOpen = false"
          class="text-slate-800 hover:text-blue-600 transition"
          >Shop</router-link
        >
        <router-link
          to="/about"
          @click="isMenuOpen = false"
          class="text-slate-800 hover:text-blue-600 transition"
          >About Us</router-link
        >
        <router-link
          to="/contact"
          @click="isMenuOpen = false"
          class="text-slate-800 hover:text-blue-600 transition"
          >Contact</router-link
        >

        <hr class="border-slate-100" />

        <!-- Logged Out Mobile -->
        <template v-if="!authStore.user">
          <button
            @click="((openLogin = true), (isMenuOpen = false))"
            class="text-left font-semibold text-slate-800 hover:text-blue-600 transition flex items-center gap-2 py-1 cursor-pointer"
          >
            <i class="pi pi-sign-in"></i> Sign In
          </button>
          <button
            @click="(openRegister = true)((isMenuOpen = false))"
            class="text-left font-semibold text-slate-800 hover:text-blue-600 transition flex items-center gap-2 py-1 cursor-pointer"
          >
            <i class="pi pi-user-plus"></i> Register
          </button>
        </template>

        <!-- Logged In Mobile -->
        <template v-else>
          <div class="flex items-center gap-3 py-1">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
              :class="authStore.user.role === 'ADMIN' ? 'bg-purple-600' : 'bg-blue-600'"
            >
              {{ authStore.user.full_name?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-700 truncate">{{
                authStore.user.full_name
              }}</span>
              <span class="text-[10px] text-slate-400 font-medium truncate">{{
                authStore.user.email
              }}</span>
            </div>
          </div>

          <router-link
            to="/profile"
            @click="isMenuOpen = false"
            class="text-slate-800 hover:text-blue-600 font-semibold transition flex items-center gap-2 py-1"
          >
            <i class="pi pi-user"></i> My Profile
          </router-link>

          <router-link
            v-if="authStore.user.role === 'ADMIN'"
            to="/admin"
            @click="isMenuOpen = false"
            class="text-slate-800 hover:text-purple-600 font-semibold transition flex items-center gap-2 py-1"
          >
            <i class="pi pi-sliders-h"></i> Admin Dashboard
          </router-link>

          <button
            @click="(handleLogout(), (isMenuOpen = false))"
            class="text-left font-semibold text-red-600 hover:text-red-700 transition flex items-center gap-2 py-1 cursor-pointer"
          >
            <i class="pi pi-sign-out"></i> Sign Out
          </button>
        </template>
      </div>
    </div>
  </header>
  <!-- Cart Sheet using shadcn Sheet component -->
  <Sheet v-model:open="showCartSheet">
    <SheetContent side="right" class="flex flex-col h-full sm:max-w-md w-full p-0">
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-xl font-bold">Your Cart</h2>
        <SheetClose asChild>
          <button class="text-gray-500 hover:text-gray-700 transition">
            <i class="pi pi-times text-lg"></i>
          </button>
        </SheetClose>
      </div>
      <div class="p-6 flex-1 overflow-y-auto">
        <ul class="space-y-6" v-if="cartStore.items && cartStore.items.length > 0">
          <li
            v-for="item in cartStore.items"
            :key="item.cart_item_id"
            class="flex gap-4 pb-6 border-b"
          >
            <div
              class="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-2 flex-shrink-0"
            >
              <img
                v-if="item.product?.image"
                :src="`/api/image/product/${item.product.image}`"
                class="object-contain w-full h-full mix-blend-multiply"
              />
              <i v-else class="pi pi-image text-gray-300 text-2xl"></i>
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div class="flex justify-between items-start gap-2">
                <span class="text-sm font-bold text-slate-800 leading-tight line-clamp-2">{{
                  item.product?.name || 'Unknown Product'
                }}</span>
                <button
                  @click="cartStore.removeItem(item.cart_item_id)"
                  class="text-red-500 hover:text-red-700 text-xs font-semibold p-1 hover:bg-red-50 rounded transition"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
              <div class="flex justify-between items-center mt-2">
                <div
                  class="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm h-8"
                >
                  <button
                    @click="cartStore.updateItem(item.cart_item_id, item.qty - 1)"
                    class="px-3 hover:bg-gray-100 disabled:opacity-50 transition font-bold h-full flex items-center justify-center"
                    :disabled="cartStore.loading"
                  >
                    -
                  </button>
                  <span
                    class="px-3 text-xs font-semibold border-x border-gray-200 h-full flex items-center justify-center"
                    >{{ item.qty }}</span
                  >
                  <button
                    @click="cartStore.updateItem(item.cart_item_id, item.qty + 1)"
                    class="px-3 hover:bg-gray-100 disabled:opacity-50 transition font-bold h-full flex items-center justify-center"
                    :disabled="cartStore.loading"
                  >
                    +
                  </button>
                </div>
                <span class="text-base font-bold text-blue-600">{{
                  formatPrice((item.product?.price || 0) * item.qty)
                }}</span>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="text-center text-gray-500 mt-10 flex flex-col items-center gap-4">
          <i class="pi pi-shopping-cart text-5xl text-gray-300"></i>
          <p class="font-medium">Your cart is currently empty.</p>
        </div>
      </div>
      <div class="p-6 border-t bg-gray-50/50" v-if="cartStore.items && cartStore.items.length > 0">
        <div class="flex justify-between items-center font-bold text-xl mb-6">
          <span>Total:</span>
          <span class="text-blue-600">{{
            formatPrice(
              cartStore.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0),
            )
          }}</span>
        </div>
        <Button
          @click="proceedToCheckout"
          class="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Proceed to Checkout
        </Button>
      </div>
    </SheetContent>
  </Sheet>

  <Dialog v-model:open="openLogin">
    <DialogContent
      class="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl border border-slate-100 shadow-2xl bg-white"
    >
      <Card class="w-full border-0 shadow-none bg-white">
        <CardHeader class="pt-6 pb-4">
          <CardTitle class="text-center text-xl font-extrabold text-slate-800">
            Login to E-Phone
          </CardTitle>
          <CardDescription class="text-center text-slate-400 text-xs">
            Select your account type and sign in
          </CardDescription>
        </CardHeader>
        <CardContent class="px-6 pb-4">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="grid w-full items-center gap-3">
              <div class="flex flex-col space-y-1.5">
                <Label for="email" class="text-slate-600 font-semibold text-xs"
                  >Email Address :</Label
                >
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  class="h-10 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
              <div class="flex flex-col space-y-1.5">
                <div class="flex justify-between items-center">
                  <Label for="password" class="text-slate-600 font-semibold text-xs"
                    >Password :</Label
                  >
                  <a href="#" class="text-[11px] text-slate-400 hover:text-blue-600 transition">
                    Forgot Password?
                  </a>
                </div>
                <Input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  class="h-10 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <!-- Error Message Alert -->
            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-xl flex items-center gap-2 animate-[slideUp_0.3s_ease-out]"
            >
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ errorMessage }}</span>
            </div>

            <div class="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                :class="[
                  'w-full h-10 font-bold transition duration-300 text-white flex items-center justify-center gap-2 rounded-xl cursor-pointer',
                  activeTab === 'CUSTOMER'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-purple-600 hover:bg-purple-700',
                ]"
                :disabled="authStore.loading"
              >
                <i v-if="authStore.loading" class="pi pi-spinner animate-spin text-sm"></i>
                <span>{{ authStore.loading ? 'Signing in...' : 'Sign In' }}</span>
              </Button>
              <Button @click="handleGoogleLogin" type="button" variant="outline" class="w-full h-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
                Login with Google
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter
          class="flex flex-col gap-2 pt-2 pb-6 px-6 bg-slate-50/50 border-t border-slate-100"
        >
          <p class="text-xs text-slate-500 text-center">
            New to E-Phone?
            <span @click="switchAuth" class="text-blue-600 font-bold cursor-pointer hover:underline"
              >Create an account</span
            >
          </p>
        </CardFooter>
      </Card>
    </DialogContent>
  </Dialog>

  <!-- register -->
  <Dialog v-model:open="openRegister">
    <DialogContent
      class="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl border border-slate-100 shadow-2xl bg-white"
    >
      <Card class="w-full border-0 shadow-none bg-white">
        <CardHeader class="pt-6 pb-4">
          <CardTitle class="text-center text-xl font-extrabold text-slate-800">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent class="p-6">
          <!-- Title -->
          <div class="text-center mb-6">
            <p class="text-sm text-gray-500 mt-1">Use your Google account or Phone to continue</p>
          </div>

          <!-- Google Button -->
          <Button
            class="w-full h-12 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm flex items-center justify-center cursor-pointer"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              class="w-5 h-5 mr-3"
            />
            Continue with Google
          </Button>

          <!-- Divider -->
          <div class="flex items-center my-5">
            <div class="flex-1 h-px bg-gray-200"></div>
            <span class="px-3 text-sm text-gray-400">or</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>

          <!-- Phone Button -->
          <Button
            variant="outline"
            class="w-full h-12 rounded-xl border-gray-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <i class="pi pi-phone"></i> Connect with Phone Number
          </Button>

          <!-- Footer -->
          <p class="text-center text-xs text-gray-400 mt-6">
            Secure authentication powered by Google
          </p>
        </CardContent>
        <CardFooter
          class="flex flex-col gap-2 pt-2 pb-6 px-6 bg-slate-50/50 border-t border-slate-100"
        >
          <p class="text-xs text-slate-500 text-center">
            Already have an account?
            <span @click="switchAuth" class="text-blue-600 font-bold cursor-pointer hover:underline"
              >Login</span
            >
          </p>
        </CardFooter>
      </Card>
    </DialogContent>
  </Dialog>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
import { Sheet, SheetContent, SheetClose } from '@/components/ui/sheet'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const authStore = useAuthStore()
const router = useRouter()
import { useCartStore } from '@/stores/cart'
const cartStore = useCartStore()

const removeItem = (itemId) => {
  cartStore.removeItem(itemId)
}

const formatPrice = (price) => {
  if (price == null) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

const handleCartClick = () => {
  if (!authStore.user) {
    openLogin.value = true
  } else {
    showCartSheet.value = true
  }
}

const proceedToCheckout = () => {
  showCartSheet.value = false
  router.push('/checkout')
}

onMounted(() => {
  if (authStore.user) {
    cartStore.fetchCart()
  }
})

const openLogin = computed({
  get: () => authStore.showLoginModal,
  set: (val) => (authStore.showLoginModal = val),
})
const openRegister = ref(false)
const isMenuOpen = ref(false)
const showCartSheet = ref(false)

// Form states
const activeTab = ref('CUSTOMER')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const showDropdown = ref(false)

const switchAuth = () => {
  openLogin.value = !openLogin.value
  openRegister.value = !openRegister.value
  errorMessage.value = ''
}
const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  const result = await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (result.success) {
    openLogin.value = false

    email.value = ''
    password.value = ''

    cartStore.fetchCart()

    // Redirect by role
    if (authStore.user?.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } else {
    errorMessage.value = result.message || 'Login failed. Please check your credentials.'
  }
}

const handleLogout = () => {
  authStore.logout()
  cartStore.clear()
  showDropdown.value = false
  router.push('/')
}

// Initiate Google OAuth login by redirecting to backend endpoint
const handleGoogleLogin = () => {
  // Ensure using http protocol for backend API
  let apiUrl = import.meta.env.VITE_API_URL.replace(/^https:/, 'http:')
  const oauthUrl = `${apiUrl}/auth/google`
  // Redirect to Google OAuth endpoint
  window.location.href = oauthUrl
}

const closeDropdown = (e) => {
  if (!e.target.closest('.user-menu-container')) {
    showDropdown.value = false
  }
}

const shopSection = ref(null)
const showShopAnimation = ref(false)
let observer = null

onMounted(() => {
  document.addEventListener('click', closeDropdown)

  observer = new IntersectionObserver(
    ([entry]) => {
      showShopAnimation.value = entry.isIntersecting
    },
    {
      threshold: 0.2,
    },
  )

  if (shopSection.value) {
    observer.observe(shopSection.value)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdown)
  if (observer && shopSection.value) {
    observer.unobserve(shopSection.value)
  }
})
</script>
<style scoped></style>
