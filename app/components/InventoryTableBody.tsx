// テーブル表示部分のコンポーネント

import { flexRender, Row } from "@tanstack/react-table";
import { stockRow } from "../libs/getProducts"
import type { InventoryTableFeatures } from "./InventoryTable";

type InventoryTableBodyProps = {
    rows: Row<InventoryTableFeatures, stockRow>[];
    visibleColumnCount: number;
}

export function InventoryTableBody({
    rows,
    visibleColumnCount,
}: InventoryTableBodyProps) {
    return (
        <tbody>
            {rows.length === 0 ? (
                <tr className="border-t border-slate-200 dark:border-slate-700">
                    <td
                        colSpan={visibleColumnCount}
                        className="px-4 py-3 text-left"
                    >
                        検索条件に一致する商品はありません
                    </td>
                </tr>
            ) : (
                // 行からidが一致している行をmap関数で作る
                rows.map((row) => (
                    <tr key={row.id}>
                        {/* 作った行から対象cellを作り出す */}
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))
            )}
        </tbody>
    );
}