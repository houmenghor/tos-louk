<template>
  <div class="profile-page py-5 min-vh-100 bg-body-custom">
    <div class="container max-w-container">
      <!-- Page Title & Header -->
      <div class="mb-5 text-center text-md-start">
        <h1 class="h3 fw-extrabold text-main mb-1">Account Settings</h1>
        <p class="text-secondary-custom text-sm mb-0">
          Manage your profile information, password, and display preferences.
        </p>
      </div>

      <div class="row g-4">
        <!-- Left Sidebar Navigation -->
        <div class="col-lg-3">
          <div class="d-flex flex-column gap-4">
            <!-- Profile mini widget -->
            <div
              class="user-sidebar-card p-3 rounded-4 border d-flex align-items-center gap-3"
            >
              <div class="avatar-wrapper-sm position-relative">
                <img
                  :src="profileImageSrc"
                  class="rounded-circle object-fit-cover border"
                  width="44"
                  height="44"
                  alt="Avatar"
                  referrerpolicy="no-referrer"
                  @error="handleAvatarError"
                />
              </div>
              <div class="overflow-hidden">
                <div class="fw-bold text-main text-truncate text-sm">
                  {{ authStore.userProfile?.full_name }}
                </div>
                <div class="text-secondary-custom text-xs text-truncate">
                  {{ authStore.userProfile?.email }}
                </div>
              </div>
            </div>

            <!-- Vertical Menu Links -->
            <nav class="d-flex flex-column gap-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="settings-nav-link btn d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-start transition-all"
                :class="{ active: activeTab === tab.id }"
              >
                <i :class="[tab.icon, 'fs-5']"></i>
                <span class="fw-semibold text-sm">{{ $t(tab.labelKey) }}</span>
              </button>

              <hr class="border-custom-glass my-3" />

              <!-- Logout Button in Sidebar -->
              <button
                @click="handleLogout"
                class="btn btn-logout-sidebar rounded-3 py-2 px-3 fw-semibold text-xs d-flex align-items-center gap-2 transition-all"
              >
                <i class="bi bi-box-arrow-right"></i>
                {{ $t("profile.logout") }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Right Content Panels -->
        <div class="col-lg-9">
          <transition name="fade-slide" mode="out-in">
            <!-- Tab 1: Personal Info -->
            <div
              v-if="activeTab === 'personal'"
              key="personal"
              class="d-flex flex-column gap-4"
            >
              <!-- Avatar Upload Box -->
              <div class="settings-card p-4 rounded-4 border">
                <div class="row align-items-center g-4">
                  <div class="col-sm-auto">
                    <div
                      class="avatar-uploader position-relative"
                      :class="{ uploading: isUploadingAvatar }"
                    >
                      <img
                        :src="profileImageSrc"
                        class="rounded-circle object-fit-cover border border-3 border-surface"
                        width="84"
                        height="84"
                        alt="Avatar"
                        referrerpolicy="no-referrer"
                        @error="handleAvatarError"
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
                      <input
                        type="file"
                        ref="fileInputRef"
                        class="d-none"
                        accept="image/*"
                        @change="handleAvatarUpload"
                      />
                    </div>
                  </div>
                  <div class="col-sm">
                    <h5 class="fw-bold text-main mb-1 text-sm">
                      Profile Photo
                    </h5>
                    <p class="text-secondary-custom text-xs mb-3">
                      JPG, GIF or PNG. Max size of 2MB allowed.
                    </p>
                    <div class="d-flex gap-2">
                      <button
                        @click="triggerFileInput"
                        class="btn btn-outline-custom btn-sm rounded-pill px-3 py-1.5 fw-semibold text-xs transition-all"
                      >
                        Change Avatar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- General Info Form -->
              <div class="settings-card p-4 p-md-5 rounded-4 border">
                <h5 class="fw-bold text-main mb-1 text-sm">Personal Details</h5>
                <p class="text-secondary-custom text-xs mb-4">
                  Provide details for updates across community listings.
                </p>

                <form @submit.prevent="submitProfile">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <BaseInput
                        id="fullName"
                        :label="$t('profile.fullName')"
                        v-model="profileForm.full_name"
                        :error="profileErrors.full_name"
                        placeholder="John Doe"
                      />
                    </div>
                    <div class="col-md-6">
                      <BaseInput
                        id="email"
                        :label="$t('profile.email')"
                        v-model="profileForm.email"
                        disabled
                      />
                    </div>
                    <div class="col-md-6">
                      <BaseInput
                        id="phone"
                        :label="$t('profile.phone')"
                        v-model="profileForm.phone"
                        :error="profileErrors.phone"
                        placeholder="+855 12 345 678"
                      />
                    </div>
                    <div class="col-md-6">
                      <BaseSelectOption
                        id="gender"
                        :label="$t('profile.gender')"
                        :placeholder="$t('profile.selectGender')"
                        v-model="profileForm.gender"
                        :options="genderOptions"
                        :error="profileErrors.gender"
                      />
                    </div>
                    <div class="col-md-6">
                      <BaseSelectDate
                        id="dob"
                        :label="$t('profile.dob')"
                        v-model="profileForm.dob"
                        :error="profileErrors.dob"
                      />
                    </div>
                    <div class="col-12">
                      <div class="mb-3">
                        <label for="address" class="form-label">{{
                          $t("profile.address")
                        }}</label>
                        <textarea
                          id="address"
                          rows="3"
                          v-model="profileForm.address"
                          class="form-control custom-textarea"
                          :placeholder="$t('profile.address')"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end mt-4">
                    <button
                      type="submit"
                      class="btn btn-primary-custom px-4 py-2 rounded-pill fw-semibold text-xs d-flex align-items-center gap-2"
                      :disabled="isSavingProfile"
                    >
                      <span
                        v-if="isSavingProfile"
                        class="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                      <i v-else class="bi bi-check2"></i>
                      {{
                        isSavingProfile
                          ? $t("profile.saving")
                          : $t("profile.saveChanges")
                      }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Tab 2: Security & Password -->
            <div
              v-else-if="activeTab === 'security'"
              key="security"
              class="d-flex flex-column gap-4"
            >
              <div class="settings-card p-4 p-md-5 rounded-4 border">
                <h5 class="fw-bold text-main mb-1 text-sm">Update Password</h5>
                <p class="text-secondary-custom text-xs mb-4">
                  Ensure your account is using a long, random password to stay
                  secure.
                </p>

                <form @submit.prevent="submitPassword">
                  <div class="row g-3">
                    <div class="col-12">
                      <BaseInputPassword
                        id="currentPassword"
                        :label="$t('profile.currentPassword')"
                        v-model="passwordForm.current_password"
                        :error="passwordErrors.current_password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div class="col-md-6">
                      <BaseInputPassword
                        id="newPassword"
                        :label="$t('profile.newPassword')"
                        v-model="passwordForm.new_password"
                        :error="passwordErrors.new_password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div class="col-md-6">
                      <BaseInputPassword
                        id="confirmPassword"
                        :label="$t('profile.confirmPassword')"
                        v-model="passwordForm.confirm_password"
                        :error="passwordErrors.confirm_password"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div class="d-flex justify-content-end mt-4">
                    <button
                      type="submit"
                      class="btn btn-primary-custom px-4 py-2 rounded-pill fw-semibold text-xs d-flex align-items-center gap-2"
                      :disabled="isUpdatingPassword"
                    >
                      <span
                        v-if="isUpdatingPassword"
                        class="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                      <i v-else class="bi bi-shield-lock"></i>
                      {{
                        isUpdatingPassword
                          ? $t("profile.updating")
                          : $t("profile.updatePassword")
                      }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Tab 3: Order History -->
            <div
              v-else-if="activeTab === 'orders'"
              key="orders"
              class="d-flex flex-column gap-4"
            >
              <div class="settings-card p-4 rounded-4 border">
                <h5 class="fw-bold text-main mb-1 text-sm">Order History</h5>
                <p class="text-secondary-custom text-xs mb-4">
                  Check status, track items, or request details for all recent
                  transactions.
                </p>

                <div v-if="orders.length > 0" class="d-flex flex-column gap-3">
                  <div
                    v-for="order in orders"
                    :key="order.id"
                    class="order-row p-3 rounded-4 border d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 transition-all"
                  >
                    <div class="d-flex align-items-center gap-3">
                      <div
                        class="order-icon-badge d-flex align-items-center justify-content-center rounded-3 bg-body-custom"
                        style="width: 40px; height: 40px"
                      >
                        <i class="bi bi-box-seam text-secondary-custom"></i>
                      </div>
                      <div>
                        <div class="fw-bold text-main text-sm">
                          {{ order.id }}
                        </div>
                        <div class="text-secondary-custom text-xs">
                          {{ formatDate(order.date) }}
                        </div>
                      </div>
                    </div>
                    <div
                      class="d-flex align-items-center justify-content-between justify-content-md-end gap-4 w-100-mobile"
                    >
                      <div>
                        <div class="text-muted text-xxs text-md-end">
                          Amount
                        </div>
                        <div class="fw-bold text-primary-brand text-sm">
                          {{ order.total }}
                        </div>
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <span
                          :class="[
                            'badge rounded-pill px-3 py-1 fw-semibold text-uppercase text-xxs',
                            getStatusBadgeClass(order.status),
                          ]"
                        >
                          {{ order.status }}
                        </span>
                        <button
                          class="btn btn-arrow-circle d-flex align-items-center justify-content-center rounded-circle transition-all"
                        >
                          <i class="bi bi-arrow-right-short"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-5">
                  <i class="bi bi-inbox text-muted display-4"></i>
                  <h6 class="fw-bold text-main mt-3">No orders found</h6>
                  <p class="text-secondary-custom text-xs">
                    Once you checkout your items will display here.
                  </p>
                </div>
              </div>
            </div>

            <!-- Tab 4: App Settings -->
            <div
              v-else-if="activeTab === 'settings'"
              key="settings"
              class="d-flex flex-column gap-4"
            >
              <!-- Visual Theme Preferences Card -->
              <div class="settings-card p-4 p-md-5 rounded-4 border">
                <h5 class="fw-bold text-main mb-1 text-sm">
                  Interface Appearance
                </h5>
                <p class="text-secondary-custom text-xs mb-4">
                  Choose how you want the Tos Louk dashboard layout to display
                  in your browser.
                </p>

                <div class="row g-3">
                  <!-- Light theme option block -->
                  <div class="col-6 col-sm-4">
                    <div
                      class="theme-block p-3 rounded-4 border text-center cursor-pointer transition-all"
                      :class="{ 'selected-theme': colorMode.value === 'light' }"
                      @click="setThemeMode('light')"
                    >
                      <div
                        class="theme-preview-box light-preview rounded-3 mb-2 border"
                      >
                        <div class="preview-line-1"></div>
                        <div class="preview-line-2"></div>
                      </div>
                      <div class="fw-semibold text-main text-xs">
                        Light Mode
                      </div>
                    </div>
                  </div>

                  <!-- Dark theme option block -->
                  <div class="col-6 col-sm-4">
                    <div
                      class="theme-block p-3 rounded-4 border text-center cursor-pointer transition-all"
                      :class="{ 'selected-theme': colorMode.value === 'dark' }"
                      @click="setThemeMode('dark')"
                    >
                      <div
                        class="theme-preview-box dark-preview rounded-3 mb-2 border"
                      >
                        <div class="preview-line-1"></div>
                        <div class="preview-line-2"></div>
                      </div>
                      <div class="fw-semibold text-main text-xs">Dark Mode</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Language Settings Card -->
              <div class="settings-card p-4 rounded-4 border">
                <h5 class="fw-bold text-main mb-1 text-sm">
                  Language Preferences
                </h5>
                <p class="text-secondary-custom text-xs mb-4">
                  Select your default translation language for buttons, labels,
                  and notices.
                </p>

                <div class="max-w-xs">
                  <select
                    class="form-select custom-select-box px-3 py-2 fw-semibold text-xs"
                    :value="locale"
                    @change="onLanguageChange($event)"
                  >
                    <option value="kh">ភាសាខ្មែរ (Khmer)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { useWishlistStore } from "~/stores/wishlistStore";
import { useCartStore } from "~/stores/cartStore";
import { useAppToast } from "~/composables/ui/useAppToast";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { profileSchema, changePasswordSchema } from "~/composables/forms/auth";
import { getApiError } from "~/utils/apiError";
import BaseInput from "~/components/base/base-input.vue";
import BaseInputPassword from "~/components/base/base-input-password.vue";
import BaseSelectDate from "~/components/base/base-select-date.vue";
import BaseSelectOption from "~/components/base/base-select-option.vue";

const defaultAvatar =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a1a1aa"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-1-5.48-2.58C7.64 15.84 10 15 12 15s4.36.84 5.48 2.42C16.43 19 14.03 20 12 20z"/></svg>';

// Page Metadata
definePageMeta({
  layout: "default",
});

const authStore = useAuthStore();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const { showSuccess, showError } = useAppToast();
const colorMode = useColorMode();
const { locale, setLocale } = useI18n();

// Tab Structure
const tabs = [
  { id: "personal", labelKey: "profile.personalInfo", icon: "bi bi-person" },
  { id: "security", labelKey: "profile.security", icon: "bi bi-shield-lock" },
  { id: "orders", labelKey: "profile.orderHistory", icon: "bi bi-receipt" },
  { id: "settings", labelKey: "profile.settings", icon: "bi bi-sliders" },
];

const activeTab = ref("personal");

const genderOptions = computed(() => [
  { value: "Male", label: locale.value === "kh" ? "ប្រុស" : "Male" },
  { value: "Female", label: locale.value === "kh" ? "ស្រី" : "Female" },
  { value: "Other", label: locale.value === "kh" ? "ផ្សេងៗ" : "Other" },
]);

// Fetch user dynamic data on client mounting
onMounted(async () => {
  if (process.client) {
    wishlistStore.initWishlist();
    cartStore.initCart();

    // Auto-fill profile fields
    if (authStore.userProfile) {
      profileForm.full_name = authStore.userProfile.full_name || "";
      profileForm.email = authStore.userProfile.email || "";
      profileForm.phone =
        authStore.userProfile.phone || authStore.userProfile.phone_number || "";
      profileForm.gender = authStore.userProfile.gender || "";
      profileForm.dob = authStore.userProfile.dob || "";
      profileForm.address = authStore.userProfile.address || "";
    }
  }
});

// Member since calculation formatted nicely
const memberSinceDate = computed(() => {
  if (!authStore.userProfile?.created_at) return "July 2026";
  const date = new Date(authStore.userProfile.created_at);
  return date.toLocaleDateString(locale.value === "kh" ? "km-KH" : "en-US", {
    year: "numeric",
    month: "long",
  });
});

// Avatar Source Computed
const profileImageSrc = computed(() => {
  const avatar =
    authStore.userProfile?.userProfile?.profile_image ||
    authStore.userProfile?.profile_image;
  if (!avatar) return defaultAvatar;

  if (avatar.startsWith("http")) return avatar;
  return `${useRuntimeConfig().public.apiBase.replace("/api/v1", "")}/storage/${avatar}`;
});

const handleAvatarError = (event) => {
  event.target.src = defaultAvatar;
};

// Form 1: Personal Information Validation
const isSavingProfile = ref(false);
const profileForm = reactive({
  full_name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  address: "",
});

const { handleSubmit: handleProfileSubmit, errors: profileErrors } = useForm({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: profileForm,
});

// Bind fields inside Vee-validate schema tracking
const { value: fullNameVal } = useField("full_name");
const { value: phoneVal } = useField("phone");
const { value: dobVal } = useField("dob");

// Keep VeeValidate fields synced with the reactive form
watch(
  () => profileForm.full_name,
  (newVal) => {
    fullNameVal.value = newVal;
  },
);
watch(
  () => profileForm.phone,
  (newVal) => {
    phoneVal.value = newVal;
  },
);
watch(
  () => profileForm.dob,
  (newVal) => {
    dobVal.value = newVal;
  },
);

const submitProfile = handleProfileSubmit(async () => {
  isSavingProfile.value = true;
  try {
    const payload = {
      full_name: profileForm.full_name,
      phone: profileForm.phone || null,
      gender: profileForm.gender || null,
      dob: profileForm.dob || null,
      address: profileForm.address || null,
    };
    await authStore.updateProfile(payload);
    showSuccess(
      locale.value === "kh"
        ? "រក្សាទុកព័ត៌មានផ្ទាល់ខ្លួនដោយជោគជ័យ!"
        : "Profile details updated successfully!",
    );
  } catch (error) {
    showError(
      getApiError(
        error,
        locale.value === "kh"
          ? "ការរក្សាទុកបរាជ័យ!"
          : "Failed to update profile details.",
      ),
    );
  } finally {
    isSavingProfile.value = false;
  }
});

// Form 2: Password Update Validation
const isUpdatingPassword = ref(false);
const passwordForm = reactive({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

const {
  handleSubmit: handlePasswordSubmit,
  errors: passwordErrors,
  resetForm: resetPassForm,
} = useForm({
  validationSchema: toTypedSchema(changePasswordSchema(false)),
  initialValues: passwordForm,
});

const { value: currentPassVal } = useField("current_password");
const { value: newPassVal } = useField("new_password");
const { value: confirmPassVal } = useField("confirm_password");

watch(
  () => passwordForm.current_password,
  (val) => {
    currentPassVal.value = val;
  },
);
watch(
  () => passwordForm.new_password,
  (val) => {
    newPassVal.value = val;
  },
);
watch(
  () => passwordForm.confirm_password,
  (val) => {
    confirmPassVal.value = val;
  },
);

const submitPassword = handlePasswordSubmit(async () => {
  isUpdatingPassword.value = true;
  try {
    const payload = {
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
      new_password_confirmation: passwordForm.confirm_password,
    };
    await authStore.changePassword(payload);
    showSuccess(
      locale.value === "kh"
        ? "ផ្លាស់ប្តូរលេខសម្ងាត់ជោគជ័យ!"
        : "Password updated successfully!",
    );

    passwordForm.current_password = "";
    passwordForm.new_password = "";
    passwordForm.confirm_password = "";
    resetPassForm();
  } catch (error) {
    showError(
      getApiError(
        error,
        locale.value === "kh"
          ? "ការផ្លាស់ប្តូរលេខសម្ងាត់បរាជ័យ!"
          : "Failed to update password. Please check your inputs.",
      ),
    );
  } finally {
    isUpdatingPassword.value = false;
  }
});

// Avatar uploading process
const isUploadingAvatar = ref(false);
const fileInputRef = ref(null);

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
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

// Theme Toggling
const setThemeMode = (mode) => {
  colorMode.preference = mode;
};

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

// Language Switching
const onLanguageChange = (event) => {
  setLocale(event.target.value);
};

// Logout handling
const handleLogout = async () => {
  try {
    await authStore.logout();
    showSuccess(
      locale.value === "kh"
        ? "អ្នកបានចាកចេញដោយជោគជ័យ!"
        : "Logged out successfully!",
    );
  } catch (e) {
    showError("Logout failed.");
  }
};

// Orders Mock Data
const orders = ref([
  {
    id: "ORD-98231",
    date: "2026-07-01",
    total: "$189.00",
    status: "Delivered",
  },
  { id: "ORD-84510", date: "2026-06-25", total: "$45.00", status: "Shipped" },
  {
    id: "ORD-73129",
    date: "2026-06-18",
    total: "$120.00",
    status: "Cancelled",
  },
]);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale.value === "kh" ? "km-KH" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-success-light text-success";
    case "Shipped":
      return "bg-warning-light text-warning";
    case "Cancelled":
      return "bg-danger-light text-danger";
    default:
      return "bg-secondary-light text-secondary-custom";
  }
};
</script>

<style scoped>
.profile-page {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-main);
}

.bg-body-custom {
  background-color: var(--color-bg);
}

/* --------------------------------------------------------------------------
   Container Limit (Standard SaaS Page Size)
-------------------------------------------------------------------------- */
.max-w-container {
  max-width: 1040px;
}

/* --------------------------------------------------------------------------
   Left Sidebar Navigation
-------------------------------------------------------------------------- */
.user-sidebar-card {
  background-color: var(--color-surface);
  border-color: var(--color-border) !important;
}

.settings-nav-link {
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: all 0.2s ease;
}

.settings-nav-link:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
}

.settings-nav-link.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.btn-logout-sidebar {
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--color-danger);
  background: transparent;
}

.btn-logout-sidebar:hover {
  background-color: rgba(239, 68, 68, 0.08);
  border-color: var(--color-danger);
}

.border-custom-glass {
  border-color: var(--color-border) !important;
}

/* --------------------------------------------------------------------------
   Settings Cards & Forms (Professional Standard Box Layout)
-------------------------------------------------------------------------- */
.settings-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

/* Form layouts */
.form-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.custom-select-box {
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.custom-select-box:focus {
  outline: none;
  background-color: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.custom-textarea {
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.custom-textarea:focus {
  outline: none;
  background-color: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

/* Buttons */
.btn-primary-custom {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 220, 130, 0.15);
}

.btn-primary-custom:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(0, 220, 130, 0.25);
  transform: translateY(-1px);
}

.btn-primary-custom:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-outline-custom {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-outline-custom:hover {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-text-secondary);
}

/* --------------------------------------------------------------------------
   Avatar Uploader Overlay
-------------------------------------------------------------------------- */
.avatar-uploader {
  cursor: pointer;
}

.avatar-uploader img {
  border-color: var(--color-border) !important;
  background-color: var(--color-surface);
  transition: opacity 0.2s ease;
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

/* --------------------------------------------------------------------------
   Order Row Layout
-------------------------------------------------------------------------- */
.order-row {
  background-color: var(--color-surface);
  border-color: var(--color-border) !important;
}

.order-row:hover {
  border-color: var(--color-primary) !important;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.order-icon-badge {
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}

.btn-arrow-circle {
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
}

.order-row:hover .btn-arrow-circle {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

@media (max-width: 767.98px) {
  .w-100-mobile {
    width: 100%;
  }
}

/* --------------------------------------------------------------------------
   Display Settings Theme Blocks
-------------------------------------------------------------------------- */
.theme-block {
  background-color: var(--color-surface);
  border-color: var(--color-border) !important;
}

.theme-block:hover {
  border-color: var(--color-text-secondary) !important;
}

.theme-block.selected-theme {
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.theme-preview-box {
  height: 64px;
  position: relative;
  overflow: hidden;
  padding: 10px;
}

.light-preview {
  background-color: #f8fafc;
}

.light-preview .preview-line-1 {
  width: 70%;
  height: 6px;
  background-color: #cbd5e1;
  border-radius: 3px;
  margin-bottom: 6px;
}

.light-preview .preview-line-2 {
  width: 45%;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
}

.dark-preview {
  background-color: #0f172a;
}

.dark-preview .preview-line-1 {
  width: 70%;
  height: 6px;
  background-color: #334155;
  border-radius: 3px;
  margin-bottom: 6px;
}

.dark-preview .preview-line-2 {
  width: 45%;
  height: 6px;
  background-color: #1e293b;
  border-radius: 3px;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.max-w-xs {
  max-width: 250px;
}

.text-xxs {
  font-size: 10px;
}

.text-xs {
  font-size: 12px;
}

.text-sm {
  font-size: 14px;
}

.bg-success-light {
  background-color: rgba(34, 197, 94, 0.08);
}

.bg-warning-light {
  background-color: rgba(245, 158, 11, 0.08);
}

.bg-danger-light {
  background-color: rgba(239, 68, 68, 0.08);
}

.bg-primary-light {
  background-color: var(--color-primary-light);
}

.bg-secondary-light {
  background-color: rgba(107, 114, 128, 0.05);
}

.text-primary-custom {
  color: var(--color-primary);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
