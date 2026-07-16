import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./authStore";

export const useWishlistStore = defineStore("wishlist", () => {
  const items = ref([]);

  // Initialize wishlist from localStorage (SSR-safe)
  const initWishlist = () => {
    if (process.client) {
      const saved = localStorage.getItem("tos_louk_wishlist");
      if (saved) {
        try {
          items.value = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse wishlist items", e);
        }
      }

      const authStore = useAuthStore();
      if (authStore.access_token) {
        if (items.value.length > 0) {
          syncWishlistWithDb();
        } else {
          fetchUserWishlist();
        }
      }
    }
  };

  const saveWishlist = () => {
    if (process.client) {
      localStorage.setItem("tos_louk_wishlist", JSON.stringify(items.value));
    }
  };

  const wishlistCount = computed(() => items.value.length);

  const isInWishlist = computed(() => (productId) => {
    return items.value.some((item) => item.id === productId);
  });

  const fetchUserWishlist = async () => {
    const authStore = useAuthStore();
    if (!authStore.access_token) return;

    const response = await $fetch("/api/wishlists");
    if (response && response.data) {
      const wishlist = response.data[0];
      if (wishlist && wishlist.items) {
        items.value = wishlist.items.map(item => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.sell_price,
          image: item.product.thumbnail || "https://placehold.co/400x400/png?text=Product",
          category: item.product.category?.name || "",
          oldPrice: item.product.oldPrice,
          rating: item.product.rating,
          uuid: item.uuid,
        }));
      } else {
        items.value = [];
      }
      saveWishlist();
    }
  };

  let syncPromise = null;

  const syncWishlistWithDb = async () => {
    const authStore = useAuthStore();
    if (!authStore.access_token) return;

    if (syncPromise) {
      return syncPromise;
    }

    syncPromise = (async () => {
      try {
        if (items.value.length === 0) {
          await fetchUserWishlist();
          return;
        }

        const productIds = items.value.map(item => item.id);
        await $fetch("/api/wishlists/sync", {
          method: "POST",
          body: { product_ids: productIds }
        });

        items.value = [];
        saveWishlist();
        await fetchUserWishlist();
      } finally {
        syncPromise = null;
      }
    })();

    return syncPromise;
  };

  const toggleWishlist = async (product) => {
    const authStore = useAuthStore();
    const exists = isInWishlist.value(product.id);

    if (authStore.access_token) {
      if (exists) {
        const item = items.value.find(item => item.id === product.id);
        if (item?.uuid) {
          await $fetch(`/api/wishlists/${item.uuid}`, {
            method: "DELETE"
          });
        }
      } else {
        await $fetch("/api/wishlists", {
          method: "POST",
          body: { product_id: product.id }
        });
      }
      await fetchUserWishlist();
    } else {
      const existsIndex = items.value.findIndex((item) => item.id === product.id);
      if (existsIndex > -1) {
        items.value.splice(existsIndex, 1);
      } else {
        items.value.push({
          id: product.id,
          title: product.title,
          price: product.price || product.sell_price,
          image: product.image || product.thumbnail,
          category: product.category?.name || product.category || "",
          oldPrice: product.oldPrice,
          rating: product.rating,
        });
      }
      saveWishlist();
    }
  };

  const removeFromWishlist = async (productId) => {
    const authStore = useAuthStore();
    const item = items.value.find((item) => item.id === productId);

    if (authStore.access_token && item?.uuid) {
      await $fetch(`/api/wishlists/${item.uuid}`, {
        method: "DELETE"
      });
      await fetchUserWishlist();
    } else {
      items.value = items.value.filter((item) => item.id !== productId);
      saveWishlist();
    }
  };

  const clearWishlist = () => {
    items.value = [];
    saveWishlist();
  };

  return {
    items,
    wishlistCount,
    isInWishlist,
    initWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    fetchUserWishlist,
    syncWishlistWithDb,
  };
});

