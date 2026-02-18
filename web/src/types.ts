import { z } from 'zod';

export const ExpiryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  expiryDate: z.string(), // ISO string date
  category: z.enum(['Pantry', 'Fridge', 'Freezer', 'Skin Care', 'Makeup', 'Other']),
  quantity: z.number().optional(),
  consumed: z.boolean().default(false),
  image: z.string().optional(), // Base64 or URL
  dateOpened: z.string().optional(), // ISO string date
  shelfLifeMonths: z.number().optional(), // Months after opening
});
export type ExpiryItem = z.infer<typeof ExpiryItemSchema>;

export const ChoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  frequencyDays: z.number(),
  lastDone: z.string().optional(), // ISO string date
  nextDue: z.string(), // ISO string date
});
export type Chore = z.infer<typeof ChoreSchema>;

export const ApplianceSchema = z.object({
  id: z.string(),
  name: z.string(),
  maintenanceTask: z.string(),
  frequencyDays: z.number(),
  lastMaintained: z.string().optional(), // ISO string date
  nextDue: z.string(), // ISO string date
});
export type Appliance = z.infer<typeof ApplianceSchema>;
