# Offline-First Migration with PGlite + TanStack DB

## Overview

Migrated from localStorage (via Mantine's `useLocalStorage`) to PGlite (Postgres in WASM) with TanStack DB for reactive queries. This makes the PWA truly offline-first with a proper local database.

## Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Page Components │────▶│  use-db.ts   │────▶│  TanStack DB    │
│  (React)         │     │  (hooks)     │     │  Collections    │
└─────────────────┘     └──────────────┘     └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │  repositories.ts │
                                              │  (CRUD functions) │
                                              └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │  PGlite (WASM)   │
                                              │  IndexedDB        │
                                              └──────────────────┘
```

## Technology Stack

- **PGlite** (`@electric-sql/pglite`) — Postgres compiled to WASM, persists to IndexedDB
- **TanStack DB** (`@tanstack/db`, `@tanstack/react-db`) — Reactive collections with live queries and optimistic mutations

## Data Flow

1. **Sync (initial load):** PGlite → repository `getAll*()` → collection sync → `begin/write/commit/markReady`
2. **Read (reactive):** `useLiveQuery(q => q.from({ name: collection }))` → auto-updates on changes
3. **Write (optimistic):** `collection.insert/update/delete()` → optimistic UI update → `onInsert/onUpdate/onDelete` persists to PGlite

## File Structure

```
src/db/
├── schema.ts              # SQL CREATE TABLE statements
├── pglite.ts              # Singleton PGlite instance (idb://home-manager)
├── repositories.ts        # Typed CRUD functions (snake_case ↔ camelCase mapping)
├── collections.ts         # TanStack DB collections with PGlite sync
├── PGliteProvider.tsx     # React context, init + loading screen
└── migrate-localstorage.ts # One-time localStorage → PGlite migration

src/hooks/
└── use-db.ts              # useInventory, useChores, useAppliances
```

## Migration from localStorage

On first load, `PGliteProvider` runs `migrateLocalStorage()`:
1. Checks `_meta` table for `localstorage_migrated` flag
2. Reads `inventory`, `chores`, `appliances` from localStorage
3. Validates with Zod schemas, inserts into PGlite
4. Marks migration complete
5. localStorage data is kept as backup

## Hook API Change

Before:
```ts
const [items, setItems] = useInventory(); // [data, setter] tuple
setItems([...items, newItem]);
```

After:
```ts
const { items, isLoading, addItem, updateItem, removeItem } = useInventory();
addItem(newItem);
```

## Future: ElectricSQL Sync

When ready to add sync:
1. Replace PGlite-backed collections with `ElectricCollection` from `@tanstack/electric-db-collection`
2. Add Hono API endpoints for write operations
3. Page components won't change — only collection definitions swap
