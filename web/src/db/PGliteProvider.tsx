import type { PGlite } from "@electric-sql/pglite";
import { Center, Loader, Stack, Text } from "@mantine/core";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getDb } from "./pglite";

type PGliteState =
  | { status: "loading" }
  | { status: "ready"; db: PGlite }
  | { status: "error"; error: unknown };

const PGliteContext = createContext<PGliteState>({
  status: "loading",
});

export function PGliteProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PGliteState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const db = await getDb();
        if (!cancelled) {
          setState({ status: "ready", db });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ status: "error", error });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <Center h="100vh">
        <Stack align="center" gap="sm">
          <Loader size="lg" />
          <Text size="sm" c="dimmed">
            Loading database...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (state.status === "error") {
    return (
      <Center h="100vh">
        <Stack align="center" gap="sm">
          <Text c="red" fw={600}>
            Failed to initialize database
          </Text>
          <Text size="sm" c="dimmed">
            {String(state.error)}
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <PGliteContext.Provider value={state}>{children}</PGliteContext.Provider>
  );
}

export function usePGlite(): PGlite {
  const state = useContext(PGliteContext);
  if (state.status !== "ready") {
    throw new Error("usePGlite must be used within a loaded PGliteProvider");
  }
  return state.db;
}
