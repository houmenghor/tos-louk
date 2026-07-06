import z, { email } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

export const registerSchema = (isForcePassword = false) => {
  let passwordValidation = z.string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.");

  if (isForcePassword) {
    passwordValidation = passwordValidation
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[\W_]/, "Password must contain at least one special character.");
  }

  return z.object({
    full_name: z.string().min(1, "Full name is required."),
    email: z.string()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),
    password: passwordValidation,
    password_confirmation: z.string().min(1, "Please confirm your password.")
  }).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });
};

export const verifyOtpSchema = z.object({
  code: z.string()
    .min(1, "OTP code is required."),
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

export const resetPasswordSchema = (isForcePassword = false) => {
  let passwordValidation = z.string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.");

  if (isForcePassword) {
    passwordValidation = passwordValidation
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[\W_]/, "Password must contain at least one special character.");
  }

  return z.object({
    new_password: passwordValidation,
    confirm_password: z.string().min(1, "Please confirm your password.")
  }).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });
};
