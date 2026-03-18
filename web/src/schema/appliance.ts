import z from "zod";

export const applianceSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  maintenanceTask: z.string().min(1).max(200),
  frequencyDays: z.number().int().min(1).max(730),
  lastMaintained: z.string().optional(), // ISO string date
  nextDue: z.string(), // ISO string date
});
export type ApplianceResponse = z.infer<typeof applianceSchema>;
