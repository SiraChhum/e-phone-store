<script setup>
import { ref } from 'vue'

// Form reactive state
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const handleSubmit = () => {
  isSubmitting.value = true

  // Simulate API submission
  setTimeout(() => {
    isSubmitting.value = false
    submitSuccess.value = true

    // Reset form fields
    form.value = { name: '', email: '', subject: '', message: '' }

    // Fade out success notification after a few seconds
    setTimeout(() => {
      submitSuccess.value = false
    }, 4000)
  }, 1000)
}
</script>

<template>
  <div class="bg-white min-h-screen font-sans antialiased">
    <section
      class="relative overflow-hidden bg-gradient-to-br from-[#111] to-[#222] px-2 py-15 text-center text-white"
    >
      <!-- Glow Effect -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_80%,rgba(209,0,209,0.12),transparent_50%)] pointer-events-none"
      ></div>

      <div class="relative z-10 mx-auto max-w-3xl">
        <h1 class="mb-5 text-4xl font-bold tracking-tight md:text-5xl">Get in Touch</h1>

        <p class="text-lg font-light text-gray-300 md:text-xl">
          Have a question about our timepieces or need assistance with an order? Our dedicated
          E-Watch support team is here to help.
        </p>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <div class="lg:col-span-5">
          <h2
            class="animate-[slideLeft_1.2s_ease-out_forwards] text-3xl font-bold text-neutral-900 mb-6 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-[#d100d1] after:mt-3 after:rounded"
          >
            Drop Us a Line
          </h2>
          <div class="animate-[slideUp_1.2s_ease-out_forwards]">
            <p class="text-neutral-600 mb-6 text-lg leading-relaxed">
              Whether you're looking for order tracking, customized corporate orders, or expert
              advice on selecting your next automatic watch, we are ready to assist.
            </p>
            <p class="text-neutral-500 text-sm">
              * Expect a personalized response from our horology specialists within 24 business
              hours.
            </p>
          </div>
        </div>

        <div class="lg:col-span-7">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-neutral-700 mb-1"
                  >Full Name</label
                >
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="John Doe"
                  class="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 outline-none transition-all focus:border-[#d100d1] focus:bg-white focus:ring-4 focus:ring-purple-100"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-neutral-700 mb-1"
                  >Email Address</label
                >
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  class="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 outline-none transition-all focus:border-[#d100d1] focus:bg-white focus:ring-4 focus:ring-purple-100"
                />
              </div>
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-neutral-700 mb-1"
                >Subject</label
              >
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                required
                placeholder="Order inquiry, partnership, warranty, etc."
                class="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 outline-none transition-all focus:border-[#d100d1] focus:bg-white focus:ring-4 focus:ring-purple-100"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-neutral-700 mb-1"
                >Your Message</label
              >
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                required
                placeholder="Write your message here..."
                class="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 outline-none transition-all focus:border-[#d100d1] focus:bg-white focus:ring-4 focus:ring-purple-100 resize-none"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full sm:w-auto px-8 py-3.5 bg-[#d100d1] hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all outline-none flex items-center justify-center"
              >
                {{ isSubmitting ? 'Sending Ticket...' : 'Send Message' }}
              </button>
            </div>

            <transition name="fade">
              <div
                v-if="submitSuccess"
                class="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm"
              >
                Success! Your message has been sent. We'll be in touch soon.
              </div>
            </transition>
          </form>
        </div>
      </div>
    </section>

    <section class="bg-neutral-50 border-t border-neutral-100 py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4">
        <h3 class="text-center text-2xl md:text-3xl font-bold text-neutral-900 mb-12">
          Connect With Us
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-neutral-100 transition-transform hover:-translate-y-1 duration-300"
          >
            <h4 class="text-lg font-semibold text-neutral-900 mb-2">Our Headquarters</h4>
            <p class="text-neutral-600 text-sm leading-relaxed">
              123 Horology Lane, Watch District, NY 10001
            </p>
          </div>

          <div
            class="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-neutral-100 transition-transform hover:-translate-y-1 duration-300"
          >
            <h4 class="text-lg font-semibold text-neutral-900 mb-2">Call Us Directly</h4>
            <p class="text-neutral-600 text-sm mb-1">+1 (555) 019-2834</p>
            <p class="text-neutral-400 text-xs">Mon - Fri, 9AM to 6PM EST</p>
          </div>

          <div
            class="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-neutral-100 transition-transform hover:-translate-y-1 duration-300"
          >
            <h4 class="text-lg font-semibold text-neutral-900 mb-2">Digital Channels</h4>
            <p class="text-[#d100d1] text-sm font-medium mb-3">support@e-watch.com</p>
            <div
              class="flex space-x-3 text-xs text-neutral-400 font-medium uppercase tracking-wider"
            >
              <a href="#" class="hover:text-[#d100d1] transition-colors">Instagram</a>
              <span>•</span>
              <a href="#" class="hover:text-[#d100d1] transition-colors">Twitter</a>
              <span>•</span>
              <a href="#" class="hover:text-[#d100d1] transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Vue simple transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideLeft {
  0% {
    transform: translateY(120px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slideUp {
  0% {
    transform: translateX(120px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
