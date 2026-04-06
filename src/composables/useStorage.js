import { ref, watch } from 'vue'

export function useStorage() {
  const getItem = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return defaultValue
    }
  }

  const setItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded! Please delete some images in the Gallery.')
      }
      console.error(`Error writing ${key} to localStorage:`, error)
    }
  }

  const removeItem = (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  }

  // Reactive wrapper for a specific key
  const usePersistedRef = (key, defaultValue) => {
    const data = ref(getItem(key, defaultValue))

    watch(data, (newValue) => {
      setItem(key, newValue)
    }, { deep: true })

    return data
  }

  return {
    getItem,
    setItem,
    removeItem,
    usePersistedRef
  }
}
