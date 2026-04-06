<template>
  <div class="card-surface p-4 overflow-hidden">
    <div class="relative rounded-2xl overflow-hidden aspect-video bg-bg shadow-inner border border-border group flex items-center justify-center">
      <video 
        v-if="track?.type === 'video' && track?.videoUrl"
        ref="videoElement"
        class="w-full h-full object-cover"
        autoplay
        loop
        muted
        playsinline
        :key="track.id"
        :src="track.videoUrl"
      ></video>
      
      <div v-else class="text-center space-y-4">
        <div class="text-primary/10 text-6xl">📽️</div>
        <p class="text-primary/40 text-[10px] tracking-[0.2em] font-bold uppercase font-sans">
          No video, try uploading mp4 instead
        </p>
      </div>
      
      <div class="absolute inset-0 bg-bg/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
      
      <div class="absolute top-4 left-6 flex items-center gap-2">
        <div class="w-2 h-2 rounded-full animate-pulse" :class="track?.type === 'video' ? 'bg-red-500' : 'bg-primary/20'"></div>
        <div class="text-[10px] tracking-[0.4em] text-primary/80 font-bold uppercase pointer-events-none font-mono">
          {{ track?.type === 'video' ? 'Track Footage' : 'Studio Monitor' }}
        </div>
      </div>

      <div class="absolute bottom-4 right-6 text-[9px] tracking-widest text-primary/40 font-mono uppercase">
        HD-1 Reference Monitor
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['track'])
</script>
