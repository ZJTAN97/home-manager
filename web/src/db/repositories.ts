import type { PGlite } from "@electric-sql/pglite";
import type { Appliance, Chore, InventoryItem } from "@/types";

// ── Row ↔ TypeScript mappers ────────────────────────────────

interface InventoryItemRow {
  id: string;
  name: string;
  expiry_date: string;
  category: string;
  quantity: number | null;
  consumed: boolean;
  image: string | null;
  date_opened: string | null;
  shelf_life_months: number | null;
}

interface ChoreRow {
  id: string;
  name: string;
  frequency_days: number;
  last_done: string | null;
  next_due: string;
}

interface ApplianceRow {
  id: string;
  name: string;
  maintenance_task: string;
  frequency_days: number;
  last_maintained: string | null;
  next_due: string;
}

function mapInventoryRow(row: InventoryItemRow): InventoryItem {
  return {
    id: row.id,
    name: row.name,
    expiryDate: row.expiry_date,
    category: row.category as InventoryItem["category"],
    quantity: row.quantity ?? undefined,
    consumed: row.consumed,
    image: row.image ?? undefined,
    dateOpened: row.date_opened ?? undefined,
    shelfLifeMonths: row.shelf_life_months ?? undefined,
  };
}

function mapChoreRow(row: ChoreRow): Chore {
  return {
    id: row.id,
    name: row.name,
    frequencyDays: row.frequency_days,
    lastDone: row.last_done ?? undefined,
    nextDue: row.next_due,
  };
}

function mapApplianceRow(row: ApplianceRow): Appliance {
  return {
    id: row.id,
    name: row.name,
    maintenanceTask: row.maintenance_task,
    frequencyDays: row.frequency_days,
    lastMaintained: row.last_maintained ?? undefined,
    nextDue: row.next_due,
  };
}

// ── Inventory Items ─────────────────────────────────────────

export async function getAllInventoryItems(
  db: PGlite
): Promise<InventoryItem[]> {
  const res = await db.query<InventoryItemRow>("SELECT * FROM inventory");
  return res.rows.map(mapInventoryRow);
}

export async function insertInventoryItem(
  db: PGlite,
  item: InventoryItem
): Promise<void> {
  await db.query(
    `INSERT INTO inventory
       (id, name, expiry_date, category, quantity, consumed, image, date_opened, shelf_life_months)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      item.id,
      item.name,
      item.expiryDate,
      item.category,
      item.quantity ?? null,
      item.consumed,
      item.image ?? null,
      item.dateOpened ?? null,
      item.shelfLifeMonths ?? null,
    ]
  );
}

export async function updateInventoryItem(
  db: PGlite,
  item: InventoryItem
): Promise<void> {
  await db.query(
    `UPDATE inventory SET
       name = $2, expiry_date = $3, category = $4, quantity = $5,
       consumed = $6, image = $7, date_opened = $8, shelf_life_months = $9
     WHERE id = $1`,
    [
      item.id,
      item.name,
      item.expiryDate,
      item.category,
      item.quantity ?? null,
      item.consumed,
      item.image ?? null,
      item.dateOpened ?? null,
      item.shelfLifeMonths ?? null,
    ]
  );
}

export async function deleteInventoryItem(
  db: PGlite,
  id: string
): Promise<void> {
  await db.query("DELETE FROM inventory WHERE id = $1", [id]);
}

// ── Chores ──────────────────────────────────────────────────

export async function getAllChores(db: PGlite): Promise<Chore[]> {
  const res = await db.query<ChoreRow>("SELECT * FROM chores");
  return res.rows.map(mapChoreRow);
}

export async function insertChore(db: PGlite, chore: Chore): Promise<void> {
  await db.query(
    `INSERT INTO chores (id, name, frequency_days, last_done, next_due)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      chore.id,
      chore.name,
      chore.frequencyDays,
      chore.lastDone ?? null,
      chore.nextDue,
    ]
  );
}

export async function updateChore(db: PGlite, chore: Chore): Promise<void> {
  await db.query(
    `UPDATE chores SET
       name = $2, frequency_days = $3, last_done = $4, next_due = $5
     WHERE id = $1`,
    [
      chore.id,
      chore.name,
      chore.frequencyDays,
      chore.lastDone ?? null,
      chore.nextDue,
    ]
  );
}

export async function deleteChore(db: PGlite, id: string): Promise<void> {
  await db.query("DELETE FROM chores WHERE id = $1", [id]);
}

// ── Appliances ──────────────────────────────────────────────

export async function getAllAppliances(db: PGlite): Promise<Appliance[]> {
  const res = await db.query<ApplianceRow>("SELECT * FROM appliances");
  return res.rows.map(mapApplianceRow);
}

export async function insertAppliance(
  db: PGlite,
  appliance: Appliance
): Promise<void> {
  await db.query(
    `INSERT INTO appliances (id, name, maintenance_task, frequency_days, last_maintained, next_due)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      appliance.id,
      appliance.name,
      appliance.maintenanceTask,
      appliance.frequencyDays,
      appliance.lastMaintained ?? null,
      appliance.nextDue,
    ]
  );
}

export async function updateAppliance(
  db: PGlite,
  appliance: Appliance
): Promise<void> {
  await db.query(
    `UPDATE appliances SET
       name = $2, maintenance_task = $3, frequency_days = $4,
       last_maintained = $5, next_due = $6
     WHERE id = $1`,
    [
      appliance.id,
      appliance.name,
      appliance.maintenanceTask,
      appliance.frequencyDays,
      appliance.lastMaintained ?? null,
      appliance.nextDue,
    ]
  );
}

export async function deleteAppliance(db: PGlite, id: string): Promise<void> {
  await db.query("DELETE FROM appliances WHERE id = $1", [id]);
}
