import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { LayoutShell } from "./-components/LayoutShell/LayoutShell";
import type { PGliteWithLive } from "@electric-sql/pglite/live";
import { useEffect, useState } from "react";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { Loader, Stack } from "@mantine/core";
import setupPgLite from "./-db/pglite";

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
  const [db, setDb] = useState<PGliteWithLive>();

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const pglite = await setupPgLite();

      if (!isMounted) {
        return;
      }

      setDb(pglite);
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  if (db === undefined) {
    return (
      <Stack align="center" justify="center" h="100dvh">
        <Loader type="dots" />
      </Stack>
    );
  }

  return (
    <PGliteProvider db={db}>
      <LayoutShell>
        <Outlet />
      </LayoutShell>
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </PGliteProvider>
  );
}
