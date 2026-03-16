import { useLiveQuery } from "@tanstack/react-db";
import {
  appliancesCollection,
  choresCollection,
  inventoryCollection,
} from "@/db/collections";
import type { Appliance, Chore, InventoryItem } from "@/types";

// ── Inventory ───────────────────────────────────────────────

export function useInventory() {
  const { data, isLoading } = useLiveQuery((q) =>
    q.from({ inventory: inventoryCollection })
  );

  const items: InventoryItem[] = (data ?? []) as InventoryItem[];

  const addItem = (item: InventoryItem) => {
    inventoryCollection.insert(item);
  };

  const updateItem = (item: InventoryItem) => {
    inventoryCollection.update(item.id, (draft) => {
      Object.assign(draft, item);
    });
  };

  const removeItem = (id: string) => {
    inventoryCollection.delete(id);
  };

  return { items, isLoading, addItem, updateItem, removeItem };
}

// ── Chores ──────────────────────────────────────────────────

export function useChores() {
  const { data, isLoading } = useLiveQuery((q) =>
    q.from({ chores: choresCollection })
  );

  const items: Chore[] = (data ?? []) as Chore[];

  const addItem = (item: Chore) => {
    choresCollection.insert(item);
  };

  const updateItem = (item: Chore) => {
    choresCollection.update(item.id, (draft) => {
      Object.assign(draft, item);
    });
  };

  const removeItem = (id: string) => {
    choresCollection.delete(id);
  };

  return { items, isLoading, addItem, updateItem, removeItem };
}

// ── Appliances ──────────────────────────────────────────────

export function useAppliances() {
  const { data, isLoading } = useLiveQuery((q) =>
    q.from({ appliances: appliancesCollection })
  );

  const items: Appliance[] = (data ?? []) as Appliance[];

  const addItem = (item: Appliance) => {
    appliancesCollection.insert(item);
  };

  const updateItem = (item: Appliance) => {
    appliancesCollection.update(item.id, (draft) => {
      Object.assign(draft, item);
    });
  };

  const removeItem = (id: string) => {
    appliancesCollection.delete(id);
  };

  return { items, isLoading, addItem, updateItem, removeItem };
}
