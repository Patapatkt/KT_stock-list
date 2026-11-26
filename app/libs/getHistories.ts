import "server-only";

import { and, desc, eq, gte, like, lt } from "drizzle-orm";
import { drizzleDb } from "./db";
import {  historySearchSchema } from "../model/stock";
import { histories } from "./schema";

type HistoriesSearchCondition = {
    createdAtFrom:string |string[],
    createdAtTo:string |string[],
    location: string |string[],
    productNumber: string |string[],
    inquiry: string |string[],
    movementType:string | string[],
}

export type historyRow = typeof histories.$inferSelect

export async function getHistories(
    condition:HistoriesSearchCondition
):Promise<{
    histories:historyRow[],
    error:string | null,
}> {
    const normalizedCondition ={
        ...condition,
    createdAtFrom:condition.createdAtFrom ===""? undefined:condition.createdAtFrom,
    createdAtTo:condition.createdAtTo === "" ? undefined : condition.createdAtTo,
    movementType:condition.movementType === "" ? undefined : condition.movementType
    }
    const parsed =  historySearchSchema.safeParse(normalizedCondition);
    if(!parsed.success){
        console.log("履歴検索の検証エラー", parsed.error.issues);
        
        return {
            histories: [],
            error: parsed.error.issues[0]?.message
                ?? "検索条件を入力してください",
        }
    }
    
    const {createdAtFrom,createdAtTo,location,productNumber,inquiry,movementType} = parsed.data
    const result = await drizzleDb
        .select()
        .from(histories)
        .where(
            and(
                createdAtFrom
                    ?gte(histories.createdAt,createdAtFrom)
                    :undefined,
                createdAtTo
                    ?lt(histories.createdAt,createdAtTo)
                    :undefined,
                location//棚番列にてstockテーブルの棚番と分割代入で取り出した棚番が
                    //前方部分一致しているか
                    ? like(histories.location, `${location}%`)
                    : undefined,
                productNumber
                    ? like(histories.productNumber, `${productNumber}%`)
                    : undefined,
                inquiry
                    ? like(histories.inquiry, `${inquiry}%`)
                    : undefined,
                movementType
                    ?eq(histories.movementType,movementType)
                    : undefined
            )
        )
        .orderBy(
            desc(histories.createdAt),//historiesテーブルの入出庫日時の降順
            desc(histories.id)//入庫日が同じならhistoryテーブルのidの降順
        );
    return {
        histories:result,
        error:null
    }
}