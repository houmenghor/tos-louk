import z from "zod";

export const getCheckoutSchema = (t) => z.object({
  customer_name: z
    .string()
    .min(1, t('validation.nameRequired', "Full name is required.")),
  customer_email: z
    .string()
    .min(1, t('validation.emailRequired', "Email is required."))
    .email(t('validation.emailInvalid', "Please enter a valid email address.")),
  customer_phone: z
    .string()
    .min(6, t('validation.phoneRequired', "Phone number is required and must be valid.")),
  shipping_province: z
    .string()
    .min(1, t('validation.provinceRequired', "Please select your delivery province/city.")),
  shipping_street: z
    .string()
    .min(5, t('validation.streetRequired', "Please enter your full street address and house number.")),
  delivery_method: z
    .string()
    .min(1, t('validation.deliveryMethodRequired', "Please select a delivery method.")),
  payment_method: z
    .string()
    .min(1, t('validation.paymentMethodRequired', "Please select a payment method.")),
  shipping_latitude: z.number().nullable().optional(),
  shipping_longitude: z.number().nullable().optional(),
  notes: z
    .string()
    .nullable()
    .optional(),
});
