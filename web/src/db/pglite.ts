import { PGlite } from "@electric-sql/pglite";
import { CREATE_TABLES_SQL, SCHEMA_VERSION } from "./schema";

let dbInstance: PGlite | null = null;
let dbPromise: Promise<PGlite> | null = null;

async function initDb(): Promise<PGlite> {
  const db = new PGlite("idb://home-manager");
  await db.exec(CREATE_TABLES_SQL);

  // Track schema version
  await db.query(
    `INSERT INTO _meta (key, value) VALUES ('schema_version', $1)
     ON CONFLICT (key) DO UPDATE SET value = $1`,
    [String(SCHEMA_VERSION)]
  );

  return db;
}

export async function getDb(): Promise<PGlite> {
  if (dbInstance) return dbInstance;
  if (!dbPromise) {
    dbPromise = initDb().then((db) => {
      dbInstance = db;
      return db;
    });
  }
  return dbPromise;
}
