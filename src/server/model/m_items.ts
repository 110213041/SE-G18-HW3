import * as DB from "./database.ts";

type standard_item = {
  item_id: number;
  display_name: string;
  price: number;
  description: string;
  owner_id: number;
  state: number;
};

export function getItemById(item_id: number) {
  const query = DB.database.prepareQuery<never, standard_item, [number]>(`--sql
    SELECT
      "id" AS item_id,
      "display_name",
      "price",
      "description",
      "owner_id",
      "state"
    FROM
      item
    WHERE
      item_id = ?
  `);

  const result = query.firstEntry([item_id]);
  query.finalize();

  return result;
}

export function getItem() {
  const query = DB.database.prepareQuery<never, standard_item, [number]>(`--sql
    SELECT
      "id" AS item_id,
      "display_name",
      "price",
      "description",
      "owner_id",
      "state"
    FROM
      item
  `);

  const result = query.allEntries();
  query.finalize();

  return result;
}

export function createItem(
  item_name: string,
  item_price: number,
  item_description: string,
  owner_id: number,
) {
  const stmt = DB.database.prepareQuery<
    never,
    never,
    [string, number, string, number, number]
  >(`--sql
  INSERT INTO
    item("display_name", "price", "description", "owner_id", "state")
  VALUES
    (?, ?, ?, ?, ?)
  `);

  try {
    DB.database.transaction(() => {
      stmt.execute([item_name, item_price, item_description, owner_id, 1]);
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export type item_key = "state" | "price" | "display_name" | "description";

export function alterItem(
  item_id: number,
  attribute: item_key,
  value: string | number,
) {
  const stmt = DB.database.prepareQuery<
    never,
    never,
    [string, string | number, number]
  >(`--sql
  UPDATE item SET ? = ? WHERE id = ?
  `);

  try {
    DB.database.transaction(() => {
      stmt.execute([attribute, value, item_id]);
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function getLastItemId() {
  const query = DB.database.prepareQuery<never, { id: number }>(
    `SELECT "id" FROM item ORDER BY "id" DESC LIMIT 1`,
  );

  const result = query.firstEntry();
  query.finalize();

  return result;
}
