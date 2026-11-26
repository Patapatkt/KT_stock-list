import type { stockRow } from "./getProducts";

// 何を受け取るか
export type PageNationProps = {
    productList: stockRow[];// ・絞り込み・並べ替え済みの在庫一覧
    PAGE_SIZE: number// ・1ページに表示する件数
    pageParam: string | null//searchParams.get("page") の結果
}

export function PageNation(
    { productList, PAGE_SIZE, pageParam }: PageNationProps
) {
    // どう処理するか
    const requestedPage = Number(pageParam);
    const page =
        Number.isSafeInteger(requestedPage) && requestedPage >= 1
            ? requestedPage// ・指定されたページの行を在庫一覧から取り出す
            : 1;//・ページ指定がなければ1ページ目を使う
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE;

    return ({
        pageRows: productList.slice(start, end),// 指定されたページの在庫行
        totalCount: productList.length// 検索条件に一致した全件数
    })
}