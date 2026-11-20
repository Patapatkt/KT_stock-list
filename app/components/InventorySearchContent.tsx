// 親ページより受け取った値を検証しDBへ渡すファイル 

import { getProducts } from "../libs/getProducts";
import type { HomeProps } from "../page";
import { InventoryTable } from "./InventoryTable";


// 関数作成
export async function SeachContent({
	searchParams,
}: HomeProps) {

	// URLから検索条件を受け取る
	const params = await searchParams
	// 各引数が文字列か確認し文字列ではなかったら空白にする
	const SearchShelf = typeof params.shelf === "string" ? params.shelf : "";
	const SearchProductName = typeof params.productName === "string" ? params.productName : "";
	const SearchInquiry = typeof params.inquiry === "string" ? params.inquiry : "";
	const sortDirection = typeof params.sortDirection === "string" ? params.sortDirection : undefined;
	const sortBy = typeof params.sortBy === "string" ? params.sortBy : undefined;
	// 入力された値と部分一致している値をDBから探す
	const { productList, error, appliedFilters, appliedSort } = await getProducts(
		{
			shelf: SearchShelf,
			productName: SearchProductName,
			inquiry: SearchInquiry,
			sortDirection,
			sortBy,
		})
	const sortLabels ={
		shelf:"棚番",
		id:"id",
		productName:"商品名",
		inquiry:"仕様",
		quantity:"現在庫"
	}

	return (
		<div className="flex flex-col gap-2">
			{appliedFilters.shelf && (
				<p>絞り込み中の棚番:{appliedFilters.shelf} </p>
			)}
			{appliedFilters.productName && (
				<p>絞り込み中の商品名:{appliedFilters.productName} </p>
			)}
			{appliedFilters.inquiry && (
				<p>絞り込み中の仕様:{appliedFilters.inquiry} </p>
			)}
			{appliedSort && (
				<p>
					DBでの並び順：{sortLabels[appliedSort.sortBy]}の{appliedSort.sortDirection === "asc" ? "昇順" : "降順"}
				</p>
			)}
			{
				error !== null ? (
					<p className="form-error">{error}</p>
				) : productList.length === 0 ? (
					<p>検索条件に一致する商品はありません。</p>
				) : (
					<InventoryTable
						productList={productList}
					/>
				)
			}
		</div>
	)
}
