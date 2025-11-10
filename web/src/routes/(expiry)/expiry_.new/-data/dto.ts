import { z } from "zod";

export const createExpiryItemSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  expiryDate: z
    .string()
    .refine((dateStr) => !Number.isNaN(new Date(dateStr).getTime()), {
      message: "Invalid date format",
    }),
});

export const expiryItemResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  expiryDate: z.string(),
});

export type ExpiryItemResponseType = z.infer<typeof expiryItemResponseSchema>;
