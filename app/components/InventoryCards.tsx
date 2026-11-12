import type { stockRow } from "../libs/getProducts";

type InventoryCardsProps = {
  products: stockRow[];
};

export function InventoryCards(
  { products }: InventoryCardsProps
) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-slate-300 p-4">
        検索条件に一致する商品はありません
      </p>
    )
  }

  return (
    <div className="min-[481px]:hidden" >
      {products.map((product) => (
        <article
          key={product.id}
          className="rounded-lg border border-slate-300 bg-white p-4 text-slate-900 shadow-sm"
        >
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
            <dt className="font-semibold text-slate-600">
              棚番
            </dt>
            <dd className="min-w-0 wrap-anywhere">
              {product.shelf}
            </dd>
          </div>

          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
            <dt className="font-semibold text-slate-600">
              商品名
            </dt>
            <dd className="min-w-0 wrap-anywhere">
              {product.productName}
            </dd>
          </div>

          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
            <dt className="font-semibold text-slate-600">
              仕様
            </dt>
            <dd className="min-w-0 wrap-anywhere">
              {product.inquiry}
            </dd>
          </div>

        </article>
      ))}


    </div>
  )
}