// a mock database in sqlite

import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";

export const database = new DB(":memory:");

const pragma = `--sql
    PRAGMA foreign_keys = ON;
`;

export type member_db = {
  id: number;
  user_name: string;
  email: string;
  password: string;
};

const memberSchema = `--sql
  CREATE TABLE member (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
  );

  INSERT INTO
    member("user_name", "email", "password")
  VALUES
    ('client1', 'client@example.com', 'client1'),
    ('seller1', 'seller1@example.com', 'seller1'), ('seller2', 'seller2@example.com', 'seller2'),
    ('shipper1', 'shipper1@example.com', 'shipper1');
`;

export type session_db = {
  user_id: number;
  session_id: string;
  life_time: string;
};

const sessionSchema = `--sql
  CREATE TABLE session (
    "user_id" INTEGER NOT NULL,
    "session" TEXT NOT NULL,
    "life_time" TEXT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES member(id)
  )
`;

const memberRoleSchema = `--sql
  CREATE TABLE member_role (
    "user_id" INTEGER NOT NULL,
    -- 1: 商家, 2: 運輸
    "role" INTEGER CHECK("role" IN (1, 2)) NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES member(id)
  );

  INSERT INTO member_role ("user_id", "role")
  VALUES (2, 1), (3, 1), (4, 2);
`;

export type item_db = {
  id: number;
  display_name: string;
  price: number;
  description: string;
  owner_id: number;
  state: number;
};

const itemSchema = `--sql
  CREATE TABLE item (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "display_name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "owner_id" INTEGER NOT NULL,
    -- 0:hold, 1: sold
    "state" INTEGER NOT NULL,
    FOREIGN KEY ("owner_id") REFERENCES member(id)
  );

  INSERT INTO
    item("display_name", "price", "description", "owner_id", "state")
  VALUES
    ('good1', 50, 'This is Good1.', 2, 1), ('good2', 120, 'This is Good2.',2, 1), ('good3', 30, 'This is Good3', 3, 1);
`;

export type cart_db = {
  user_id: number;
  cart: Array<{
    item_id: number;
    quantity: number;
  }>;
};

const cartSchema = `--sql
    CREATE TABLE cart (
      "user_id" INTEGER NOT NULL,
      "cart" TEXT NOT NULL,
      FOREIGN KEY ("user_id") REFERENCES member(id)
    )
`;

export type shopping_db = {
  id: number;
  user_id: number;
};

const shoppingSchema = `--sql
  CREATE TABLE shopping (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL
  ) 
`;

export type shipping_db = {
  id: number;
  seller_id: number;
  item_id: number;
  item_name: string;
  item_price: number;
  item_description: string | null;
  quantity: number;
  ship_status: 0 | 1 | 2 | 3;
};

const shippingSchema = `--sql
  CREATE TABLE shipping (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "seller_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_price" INTEGER NOT NULL,
    "item_description" TEXT,
    "quantity" INTEGER NOT NULL,
    -- 0: 送出, 1: 處理, 2:寄送, 3:到達
    "ship_status" INTEGER CHECK("ship_status" IN (0, 1, 2, 3)) NOT NULL,
    FOREIGN KEY ("seller_id") REFERENCES member(id)
  )
`;

export type ship_ship_er_db = {
  shopping_id: number;
  shipping_id: number;
};

const shipShopERSchema = `--sql
  CREATE TABLE ship_ship_er (
    "shopping_id" INTEGER NOT NULL,
    "shipping_id" INTEGER NOT NULL,
  )
`;

database.execute(pragma);
database.execute(memberSchema);
database.execute(sessionSchema);
database.execute(memberRoleSchema);
database.execute(itemSchema);
database.execute(cartSchema);
database.execute(shoppingSchema);
database.execute(shippingSchema);
database.execute(shipShopERSchema);
