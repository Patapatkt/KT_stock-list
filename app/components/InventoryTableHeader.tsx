import { flexRender } from "@tanstack/react-table";
import type { HeaderGroup } from "@tanstack/react-table";
import type { stockRow } from "../libs/getProducts";
import type { InventoryTableFeatures } from "./InventoryTable";
import { FaSortDown, FaSortUp } from "react-icons/fa6";
type InventoryTableHeaderProps = {
    // 親から受け取る見出し行の配列
    headerGroups: HeaderGroup<InventoryTableFeatures, stockRow>[];
};

export function InventoryTableHeader({
    headerGroups,
}: InventoryTableHeaderProps) {
    return (
        <thead className="bg-slate-100 dark:bg-slate-800">
            {/* 見出しグループ1つにつき、見出し行を1つ作る */}
            {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {/* この行の見出し1つにつき、thを1つ作る */}
                    {headerGroup.headers.map((header) => {
                        // グループ化された見出しを使うときの空きマス
                        if (header.isPlaceholder) {
                            return <th key={header.id} colSpan={header.colSpan} 
                                    className="whitespace-nowrap px-4 py-3 text-center font-semibold"
                            />;
                        }

                        // columns で設定した見出しを描画する
                        const label = flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                        );
                        const sortDirection = header.column.getIsSorted();

                        return (
                            <th key={header.id} colSpan={header.colSpan}
                                className={`whitespace-nowrap px-4 py-3 text-center font-semibold ${header.column.id === "quantity" ? "text-right" : "text-left"
                                    }`}
                            >

                                {header.column.getCanSort() ? (
                                    // 並び替えできる列は、見出しをボタンにする
                                    <button
                                        type="button"
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="inline-flex items-center justify-center gap-1"
                                    >
                                        {label}
                                        {sortDirection === "asc" && <FaSortUp />}
                                        {sortDirection === "desc" && <FaSortDown />}
                                    </button>
                                ) : (
                                    label
                                )}
                            </th>
                        );
                    })}
                </tr>
            ))}
        </thead>
    );
}