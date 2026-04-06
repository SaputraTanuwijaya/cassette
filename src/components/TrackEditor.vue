<template>
  <div v-if="track" class="card-surface p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative text-left">
    <div class="flex justify-between items-start">
      <h3 class="text-sm tracking-[0.4em] font-medium text-muted uppercase font-sans">Track Station</h3>
    </div>

    <div class="flex flex-col md:flex-row gap-12">
      <div class="space-y-4">
        <div class="w-64 h-64 rounded-3xl overflow-hidden bg-bg border-2 border-border shadow-[0_0_30px_var(--color-glow)] relative group">
          <img 
            v-if="resolvedThumbnail" 
            :src="resolvedThumbnail" 
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-primary/10 text-6xl">📼</div>
          
          <div class="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button @click="showGallery = true" class="btn-primary !py-2 !px-4 !text-xs">CHANGE THUMBNAIL</button>
          </div>
        </div>
        
        <div class="flex flex-col gap-2 text-center">
          <p class="text-[10px] text-muted tracking-widest uppercase font-mono">
            {{ track.thumbnailId ? 'Asset Linked from Gallery' : 'No Asset Linked' }}
          </p>
          <div v-if="!track.url" class="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl">
             <p class="text-[10px] text-red-500 font-bold uppercase font-sans">Asset Disconnected</p>
             <button @click="reconnect" class="text-[10px] text-primary underline mt-1 font-bold">RECONNECT FILE</button>
          </div>
        </div>
      </div>

      <div class="flex-1 space-y-8">
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] tracking-widest text-primary/50 font-bold uppercase font-mono">Asset Title</label>
            <input v-model="track.title" class="bg-transparent text-4xl font-display text-primary border-none focus:ring-0 p-0 w-full" />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] tracking-widest text-primary/50 font-bold uppercase font-mono">Artist / Studio</label>
            <input v-model="track.artist" class="bg-transparent text-xl text-text border-none focus:ring-0 p-0 w-full tracking-wider uppercase font-sans" />
          </div>
        </div>

        <div class="pt-8 border-t border-border space-y-6">
          <div class="flex justify-between items-center">
            <label class="text-[10px] tracking-widest text-primary/50 font-bold uppercase font-mono">Studio Configuration</label>
            <button @click="resetEffects" class="text-[10px] text-muted hover:text-primary underline uppercase font-bold font-sans">Reset Defaults</button>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div class="p-4 bg-bg/50 rounded-2xl border border-border/50 text-center">
              <div class="text-[9px] text-muted uppercase mb-1">Speed</div>
              <div class="text-primary text-sm">{{ (track.effects.playbackRate || 1.0).toFixed(2) }}x</div>
            </div>
            <div class="p-4 bg-bg/50 rounded-2xl border border-border/50 text-center">
              <div class="text-[9px] text-muted uppercase mb-1">Bass</div>
              <div class="text-primary text-sm">{{ track.effects.bassGain || 0 }}dB</div>
            </div>
            <div class="p-4 bg-bg/50 rounded-2xl border border-border/50 text-center">
              <div class="text-[9px] text-muted uppercase mb-1">Reverb</div>
              <div class="text-primary text-sm">{{ Math.round((track.effects.reverbWet || 0) * 100) }}%</div>
            </div>
            <div class="p-4 bg-bg/50 rounded-2xl border border-border/50 text-center">
              <div class="text-[9px] text-muted uppercase mb-1">Pitch</div>
              <div class="text-primary text-sm">{{ track.effects.pitch || 0 }}st</div>
            </div>
          </div>

          <button @click="syncCurrentEffects" class="w-full btn-primary !py-3 !text-[10px] tracking-[0.2em] font-bold uppercase">SNAPSHOT CURRENT SLIDERS</button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showGallery" class="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-bg/95 backdrop-blur-sm">
        <div class="card-surface w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col p-8 space-y-6">
          <div class="flex justify-between items-center border-b border-border pb-4">
            <h3 class="text-xl tracking-widest font-display text-primary uppercase">Link Master Asset</h3>
            <button @click="showGallery = false" class="text-muted hover:text-primary font-bold text-sm">CLOSE [×]</button>
          </div>
          
          <div v-if="gallery.length === 0" class="flex-1 flex flex-col items-center justify-center text-muted text-center space-y-4 font-sans">
            <p>Your Studio Gallery is empty.</p>
            <router-link to="/gallery" class="btn-primary !px-6 !py-2 !text-xs">GO TO GALLERY</router-link>
          </div>
          
          <div v-else class="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-2 custom-scrollbar">
            <div 
              v-for="img in gallery" 
              :key="img.id"
              @click="pickImage(img.id)"
              class="aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all relative group shadow-lg"
              :class="{ '!border-primary shadow-amber': track.thumbnailId === img.id }"
            >
              <img :src="img.base64" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center uppercase">
                <span class="text-[10px] font-bold tracking-widest bg-bg/80 px-2 py-1 rounded text-primary">SELECT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <input type="file" ref="reconnectInput" class="hidden" accept="audio/*,video/mp4" @change="handleReconnect" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStorage } from '../composables/useStorage'

const props = defineProps(['track', 'engine'])
const emit = defineEmits(['reconnect'])
const { getItem } = useStorage()

const showGallery = ref(false)
const gallery = ref(getItem('gallery_images', []))
const reconnectInput = ref(null)

const resolvedThumbnail = computed(() => {
  if (!props.track.thumbnailId) return props.track.thumbnail 
  const master = gallery.value.find(img => img.id === props.track.thumbnailId)
  return master ? master.base64 : null
})

const pickImage = (id) => {
  props.track.thumbnailId = id
  props.track.thumbnail = null 
  showGallery.value = false
}

const syncCurrentEffects = () => {
  props.track.effects = {
    playbackRate: props.engine.playbackRate.value,
    reverbWet: props.engine.reverbWet.value,
    bassGain: props.engine.bassGain.value,
    pitch: props.engine.pitch.value
  }
  
  // Force storage update for the tracks array
  const tracks = getItem('playlist_tracks', [])
  const idx = tracks.findIndex(t => t.id === props.track.id)
  if (idx > -1) {
    tracks[idx] = JSON.parse(JSON.stringify(props.track))
    localStorage.setItem('playlist_tracks', JSON.stringify(tracks))
  }
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
</script>
