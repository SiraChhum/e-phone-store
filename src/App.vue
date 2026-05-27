<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HomeView from './views/HomeView.vue'
import headerVue from '@/layouts/header.vue'
</script>

<template>
  <div class="bg-gray-50 text-gray-800 scroll-smooth">
    <headerVue />
    <main>
      <router-view />
    </main>
  </div>
</template>
