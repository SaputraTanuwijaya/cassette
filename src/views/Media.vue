<template>
  <div class="max-w-7xl mx-auto px-12 py-12 space-y-12 min-h-screen">
    <!-- Header -->
    <header class="flex justify-between items-center">
      <h1 class="text-4xl tracking-widest uppercase">Studio Player</h1>
      <div v-if="engine.isPlaying.value" class="text-xs tracking-[0.4em] text-primary animate-pulse font-bold uppercase">
        Live Output Active
      </div>
    </header>

    <!-- Visualizer Section -->
    <section>
      <EQVisualizer :engine="engine" />
    </section>

    <!-- Player and Effects Section -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2">
        <AudioPlayer 
          :engine="engine" 
          :tracks="tracks"
          @edit="handleEdit"
        />
      </div>
      <div>
        <EffectsPanel :engine="engine" />
      </div>
    </section>

    <!-- Track Editor Section (Conditional) -->
    <section v-if="editingTrack !== null">
      <TrackEditor 
        :track="tracks[editingTrack]" 
        :engine="engine"
        @close="editingTrack = null"
        @reconnect="handleReconnect"
      />
    </section>

    <!-- Video Monitor Section -->
    <section class="max-w-3xl mx-auto">
      <VideoPlayer :tracks="tracks" :engine="engine" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAudioEngine } from '../composables/useAudioEngine'
import { useStorage } from '../composables/useStorage'
import EQVisualizer from '../components/EQVisualizer.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import EffectsPanel from '../components/EffectsPanel.vue'
import VideoPlayer from '../components/VideoPlayer.vue'
import TrackEditor from '../components/TrackEditor.vue'

const engine = useAudioEngine()
const { usePersistedRef, getFile } = useStorage()
const tracks = usePersistedRef('playlist_tracks', [])
const editingTrack = ref(null)

const handleEdit = (index) => {
  editingTrack.value = index
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }, 100)
}

const handleReconnect = ({ trackId, url }) => {
  const track = tracks.value.find(t => t.id === trackId)
  if (track) {
    track.url = url
  }
}

onMounted(async () => {
  // --- AUTO-LINK SYSTEM ---
  // Restore Blob URLs from IndexedDB for all tracks
  for (const track of tracks.value) {
    // Restore Audio
    try {
      const audioFile = await getFile(`audio_${track.id}`)
      if (audioFile) {
        track.url = URL.createObjectURL(audioFile)
      }
    } catch (e) {
      console.error(`Failed to auto-link audio for ${track.title}`)
    }

    // Restore Video
    try {
      const videoFile = await getFile(`video_${track.id}`)
      if (videoFile) {
        track.videoUrl = URL.createObjectURL(videoFile)
      }
    } catch (e) {
      console.error(`Failed to auto-link video for ${track.title}`)
    }
  }
})
</script>
