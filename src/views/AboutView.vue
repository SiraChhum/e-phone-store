<script setup>
import { ref } from 'vue'

// Reactive data for core values
const coreValues = ref([
  {
    title: 'Curated Quality',
    description:
      'We source exclusively from authorized manufacturers and legendary watchmakers to guarantee 100% authenticity.',
  },
  {
    title: 'Expert Support',
    description:
      'Our dedicated horology experts are always on hand to help you find the perfect match for your lifestyle.',
  },
  {
    title: 'Seamless Experience',
    description:
      'Enjoy premium packaging, secure insured global shipping, and hassle-free returns on every order.',
  },
])
</script>

<template>
  <div id="about" class="font-[Inter] text-[#1a1a1a] leading-relaxed">
    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-[#111] to-[#222] px-2 py-15 text-center text-white"
    >
      <!-- Glow Effect -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_80%,rgba(209,0,209,0.12),transparent_50%)] pointer-events-none"
      ></div>

      <div class="relative z-10 mx-auto max-w-3xl">
        <h1 class="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
          Crafting Time, Defining Style
        </h1>

        <p class="text-lg font-light text-gray-300 md:text-xl">
          At E-Watch, we don't just sell timepieces. We curate extraordinary moments and precision
          engineering for the modern wrist.
        </p>
      </div>
    </section>

    <!-- Story Section -->
    <section class="mx-auto max-w-7xl px-5 py-16">
      <div class="grid items-center gap-14 md:grid-cols-2">
        <!-- Text -->
        <div>
          <h2 class="mb-6 text-4xl font-bold animate-[slideLeft_1.2s_ease-out_forwards]">
            Our Journey

            <span class="mt-3 block h-1 w-14 rounded-full bg-fuchsia-600"></span>
          </h2>

          <p class="mb-5 text-lg text-gray-500">
            Founded with a passion for horology and cutting-edge design, E-Watch has grown from a
            boutique concept into a premier destination for watch enthusiasts. We bridge the gap
            between traditional craftsmanship and modern digital retail.
          </p>

          <p class="text-lg text-gray-500">
            Every piece in our collection is handpicked for its mechanical integrity, design
            excellence, and enduring legacy. Whether you are looking for a rugged smartwatch, a
            classic automatic, or a statement luxury piece, we ensure authenticity and unparalleled
            quality.
          </p>
        </div>

        <!-- Image -->
        <div class="animate-[slideUp_1.2s_ease-out_forwards]">
          <img
            src="/cbd58b8b5231caf9b2f56823857de4f1.jpg"
            alt="Premium Watch Craftsmanship"
            class="h-full w-full rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="bg-gray-50 py-16">
      <div class="mx-auto max-w-7xl px-5">
        <h2 class="mb-12 text-center text-4xl font-bold">Why E-Watch?</h2>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(value, index) in coreValues"
            :key="index"
            class="rounded-2xl bg-white p-10 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(209,0,209,0.08)]"
          >
            <div class="mb-5 text-4xl">
              {{ value.icon }}
            </div>

            <h3 class="mb-3 text-2xl font-semibold">
              {{ value.title }}
            </h3>

            <p class="text-gray-500">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style>
@keyframes slideLeft {
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
</style>
