import * as DB from "./database.ts";
import * as ItemsModel from "./m_items.ts";
import * as ShippingModel from "./m_shipping.ts";
import * as ShoppingModel from "./m_shopping.ts";

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
      JSON.stringify(cartObj.filter((v) => v.item_id !== item_id)),
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

export function checkoutCart(id: number) {
  const cart = getCart(id);

  if (cart === undefined) return -1;

  type cartItem = {
    item_id: number;
    quantity: number;
  };

  const sellerGroup: Map<
    number,
    Array<{
      seller_id: number;
      item_id: number;
      item_name: string;
      item_price: number;
      item_description: string | null;
      quantity: number;
    }>
  > = new Map();

  const cartArray: cartItem[] = JSON.parse(cart.cart);

  for (const v of cartArray) {
    const item = ItemsModel.getItemById(v.item_id);
    if (item === undefined) {
      return -1;
    }

    if (item.state !== 1) {
      return -2;
    }

    if (!sellerGroup.has(item.owner_id)) {
      sellerGroup.set(item.owner_id, []);
    }

    sellerGroup.get(item.owner_id)?.push(
      {
        seller_id: item.owner_id,
        item_id: v.item_id,
        item_name: item.display_name,
        item_price: item.price,
        item_description: item.description,
        quantity: v.quantity,
      },
    );
  }

  const shipIdArray: number[] = [];

  const createShippingOrder = DB.database.transaction(() => {
    sellerGroup.forEach((itemArray) => {
      itemArray.forEach((v) => {
        if (ShippingModel.createShipping({ ...v, ship_status: 0 })) {
          shipIdArray.push(ShippingModel.getLastShipId()!.id);
        } else {
          shipIdArray.push(-3);
        }
      });
    });

    if (shipIdArray.filter((v) => v < 0).length > 0) {
      return -4;
    }
    return shipIdArray.length;
  });

  if (createShippingOrder < 0) return -10;

  const shoppingId = DB.database.transaction(() => {
    try {
      const shoppingOrder = ShoppingModel.createShoppingOrder(id);
      if (shoppingOrder === -1) return -5;

      shipIdArray.forEach((v) => {
        ShoppingModel.linkShipRelation(shoppingOrder.id, v);
      });

      return shoppingOrder.id;
    } catch (e) {
      console.error(e);
      return -6;
    }
  });

  return shoppingId;
}
