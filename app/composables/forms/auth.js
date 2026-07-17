import z, { email } from "zod";

export const getLoginSchema = (t) => z.object({
  email: z
    .string()
    .min(1, t('validation.emailRequired', "Email is required."))
    .email(t('validation.emailInvalid', "Please enter a valid email address.")),
  password: z
    .string()
    .min(1, t('validation.passwordRequired', "Password is required."))
    .min(8, t('validation.passwordMin', "Password must be at least 8 characters.")),
});

export const getRegisterSchema = (t, isForcePassword = false) => {
  let passwordValidation = z
    .string()
    .min(1, t('validation.passwordRequired', "Password is required."))
    .min(8, t('validation.passwordMin', "Password must be at least 8 characters."));

  if (isForcePassword) {
    passwordValidation = passwordValidation
      .regex(/[A-Z]/, t('validation.passwordUppercase', "Password must contain at least one uppercase letter."))
      .regex(/[a-z]/, t('validation.passwordLowercase', "Password must contain at least one lowercase letter."))
      .regex(/[0-9]/, t('validation.passwordNumber', "Password must contain at least one number."))
      .regex(/[\W_]/, t('validation.passwordSpecial', "Password must contain at least one special character."));
  }

  return z
    .object({
      full_name: z.string().min(1, t('validation.nameRequired', "Full name is required.")),
      email: z
        .string()
        .min(1, t('validation.emailRequired', "Email is required."))
        .email(t('validation.emailInvalid', "Please enter a valid email address.")),
      password: passwordValidation,
      password_confirmation: z.string().min(1, t('validation.confirmPasswordRequired', "Please confirm your password.")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t('validation.passwordsMatch', "Passwords do not match."),
      path: ["password_confirmation"],
    });
};

export const getVerifyOtpSchema = (t) => z.object({
  code: z.string().min(1, t('validation.otpRequired', "OTP code is required.")),
});

export const getForgotPasswordSchema = (t) => z.object({
  email: z
    .string()
    .min(1, t('validation.emailRequired', "Email is required."))
    .email(t('validation.emailInvalid', "Please enter a valid email address.")),
});

export const getResetPasswordSchema = (t, isForcePassword = false) => {
  let passwordValidation = z
    .string()
    .min(1, t('validation.passwordRequired', "Password is required."))
    .min(8, t('validation.passwordMin', "Password must be at least 8 characters."));

  if (isForcePassword) {
    passwordValidation = passwordValidation
      .regex(/[A-Z]/, t('validation.passwordUppercase', "Password must contain at least one uppercase letter."))
      .regex(/[a-z]/, t('validation.passwordLowercase', "Password must contain at least one lowercase letter."))
      .regex(/[0-9]/, t('validation.passwordNumber', "Password must contain at least one number."))
      .regex(/[\W_]/, t('validation.passwordSpecial', "Password must contain at least one special character."));
  }

  return z
    .object({
      new_password: passwordValidation,
      confirm_password: z.string().min(1, t('validation.confirmPasswordRequired', "Please confirm your password.")),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t('validation.passwordsMatch', "Passwords do not match."),
      path: ["confirm_password"],
    });
};

export const getProfileSchema = (t) => z.object({
  full_name: z.string().min(1, t('validation.nameRequired', "Full name is required.")),
  phone: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  dob: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

export const getChangePasswordSchema = (t, isForcePassword = false) => {
  let passwordValidation = z
    .string()
    .min(1, t('validation.newPasswordRequired', "New password is required."))
    .min(8, t('validation.newPasswordMin', "New password must be at least 8 characters."));

  if (isForcePassword) {
    passwordValidation = passwordValidation
      .regex(/[A-Z]/, t('validation.passwordUppercase', "Password must contain at least one uppercase letter."))
      .regex(/[a-z]/, t('validation.passwordLowercase', "Password must contain at least one lowercase letter."))
      .regex(/[0-9]/, t('validation.passwordNumber', "Password must contain at least one number."))
      .regex(/[\W_]/, t('validation.passwordSpecial', "Password must contain at least one special character."));
  }

  return z
    .object({
      current_password: z.string().min(1, t('validation.currentPasswordRequired', "Current password is required.")),
      new_password: passwordValidation,
      confirm_password: z.string().min(1, t('validation.confirmNewPasswordRequired', "Please confirm your new password.")),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t('validation.newPasswordsMatch', "New passwords do not match."),
      path: ["confirm_password"],
    });
};
