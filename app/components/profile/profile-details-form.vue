<template>
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
            :label="$t('profile.fullName', 'Full Name')"
            v-model="profileForm.full_name"
            :error="profileErrors.full_name"
            placeholder="John Doe"
          />
        </div>
        <div class="col-md-6">
          <BaseInput
            id="email"
            :label="$t('profile.email', 'Email Address')"
            v-model="profileForm.email"
            :error="profileErrors.email"
            disabled
          />
        </div>
        <div class="col-md-6">
          <BaseInput
            id="phone"
            :label="$t('profile.phone', 'Phone Number')"
            v-model="profileForm.phone"
            :error="profileErrors.phone"
            placeholder="+855 12 345 678"
          />
        </div>
        <div class="col-md-6">
          <BaseSelectOption
            id="gender"
            :label="$t('profile.gender', 'Gender')"
            :placeholder="$t('profile.selectGender', 'Select Gender')"
            v-model="profileForm.gender"
            :options="genderOptions"
            :error="profileErrors.gender"
          />
        </div>
        <div class="col-md-6">
          <BaseSelectDate
            id="dob"
            :label="$t('profile.dob', 'Date of Birth')"
            v-model="profileForm.dob"
            :error="profileErrors.dob"
          />
        </div>
        <div class="col-md-6">
          <BaseInput
            id="country"
            :label="$t('profile.country', 'Country')"
            v-model="profileForm.country"
            :error="profileErrors.country"
            placeholder="Cambodia"
          />
        </div>
        <div class="col-12">
          <BaseInput
            type="textarea"
            id="address"
            :label="$t('profile.address', 'Address')"
            v-model="profileForm.address"
            :error="profileErrors.address"
            placeholder="123 Street Name, City, Province"
            rows="3"
          />
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <BaseButton
          statusType="submit"
          variants="primary"
          size="md"
          class="px-4 py-2 rounded-pill fw-semibold text-xs"
          :isLoading="isSavingProfile"
        >
          <i class="bi bi-check2"></i>
          {{ $t("profile.saveChanges", "Save Changes") }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { useAppToast } from "~/composables/ui/useAppToast";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { getEditProfileSchema } from "~/composables/forms/auth";
import { getApiError } from "~/utils/apiError";
import BaseInput from "~/components/base/base-input.vue";
import BaseSelectDate from "~/components/base/base-select-date.vue";
import BaseSelectOption from "~/components/base/base-select-option.vue";
import BaseButton from "~/components/base/base-button.vue";

const authStore = useAuthStore();
const { showSuccess, showError } = useAppToast();
const { locale, t } = useI18n();

const genderOptions = computed(() => [
  { value: "Male", label: locale.value === "kh" ? "ប្រុស" : "Male" },
  { value: "Female", label: locale.value === "kh" ? "ស្រី" : "Female" },
  { value: "Other", label: locale.value === "kh" ? "ផ្សេងៗ" : "Other" },
]);

const originalEmail = ref("");
const isSavingProfile = ref(false);
const profileForm = reactive({
  full_name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  address: "",
  country: "",
});

const { handleSubmit: handleProfileSubmit, errors: profileErrors } = useForm({
  validationSchema: toTypedSchema(getEditProfileSchema(t)),
  initialValues: profileForm,
});

const { value: fullNameVal } = useField("full_name");
const { value: emailVal } = useField("email");
const { value: phoneVal } = useField("phone");
const { value: dobVal } = useField("dob");
const { value: addressVal } = useField("address");
const { value: countryVal } = useField("country");

watch(() => profileForm.full_name, (newVal) => { fullNameVal.value = newVal; });
watch(() => profileForm.email, (newVal) => { emailVal.value = newVal; });
watch(() => profileForm.phone, (newVal) => { phoneVal.value = newVal; });
watch(() => profileForm.dob, (newVal) => { dobVal.value = newVal; });
watch(() => profileForm.address, (newVal) => { addressVal.value = newVal; });
watch(() => profileForm.country, (newVal) => { countryVal.value = newVal; });

const populateProfileFields = () => {
  if (authStore.userProfile) {
    profileForm.full_name = authStore.userProfile.full_name || "";
    profileForm.email = authStore.userProfile.email || "";
    originalEmail.value = authStore.userProfile.email || "";
    profileForm.phone =
      authStore.userProfile.phone || authStore.userProfile.phone_number || "";
    profileForm.gender = authStore.userProfile.gender || "";
    profileForm.dob = authStore.userProfile.dob || "";
    profileForm.address = authStore.userProfile.address || "";
    profileForm.country = authStore.userProfile.country || "";
  }
};

onMounted(() => {
  populateProfileFields();
});

watch(
  () => authStore.userProfile,
  () => {
    populateProfileFields();
  },
  { immediate: true },
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
      country: profileForm.country || null,
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
</style>
