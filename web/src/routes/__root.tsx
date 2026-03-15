import { createRootRoute, Outlet } from "@tanstack/react-router";
import { LayoutShell } from "../components/LayoutShell/LayoutShell";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>Route not found</p>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <LayoutShell>
      <Outlet />
    </LayoutShell>
  );
}
