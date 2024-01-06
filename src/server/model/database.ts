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
    ('client1', 'client@example.com', 'client1'), ('seller1', 'seller1@example.com', 'seller1'),
    ('seller2', 'seller2@example.com', 'seller2');
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
    "role" INTEGER CHECK("role" IN (1, 2)) NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES member(id)
  );

  INSERT INTO member_role ("user_id", "role")
  VALUES (2, 1), (3, 1);
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
    "state" INTEGER NOT NULL,
    FOREIGN KEY ("owner_id") REFERENCES member(id)
  );

  INSERT INTO
    item("display_name", "price", "description", "owner_id", "state")
  VALUES
    ('good1', 50, 'This is Good1.', 2, 1), ('good2', 120, 'This is Good2.',2, 1), ('good3', 30, 'This is Good3', 3, 1);
`;

database.execute(pragma);
database.execute(memberSchema);
database.execute(sessionSchema);
database.execute(memberRoleSchema);
database.execute(itemSchema);