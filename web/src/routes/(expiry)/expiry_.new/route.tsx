import { createFileRoute } from "@tanstack/react-router";
import { CreateExpiryPage } from "./-page/CreateExpiryPage";

export const Route = createFileRoute("/(expiry)/expiry_/new")({
  component: CreateExpiryPage,
});
