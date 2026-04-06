<template>
  <div class="max-w-7xl mx-auto px-12 py-16 space-y-12 min-h-screen">
    <header class="flex justify-between items-center">
      <h1 class="text-4xl tracking-widest uppercase">Master Art Gallery</h1>
      <button 
        @click="triggerUpload"
        class="btn-primary flex items-center gap-2"
      >
        <span class="text-xl">+</span> UPLOAD NEW ART
      </button>
      <input 
        ref="fileInput" 
        type="file" 
        class="hidden" 
        accept="image/*" 
        @change="handleFileUpload"
      />
    </header>

    <!-- Empty State -->
    <div 
      v-if="gallery.length === 0" 
      class="border-2 border-dashed border-border rounded-3xl h-64 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-surface/10 transition-colors"
      @click="triggerUpload"
    >
      <div class="text-primary text-5xl">
        <span class="opacity-30">🖼️</span>
      </div>
      <p class="text-muted tracking-wide">Gallery is empty.</p>
      <p class="text-primary/50 text-sm">Upload master assets here to use them in your tracks.</p>
    </div>

    <!-- Gallery Grid -->
    <div 
      v-else 
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
    >
      <div 
        v-for="(image, index) in gallery" 
        :key="image.id"
        class="card-surface group relative overflow-hidden"
      >
        <div class="aspect-square w-full mb-6 overflow-hidden rounded-2xl bg-bg shadow-inner border border-border/50">
          <img 
            :src="image.base64" 
            :alt="image.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <div class="space-y-4">
          <p class="text-sm font-mono text-muted truncate uppercase tracking-tighter" :title="image.name">
            {{ image.name }}
          </p>
          
          <div class="flex gap-3">
            <button 
              @click="triggerChange(index)"
              class="flex-1 btn-ghost !px-2 !py-2 !text-[10px] tracking-widest"
            >
              CHANGE IMAGE
            </button>
            <button 
              @click="deleteImage(index)"
              class="flex-1 btn-ghost !border-red-500/50 !text-red-500/50 hover:!bg-red-500/10 !px-2 !py-2 !text-[10px] tracking-widest"
            >
              DELETE
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStorage } from '../composables/useStorage'
import { compressImage } from '../utils/image'

const { usePersistedRef } = useStorage()
const gallery = usePersistedRef('gallery_images', [])
const fileInput = ref(null)
const changeIndex = ref(-1)

// Migration: Add IDs to existing images if they don't have them
onMounted(() => {
  let updated = false
  gallery.value.forEach(img => {
    if (!img.id) {
      img.id = Date.now() + Math.random()
      updated = true
    }
  })
})

const triggerUpload = () => {
  changeIndex.value = -1
  fileInput.value.click()
}

const triggerChange = (index) => {
  changeIndex.value = index
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const originalBase64 = e.target.result
    const compressedBase64 = await compressImage(originalBase64)
    
    if (changeIndex.value > -1) {
      // Change existing: KEEP THE ID so tracks still point to it
      gallery.value[changeIndex.value].base64 = compressedBase64
      gallery.value[changeIndex.value].name = file.name
    } else {
      // Add new with unique ID
      gallery.value.push({
        id: Date.now() + Math.random(),
        name: file.name,
        base64: compressedBase64
      })
    }
    
    event.target.value = ''
  }
  reader.readAsDataURL(file)
}

const deleteImage = (index) => {
  if (confirm('Delete this master asset? Tracks using this image will lose their thumbnail.')) {
    gallery.value.splice(index, 1)
  }
}
</script>
