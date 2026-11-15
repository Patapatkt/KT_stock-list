import { HistoryProps } from "../history/page";
import { getHistories } from "../libs/getHistories";
import { HistoryTable } from "./HistoryTable";

// 履歴を取得し、表示用コンポーネントへ渡す
export async function HistoryContent(
    { searchParams }: HistoryProps
) {
    const params = await searchParams
    const historyCreatedAtFrom = typeof params.createdAtFrom === "string" ? params.createdAtFrom : "";
    const historyCreatedAtTo = typeof params.createdAtTo === "string" ? params.createdAtTo : "";
    const historyShelf = typeof params.shelf === "string" ? params.shelf : "";
    const historyProductName = typeof params.productName === "string" ? params.productName : "";
    const historyInquiry = typeof params.inquiry === "string" ? params.inquiry : "";
    const historyMovementType = typeof params.movementType === "string" ? params.movementType : "";
    const { histories, error } = await getHistories({
        createdAtFrom: historyCreatedAtFrom,
        createdAtTo:historyCreatedAtTo,
        shelf: historyShelf,
        productName: historyProductName,
        inquiry: historyInquiry,
        movementType: historyMovementType,
    });
    return (
        <HistoryTable
            historyList={histories.map((history) => ({
                ...history,
                movementType: history.movementType as "IN" | "OUT",
            }))}
        />
    )
}