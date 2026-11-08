// 入力時の検証ルール
import {z} from "zod"

export const productSchema = z.object({
    shelf: z
        .string()
        .trim()
        .optional(),
    productName: z//商品名の入力ルールは文字列・前後の空白を取り除く
        .string()
        .trim()
        .optional(),
    inquiry: z
        .string()
        .trim()
        .optional(),
})
export type CreateStockConditions =z.infer<typeof productSchema>
// 検索時の入力値の検証ルール
export const searchSchema = z.object({
    shelf:productSchema.shape.shelf,
    productName:productSchema.shape.productName,
    inquiry:productSchema.shape.inquiry,
    quantity: z
        .int()
        .min(1)
        .max(
        Number.MAX_SAFE_INTEGER,
        "数量が大きすぎます",
    ),
    memo:z
        .string()
        .optional(),//入力は任意
})