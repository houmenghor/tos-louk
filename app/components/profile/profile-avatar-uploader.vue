<template>
  <div class="settings-card p-4 rounded-4 border">
    <div class="row align-items-center g-4">
      <div class="col-sm-auto">
        <div
          class="avatar-uploader position-relative"
          :class="{ uploading: isUploadingAvatar }"
        >
          <BaseAvatar
            :src="authStore.userProfile?.userProfile?.profile_image || authStore.userProfile?.profile_image"
            :name="authStore.userProfile?.full_name || 'User'"
            :size="84"
            border-class="border border-3 border-surface shadow-sm"
          />
          <div
            class="uploader-overlay d-flex align-items-center justify-content-center rounded-circle"
            @click="triggerFileInput"
          >
            <span
              v-if="isUploadingAvatar"
              class="spinner-border spinner-border-sm text-light"
              role="status"
            ></span>
            <i v-else class="bi bi-camera text-light"></i>
          </div>
          <div class="d-none">
            <BaseInput
              type="file"
              id="fileInputRef"
              accept="image/*"
              @change="handleAvatarUpload"
            />
          </div>
        </div>
      </div>
      <div class="col-sm">
        <h5 class="fw-bold text-main mb-1 text-sm">Profile Photo</h5>
        <p class="text-secondary-custom text-xs mb-3">
          JPG, GIF or PNG. Max size of 2MB allowed.
        </p>
        <div class="d-flex gap-2">
          <BaseButton
            @click="triggerFileInput"
            variants="outline-primary"
            size="sm"
            class="rounded-pill px-3 py-1.5 fw-semibold text-xs transition-all"
          >
            Change Avatar
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { useAppToast } from "~/composables/ui/useAppToast";
import { getApiError } from "~/utils/apiError";
import BaseInput from "~/components/base/base-input.vue";
import BaseButton from "~/components/base/base-button.vue";
import BaseAvatar from "~/components/base/base-avatar.vue";

const authStore = useAuthStore();
const { showSuccess, showError } = useAppToast();
const { locale } = useI18n();

const isUploadingAvatar = ref(false);

const triggerFileInput = () => {
  const inputElement = document.getElementById("fileInputRef");
  if (inputElement) inputElement.click();
};

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showError(
      locale.value === "kh"
        ? "ទំហំរូបភាពមិនអាចលើសពី 2MB ឡើយ"
        : "Image size cannot exceed 2MB.",
    );
    return;
  }

  isUploadingAvatar.value = true;
  const formData = new FormData();
  formData.append("profile_image", file);

  try {
    await authStore.updateAvatar(formData);
    showSuccess(
      locale.value === "kh"
        ? "រូបភាពទម្រង់ត្រូវបានផ្លាស់ប្តូរ!"
        : "Avatar image uploaded successfully!",
    );
  } catch (error) {
    showError(
      getApiError(
        error,
        locale.value === "kh"
          ? "ការអាប់ឡូតបរាជ័យ!"
          : "Failed to upload profile image.",
      ),
    );
  } finally {
    isUploadingAvatar.value = false;
  }
};
</script>

<style scoped>
.settings-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

.text-main {
  color: var(--color-text);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
}

/* --------------------------------------------------------------------------
   Avatar Uploader Overlay
-------------------------------------------------------------------------- */
.avatar-uploader {
  cursor: pointer;
  width: 84px;
  height: 84px;
  border-radius: 50%;
}

.uploader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 84px;
  height: 84px;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s ease;
  backdrop-filter: blur(2px);
  border: 3px solid var(--color-surface);
}

.avatar-uploader:hover .uploader-overlay {
  opacity: 1;
}

.avatar-uploader.uploading .uploader-overlay {
  opacity: 1;
  pointer-events: none;
}
</style>
