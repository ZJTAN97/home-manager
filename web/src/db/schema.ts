export const SCHEMA_VERSION = 1;

export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS _meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS expiry_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER,
    consumed BOOLEAN NOT NULL DEFAULT false,
    image TEXT,
    date_opened TEXT,
    shelf_life_months INTEGER
  );

  CREATE TABLE IF NOT EXISTS chores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    frequency_days INTEGER NOT NULL,
    last_done TEXT,
    next_due TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS appliances (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    maintenance_task TEXT NOT NULL,
    frequency_days INTEGER NOT NULL,
    last_maintained TEXT,
    next_due TEXT NOT NULL
  );
`;
