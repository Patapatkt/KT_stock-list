// 検索条件をZodで検証し、DBを検索して結果を返す

import { productSchema } from "@/app/model/stock"
import { and, like } from "drizzle-orm";
import { stocks } from "./schema";
import { drizzleDb } from "./db";
// 引数の型作成
type ProductsSearchCondition = {
    shelf: string,
    productName: string,
    inquiry: string,
}

export type stockRow = typeof stocks.$inferSelect

// 関数作成
export async function getProducts(
    conditions: ProductsSearchCondition
): Promise<{
    productList: stockRow[];
    error: string | null;
}> {
    const parsed = productSchema.safeParse(conditions)
    if (!parsed.success) {
        return {
            productList: [],
            error: parsed.error.issues[0]?.message
                ?? "検索条件を入力してください",
        }
    }
    // 分割代入で検証済の値から入力値を取り出す
    const { shelf, productName, inquiry } = parsed.data

    const result = await drizzleDb
        .select()
        .from(stocks)//stocksテーブルより
        // 下記条件で絞り込み
        .where(
            //andで複数の条件
            and(
                shelf//棚番列にてstockテーブルの棚番と分割代入で取り出した棚番が
                    //前方部分一致しているか
                    ? like(stocks.shelf, `${shelf}%`)
                    : undefined,
                productName
                    ? like(stocks.productName, `${productName}%`)
                    : undefined,
                inquiry
                    ? like(stocks.inquiry, `${inquiry}%`)
                    : undefined
            )
        )
    return {
        // 検索条件に一致した在庫データ1行を返す
        productList: result,
        error: null
    }

}