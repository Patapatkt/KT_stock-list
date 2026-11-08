// 読み込み先のschema.ts,DBの種類・読み込み先を指定
import { defineConfig } from "drizzle-kit";

// Drizzle Kitが使用するスキーマと接続先
export default defineConfig({
    schema: "./app/libs/shema.ts",//読込み先のschema.tsを指定
    dialect: "sqlite",//DBの種類を指定
    dbCredentials: {
        url: "stock-list.db",//反映先のDBを指定
    },
    verbose: true,//DBに適用予定のSQLをターミナルに表示
    strict: true,//DB変更前に適用してよいか確認
});