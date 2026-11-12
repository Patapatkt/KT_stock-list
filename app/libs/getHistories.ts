import { desc } from "drizzle-orm";
import { drizzleDb } from "./db";
import { historySchema } from "../model/stock";
import { histories } from "./schema";

export async function gethistories(){
    const result = await drizzleDb
    .select()
    .from(histories)
    .orderBy(
            desc(histories.createdAt),//historiesテーブルの入庫日時の降順
            desc(histories.id)//入庫日が同じならhistoryテーブルのidの降順
        );
    
    return historySchema.array().parse(result)
}