<template>
  <div v-if="track" class="card-surface p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
    <div class="flex justify-between items-start">
      <h3 class="text-sm tracking-[0.4em] font-medium text-muted uppercase">Track Station</h3>
      <button @click="$emit('close')" class="text-muted hover:text-primary transition-colors text-xs">
        CLOSE [×]
      </button>
    </div>

    <div class="flex flex-col md:flex-row gap-12">
      <!-- Large Thumbnail Section -->
      <div class="space-y-4">
        <div class="w-64 h-64 rounded-3xl overflow-hidden bg-bg border-2 border-border shadow-[0_0_30px_var(--color-glow)] relative group">
          <img 
            v-if="track.thumbnail" 
            :src="track.thumbnail" 
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-primary/10 text-6xl">
            📼
          </div>
          
          <!-- Direct Gallery Assignment Overlay -->
          <div class="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              @click="showGallery = true"
              class="btn-primary !py-2 !px-4 !text-xs"
            >
              CHANGE THUMBNAIL
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-[10px] text-muted text-center tracking-widest uppercase">
            Studio Artwork Slot
          </p>
          <div v-if="!track.url" class="p-2 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
             <p class="text-[10px] text-red-500 font-bold uppercase">Audio Disconnected</p>
             <button @click="reconnect" class="text-[9px] text-primary underline mt-1">RECONNECT FILE</button>
          </div>
        </div>
      </div>

      <!-- Metadata Section -->
      <div class="flex-1 space-y-8">
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] tracking-widest text-primary/50 font-bold uppercase">Track Title</label>
            <input 
              v-model="track.title" 
              class="bg-transparent text-4xl font-display text-primary border-none focus:ring-0 p-0 w-full"
              @input="save"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] tracking-widest text-primary/50 font-bold uppercase">Artist / Author</label>
            <input 
              v-model="track.artist" 
              class="bg-transparent text-xl text-text border-none focus:ring-0 p-0 w-full tracking-wider uppercase"
              @input="save"
            />
          </div>
        </div>

        <!-- Effect Management -->
        <div class="pt-8 border-t border-border space-y-4">
          <div class="flex justify-between items-center">
            <label class="text-[10px] tracking-widest text-primary/50 font-bold uppercase">Track Effects (Auto-Saving)</label>
            <button @click="resetEffects" class="text-[10px] text-muted hover:text-primary underline uppercase font-bold">Reset to Default</button>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-bg/50 rounded-2xl border border-border/50 font-mono text-xs flex justify-between">
              <span class="text-muted uppercase">SPEED</span>
              <span class="text-primary">{{ track.effects.playbackRate.toFixed(2) }}x</span>
            </div>
            <div class="p-4 bg-bg/50 rounded-2xl border border-border/50 font-mono text-xs flex justify-between">
              <span class="text-muted uppercase">BASS</span>
              <span class="text-primary">{{ track.effects.bassGain }}dB</span>
            </div>
          </div>
          <button 
            @click="syncCurrentEffects"
            class="w-full btn-ghost !py-2 !text-[10px] tracking-[0.2em] font-bold"
          >
            APPLY CURRENT STUDIO SLIDERS TO THIS TRACK
          </button>
        </div>
      </div>
    </div>

    <!-- Gallery Selection Modal -->
    <transition name="fade">
      <div v-if="showGallery" class="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-bg/95 backdrop-blur-sm">
        <div class="card-surface w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col p-8 space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-xl tracking-widest font-display text-primary uppercase">Select Album Art</h3>
            <button @click="showGallery = false" class="text-muted hover:text-primary">CLOSE</button>
          </div>
          
          <div v-if="gallery.length === 0" class="flex-1 flex flex-col items-center justify-center text-muted">
            <p>Your Gallery is empty.</p>
            <router-link to="/gallery" class="text-primary underline mt-2">Go to Gallery to upload art</router-link>
          </div>
          
          <div v-else class="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2 custom-scrollbar">
            <div 
              v-for="(img, idx) in gallery" 
              :key="idx"
              @click="pickImage(img.base64)"
              class="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all relative group"
            >
              <img :src="img.base64" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Hidden file input for reconnect -->
    <input type="file" ref="reconnectInput" class="hidden" accept="audio/*" @change="handleReconnect" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStorage } from '../composables/useStorage'

const props = defineProps(['track', 'engine'])
const emit = defineEmits(['close', 'reconnect'])
const { getItem } = useStorage()

const showGallery = ref(false)
const gallery = ref(getItem('gallery_images', []))
const reconnectInput = ref(null)

const pickImage = (base64) => {
  props.track.thumbnail = base64
  showGallery.value = false
  save()
}

const syncCurrentEffects = () => {
  props.track.effects = {
    playbackRate: props.engine.playbackRate.value,
    reverbWet: props.engine.reverbWet.value,
    bassGain: props.engine.bassGain.value,
    pitch: props.engine.pitch.value
  }
  save()
}

const resetEffects = () => {
  props.engine.playbackRate.value = 1.0
  props.engine.reverbWet.value = 0.0
  props.engine.bassGain.value = 0.0
  props.engine.pitch.value = 0
  syncCurrentEffects()
}

const reconnect = () => reconnectInput.value.click()

const handleReconnect = (e) => {
  const file = e.target.files[0]
  if (file) {
    const url = URL.createObjectURL(file)
    emit('reconnect', { trackId: props.track.id, url })
  }
}

const save = () => {
  // Persistence is handled by the parent's usePersistedRef watcher
}

// Auto-sync engine when sliders move
watch([
  () => props.engine.playbackRate.value,
  () => props.engine.reverbWet.value,
  () => props.engine.bassGain.value,
  () => props.engine.pitch.value
], () => {
  // Note: We don't auto-save to track object while just listening, 
  // only when syncCurrentEffects is clicked, but we could auto-save here too
})
</script>
