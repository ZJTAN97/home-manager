import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ExpiryPage } from "./-page/ExpiryPage";

const searchSchema = z.object({
  modal: z.string().optional(),
});

export const Route = createFileRoute("/(expiry)/expiry")({
  validateSearch: (search) => searchSchema.parse(search),
  component: ExpiryPage,
});
