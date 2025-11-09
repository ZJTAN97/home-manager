import { createFileRoute } from "@tanstack/react-router";
import { ExpiryPage } from "./-page/ExpiryPage";

export const Route = createFileRoute("/(expiry)/expiry")({
  component: ExpiryPage,
});
