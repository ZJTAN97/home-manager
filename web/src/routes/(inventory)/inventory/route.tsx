import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { InventoryPage } from "./-page/InventoryPage";

const searchSchema = z.object({
  modal: z.string().optional(),
});

export const Route = createFileRoute("/(inventory)/inventory")({
  validateSearch: (search) => searchSchema.parse(search),
  component: InventoryPage,
});
