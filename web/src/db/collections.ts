import {
  type CollectionConfig,
  createCollection,
  type Mutation,
} from "@tanstack/db";
import type { Appliance, Chore, InventoryItem } from "@/types";
import { getDb } from "./pglite";
import {
  deleteAppliance,
  deleteChore,
  deleteInventoryItem,
  getAllAppliances,
  getAllChores,
  getAllInventoryItems,
  insertAppliance,
  insertChore,
  insertInventoryItem,
  updateAppliance,
  updateChore,
  updateInventoryItem,
} from "./repositories";

// ── Helper ──────────────────────────────────────────────────
// Wraps a collection with a sync layer that:
//  1. Loads initial data asynchronously from PGlite
//  2. After each onInsert/onUpdate/onDelete callback, feeds the
//     mutation back through sync (confirmOperationsSync) so the
//     optimistic state is promoted to permanent synced data.

type SyncWrite<T> = (op: { type: "insert" | "update" | "delete"; value: T }) => void;

function asyncPgliteCollection<T extends Record<string, unknown>>(config: {
  id: string;
  getKey: (item: T) => string;
  loadAll: () => Promise<T[]>;
  onInsert: (mutations: Mutation<T, string>[]) => Promise<void>;
  onUpdate: (mutations: Mutation<T, string>[]) => Promise<void>;
  onDelete: (mutations: Mutation<T, string>[]) => Promise<void>;
}) {
  // Captured sync functions for confirmOperationsSync
  let syncBegin: (() => void) | null = null;
  let syncWrite: SyncWrite<T> | null = null;
  let syncCommit: (() => void) | null = null;

  function confirmOperationsSync(mutations: Mutation<T, string>[]) {
    if (!syncBegin || !syncWrite || !syncCommit) return;
    syncBegin();
    for (const m of mutations) {
      syncWrite({ type: m.type, value: m.modified });
    }
    syncCommit();
  }

  return createCollection<T, string>({
    id: config.id,
    getKey: config.getKey,
    sync: {
      sync: ({ begin, write, commit, markReady }) => {
        syncBegin = begin;
        syncWrite = write as SyncWrite<T>;
        syncCommit = commit;

        (async () => {
          const items = await config.loadAll();
          begin();
          for (const item of items) {
            write({ type: "insert", value: item });
          }
          commit();
          markReady();
        })();
      },
    },
    onInsert: async ({ transaction }) => {
      await config.onInsert(transaction.mutations);
      confirmOperationsSync(transaction.mutations);
    },
    onUpdate: async ({ transaction }) => {
      await config.onUpdate(transaction.mutations);
      confirmOperationsSync(transaction.mutations);
    },
    onDelete: async ({ transaction }) => {
      await config.onDelete(transaction.mutations);
      confirmOperationsSync(transaction.mutations);
    },
  } as CollectionConfig<T, string>);
}

// ── Inventory Collection ────────────────────────────────────

export const inventoryCollection = asyncPgliteCollection<InventoryItem>({
  id: "inventory",
  getKey: (item) => item.id,
  loadAll: async () => {
    const db = await getDb();
    return getAllInventoryItems(db);
  },
  onInsert: async (mutations) => {
    const db = await getDb();
    for (const m of mutations) {
      await insertInventoryItem(db, m.modified);
    }
  },
  onUpdate: async (mutations) => {
    const db = await getDb();
    for (const m of mutations) {
      await updateInventoryItem(db, m.modified);
    }
  },
  onDelete: async (mutations) => {
    const db = await getDb();
    for (const m of mutations) {
      await deleteInventoryItem(db, m.key);
    }
  },
});

// ── Chores Collection ───────────────────────────────────────

export const choresCollection = asyncPgliteCollection<Chore>({
  id: "chores",
  getKey: (item) => item.id,
  loadAll: async () => {
    const db = await getDb();
    return getAllChores(db);
  },
  onInsert: async (mutations) => {
    const db = await getDb();
    for (const m of mutations) {
      await insertChore(db, m.modified);
    }
  },
  onUpdate: async (mutations) => {
    const db = await getDb();
    for (const m of mutations) {
      await updateChore(db, m.modified);
    }
  },
  onDelete: async (mutations) => {
    const db = await getDb();
    for (const m of mutations) {
      await deleteChore(db, m.key);
    }
  },
});

// ── Appliances Collection ───────────────────────────────────

export const appliancesCollection = asyncPgliteCollection<Appliance>({
  id: "appliances",
  getKey: (item) => item.id,
  loadAll: async () => {
    const db = await getDb();
    return getAllAppliances(db);
  },
  onInsert: async (mutations) => {
    const db = await getDb();
    for (const m of mutations) {
      await insertAppliance(db, m.modified);
    }
  },
  onUpdate: async (mutations) => {
    const db = await getDb();
    for (const m of mutations) {
      await updateAppliance(db, m.modified);
    }
  },
  onDelete: async (mutations) => {
    const db = await getDb();
    for (const m of mutations) {
      await deleteAppliance(db, m.key);
    }
  },
});
