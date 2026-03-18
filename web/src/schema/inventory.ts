import z from "zod";

export const inventorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  expiryDate: z.string(),
  category: z.enum([
    "Pantry",
    "Fridge",
    "Freezer",
    "Skin Care",
    "Makeup",
    "Other",
  ]),
  quantity: z.number().int().min(0).max(9999).optional(),
  consumed: z.boolean().default(false),
  image: z.string().max(5_000_000).optional(), // Base64 or URL
  dateOpened: z.string().optional(), // ISO string date
  shelfLifeMonths: z.number().int().min(1).max(120).optional(), // Months after opening
});

export const inventoryCreateSchema = inventorySchema
  .omit({
    id: true,
    consumed: true,
    expiryDate: true,
    image: true,
    dateOpened: true,
    shelfLifeMonths: true,
  })
  .extend({
    expiryDate: z.string(),
    dateOpened: z.string().optional(),
    shelfLifeMonths: z.number().int().min(1).max(120).optional(),
  });

export type InventoryResponse = z.infer<typeof inventorySchema>;
export type InventoryCreateRequest = z.infer<typeof inventoryCreateSchema>;
