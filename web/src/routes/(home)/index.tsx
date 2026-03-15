import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "./-page/DashboardPage";

export const Route = createFileRoute("/(home)/")({
  component: DashboardPage,
});
