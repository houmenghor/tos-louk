import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./authStore";
import { useSettingStore } from "./settingStore";

export const useCartStore = defineStore("cart", () => {
  const items = ref([]);
  const isOpen = ref(false);
  const isInitialized = ref(false);

  // Initialize cart from localStorage (SSR-safe)
  const initCart = () => {
    if (process.client) {
      if (isInitialized.value) return;
      isInitialized.value = true;

      const saved = localStorage.getItem("tos_louk_cart");
      if (saved) {
        try {
          items.value = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse cart items", e);
        }
      }

      const authStore = useAuthStore();
      if (authStore.access_token) {
        const guestItems = items.value.filter((item) => !item.uuid);
        if (guestItems.length > 0) {
          syncCartWithDb();
        } else {
          fetchUserCart();
        }
      }
    }
  };

  const saveCart = () => {
    if (process.client) {
      localStorage.setItem("tos_louk_cart", JSON.stringify(items.value));
    }
  };

  const cartCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const cartSubtotal = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  });

  const freeShippingThreshold = computed(() => {
    const settingStore = useSettingStore();
    const threshold = settingStore.settings?.shipping?.free_shipping_threshold;
    return threshold ? Number(threshold) : 40;
  });

  const defaultShippingFee = computed(() => {
    const settingStore = useSettingStore();
    const fee = settingStore.settings?.shipping?.delivery_fee_phnom_penh;
    return fee !== undefined && fee !== null ? Number(fee) : 1.5;
  });

  const isFreeShipping = computed(
    () => cartSubtotal.value >= freeShippingThreshold.value,
  );

  const amountToFreeShipping = computed(() => {
    return Math.max(0, freeShippingThreshold.value - cartSubtotal.value);
  });

  const shippingProgress = computed(() => {
    return Math.min(100, (cartSubtotal.value / freeShippingThreshold.value) * 100);
  });

  const shippingCost = computed(() => {
    if (isFreeShipping.value || cartSubtotal.value === 0) return 0;
    return defaultShippingFee.value;
  });

  const cartTotal = computed(() => {
    return cartSubtotal.value + shippingCost.value;
  });

  const fetchUserCart = async () => {
    const authStore = useAuthStore();
    if (!authStore.access_token) return;

    const response = await $fetch("/api/carts");
    if (response && response.data) {
      items.value = (response.data.items || []).map((item) => {
        const product = item.product || {};
        return {
          id: product.id || item.product_id,
          title: product.title || product.name || "Product",
          name: product.title || product.name || "Product",
          price: product.sell_price || product.price || 0,
          image: product.thumbnail || product.image || "https://placehold.co/400x400/png?text=Product",
          thumbnail: product.thumbnail || product.image || "https://placehold.co/400x400/png?text=Product",
          category: product.category?.name || "",
          quantity: item.qty || item.quantity || 1,
          uuid: item.uuid,
        };
      });
      saveCart();
    }
  };

  let syncPromise = null;

  const syncCartWithDb = async () => {
    const authStore = useAuthStore();
    if (!authStore.access_token) return;

    if (syncPromise) {
      return syncPromise;
    }

    syncPromise = (async () => {
      try {
        const guestItems = items.value.filter((item) => !item.uuid);
        if (guestItems.length === 0) {
          await fetchUserCart();
          return;
        }

        const payload = guestItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        }));

        await $fetch("/api/carts/sync", {
          method: "POST",
          body: { items: payload },
        });

        items.value = [];
        saveCart();
        await fetchUserCart();
      } finally {
        syncPromise = null;
      }
    })();

    return syncPromise;
  };

  const addToCart = async (product, qty = 1, showToast = true) => {
    const authStore = useAuthStore();

    // Optimistic instant update for live data
    const existing = items.value.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.value.push({
        id: product.id,
        title: product.title || "Product",
        price: product.price || product.sell_price || 0,
        image: product.image || product.thumbnail || "https://placehold.co/400x400/png?text=Product",
        thumbnail: product.image || product.thumbnail || "https://placehold.co/400x400/png?text=Product",
        category: product.category?.name || product.category || "",
        quantity: qty,
      });
    }
    saveCart();
    isOpen.value = true;

    if (showToast && import.meta.client) {
      const { showSuccess } = useAppToast();
      const { locale } = useI18n();
      const msg =
        locale?.value === "kh"
          ? "បានបន្ថែមទៅក្នុងកន្ត្រកជោគជ័យ!"
          : "Added to cart successfully!";
      showSuccess(msg);
    }

    if (authStore.access_token) {
      await $fetch("/api/carts", {
        method: "POST",
        body: {
          product_id: product.id,
          qty: qty,
        },
      });
      await fetchUserCart();
    }
  };

  const removeFromCart = async (productId) => {
    const authStore = useAuthStore();
    const item = items.value.find((item) => item.id === productId);

    // Optimistic instant update for live data
    items.value = items.value.filter((item) => item.id !== productId);
    saveCart();

    if (authStore.access_token && item?.uuid) {
      await $fetch(`/api/carts/${item.uuid}`, {
        method: "DELETE",
      });
      await fetchUserCart();
    }
  };

  const updateQuantity = async (productId, qty) => {
    const authStore = useAuthStore();
    const item = items.value.find((item) => item.id === productId);
    if (!item) return;

    // Optimistic instant update for live data
    const newQty = Math.max(1, qty);
    item.quantity = newQty;
    saveCart();

    if (authStore.access_token && item?.uuid) {
      await $fetch(`/api/carts/${item.uuid}`, {
        method: "PATCH",
        body: { qty: newQty },
      });
      await fetchUserCart();
    }
  };

  const clearCart = () => {
    items.value = [];
    isInitialized.value = false;
    saveCart();
  };

  const toggleCart = (value) => {
    isOpen.value = typeof value === "boolean" ? value : !isOpen.value;
  };

  const checkoutOrder = async (payload) => {
    return await $fetch("/api/order/checkout", {
      method: "POST",
      body: payload,
    });
  };

  return {
    items,
    isOpen,
    cartCount,
    cartSubtotal,
    freeShippingThreshold,
    isFreeShipping,
    amountToFreeShipping,
    shippingProgress,
    shippingCost,
    cartTotal,
    initCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    fetchUserCart,
    syncCartWithDb,
    checkoutOrder,
  };
});

