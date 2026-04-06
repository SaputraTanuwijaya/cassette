<template>
  <div class="max-w-7xl mx-auto px-12 py-12 space-y-12 min-h-screen">
    <header class="flex justify-between items-center">
      <h1 class="text-4xl tracking-widest uppercase">Studio Player</h1>
      <div v-if="engine.isPlaying.value" class="text-xs tracking-[0.4em] text-primary animate-pulse font-bold uppercase">Live Output Active</div>
    </header>

    <section><EQVisualizer :engine="engine" /></section>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2">
        <AudioPlayer :engine="engine" :tracks="tracks" />
      </div>
      <div>
        <EffectsPanel :engine="engine" />
      </div>
    </section>

    <section>
      <TrackEditor 
        v-if="currentTrack"
        :track="currentTrack" 
        :engine="engine"
        @reconnect="handleReconnect"
      />
    </section>

    <section class="max-w-3xl mx-auto">
      <VideoPlayer :tracks="tracks" :engine="engine" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
const currentIndex = usePersistedRef('current_track_index', 0)

const currentTrack = computed(() => tracks.value[currentIndex.value])

const handleReconnect = ({ trackId, url }) => {
  const track = tracks.value.find(t => t.id === trackId)
  if (track) track.url = url
}

onMounted(async () => {
  for (const track of tracks.value) {
    try {
      const audioFile = await getFile(`audio_${track.id}`)
      if (audioFile) track.url = URL.createObjectURL(audioFile)
      
      const videoFile = await getFile(`video_${track.id}`)
      if (videoFile) track.videoUrl = URL.createObjectURL(videoFile)
    } catch (e) {
      console.error(`Failed to auto-link ${track.title}`)
    }
  }
})
</script>
