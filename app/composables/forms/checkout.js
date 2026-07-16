import z from "zod";

export const checkoutSchema = z.object({
  customer_name: z
    .string()
    .min(1, "Full name is required."),
  customer_email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  customer_phone: z
    .string()
    .min(6, "Phone number is required and must be valid."),
  shipping_province: z
    .string()
    .min(1, "Please select your delivery province/city."),
  shipping_street: z
    .string()
    .min(5, "Please enter your full street address and house number."),
  delivery_method: z
    .string()
    .min(1, "Please select a delivery method."),
  payment_method: z
    .string()
    .min(1, "Please select a payment method."),
  shipping_latitude: z.number().nullable().optional(),
  shipping_longitude: z.number().nullable().optional(),
  notes: z
    .string()
    .nullable()
    .optional(),
});
