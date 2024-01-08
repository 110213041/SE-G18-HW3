import * as DB from "./database.ts";

export function getLastShipId() {
  const query = DB.database.prepareQuery<never, { id: number }>(
    `SELECT "id" FROM shipping ORDER BY "id" DESC LIMIT 1`,
  );

  const result = query.firstEntry();
  query.finalize();

  return result;
}

export function getShippingById(id: number) {
  const query = DB.database.prepareQuery<never, DB.shipping_db>(`--sql
    SELECT 
      "id",
      "seller_id",
      "item_id",
      "item_name",
      "item_price",
      "item_description",
      "quantity",
      "ship_status"
    FROM
      shipping
    WHERE id = ?
  `);

  const result = query.firstEntry([id]);
  query.finalize();

  return result;
}

export function getShippingBySellerId(id: number) {
  const query = DB.database.prepareQuery<never, DB.shipping_db>(`--sql
    SELECT 
      "id",
      "seller_id",
      "item_id",
      "item_name",
      "item_price",
      "item_description",
      "quantity",
      "ship_status"
    FROM
      shipping
    WHERE seller_id = ?
  `);

  const result = query.allEntries([id]);
  query.finalize();

  return result;
}

export function createShipping(newItem: Omit<DB.shipping_db, "id">) {
  const stmt = DB.database.prepareQuery(`--sql
    INSERT INTO shipping (
      "seller_id",
      "item_id",
      "item_name",
      "item_prince",
      "item_description",
      "quantity",
      "ship_status"
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  return DB.database.transaction(() => {
    try {
      stmt.execute([
        newItem.seller_id,
        newItem.item_id,
        newItem.item_name,
        newItem.item_price,
        newItem.item_description,
        newItem.quantity,
        newItem.ship_status,
      ]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  });
}

export function alterShipping(
  id: number,
  attribute: string,
  value: string | number,
) {
  const stmt = DB.database.prepareQuery(`--sql
    UPDATE shipping
    SET ? = ?
    WHERE id = ?
  `);

  DB.database.transaction(() => {
    try {
      stmt.execute([attribute, value, id]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  });
}
