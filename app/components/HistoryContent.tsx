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
    const historylocation = typeof params.location === "string" ? params.location : "";
    const historyproductNumber = typeof params.productNumber === "string" ? params.productNumber : "";
    const historyInquiry = typeof params.inquiry === "string" ? params.inquiry : "";
    const historyMovementType = typeof params.movementType === "string" ? params.movementType : "";
    const { histories, error } = await getHistories({
        createdAtFrom: historyCreatedAtFrom,
        createdAtTo:historyCreatedAtTo,
        location: historylocation,
        productNumber: historyproductNumber,
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