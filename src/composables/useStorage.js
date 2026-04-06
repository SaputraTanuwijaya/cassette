import { ref, watch } from 'vue'

// --- IndexedDB Configuration ---
const DB_NAME = 'CassetteStudio'
const STORE_NAME = 'media_files'

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export function useStorage() {
  // --- Large File Storage (IndexedDB) ---
  const saveFile = async (id, file) => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      transaction.objectStore(STORE_NAME).put(file, id)
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  const getFile = async (id) => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const request = transaction.objectStore(STORE_NAME).get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  const removeFile = async (id) => {
    const db = await openDB()
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).delete(id)
  }

  // --- Metadata Storage (LocalStorage) ---
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
    usePersistedRef,
    saveFile,
    getFile,
    removeFile
  }
}
