<template>
  <div class="card-surface p-4 overflow-hidden">
    <div class="relative rounded-2xl overflow-hidden aspect-video bg-bg shadow-inner border border-border group">
      <video 
        ref="videoElement"
        class="w-full h-full object-cover"
        autoplay
        loop
        muted
        playsinline
        :src="activeVideoUrl"
      ></video>
      
      <!-- Overlay Info -->
      <div class="absolute inset-0 bg-bg/20 group-hover:bg-transparent transition-colors"></div>
      
      <div class="absolute top-4 left-6 flex items-center gap-2">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div class="text-[10px] tracking-[0.4em] text-primary/80 font-bold uppercase pointer-events-none">
          {{ isDefault ? 'Reference Loop' : 'Track Footage' }}
        </div>
      </div>

      <div class="absolute bottom-4 right-6 text-[9px] tracking-widest text-primary/40 font-mono uppercase">
        Studio Monitor HD-1
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStorage } from '../composables/useStorage'

const props = defineProps(['tracks', 'engine'])
const { getItem } = useStorage()

// The current track index from storage
const currentIndex = ref(getItem('current_track_index', 0))

// Default fallback loop
const DEFAULT_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-vintage-cassette-tape-playing-in-a-deck-34445-preview.mp4"

const activeVideoUrl = computed(() => {
  const currentTrack = props.tracks[currentIndex.value]
  return currentTrack?.videoUrl || DEFAULT_VIDEO
})

const isDefault = computed(() => activeVideoUrl.value === DEFAULT_VIDEO)

// Sync with storage changes (track switching)
watch(() => localStorage.getItem('current_track_index'), (newVal) => {
  if (newVal !== null) currentIndex.value = parseInt(newVal)
})
</script>
