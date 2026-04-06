/**
 * Resizes and compresses an image base64 string using Canvas.
 * @param {string} base64Str - The original base64 string.
 * @param {number} maxWidth - Max width of the output image.
 * @param {number} maxHeight - Max height of the output image.
 * @returns {Promise<string>} - The compressed base64 string.
 */
export async function compressImage(base64Str, maxWidth = 800, maxHeight = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = base64Str
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      // Quality 0.7 to save significant space
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = (error) => reject(error)
  })
}
