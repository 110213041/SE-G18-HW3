import * as DB from "./database.ts";

export function getCart(id: number) {
  const query = DB.database.prepareQuery<never, { cart: string }, [number]>(
    `SELECT "cart" FROM cart WHERE user_id = ?`,
  );

  const result = query.firstEntry([id]);
  query.finalize();

  return result;
}

export function createCart(id: number) {
  try {
    DB.database.transaction(() => {
      const stmt = DB.database.prepareQuery<never, never, [number]>(`--sql
      INSERT INTO cart ("user_id", "cart") VALUES (?, '[]')
      `);
      stmt.execute([id]);
    });

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function alterCart(user_id: number, item_id: number, quantity: number) {
  try {
    const cart = getCart(user_id);
    if (cart === undefined) {
      return false;
    }

    const cartObj: Array<{
      item_id: number;
      quantity: number;
    }> = JSON.parse(cart.cart);

    const item = cartObj.find((v) => v.item_id == item_id);
    if (item !== undefined) {
      item.quantity = quantity;
    } else {
      cartObj.push({
        item_id: item_id,
        quantity: quantity,
      });
    }

    return updateCart(user_id, JSON.stringify(cartObj));
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function delCart(user_id: number, item_id: number) {
  try {
    const cart = getCart(user_id);
    if (cart === undefined) {
      return false;
    }

    const cartObj: Array<{
      item_id: number;
      quantity: number;
    }> = JSON.parse(cart.cart);

    return updateCart(
      user_id,
      JSON.stringify(cartObj.filter((v) => v.item_id! == item_id)),
    );
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function updateCart(user_id: number, newCart: string) {
  try {
    DB.database.transaction(() => {
      const stmt = DB.database.prepareQuery<never, never, [string, number]>(
        `--sql
        UPDATE cart SET cart = ? WHERE user_id = ?
      `,
      );
      stmt.execute([newCart, user_id]);
      stmt.finalize();
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
