import { createCollection } from "@tanstack/db";
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

// ── Inventory Collection ────────────────────────────────────

export const inventoryCollection = createCollection<InventoryItem, string>({
  id: "inventory",
  getKey: (item) => item.id,
  sync: {
    sync: ({ begin, write, commit, markReady }) => {
      (async () => {
        const db = await getDb();
        const items = await getAllInventoryItems(db);
        begin();
        for (const item of items) {
          write({
            type: "insert",
            value: item,
          });
        }
        commit();
        markReady();
      })();
    },
  },
  onInsert: async ({ transaction }) => {
    const db = await getDb();
    for (const m of transaction.mutations) {
      await insertInventoryItem(db, m.modified);
    }
  },
  onUpdate: async ({ transaction }) => {
    const db = await getDb();
    for (const m of transaction.mutations) {
      await updateInventoryItem(db, m.modified);
    }
  },
  onDelete: async ({ transaction }) => {
    const db = await getDb();
    for (const m of transaction.mutations) {
      await deleteInventoryItem(db, m.key);
    }
  },
});

// ── Chores Collection ───────────────────────────────────────

export const choresCollection = createCollection<Chore, string>({
  id: "chores",
  getKey: (item) => item.id,
  sync: {
    sync: ({ begin, write, commit, markReady }) => {
      (async () => {
        const db = await getDb();
        const items = await getAllChores(db);
        begin();
        for (const item of items) {
          write({
            type: "insert",
            value: item,
          });
        }
        commit();
        markReady();
      })();
    },
  },
  onInsert: async ({ transaction }) => {
    const db = await getDb();
    for (const m of transaction.mutations) {
      await insertChore(db, m.modified);
    }
  },
  onUpdate: async ({ transaction }) => {
    const db = await getDb();
    for (const m of transaction.mutations) {
      await updateChore(db, m.modified);
    }
  },
  onDelete: async ({ transaction }) => {
    const db = await getDb();
    for (const m of transaction.mutations) {
      await deleteChore(db, m.key);
    }
  },
});

// ── Appliances Collection ───────────────────────────────────

export const appliancesCollection = createCollection<Appliance, string>({
  id: "appliances",
  getKey: (item) => item.id,
  sync: {
    sync: ({ begin, write, commit, markReady }) => {
      (async () => {
        const db = await getDb();
        const items = await getAllAppliances(db);
        begin();
        for (const item of items) {
          write({
            type: "insert",
            value: item,
          });
        }
        commit();
        markReady();
      })();
    },
  },
  onInsert: async ({ transaction }) => {
    const db = await getDb();
    for (const m of transaction.mutations) {
      await insertAppliance(db, m.modified);
    }
  },
  onUpdate: async ({ transaction }) => {
    const db = await getDb();
    for (const m of transaction.mutations) {
      await updateAppliance(db, m.modified);
    }
  },
  onDelete: async ({ transaction }) => {
    const db = await getDb();
    for (const m of transaction.mutations) {
      await deleteAppliance(db, m.key);
    }
  },
});
