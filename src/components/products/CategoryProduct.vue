<template>
  <aside class="md:col-span-2 w-50 lg:col-span-2 mr-20 sticky">
    <div class="w-full rounded-2xl border border-neutral-100 p-3 shadow-sm space-y-1">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectCategory(category)"
        :class="[
          'w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group outline-none',
          selectedCategory === category
            ? 'bg-purple-50 text-[#d100d1]'
            : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900',
        ]"
      >
        <span class="tracking-wide">{{ category }}</span>

        <span
          :class="[
            'text-xs transition-all duration-300 transform',
            selectedCategory === category
              ? 'text-[#d100d1] translate-x-0 opacity-100'
              : 'text-neutral-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1',
          ]"
        >
          ➔
        </span>
      </button>
    </div>
  </aside>
</template>
<script setup>
import { onMounted, ref, defineEmits } from 'vue'

const emit = defineEmits(['category-selected'])

// Active category state tracker
const selectedCategory = ref('All')
const selectCategory = (category) => {
  selectedCategory.value = category
  emit('category-selected', category)
}

// Sidebar Navigation categories
const categories = ref(['All', 'Phone', 'Tablets', 'Laptops'])
</script>
