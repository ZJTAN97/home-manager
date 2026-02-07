import { createFileRoute } from "@tanstack/react-router";
import { AppliancesPage } from "./-page/AppliancesPage";

export const Route = createFileRoute("/appliances")({
  component: AppliancesPage,
});
