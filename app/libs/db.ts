// Db接続　drizzleDbの定義

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
// SQLiteのDBファイルを開き、接続をdbに入れる
const db = new Database(
    "stock-list.db", //接続先の指定
)
// drizzleDbの接続をDrizzleに渡し他のファイルで使えるように定義する
export const drizzleDb = drizzle(db)