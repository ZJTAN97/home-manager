import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { LayoutShell } from "./-components/LayoutShell/LayoutShell";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
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
    <>
      <LayoutShell>
        <Outlet />
      </LayoutShell>
      {/* <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  );
}
