// 検索条件をZodで検証し、DBを検索して結果を返す

import { productSchema } from "@/app/model/stock"
import { and, asc, desc, like } from "drizzle-orm";
import { stocks } from "./schema";
import { drizzleDb } from "./db";
// 引数の型作成
type ProductsSearchCondition = {
	shelf: string,
	productName: string,
	inquiry: string,
	sortDirection?: string | string[],
	sortBy?: string | undefined;
}

export type stockRow = typeof stocks.$inferSelect

// 関数作成
export async function getProducts(
	conditions: ProductsSearchCondition
): Promise<{
	productList: stockRow[];
	error: string | null;
	appliedFilters: {
		shelf?: string;
		productName?: string;
		inquiry?: string;
	};
	appliedSort: {
		sortBy: "id" | "productName" | "shelf" | "inquiry" | "quantity";
		sortDirection: "asc" | "desc"
	} | null;
}> {
	const parsed = productSchema.safeParse(conditions)
	if (!parsed.success) {
		return {
			productList: [],
			error: parsed.error.issues[0]?.message
				?? "検索条件を入力してください",
			// 11/18// 在庫検索に実際に適用した条件
			appliedFilters: {},
			// // 11/18// 在庫検索に実際に適用したソート
			appliedSort: null,
		}
	}
	// 11/18sortDirectionの分割代入追加
	const { shelf, productName, inquiry, sortDirection } = parsed.data
	const sortBy = conditions.sortBy
	const appliedSortBy =
		sortBy === "shelf" || sortBy === "productName" || sortBy === "inquiry" || sortBy === "quantity"
			? sortBy
			: "id";
	const sortColumn =
		appliedSortBy === "shelf"
			? stocks.shelf
			:appliedSortBy === "productName"
				?stocks.productName
				:appliedSortBy==="inquiry" 
					?stocks.inquiry
					:appliedSortBy==="quantity"
					?stocks.quantity
					:stocks.id
	const sortOrder =
		sortDirection === "asc" ? asc(sortColumn) : desc(sortColumn);


	const result = await drizzleDb
		.select()
		.from(stocks)
		.where(
			and(
				shelf
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
		.orderBy(
			sortOrder,
		)

	const appliedFiltersShelf = shelf ? { shelf } : undefined;
	const appliedFiltersProductName = productName ? { productName } : undefined;
	const appliedFiltersInquiry = inquiry ? { inquiry } : undefined;

	return {
		productList: result,
		error: null,
		appliedFilters: {
			...appliedFiltersShelf,
			...appliedFiltersProductName,
			...appliedFiltersInquiry
		},
		appliedSort: {
			sortBy: appliedSortBy,
			sortDirection
		}
	}
}