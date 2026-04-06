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
        <AudioPlayer :engine="engine" />
      </div>
      <div>
        <EffectsPanel :engine="engine" />
      </div>
    </section>

    <!-- Video Monitor Section -->
    <section class="max-w-3xl mx-auto">
      <VideoPlayer />
    </section>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useAudioEngine } from '../composables/useAudioEngine'
import EQVisualizer from '../components/EQVisualizer.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import EffectsPanel from '../components/EffectsPanel.vue'
import VideoPlayer from '../components/VideoPlayer.vue'

const engine = reactive(useAudioEngine())

onMounted(async () => {
  // Pre-initialize context on mount if possible, or wait for user interaction
  // props.engine will be passed to components
})
</script>
