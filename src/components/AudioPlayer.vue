<template>
  <div class="card-surface flex flex-col h-[600px] overflow-hidden">
    <!-- Player Controls -->
    <div class="p-8 border-b border-border bg-surface-2/30">
      <div class="flex items-center gap-8">
        <!-- Track Thumbnail -->
        <div class="w-32 h-32 rounded-2xl overflow-hidden bg-bg border border-border flex-shrink-0 shadow-[0_0_20px_var(--color-glow)]">
          <img 
            v-if="currentTrack?.thumbnail" 
            :src="currentTrack.thumbnail" 
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-primary/20 text-4xl">
            📼
          </div>
        </div>

        <!-- Track Info -->
        <div class="flex-1 min-w-0">
          <input 
            v-if="currentTrack"
            v-model="currentTrack.title" 
            class="bg-transparent text-2xl font-display text-primary w-full border-none focus:ring-0 p-0"
            placeholder="Track Title"
          />
          <input 
            v-if="currentTrack"
            v-model="currentTrack.artist" 
            class="bg-transparent text-muted w-full border-none focus:ring-0 p-0 text-sm tracking-widest uppercase font-medium"
            placeholder="Artist Name"
          />
          <div v-else class="text-muted tracking-widest uppercase text-sm">No track selected</div>
          
          <!-- Time & Progress -->
          <div class="mt-4 space-y-2">
            <div class="flex justify-between font-mono text-xs text-primary/60 tracking-tighter">
              <span>{{ formatTime(engine.currentTime.value) }}</span>
              <span>{{ formatTime(engine.duration.value) }}</span>
            </div>
            <div class="h-1 bg-bg rounded-full overflow-hidden relative">
              <div 
                class="absolute inset-y-0 left-0 bg-primary transition-all duration-100"
                :style="{ width: (engine.currentTime.value / engine.duration.value * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="mt-8 flex items-center justify-center gap-6">
        <button @click="prevTrack" class="text-muted hover:text-primary transition-colors text-xl">
          ⏮
        </button>
        <button 
          @click="togglePlay" 
          class="w-16 h-16 rounded-full bg-primary text-bg flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_var(--color-glow)]"
        >
          {{ engine.isPlaying.value ? '⏸' : '▶' }}
        </button>
        <button @click="nextTrack" class="text-muted hover:text-primary transition-colors text-xl">
          ⏭
        </button>
      </div>
    </div>

    <!-- Playlist Header -->
    <div class="px-8 py-4 flex justify-between items-center bg-surface/50">
      <h3 class="text-sm tracking-[0.2em] font-medium text-muted uppercase">Playlist</h3>
      <button 
        @click="triggerUpload"
        class="text-xs text-primary hover:tracking-widest transition-all font-bold"
      >
        + ADD TRACKS
      </button>
      <input 
        ref="fileInput"
        type="file" 
        multiple 
        class="hidden" 
        accept="audio/*" 
        @change="handleFileUpload"
      />
    </div>

    <!-- Playlist Content -->
    <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
      <div 
        v-for="(track, index) in tracks" 
        :key="track.id"
        class="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 group relative"
        :class="currentIndex === index ? 'bg-primary/10 border border-primary/20' : 'hover:bg-surface-2'"
        @click="selectTrack(index)"
      >
        <div class="w-12 h-12 rounded-lg overflow-hidden bg-bg border border-border flex-shrink-0">
          <img v-if="track.thumbnail" :src="track.thumbnail" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-primary/20 text-xs">📼</div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium truncate" :class="currentIndex === index ? 'text-primary' : 'text-text'">
            {{ track.title }}
          </div>
          <div class="text-[10px] text-muted tracking-widest uppercase truncate">{{ track.artist }}</div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            @click.stop="$emit('edit', index)"
            class="p-2 text-primary/60 hover:text-primary transition-colors text-xs"
            title="Edit Track"
          >
            ✏️
          </button>
          <button 
            @click.stop="removeTrack(index)"
            class="p-2 text-red-500/40 hover:text-red-500 transition-colors text-xs"
            title="Remove Track"
          >
            ❌
          </button>
        </div>

        <div v-if="currentIndex === index && engine.isPlaying.value" class="w-4 h-4 text-primary animate-pulse ml-2">
          🔊
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useStorage } from '../composables/useStorage'

const props = defineProps(['engine'])
const emit = defineEmits(['edit'])
const { usePersistedRef, getItem } = useStorage()

const tracks = usePersistedRef('playlist_tracks', [])
const currentIndex = usePersistedRef('current_track_index', 0)
const fileInput = ref(null)

const currentTrack = computed(() => tracks.value[currentIndex.value])

const removeTrack = (index) => {
  if (confirm('Remove this track from playlist?')) {
    if (currentIndex.value === index) {
      props.engine.stop()
    }
    tracks.value.splice(index, 1)
    if (currentIndex.value >= tracks.value.length) {
      currentIndex.value = Math.max(0, tracks.value.length - 1)
    }
  }
}

// Watch for thumbnail assignment from Gallery
watch(() => getItem('currentThumbnail'), (newThumb) => {
  if (newThumb && currentTrack.value) {
    currentTrack.value.thumbnail = newThumb
  }
})

const triggerUpload = () => fileInput.value.click()

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    const url = URL.createObjectURL(file)
    tracks.value.push({
      id: Date.now() + Math.random(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: 'UNKNOWN ARTIST',
      url,
      thumbnail: null,
      effects: {
        playbackRate: 1.0,
        reverbWet: 0.0,
        bassGain: 0.0,
        pitch: 0
      }
    })
  })
  event.target.value = ''
  if (tracks.value.length === files.length) {
    selectTrack(0)
  }
}

const selectTrack = async (index) => {
  currentIndex.value = index
  const track = tracks.value[index]
  if (!track) return

  await props.engine.initContext()
  await props.engine.loadAudio(track.url)
  
  // Apply persisted effects for this track
  props.engine.playbackRate.value = track.effects.playbackRate
  props.engine.reverbWet.value = track.effects.reverbWet
  props.engine.bassGain.value = track.effects.bassGain
  props.engine.pitch.value = track.effects.pitch
  
  if (props.engine.isPlaying.value) {
    props.engine.stop()
    props.engine.play()
  }
}

const togglePlay = async () => {
  if (!currentTrack.value) return
  await props.engine.initContext()
  
  if (props.engine.isPlaying.value) {
    props.engine.pause()
  } else {
    if (!props.engine.currentTime.value) {
      await props.engine.loadAudio(currentTrack.value.url)
    }
    props.engine.play()
  }
}

const nextTrack = () => {
  const next = (currentIndex.value + 1) % tracks.value.length
  selectTrack(next)
}

const prevTrack = () => {
  const prev = (currentIndex.value - 1 + tracks.value.length) % tracks.value.length
  selectTrack(prev)
}

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Only sync effects to the track when explicitly playing that track
watch([
  () => props.engine.playbackRate.value,
  () => props.engine.reverbWet.value,
  () => props.engine.bassGain.value,
  () => props.engine.pitch.value
], ([rate, reverb, bass, pitch]) => {
  if (currentTrack.value) {
    // Note: We don't auto-save here anymore, we'll use the TrackEditor Save button
  }
})
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 9999px;
}
</style>
