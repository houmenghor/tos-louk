export const useSettingStore = defineStore('setting', () => {
    const settings = ref(null);

    const getSettings = async () => {
        const response = await $fetch('/api/settings');
        settings.value = response.data;
    }

    return {
        settings,
        getSettings
    }
})