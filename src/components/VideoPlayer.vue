<template>
  <div class="card-surface p-4 overflow-hidden">
    <div class="relative rounded-2xl overflow-hidden aspect-video bg-bg shadow-inner border border-border">
      <video 
        class="w-full h-full object-cover"
        autoplay
        loop
        muted
        playsinline
        src="https://assets.mixkit.co/videos/preview/mixkit-vintage-cassette-tape-playing-in-a-deck-34445-preview.mp4"
      ></video>
      <div class="absolute top-4 right-6 text-[10px] tracking-[0.4em] text-primary/50 font-bold uppercase pointer-events-none">
        Tape Deck Monitor
      </div>
    </div>
  </div>
</template>

<script setup>
// Purely functional component for visual mood
</script>
