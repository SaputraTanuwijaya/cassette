<template>
  <div ref="container" class="w-full h-48 card-surface overflow-hidden relative group">
    <canvas ref="canvas" class="w-full h-full"></canvas>
    <div class="absolute inset-0 bg-linear-to-t from-bg/20 to-transparent pointer-events-none"></div>
    <div class="absolute top-4 left-8 text-[10px] tracking-[0.4em] text-primary/30 font-bold uppercase pointer-events-none">
      Real-Time Frequency Analysis
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps(['engine'])
const container = ref(null)
const canvas = ref(null)
let ctx = null
let animationId = null

const initCanvas = () => {
  if (!canvas.value) return
  const dpr = window.devicePixelRatio || 1
  canvas.value.width = container.value.clientWidth * dpr
  canvas.value.height = container.value.clientHeight * dpr
  ctx = canvas.value.getContext('2d')
  ctx.scale(dpr, dpr)
}

const draw = () => {
  animationId = requestAnimationFrame(draw)
  
  const analyser = props.engine.getAnalyser()
  if (!analyser || !ctx) return

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyser.getByteFrequencyData(dataArray)

  const width = container.value.clientWidth
  const height = container.value.clientHeight
  const barWidth = (width / bufferLength) * 2.5
  let x = 0

  ctx.clearRect(0, 0, width, height)

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * height
    
    // Create warm gradient
    const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height)
    gradient.addColorStop(0, '#F5C842') // Primary amber
    gradient.addColorStop(1, '#E8703A') // Secondary orange
    
    ctx.fillStyle = gradient
    
    // Draw rounded bars
    const radius = 2
    ctx.beginPath()
    ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, [radius, radius, 0, 0])
    ctx.fill()

    x += barWidth
  }
}

onMounted(() => {
  initCanvas()
  const observer = new ResizeObserver(initCanvas)
  observer.observe(container.value)
  draw()
  
  onUnmounted(() => {
    observer.disconnect()
    cancelAnimationFrame(animationId)
  })
})
</script>
