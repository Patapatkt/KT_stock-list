// 検索条件をZodで検証し、DBを検索して結果を返す

import { productSchema } from "@/app/model/stock"
import { and, asc, desc, like } from "drizzle-orm";
import { stocks } from "./schema";
import { drizzleDb } from "./db";
// 引数の型作成
type ProductsSearchCondition = {
	location: string,
	productNumber: string,
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
		location?: string;
		productNumber?: string;
		inquiry?: string;
	};
	appliedSort: {
		sortBy: "id" | "productNumber" | "location" | "inquiry" | "quantity";
		sortDirection: "asc" | "desc"
	} | null;
}> {
	const parsed = productSchema.safeParse({
		...conditions,
		sortDirection:
			conditions.sortDirection === "" ? undefined : conditions.sortDirection,
	})

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
	const { location, productNumber, inquiry, sortDirection } = parsed.data
	const sortBy = conditions.sortBy
	const appliedSortBy =
		sortBy === "location" || sortBy === "productNumber" || sortBy === "inquiry" || sortBy === "quantity"
			? sortBy
			: "id";
	const sortColumn =
		appliedSortBy === "location"
			? stocks.location
			: appliedSortBy === "productNumber"
				? stocks.productNumber
				: appliedSortBy === "inquiry"
					? stocks.inquiry
					: appliedSortBy === "quantity"
						? stocks.quantity
						: stocks.id

	const appliedSortDirection = sortDirection ?? "desc";
	const sortOrder =
		appliedSortDirection === "asc" ? asc(sortColumn) : desc(sortColumn);

		const result = await drizzleDb
		.select()
		.from(stocks)
		.where(
			and(
				location
					? like(stocks.location, `${location}%`)
					: undefined,
				productNumber
					? like(stocks.productNumber, `${productNumber}%`)
					: undefined,
				inquiry
					? like(stocks.inquiry, `${inquiry}%`)
					: undefined
			)
		)
		.orderBy(
			sortOrder,
		)

	const appliedFilterslocation = location ? { location } : undefined;
	const appliedFiltersproductNumber = productNumber ? { productNumber } : undefined;
	const appliedFiltersInquiry = inquiry ? { inquiry } : undefined;

	return {
		productList: result,
		error: null,
		appliedFilters: {
			...appliedFilterslocation,
			...appliedFiltersproductNumber,
			...appliedFiltersInquiry
		},
		appliedSort: {
			sortBy: appliedSortBy,
			sortDirection: appliedSortDirection,
		}
	}
}