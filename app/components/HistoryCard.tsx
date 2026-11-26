"use client";
import { historyRow } from "../libs/getHistories";

type InventoryCardsProps = {
  historyList: historyRow[];
};

export function HistoryCards(
  { historyList }: InventoryCardsProps
) {
  if (historyList.length === 0) {
    return (
      <p className="rounded-lg border border-slate-300 p-4">
        検索条件に一致する商品はありません
      </p>
    )
  }

  return (
    <div className="min-[481px]:hidden" >
      {historyList.map((history) => (
        <article
          key={history.id}
          className="rounded-lg border border-slate-300 bg-white p-4 text-slate-900 shadow-sm"
        >
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
            <dt className="font-semibold text-slate-600">
              入出庫時間
            </dt>
            <dd className="min-w-0 wrap-anywhere">
              {history.createdAt?.replace("T", "-") ?? ""}
            </dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
            <dt className="font-semibold text-slate-600">
              棚番
            </dt>
            <dd className="min-w-0 wrap-anywhere">
              {history.location}
            </dd>
          </div>

          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
            <dt className="font-semibold text-slate-600">
              商品名
            </dt>
            <dd className="min-w-0 wrap-anywhere">
              {history.productNumber}
            </dd>
          </div>

          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
            <dt className="font-semibold text-slate-600">
              仕様
            </dt>
            <dd className="min-w-0 wrap-anywhere">
              {history.inquiry}
            </dd>
          </div>

          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
            <dt className="font-semibold text-slate-600">
              区分
            </dt>
            <dd className="min-w-0 wrap-anywhere">
              {history.movementType === "IN" ? "入庫" :
                history.movementType === "OUT" ? "出庫" : "-"}
            </dd>
          </div>

          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
            <dt className="font-semibold text-slate-600">
              数量
            </dt>
            <dd className="min-w-0 wrap-anywhere">
              {history.quantity}
            </dd>
          </div>

        </article>
      ))}


    </div>
  )
}