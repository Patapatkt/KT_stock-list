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
            : 1;
    const totalCount = productList.length;
    const totalPage = Math.ceil(totalCount / PAGE_SIZE)
    if (pageParam !== null && page > totalPage) {
        return ({
            totalCount, page,
            error: `指定されたページはありません`
        })
    }

    return ({
        totalCount,// 検索条件に一致した全件数
        page,
        error: null,
    })
}