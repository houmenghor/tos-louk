import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isOpen = ref(false)

  // Initialize cart from localStorage (SSR-safe)
  const initCart = () => {
    if (process.client) {
      const saved = localStorage.getItem('tos_louk_cart')
      if (saved) {
        try {
          items.value = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse cart items', e)
        }
      }
    }
  }

  const saveCart = () => {
    if (process.client) {
      localStorage.setItem('tos_louk_cart', JSON.stringify(items.value))
    }
  }

  const cartCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartSubtotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const freeShippingThreshold = 150
  const isFreeShipping = computed(() => cartSubtotal.value >= freeShippingThreshold)
  
  const amountToFreeShipping = computed(() => {
    return Math.max(0, freeShippingThreshold - cartSubtotal.value)
  })
  
  const shippingProgress = computed(() => {
    return Math.min(100, (cartSubtotal.value / freeShippingThreshold) * 100)
  })

  const addToCart = (product, qty = 1) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: qty
      })
    }
    saveCart()
    // Open offcanvas to show the product is added!
    isOpen.value = true
  }

  const removeFromCart = (productId) => {
    items.value = items.value.filter(item => item.id !== productId)
    saveCart()
  }

  const updateQuantity = (productId, qty) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, qty)
      saveCart()
    }
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  const toggleCart = (value) => {
    isOpen.value = typeof value === 'boolean' ? value : !isOpen.value
  }

  return {
    items,
    isOpen,
    cartCount,
    cartSubtotal,
    freeShippingThreshold,
    isFreeShipping,
    amountToFreeShipping,
    shippingProgress,
    initCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart
  }
})
