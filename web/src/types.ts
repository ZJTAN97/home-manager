import { z } from "zod";

const isoDateString = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
    "Must be a valid ISO date string"
  );
const uuid = z.string().uuid();

export const InventoryItemSchema = z.object({
  id: uuid,
  name: z.string().min(1).max(100),
  expiryDate: isoDateString, // ISO string date
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
  dateOpened: isoDateString.optional(), // ISO string date
  shelfLifeMonths: z.number().int().min(1).max(120).optional(), // Months after opening
});
export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export const ChoreSchema = z.object({
  id: uuid,
  name: z.string().min(1).max(100),
  frequencyDays: z.number().int().min(1).max(365),
  lastDone: isoDateString.optional(), // ISO string date
  nextDue: isoDateString, // ISO string date
});
export type Chore = z.infer<typeof ChoreSchema>;

export const ApplianceSchema = z.object({
  id: uuid,
  name: z.string().min(1).max(100),
  maintenanceTask: z.string().min(1).max(200),
  frequencyDays: z.number().int().min(1).max(730),
  lastMaintained: isoDateString.optional(), // ISO string date
  nextDue: isoDateString, // ISO string date
});
export type Appliance = z.infer<typeof ApplianceSchema>;
