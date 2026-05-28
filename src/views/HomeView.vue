<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ShoppingCart } from 'lucide-vue-next'
import headerVue from '@/layouts/header.vue'
import { useProductStore } from '@/stores/product'
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

const isMenuOpen = ref(false)
const activeLink = ref('home')
const shopSection = ref(null)
const shopSection2 = ref(null)
const slide1Section = ref(null)
const slide2Section = ref(null)
const shadowSlide = ref(null)
const showShopAnimation = ref(false)
const showShopAnimation2 = ref(false)
const shadowSlideProduct = ref(false)

const openProduct = ref(false)
const selectProduct = ref(null)

const productStore = useProductStore()

const handleOpenDetail = (product) => {
  selectProduct.value = product
  openProduct.value = true
}

onMounted(async () => {
  await productStore.fetchProducts()
})

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === shopSection.value) {
          showShopAnimation.value = entry.isIntersecting
        } else if (entry.target === shopSection2.value) {
          showShopAnimation2.value = entry.isIntersecting
        } else if (entry.target === shadowSlide.value) {
          shadowSlideProduct.value = entry.isIntersecting
        }
      })
    },
    {
      threshold: 0.2,
    },
  )

  if (shopSection.value) {
    observer.observe(shopSection.value)
  }
  if (shopSection2.value) {
    observer.observe(shopSection2.value)
  }
  if (shadowSlide.value) {
    observer.observe(shadowSlide.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <!-- HERO -->
  <section
    id="home"
    class="min-h-screen flex items-center text-white bg-[url('/cover.jpg')] bg-cover bg-center bg-no-repeat relative"
  >
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p class="uppercase tracking-[6px] mb-4 text-pink-100">Welcome - E-Phone</p>

        <h1
          class="text-5xl md:text-7xl font-black leading-tight mb-6 animate-[slideFromLeft_1.2s_ease-out_forwards]"
        >
          Upgrade to Next-Gen
          <span class="text-yellow-300">Innovation.</span>
        </h1>

        <p
          class="text-base md:text-lg text-gray-100 leading-7 md:leading-8 mb-8 text-center md:text-left"
        >
          Discover the latest smartphones packed with cutting-edge technology, stunning displays,
          and pro-grade cameras. Find your perfect device today.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <a
            href="/shop"
            class="px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:scale-105 transition"
          >
            Shop Now
          </a>

          <a
            href="/about"
            class="px-8 py-4 border border-white rounded-full hover:bg-white hover:text-purple-600 transition"
          >
            View Deals
          </a>
        </div>
      </div>

      <div class="relative hidden md:block">
        <div class="animate-[slideFromRight_1.2s_ease-out_forwards]">
          <img
            src="/banner.png"
            class="rounded-2xl w-full h-[260px] sm:h-[340px] md:h-[420px] object-cover"
          />
        </div>
      </div>
    </div>
  </section>
  <section ref="shopSection" class="py-24">
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
      <div>
        <img
          src="/slide.png"
          :class="
            showShopAnimation
              ? 'animate-[slideFromLeft_1.2s_ease-out_forwards] opacity-100'
              : 'opacity-0 -translate-x-20'
          "
          class="rounded-3xl transition-all duration-700"
        />
      </div>

      <div>
        <h2 class="text-5xl font-black mb-6">Explore Our Store</h2>

        <p class="text-gray-300 leading-8 mb-10">
          Explore our store and find the perfect product for your needs. We have a wide range of
          products to choose from, including electronics, clothing, accessories, and more. All of
          our products are high quality and come with a satisfaction guarantee.
        </p>

        <!-- Animated Skill Bars -->
        <div class="space-y-6">
          <div>
            <img
              src="/slide2.png"
              class="rounded-3xl"
              :class="
                showShopAnimation
                  ? 'animate-[slideUp_1.2s_ease-out_forwards] opacity-100'
                  : 'opacity-0 -translate-y-20'
              "
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SHOP -->
  <section class="py-24">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-black mb-4">Top Products</h2>
        <p class="text-gray-500 text-lg">Best products ever</p>
      </div>

      <!-- Product Cards -->
      <div ref="shadowSlide" class="grid sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
        <div
          v-for="product in productStore.products.slice(0, 8)"
          :key="product.id"
          @click="handleOpenDetail(product)"
          :class="
            shadowSlideProduct
              ? 'animate-[shadowUp_1.2s_ease-out_forwards] opacity-100'
              : 'opacity-0 translate-y-20'
          "
          class="bg-white rounded-3xl overflow-hidden hover:-translate-y-3 transition duration-300 group"
        >
          <div class="overflow-hidden">
            <img
              :src="product.image"
              class="h-64 w-full object-cover group-hover:scale-110 transition duration-500"
            />
          </div>

          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              <span class="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
                {{ product.category.category_name }}
              </span>
            </div>

            <h3 class="text-xl font-bold mb-2">
              {{ product.name }}
            </h3>

            <p class="text-gray-600 text-sm line-clamp-2">
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section ref="shopSection2" class="min-h-screen bg-slate-900 flex items-center overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
      <!-- LEFT IMAGE -->
      <div class="space-y-8">
        <!-- CARD -->
        <div
          :class="
            showShopAnimation2
              ? 'animate-[slideUp_1.2s_ease-out_forwards] opacity-100'
              : 'opacity-0 -translate-y-20'
          "
          class="rounded-3xl bg-slate-900 text-white p-8 shadow-2xl hover:-translate-y-2 transition duration-300"
        >
          <div class="text-sm font-bold tracking-[4px] text-indigo-500 uppercase mb-3">
            Company Retreat
          </div>

          <h2 class="text-3xl font-black text-white mb-4">
            Incredible accommodation for your team
          </h2>

          <p class="text-gray-400 leading-8">
            Looking to take your team away on a retreat to enjoy awesome food and sunshine? We have
            beautiful places prepared for your business team.
          </p>
        </div>

        <!-- CARD -->
        <div
          :class="
            showShopAnimation2
              ? 'animate-[slideUp_1.6s_ease-out_forwards] opacity-100'
              : 'opacity-0 -translate-y-20'
          "
          class="rounded-3xl bg-slate-900 p-8 shadow-2xl hover:-translate-y-2 transition duration-300"
        >
          <div class="text-sm font-bold tracking-[4px] text-pink-500 uppercase mb-3">
            Modern Workspace
          </div>

          <h2 class="text-3xl font-black text-white mb-4">Creative environment for productivity</h2>

          <p class="text-gray-400 leading-8">
            Professional workspace experience with modern design, collaboration, and premium comfort
            for your entire team.
          </p>
        </div>
      </div>
      <!-- RIGHT CONTENT -->
      <div class="space-y-8">
        <!-- CARD -->
        <div
          :class="
            showShopAnimation2
              ? 'animate-[slideUp_1.2s_ease-out_forwards] opacity-100'
              : 'opacity-0 -translate-y-20'
          "
          class="rounded-3xl bg-slate-900 text-white p-8 shadow-2xl hover:-translate-y-2 transition duration-300"
        >
          <div class="text-sm font-bold tracking-[4px] text-indigo-500 uppercase mb-3">
            Company Retreat
          </div>

          <h2 class="text-3xl font-black text-white mb-4">
            Incredible accommodation for your team
          </h2>

          <p class="text-gray-400 leading-8">
            Looking to take your team away on a retreat to enjoy awesome food and sunshine? We have
            beautiful places prepared for your business team.
          </p>
        </div>

        <!-- CARD -->
        <div
          :class="
            showShopAnimation2
              ? 'animate-[slideUp_1.6s_ease-out_forwards] opacity-100'
              : 'opacity-0 -translate-y-20'
          "
          class="rounded-3xl bg-slate-900 p-8 shadow-2xl hover:-translate-y-2 transition duration-300"
        >
          <div class="text-sm font-bold tracking-[4px] text-pink-500 uppercase mb-3">
            Modern Workspace
          </div>

          <h2 class="text-3xl font-black text-white mb-4">Creative environment for productivity</h2>

          <p class="text-gray-400 leading-8">
            Professional workspace experience with modern design, collaboration, and premium comfort
            for your entire team.
          </p>
        </div>
      </div>
    </div>
  </section>
  <section class="h-30"></section>
  <section id="home" class="min-h-screen items-center overflow-hidden">
    <div class="flex justify-center py-5">
      <p class="font-black text-4xl">Best for Business and team work</p>
    </div>
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 items-center p-10">
      <!-- COLUMN 2 -->
      <div class="rounded bg-white p-8 shadow-2xl hover:-translate-y-2 transition duration-300">
        <img src="/phone1.jpg" class="h-full" />

        <h1 class="text-3xl font-black"></h1>

        <p class="text-gray-600 leading-8">
          Looking to take your team away on a retreat to enjoy awesome food and sunshine? We have
          beautiful places prepared for your business team.
        </p>
      </div>

      <div class="rounded bg-white p-8 shadow-2xl hover:-translate-y-2 transition duration-300">
        <img src="/phone2.jpg" class="h-full" />

        <h1 class="text-3xl font-black"></h1>

        <p class="text-gray-600 leading-8">
          Looking to take your team away on a retreat to enjoy awesome food and sunshine? We have
          beautiful places prepared for your business team.
        </p>
      </div>

      <div class="rounded bg-white p-8 shadow-2xl hover:-translate-y-2 transition duration-300">
        <img src="/kas.jpg" class="h-full" />

        <h1 class="text-3xl font-black"></h1>

        <p class="text-gray-600 leading-8">
          Looking to take your team away on a retreat to enjoy awesome food and sunshine? We have
          beautiful places prepared for your business team.
        </p>
      </div>
    </div>
  </section>
  <!-- FOOTER -->
  <footer class="bg-black text-white py-12">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div class="flex flex-col items-start">
        <p class="text-lg font-bold mb-4">Contact Us</p>
        <div class="flex flex-col gap-3 text-left">
          <p class="text-base text-gray-300">
            Address:
            <span class="font-light block text-white mt-1"
              >#123 Monivong Blvd, Phnom Penh, Cambodia</span
            >
          </p>
          <p class="text-base text-gray-300">
            Phone: <span class="font-light block text-white mt-1">+855 083-247-7766</span>
          </p>
          <p class="text-base text-gray-300">
            Email: <span class="font-light block text-white mt-1">sirachhum5555@gmail.com</span>
          </p>
        </div>
      </div>

      <div class="flex flex-col items-start">
        <p class="text-lg font-bold mb-4">Resources</p>
        <div class="flex flex-col gap-3 text-left">
          <a href="#" class="text-base font-light text-gray-300 hover:text-white transition-colors"
            >Track Order</a
          >
          <a href="#" class="text-base font-light text-gray-300 hover:text-white transition-colors"
            >Shipping & Delivery</a
          >
          <a href="#" class="text-base font-light text-gray-300 hover:text-white transition-colors"
            >Returns & Exchanges</a
          >
          <a href="#" class="text-base font-light text-gray-300 hover:text-white transition-colors"
            >FAQs</a
          >
        </div>
      </div>

      <div class="flex flex-col items-start">
        <p class="text-lg font-bold mb-4">Company</p>
        <div class="flex flex-col gap-3 text-left">
          <a href="#" class="text-base font-light text-gray-300 hover:text-white transition-colors"
            >About E-Phone</a
          >
          <a href="#" class="text-base font-light text-gray-300 hover:text-white transition-colors"
            >Our Blog</a
          >
          <a href="#" class="text-base font-light text-gray-300 hover:text-white transition-colors"
            >Careers</a
          >
          <a href="#" class="text-base font-light text-gray-300 hover:text-white transition-colors"
            >Privacy Policy</a
          >
        </div>
      </div>

      <div class="flex flex-col items-start md:items-center">
        <p class="text-lg font-bold mb-4">Follow Us</p>
        <div
          class="flex flex-row gap-5 justify-start md:justify-center items-center text-xl text-gray-300"
        >
          <a href="#" class="hover:text-white transition-colors"><i class="pi pi-facebook"></i></a>
          <a href="#" class="hover:text-white transition-colors"><i class="pi pi-twitter"></i></a>
          <a href="#" class="hover:text-white transition-colors"><i class="pi pi-instagram"></i></a>
          <a href="#" class="hover:text-white transition-colors"><i class="pi pi-youtube"></i></a>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
      <p>&copy; 2026 E-Phone. All rights reserved. Built with Vue 3.</p>
    </div>
  </footer>

  <Dialog v-model:open="openProduct">
    <DialogContent
      v-if="selectProduct"
      class="sm:max-w-[900px] p-0 overflow-y-auto rounded-3xl max-h-[90vh]"
    >
      <div class="grid md:grid-cols-2">
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
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style>
html {
  scroll-behavior: smooth;
}
@keyframes slideFromLeft {
  0% {
    transform: translateX(-120px);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideFromRight {
  0% {
    transform: translateX(120px);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slideUp {
  0% {
    transform: translateY(120px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes shadowUp {
  0% {
    transform: translateY(120px);
    opacity: 0;
  }
  100% {
    transform: translate(0);
    opacity: 1;
  }
}
</style>
