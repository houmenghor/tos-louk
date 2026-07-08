import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref([])

  // Initialize wishlist from localStorage (SSR-safe)
  const initWishlist = () => {
    if (process.client) {
      const saved = localStorage.getItem('tos_louk_wishlist')
      if (saved) {
        try {
          items.value = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse wishlist items', e)
        }
      }
    }
  }

  const saveWishlist = () => {
    if (process.client) {
      localStorage.setItem('tos_louk_wishlist', JSON.stringify(items.value))
    }
  }

  const wishlistCount = computed(() => items.value.length)

  const isInWishlist = computed(() => (productId) => {
    return items.value.some(item => item.id === productId)
  })

  const toggleWishlist = (product) => {
    const existsIndex = items.value.findIndex(item => item.id === product.id)
    if (existsIndex > -1) {
      items.value.splice(existsIndex, 1)
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        oldPrice: product.oldPrice,
        rating: product.rating
      })
    }
    saveWishlist()
  }

  const removeFromWishlist = (productId) => {
    items.value = items.value.filter(item => item.id !== productId)
    saveWishlist()
  }

  const clearWishlist = () => {
    items.value = []
    saveWishlist()
  }

  return {
    items,
    wishlistCount,
    isInWishlist,
    initWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist
  }
})
