<template>
  <nav class="bg-surface border-b border-border py-4 px-8 flex justify-between items-center sticky top-0 z-50">
    <div class="text-3xl font-display text-primary tracking-widest uppercase">
      CASSETTE
    </div>
    <div class="flex gap-6 font-mono">
      <router-link
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="text-muted hover:text-primary transition-colors duration-200 text-sm tracking-tighter"
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
