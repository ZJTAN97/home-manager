import { useLiveQuery } from "@tanstack/react-db";
import {
  appliancesCollection,
  choresCollection,
  expiryItemsCollection,
} from "@/db/collections";
import type { Appliance, Chore, ExpiryItem } from "@/types";

// ── Expiry Items ────────────────────────────────────────────

export function useExpiryItems() {
  const { data, isLoading } = useLiveQuery((q) =>
    q.from({ expiryItems: expiryItemsCollection })
  );

  const items: ExpiryItem[] = (data ?? []) as ExpiryItem[];

  const addItem = (item: ExpiryItem) => {
    expiryItemsCollection.insert(item);
  };

  const updateItem = (item: ExpiryItem) => {
    expiryItemsCollection.update(item.id, (draft) => {
      Object.assign(draft, item);
    });
  };

  const removeItem = (id: string) => {
    expiryItemsCollection.delete(id);
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
