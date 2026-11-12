import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// stocksテーブルの構造を定義
export const stocks = sqliteTable(
    "stocks",
    // 下記登録内容:memoの初期値は省略可、省略すると空文字が入る
    {
        id: integer("id").primaryKey(),//識別のためのid
        shelf: text("shelf").notNull(),//棚番
        productName: text("productName").notNull(),//商品名
        inquiry: text("inquiry").notNull(),//仕様
        quantity: integer("quantity").notNull(),//現在庫
        memo: text("memo").notNull().default(""),//メモ(任意入力)
    }
)

// historiesのテーブル定義
export const histories =sqliteTable(
    "histories",
    {
        id: integer("id").primaryKey(),//識別のためのid
        createdAt:text("createdAt").notNull(),
        movementType:text("type",{enum:["IN","OUT"]}).notNull(),
        shelf: text("shelf").notNull(),//棚番
        productName: text("productName").notNull(),//商品名
        inquiry: text("inquiry").notNull(),//仕様
        quantity: integer("quantity").notNull(),//入出庫時の数量
        memo: text("memo").notNull().default(""),//メモ(任意入力)
    }
)