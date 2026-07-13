import { ref, onMounted, onUnmounted, nextTick } from "vue";

/**
 * Composable for managing horizontal drag-to-scroll, arrow navigation,
 * and dynamic dot pagination for carousels and track elements.
 * Auto-imported by Nuxt 3 from composables/useCarouselScroll.js.
 */
export const useCarouselScroll = () => {
  const carouselTrack = ref(null);
  const isDown = ref(false);
  const startX = ref(0);
  const scrollLeftPos = ref(0);

  const activeIndex = ref(0);
  const totalDots = ref(0);

  // --- Mouse Drag Logic ---
  const startDrag = (e) => {
    if (!carouselTrack.value) return;
    isDown.value = true;
    carouselTrack.value.classList.add("active-drag");
    startX.value = e.pageX - carouselTrack.value.offsetLeft;
    scrollLeftPos.value = carouselTrack.value.scrollLeft;
  };

  const stopDrag = () => {
    if (!carouselTrack.value) return;
    isDown.value = false;
    carouselTrack.value.classList.remove("active-drag");
  };

  const onDrag = (e) => {
    if (!isDown.value || !carouselTrack.value) return;
    e.preventDefault();
    const x = e.pageX - carouselTrack.value.offsetLeft;
    const walk = (x - startX.value) * 1.5;
    carouselTrack.value.scrollLeft = scrollLeftPos.value - walk;
  };

  // --- Pagination Logic ---
  const calculateDots = () => {
    if (carouselTrack.value) {
      const track = carouselTrack.value;
      totalDots.value = Math.ceil(track.scrollWidth / track.clientWidth);
    }
  };

  const handleScroll = () => {
    if (carouselTrack.value) {
      const track = carouselTrack.value;
      activeIndex.value = Math.round(track.scrollLeft / track.clientWidth);
    }
  };

  const scrollToPage = (index) => {
    if (carouselTrack.value) {
      carouselTrack.value.scrollTo({
        left: index * carouselTrack.value.clientWidth,
        behavior: "smooth",
      });
    }
  };

  // --- Button Navigation ---
  const scrollNext = () => {
    if (carouselTrack.value) {
      carouselTrack.value.scrollBy({
        left: carouselTrack.value.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollPrev = () => {
    if (carouselTrack.value) {
      carouselTrack.value.scrollBy({
        left: -carouselTrack.value.clientWidth,
        behavior: "smooth",
      });
    }
  };

  onMounted(() => {
    nextTick(() => {
      calculateDots();
    });
    window.addEventListener("resize", calculateDots);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", calculateDots);
  });

  return {
    carouselTrack,
    isDown,
    activeIndex,
    totalDots,
    startDrag,
    stopDrag,
    onDrag,
    handleScroll,
    scrollToPage,
    scrollNext,
    scrollPrev,
    calculateDots
  };
};
