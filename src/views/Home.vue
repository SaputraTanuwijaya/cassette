<template>
  <div class="space-y-24 pb-24">
    <!-- Hero Section -->
    <section class="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      <!-- Background Image -->
      <div 
        class="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] hover:scale-105"
        style="background-image: url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80')"
      ></div>
      <!-- Overlay -->
      <div class="absolute inset-0 bg-linear-to-t from-bg via-bg/40 to-transparent"></div>
      
      <!-- Content -->
      <div class="relative z-10 text-center space-y-8 max-w-3xl px-6">
        <h1 class="text-8xl md:text-9xl tracking-[0.2em] font-medium drop-shadow-2xl">
          CASSETTE
        </h1>
        <p class="text-xl md:text-2xl text-text/80 font-light tracking-wide max-w-2xl mx-auto">
          A retro-modern local music player for those who value the warmth of analog.
        </p>
        <div class="pt-8">
          <router-link to="/media" class="btn-primary text-lg">
            OPEN PLAYER
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="card-surface group">
          <div class="text-primary mb-6 text-4xl">
            <span class="icon-[ph--music-notes-light]"></span>
          </div>
          <h3 class="text-2xl mb-4 group-hover:tracking-wider transition-all duration-300">Your Music</h3>
          <p class="text-muted leading-relaxed">
            Upload any local audio file (MP3, WAV, OGG, FLAC) and play it instantly in your browser. No cloud, no tracking.
          </p>
        </div>

        <div class="card-surface group">
          <div class="text-primary mb-6 text-4xl">
            <span class="icon-[ph--equalizer-light]"></span>
          </div>
          <h3 class="text-2xl mb-4 group-hover:tracking-wider transition-all duration-300">Studio Effects</h3>
          <p class="text-muted leading-relaxed">
            Apply real-time speed, reverb, bass boost, and pitch shift. Sculpt your sound with professional-grade controls.
          </p>
        </div>

        <div class="card-surface group">
          <div class="text-primary mb-6 text-4xl">
            <span class="icon-[ph--image-square-light]"></span>
          </div>
          <h3 class="text-2xl mb-4 group-hover:tracking-wider transition-all duration-300">Album Art</h3>
          <p class="text-muted leading-relaxed">
            Manage your cover art gallery. Upload images and assign custom thumbnails to your tracks with a single click.
          </p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="max-w-5xl mx-auto px-12 text-center">
      <h2 class="text-4xl mb-16 tracking-widest uppercase text-muted font-light">How It Works</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="space-y-6">
          <div class="text-6xl font-display text-primary/30">01</div>
          <p class="text-lg font-medium tracking-wide">Load your files locally</p>
        </div>
        <div class="space-y-6">
          <div class="text-6xl font-display text-primary/30">02</div>
          <p class="text-lg font-medium tracking-wide">Apply your custom effects</p>
        </div>
        <div class="space-y-6">
          <div class="text-6xl font-display text-primary/30">03</div>
          <p class="text-lg font-medium tracking-wide">Enjoy the retro vibe</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// No extra logic needed for static Home page
</script>

<style scoped>
/* Optional: extra local styles */
</style>
