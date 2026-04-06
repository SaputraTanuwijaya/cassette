import { ref, watch, onUnmounted } from 'vue'
import * as Tone from 'tone'

export function useAudioEngine() {
  // --- Refs for UI binding ---
  const playbackRate = ref(1.0)
  const reverbWet = ref(0.0)
  const bassGain = ref(0.0)
  const pitch = ref(0)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.8)

  // --- Web Audio Internal State ---
  let audioContext = null
  let sourceNode = null
  let bassNode = null
  let reverbNode = null
  let reverbGain = null
  let dryGain = null
  let pitchShift = null
  let analyserNode = null
  let masterGain = null
  let audioBuffer = null
  let startTime = 0
  let offset = 0
  let animationFrameId = null

  // --- Setup Audio Context and Nodes ---
  const initContext = async () => {
    if (audioContext) return

    await Tone.start()
    audioContext = Tone.getContext().rawContext

    // Create Nodes
    bassNode = audioContext.createBiquadFilter()
    bassNode.type = 'lowshelf'
    bassNode.frequency.value = 200
    bassNode.gain.value = bassGain.value

    reverbNode = audioContext.createConvolver()
    reverbNode.buffer = createReverbBuffer()
    
    reverbGain = audioContext.createGain()
    reverbGain.gain.value = reverbWet.value

    dryGain = audioContext.createGain()
    dryGain.gain.value = 1.0 - reverbWet.value

    pitchShift = new Tone.PitchShift({ pitch: pitch.value })
    
    analyserNode = audioContext.createAnalyser()
    analyserNode.fftSize = 256
    
    masterGain = audioContext.createGain()
    masterGain.gain.value = volume.value

    // --- Connect Chain ---
    // Source (added in playTrack) -> Bass -> PitchShift -> [Dry | Reverb] -> MasterGain -> Analyser -> Destination
  }

  // --- Helper: Generate Reverb Impulse Response ---
  const createReverbBuffer = () => {
    const length = audioContext.sampleRate * 2 // 2 seconds
    const buffer = audioContext.createBuffer(2, length, audioContext.sampleRate)
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        // Decaying noise
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
      }
    }
    return buffer
  }

  // --- Core Methods ---
  const loadAudio = async (url) => {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    duration.value = audioBuffer.duration
    offset = 0
    currentTime.value = 0
  }

  const play = () => {
    if (!audioBuffer || isPlaying.value) return
    
    sourceNode = audioContext.createBufferSource()
    sourceNode.buffer = audioBuffer
    sourceNode.playbackRate.value = playbackRate.value
    
    // Wire up the source to the start of the chain
    sourceNode.connect(bassNode)
    
    // Bass to PitchShift (Tone.js node)
    // Note: To connect native Web Audio to Tone.js, we use Tone.connect
    Tone.connect(bassNode, pitchShift)
    
    // PitchShift to Dry/Wet paths
    // Tone nodes can connect to native AudioNodes
    pitchShift.connect(dryGain)
    pitchShift.connect(reverbNode)
    reverbNode.connect(reverbGain)
    
    // Combine back
    dryGain.connect(masterGain)
    reverbGain.connect(masterGain)
    
    // Master to Analyser to Destination
    masterGain.connect(analyserNode)
    analyserNode.connect(audioContext.destination)

    startTime = audioContext.currentTime - offset / playbackRate.value
    sourceNode.start(0, offset)
    isPlaying.value = true
    
    updateProgress()
  }

  const pause = () => {
    if (!isPlaying.value) return
    sourceNode.stop()
    offset = (audioContext.currentTime - startTime) * playbackRate.value
    isPlaying.value = false
    cancelAnimationFrame(animationFrameId)
  }

  const stop = () => {
    if (sourceNode) {
      try { sourceNode.stop() } catch (e) {}
    }
    offset = 0
    currentTime.value = 0
    isPlaying.value = false
    cancelAnimationFrame(animationFrameId)
  }

  const updateProgress = () => {
    if (!isPlaying.value) return
    currentTime.value = (audioContext.currentTime - startTime) * playbackRate.value
    if (currentTime.value >= duration.value) {
      isPlaying.value = false
      offset = 0
      currentTime.value = 0
    } else {
      animationFrameId = requestAnimationFrame(updateProgress)
    }
  }

  // --- Watchers for real-time effects ---
  watch(playbackRate, (val) => {
    if (sourceNode) sourceNode.playbackRate.value = val
  })

  watch(bassGain, (val) => {
    if (bassNode) bassNode.gain.value = val
  })

  watch(reverbWet, (val) => {
    if (reverbGain && dryGain) {
      reverbGain.gain.value = val
      dryGain.gain.value = 1.0 - val
    }
  })

  watch(pitch, (val) => {
    if (pitchShift) pitchShift.pitch = val
  })

  watch(volume, (val) => {
    if (masterGain) masterGain.gain.value = val
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
    if (audioContext) audioContext.close()
  })

  return {
    initContext,
    loadAudio,
    play,
    pause,
    stop,
    playbackRate,
    reverbWet,
    bassGain,
    pitch,
    volume,
    isPlaying,
    currentTime,
    duration,
    getAnalyser: () => analyserNode
  }
}
