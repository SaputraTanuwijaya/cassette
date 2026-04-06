<template>
  <div class="card-surface p-8 space-y-10 h-full">
    <h3 class="text-sm tracking-[0.2em] font-medium text-muted uppercase border-b border-border pb-4">
      Studio Effects
    </h3>

    <!-- Speed Control -->
    <div class="space-y-4">
      <div class="flex justify-between items-end">
        <label class="text-xs tracking-widest text-text/60 font-bold uppercase">Playback Speed</label>
        <span class="font-mono text-primary text-sm">{{ engine.playbackRate.value.toFixed(2) }}x</span>
      </div>
      <input 
        v-model.number="engine.playbackRate.value" 
        type="range" min="0.5" max="2" step="0.01" 
        class="w-full"
      />
    </div>

    <!-- Reverb Control -->
    <div class="space-y-4">
      <div class="flex justify-between items-end">
        <label class="text-xs tracking-widest text-text/60 font-bold uppercase">Reverb Depth</label>
        <span class="font-mono text-primary text-sm">{{ Math.round(engine.reverbWet.value * 100) }}%</span>
      </div>
      <input 
        v-model.number="engine.reverbWet.value" 
        type="range" min="0" max="1" step="0.01" 
        class="w-full"
      />
    </div>

    <!-- Bass Boost Control -->
    <div class="space-y-4">
      <div class="flex justify-between items-end">
        <label class="text-xs tracking-widest text-text/60 font-bold uppercase">Bass Boost</label>
        <span class="font-mono text-primary text-sm">{{ engine.bassGain.value > 0 ? '+' : '' }}{{ engine.bassGain.value }}dB</span>
      </div>
      <input 
        v-model.number="engine.bassGain.value" 
        type="range" min="-12" max="12" step="1" 
        class="w-full"
      />
    </div>

    <!-- Pitch Shift Control -->
    <div class="space-y-4">
      <div class="flex justify-between items-end">
        <label class="text-xs tracking-widest text-text/60 font-bold uppercase">Pitch Shift</label>
        <span class="font-mono text-primary text-sm">{{ engine.pitch.value > 0 ? '+' : '' }}{{ engine.pitch.value }} st</span>
      </div>
      <input 
        v-model.number="engine.pitch.value" 
        type="range" min="-12" max="12" step="1" 
        class="w-full"
      />
    </div>

    <!-- Volume Control -->
    <div class="pt-6 border-t border-border space-y-4">
      <div class="flex justify-between items-end">
        <label class="text-xs tracking-widest text-text/60 font-bold uppercase">Master Output</label>
        <span class="font-mono text-primary text-sm">{{ Math.round(engine.volume.value * 100) }}%</span>
      </div>
      <input 
        v-model.number="engine.volume.value" 
        type="range" min="0" max="1.5" step="0.01" 
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['engine'])
</script>

<style scoped>
/* Slider styling is already in style.css but we can refine here if needed */
</style>
