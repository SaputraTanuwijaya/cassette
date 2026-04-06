<template>
  <nav class="bg-surface py-6 px-12 flex justify-between items-center sticky top-0 z-50 transition-all duration-300">
    <div class="text-3xl font-display text-primary tracking-widest uppercase font-medium">
      CASSETTE
    </div>
    <div class="flex gap-8 font-sans">
      <router-link
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="text-muted hover:text-primary transition-all duration-300 text-sm tracking-widest font-medium"
        active-class="text-primary font-bold"
      >
        {{ link.name }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
const links = [
  { name: 'HOME', path: '/' },
  { name: 'GALLERY', path: '/gallery' },
  { name: 'MEDIA', path: '/media' },
]
</script>
