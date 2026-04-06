<template>
  <div class="card-surface flex flex-col h-[600px] overflow-hidden">
    <div class="p-8 border-b border-border bg-surface-2/30 text-left">
      <div class="flex items-center gap-8">
        <div class="w-32 h-32 rounded-2xl overflow-hidden bg-bg border border-border flex-shrink-0 shadow-[0_0_20px_var(--color-glow)]">
          <img 
            v-if="resolveThumbnail(currentTrack)" 
            :src="resolveThumbnail(currentTrack)" 
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-primary/20 text-4xl">📼</div>
        </div>

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
            class="bg-transparent text-muted w-full border-none focus:ring-0 p-0 text-sm tracking-widest uppercase font-medium font-sans"
            placeholder="Artist Name"
          />
          <div v-else class="text-muted tracking-widest uppercase text-sm font-mono">No track selected</div>
          
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

      <div class="mt-8 flex items-center justify-center gap-6">
        <button @click="prevTrack" class="text-muted hover:text-primary transition-colors text-xl">⏮</button>
        <button 
          @click="togglePlay" 
          class="w-16 h-16 rounded-full bg-primary text-bg flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_var(--color-glow)]"
        >
          {{ engine.isPlaying.value ? '⏸' : '▶' }}
        </button>
        <button @click="nextTrack" class="text-muted hover:text-primary transition-colors text-xl">⏭</button>
      </div>
    </div>

    <div class="px-8 py-4 flex justify-between items-center bg-surface/50">
      <h3 class="text-sm tracking-[0.2em] font-medium text-muted uppercase font-sans">Playlist</h3>
      <button @click="triggerUpload" class="text-xs text-primary hover:tracking-widest transition-all font-bold">
        + ADD ASSETS (MP3/MP4)
      </button>
      <input ref="fileInput" type="file" multiple class="hidden" accept="audio/*,video/mp4" @change="handleFileUpload" />
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
      <div 
        v-for="(track, index) in tracks" 
        :key="track.id"
        class="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 group relative text-left"
        :class="currentIndex === index ? 'bg-primary/10 border border-primary/20' : 'hover:bg-surface-2'"
        @click="selectTrack(index)"
      >
        <div class="w-12 h-12 rounded-lg overflow-hidden bg-bg border border-border flex-shrink-0">
          <img v-if="resolveThumbnail(track)" :src="resolveThumbnail(track)" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-primary/20 text-xs">
            {{ track.type === 'video' ? '🎬' : '📼' }}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium truncate" :class="currentIndex === index ? 'text-primary' : 'text-text'">{{ track.title }}</div>
          <div class="text-[10px] text-muted tracking-widest uppercase truncate font-mono">{{ track.artist }}</div>
        </div>
        
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click.stop="removeTrack(index)" class="p-2 text-red-500/40 hover:text-red-500 transition-colors text-xs">❌</button>
        </div>

        <div v-if="currentIndex === index && engine.isPlaying.value" class="w-4 h-4 text-primary animate-pulse ml-2">🔊</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStorage } from '../composables/useStorage'

const props = defineProps(['engine', 'tracks', 'currentIndex'])
const emit = defineEmits(['update:currentIndex'])
const { getItem, saveFile, removeFile } = useStorage()

const fileInput = ref(null)
const isRecalling = ref(false)

const galleryImages = computed(() => getItem('gallery_images', []))

const resolveThumbnail = (track) => {
  if (!track) return null
  if (track.thumbnailId) {
    const master = galleryImages.value.find(img => img.id === track.thumbnailId)
    return master ? master.base64 : null
  }
  return track.thumbnail 
}

const currentTrack = computed(() => props.tracks[props.currentIndex])

const removeTrack = async (index) => {
  if (confirm('Delete this asset?')) {
    const track = props.tracks[index]
    if (props.currentIndex === index) props.engine.stop()
    await removeFile(`audio_${track.id}`)
    if (track.type === 'video') await removeFile(`video_${track.id}`)
    props.tracks.splice(index, 1)
    if (props.currentIndex >= props.tracks.length) {
      emit('update:currentIndex', Math.max(0, props.tracks.length - 1))
    }
  }
}

const triggerUpload = () => fileInput.value.click()

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(async (file) => {
    const trackId = Date.now() + Math.random()
    const url = URL.createObjectURL(file)
    const isVideo = file.type.includes('video')
    await saveFile(`audio_${trackId}`, file)
    if (isVideo) await saveFile(`video_${trackId}`, file)
    props.tracks.push({
      id: trackId,
      type: isVideo ? 'video' : 'audio',
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: 'STUDIO ASSET',
      url,
      videoUrl: isVideo ? url : null,
      duration: 0,
      effects: { playbackRate: 1.0, reverbWet: 0.0, bassGain: 0.0, pitch: 0 }
    })
  })
  event.target.value = ''
}

const selectTrack = async (index) => {
  const track = props.tracks[index]
  if (!track) return

  emit('update:currentIndex', index)
  isRecalling.value = true 

  if (track.url) {
    await props.engine.initContext()
    await props.engine.loadAudio(track.url)
    track.duration = props.engine.duration.value
  }

  props.engine.playbackRate.value = track.effects.playbackRate || 1.0
  props.engine.reverbWet.value = track.effects.reverbWet || 0.0
  props.engine.bassGain.value = track.effects.bassGain || 0.0
  props.engine.pitch.value = track.effects.pitch || 0
  
  if (!track.url && track.duration) props.engine.duration.value = track.duration
  if (props.engine.isPlaying.value) {
    props.engine.stop()
    if (track.url) props.engine.play()
  }
  setTimeout(() => { isRecalling.value = false }, 100)
}

const togglePlay = async () => {
  if (!currentTrack.value) return
  if (!currentTrack.value.url) {
    alert('Please reconnect the studio file in the Editor.')
    return
  }
  await props.engine.initContext()
  if (props.engine.isPlaying.value) {
    props.engine.pause()
  } else {
    if (!props.engine.currentTime.value) await props.engine.loadAudio(currentTrack.value.url)
    props.engine.play()
  }
}

const nextTrack = () => selectTrack((props.currentIndex + 1) % props.tracks.length)
const prevTrack = () => selectTrack((props.currentIndex - 1 + props.tracks.length) % props.tracks.length)

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

watch([
  () => props.engine.playbackRate.value,
  () => props.engine.reverbWet.value,
  () => props.engine.bassGain.value,
  () => props.engine.pitch.value
], () => {
  if (currentTrack.value && !isRecalling.value) {
    currentTrack.value.effects = {
      playbackRate: props.engine.playbackRate.value,
      reverbWet: props.engine.reverbWet.value,
      bassGain: props.engine.bassGain.value,
      pitch: props.engine.pitch.value
    }
  }
})
</script>

<style>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { @apply bg-transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: var(--color-border); border-radius: 9999px; }
</style>
