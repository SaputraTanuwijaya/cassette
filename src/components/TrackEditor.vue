<template>
  <div v-if="track" class="card-surface p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="flex justify-between items-start">
      <h3 class="text-sm tracking-[0.4em] font-medium text-muted uppercase">Track Editor</h3>
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
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-primary/10 text-6xl">
            📼
          </div>
          
          <!-- Quick Assignment Overlay -->
          <div class="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              @click="applyGlobalThumb"
              class="btn-primary !py-2 !px-4 !text-xs"
            >
              USE RECENT FROM GALLERY
            </button>
          </div>
        </div>
        <p class="text-[10px] text-muted text-center tracking-widest uppercase">
          800x800 Studio Standard
        </p>
      </div>

      <!-- Metadata and Stats Section -->
      <div class="flex-1 space-y-8">
        <div class="space-y-6">
          <!-- Title Edit -->
          <div class="space-y-2">
            <label class="text-[10px] tracking-widest text-primary/50 font-bold uppercase">Track Title</label>
            <div class="flex items-center gap-4 group">
              <input 
                v-model="track.title" 
                class="bg-transparent text-4xl font-display text-primary border-none focus:ring-0 p-0 w-full"
              />
              <span class="text-primary/20 group-hover:text-primary/50 transition-colors">✏️</span>
            </div>
          </div>

          <!-- Artist Edit -->
          <div class="space-y-2">
            <label class="text-[10px] tracking-widest text-primary/50 font-bold uppercase">Artist / Author</label>
            <div class="flex items-center gap-4 group">
              <input 
                v-model="track.artist" 
                class="bg-transparent text-xl text-text border-none focus:ring-0 p-0 w-full tracking-wider uppercase"
              />
              <span class="text-primary/20 group-hover:text-primary/50 transition-colors">✏️</span>
            </div>
          </div>
        </div>

        <!-- Saved Effects Display -->
        <div class="grid grid-cols-2 gap-4 pt-8 border-t border-border">
          <div class="p-4 bg-bg/50 rounded-2xl border border-border/50">
            <div class="text-[10px] text-muted tracking-widest uppercase mb-1">Speed</div>
            <div class="font-mono text-primary">{{ track.effects.playbackRate.toFixed(2) }}x</div>
          </div>
          <div class="p-4 bg-bg/50 rounded-2xl border border-border/50">
            <div class="text-[10px] text-muted tracking-widest uppercase mb-1">Bass</div>
            <div class="font-mono text-primary">{{ track.effects.bassGain }}dB</div>
          </div>
          <div class="p-4 bg-bg/50 rounded-2xl border border-border/50">
            <div class="text-[10px] text-muted tracking-widest uppercase mb-1">Reverb</div>
            <div class="font-mono text-primary">{{ Math.round(track.effects.reverbWet * 100) }}%</div>
          </div>
          <div class="p-4 bg-bg/50 rounded-2xl border border-border/50">
            <div class="text-[10px] text-muted tracking-widest uppercase mb-1">Pitch</div>
            <div class="font-mono text-primary">{{ track.effects.pitch }}st</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-8">
          <button 
            @click="saveEffects"
            class="flex-1 btn-primary py-4 tracking-[0.2em] font-bold"
          >
            SAVE CURRENT EFFECTS TO TRACK
          </button>
          <button 
            @click="resetEffects"
            class="btn-ghost py-4 px-8 tracking-[0.2em]"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStorage } from '../composables/useStorage'

const props = defineProps(['track', 'engine'])
const emit = defineEmits(['close', 'update'])
const { getItem } = useStorage()

const applyGlobalThumb = () => {
  const thumb = getItem('currentThumbnail')
  if (thumb) {
    props.track.thumbnail = thumb
  } else {
    alert('No recent image found in Gallery. Please assign one there first.')
  }
}

const saveEffects = () => {
  props.track.effects = {
    playbackRate: props.engine.playbackRate.value,
    reverbWet: props.engine.reverbWet.value,
    bassGain: props.engine.bassGain.value,
    pitch: props.engine.pitch.value
  }
  alert('Studio effects saved to this track!')
}

const resetEffects = () => {
  if (confirm('Reset effects to studio defaults?')) {
    props.engine.playbackRate.value = 1.0
    props.engine.reverbWet.value = 0.0
    props.engine.bassGain.value = 0.0
    props.engine.pitch.value = 0
    saveEffects()
  }
}
</script>
