import z from "zod";

export const choreSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  frequencyDays: z.number().int().min(1).max(365),
  lastDone: z.string().optional(),
  nextDue: z.string(),
});

export type ChoreResponse = z.infer<typeof choreSchema>;
