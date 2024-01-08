import * as DB from "./database.ts";
import * as ShippingModel from "./m_shipping.ts";

export function getLastShopId() {
  const query = DB.database.prepareQuery<never, { id: number }>(
    `SELECT "id" FROM shopping ORDER BY "id" DESC LIMIT 1`,
  );

  const result = query.firstEntry();
  query.finalize();

  return result;
}

export function getShoppingById(id: number) {
  const query = DB.database.prepareQuery<never, DB.shopping_db>(`--sql
    SELECT
      "id",
      "user_id"
    FROM
      shopping
    WHERE id = ?
  `);

  const result = query.firstEntry([id]);
  query.finalize();

  return result;
}

export function getShoppingByUserId(id: number) {
  const query = DB.database.prepareQuery<never, DB.shopping_db>(`--sql
    SELECT
      "id",
      "user_id"
    FROM
      shopping
    WHERE user_id = ?
  `);

  const result = query.allEntries([id]);
  query.finalize();

  return result;
}

export function createShoppingOrder(user_id: number) {
  const stmt = DB.database.prepareQuery(`--sql
    INSERT INTO shopping (user_id) VALUES (?)
  `);

  const insertResult = DB.database.transaction(() => {
    try {
      stmt.execute([user_id]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  });

  if (insertResult) {
    return getLastShopId()!;
  }

  return -1;
}

export function linkShipRelation(shop_id: number, ship_id: number) {
  if (ShippingModel.getShippingById(ship_id) === undefined) {
    return false;
  }

  if (getShoppingById(shop_id) === undefined) {
    return false;
  }

  const stmt = DB.database.prepareQuery(`--sql
    INSERT INTO ship_ship_er (
      shopping_id,
      shipping_id
    ) VALUES (?, ?);
  `);

  try {
    DB.database.transaction(() => {
      stmt.execute([shop_id, ship_id]);
    });

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function getOrderShipping(order_id: number) {
  const query = DB.database.prepareQuery<never, DB.ship_ship_er_db>(`--sql
    SELECT 
      shopping_id,
      shipping_id
    FROM
      ship_ship_er
    WHERE shopping_id = ? order_id
  `);

  const result = query.allEntries([order_id]);
  query.finalize();

  return result;
}
