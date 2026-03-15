import { MantineProvider } from "@mantine/core";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReactDOM from "react-dom/client";
import { PGliteProvider } from "./db/PGliteProvider";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

dayjs.extend(relativeTime);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <MantineProvider
      defaultColorScheme="auto"
      theme={{ primaryColor: "teal", defaultRadius: "md" }}
    >
      <PGliteProvider>
        <RouterProvider router={router} />
      </PGliteProvider>
    </MantineProvider>
  );
}
