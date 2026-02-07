import { createFileRoute } from "@tanstack/react-router";
import { ChoresPage } from "./-page/ChoresPage";

export const Route = createFileRoute("/chores")({
  component: ChoresPage,
});
