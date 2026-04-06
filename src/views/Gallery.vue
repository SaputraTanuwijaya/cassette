<template>
  <div class="max-w-7xl mx-auto px-12 py-16 space-y-12 min-h-screen">
    <header class="flex justify-between items-center">
      <h1 class="text-4xl tracking-widest uppercase">Album Art Wall</h1>
      <button 
        @click="triggerUpload"
        class="btn-primary flex items-center gap-2"
      >
        <span class="text-xl">+</span> UPLOAD ART
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
      <p class="text-muted tracking-wide">No images in your gallery yet.</p>
      <p class="text-primary/50 text-sm">Click here to upload your first art piece.</p>
    </div>

    <!-- Gallery Grid -->
    <div 
      v-else 
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
    >
      <div 
        v-for="(image, index) in gallery" 
        :key="index"
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
          
          <div class="flex flex-wrap gap-3">
            <button 
              @click="triggerUpdate(index)"
              class="flex-1 btn-ghost !px-2 !py-2 !text-[10px] tracking-widest"
            >
              UPDATE
            </button>
            <button 
              @click="assignThumbnail(image)"
              class="flex-1 btn-primary !px-2 !py-2 !text-[10px] tracking-widest"
            >
              ASSIGN
            </button>
            <button 
              @click="deleteImage(index)"
              class="w-full btn-ghost !border-red-500/50 !text-red-500/50 hover:!bg-red-500/10 !px-2 !py-1 !text-[10px] tracking-widest"
            >
              DELETE
            </button>
          </div>
        </div>
        
        <!-- Feedback Overlay -->
        <transition name="fade">
          <div 
            v-if="assignedIndex === index" 
            class="absolute inset-0 bg-primary/90 flex items-center justify-center text-bg font-bold tracking-[0.2em] text-sm z-20 pointer-events-none"
          >
            ASSIGNED TO PLAYER
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStorage } from '../composables/useStorage'
import { compressImage } from '../utils/image'

const { usePersistedRef, setItem } = useStorage()
const gallery = usePersistedRef('gallery_images', [])
const fileInput = ref(null)
const updateIndex = ref(-1)
const assignedIndex = ref(-1)

const triggerUpload = () => {
  updateIndex.value = -1
  fileInput.value.click()
}

const triggerUpdate = (index) => {
  updateIndex.value = index
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const originalBase64 = e.target.result
    const compressedBase64 = await compressImage(originalBase64)
    
    if (updateIndex.value > -1) {
      // Update existing
      gallery.value[updateIndex.value] = {
        name: file.name,
        base64: compressedBase64
      }
    } else {
      // Add new
      gallery.value.push({
        name: file.name,
        base64: compressedBase64
      })
    }
    
    // Clear input
    event.target.value = ''
  }
  reader.readAsDataURL(file)
}

const assignThumbnail = (image) => {
  // Store the base64 as the currentThumbnail for the player
  setItem('currentThumbnail', image.base64)
  
  // Flash feedback
  const idx = gallery.value.indexOf(image)
  assignedIndex.value = idx
  setTimeout(() => {
    assignedIndex.value = -1
  }, 1500)
}

const deleteImage = (index) => {
  if (confirm('Delete this image from gallery?')) {
    gallery.value.splice(index, 1)
  }
}
</script>

<style scoped>
/* Any additional specific transitions */
</style>
