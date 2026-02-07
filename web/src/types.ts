import { z } from 'zod';

export const FoodItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  expiryDate: z.string(), // ISO string date
  category: z.enum(['Pantry', 'Fridge', 'Freezer', 'Other']),
  quantity: z.number().optional(),
  consumed: z.boolean().default(false),
});
export type FoodItem = z.infer<typeof FoodItemSchema>;

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
