// 親ページより受け取った値を検証しDBへ渡すファイル 

import { getProducts } from "../libs/getProducts";
import type { HomeProps } from "../page";
import {InventoryTable} from "./InventoryTable";


// 関数作成
export async function SeachContent({
    searchParams
}: HomeProps) {

    // URLから検索条件を受け取る
    const params =await searchParams
    const {shelf,productName,inquiry} =  params
    // 各引数が文字列か確認し文字列ではなかったら空白にする
    const SearchShelf = typeof params.shelf === "string" ? params.shelf : "";
    const SearchProductName = typeof params.productName === "string" ? params.productName : "";
    const SearchInquiry = typeof params.inquiry === "string" ? params.inquiry : "";
    // 入力された値と部分一致している値をDBから探す
    const { productList, error } = await getProducts({
        shelf: SearchShelf,
        productName: SearchProductName,
        inquiry: SearchInquiry,
    })
    return (
        <>
            {
                error !== null ? (
                    <p className="form-error">{error}</p>
                ) : productList.length === 0 ? (
                    <p>検索条件に一致する商品はありません。</p>
                ) : (
                    <InventoryTable
                        productList ={productList}
                    />
                )
            }
        </>
    )
}
