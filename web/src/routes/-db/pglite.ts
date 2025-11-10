import { PGlite } from "@electric-sql/pglite";
import { live, type PGliteWithLive } from "@electric-sql/pglite/live";
import localSchemaMigrations from "./pglite-schema.sql?raw";

const DATA_DIR = "idb://home-manager";

const registry = new Map<string, Promise<PGliteWithLive>>();

export default async function setupPgLite(): Promise<PGliteWithLive> {
  let loadingPromise = registry.get("loadingPromise");

  if (loadingPromise === undefined) {
    loadingPromise = _loadPGlite();
    registry.set("loadingPromise", loadingPromise);
  }

  return loadingPromise as Promise<PGliteWithLive>;
}

async function _loadPGlite(): Promise<PGliteWithLive> {
  const pglite = await PGlite.create(DATA_DIR, {
    extensions: {
      live,
    },
  });

  const response = await pglite.query(`
      SELECT relname 
        FROM pg_class 
        JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
        WHERE pg_class.relkind = 'r';
    `);

  if (response.rows.length === 68) {
    console.log("[INFO] Executing migration on local pglite.");
    await pglite.exec(localSchemaMigrations);
  }

  return pglite;
}
