"use client";

import { useState } from "react"
import type { stockRow } from "../libs/getProducts"
import { ColumnDef, createPaginatedRowModel, createSortedRowModel, SortingState, stockFeatures, tableFeatures, useTable } from "@tanstack/react-table"
import { InventoryTableBody } from "./InventoryTableBody";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { InventoryCards } from "./InventoryCards";
import { Accordion } from '@heroui/react';

type InventoryTableProps = {
    productList: stockRow[]//stockRow1行分の在庫データ
}

export type InventoryTableFeatures = typeof features

// 標準機能に、実際に行を並び替える処理を追加する
const features = tableFeatures({
    ...stockFeatures,
    sortedRowModel: createSortedRowModel(),
    // ページネーション追加
    paginatedRowModel: createPaginatedRowModel(),
})

// 「使う機能の型」「行データの型」の順に指定する
const columns: ColumnDef<typeof features, stockRow>[] = [
    {
        accessorKey: "shelf",
        header: "棚番",
        sortFn: (rowA, rowB) =>
            rowA.original.shelf.localeCompare(
                rowB.original.shelf,
                "ja",
            ),
    },
    {
        accessorKey: "productName",
        header: "商品名",
        // 昇順の比較を定義し、降順への反転はテーブルに任せる
        sortFn: (rowA, rowB) =>
            rowA.original.productName.localeCompare(
                rowB.original.productName,
                "ja",
            ),
    },
    {
        accessorKey: "inquiry",
        header: "仕様",
        sortFn: (rowA, rowB) =>
            rowA.original.inquiry.localeCompare(
                rowB.original.inquiry,
                "ja",
            ),
    },
    {
        accessorKey: "quantity",
        header: "現在庫",
        sortFn: (rowA, rowB) =>
            rowA.original.quantity - rowB.original.quantity,
    },
];

export function InventoryTable({
    productList,
}: InventoryTableProps) {
    // 初期表示は棚番の昇順
    const [sorting, setSorting] = useState<SortingState>([
        { id: "shelf", desc: false },
    ]);

    const table = useTable({
        features,

        data: productList,
        columns,
        getRowId: (product) => String(product.id),

        // 初期表示では日時2列を非表示にする
        initialState: {
            columnVisibility: {
                lastReceivedAt: false,
                lastShippedAt: false,
            },
            // ページネーション追加
            pagination: {
                pageIndex: 0,//0が1ページ目
                pageSize: 10,//1ページに表示する件数
            },
        },

        // ソート状態をReactで管理する
        state: {
            sorting,
        },
        onSortingChange: setSorting,

        // ページネーション追加

        autoResetAll: true, // データが変わったらソート状態をリセットする

        // 昇順と降順の2通りで切り替える
        enableSortingRemoval: false,
        enableMultiSort: false,
    });

    // 日時の表示切替に使う列を取得する
    const dateColumns = table.getAllLeafColumns().filter(
        (column) =>
            column.id === "lastReceivedAt" ||
            column.id === "lastShippedAt",
    );

    // 並び替えボタンに使う列を取得する
    const sortColumns = table.getAllLeafColumns().filter(
        (column) =>
            column.id === "shelf" ||
            column.id === "productName" ||
            column.id === "inquiry",
    );

    return (
        <div className="mx-auto w-full max-w-5xl">
            {/* <InventoryCheckbox columns={dateColumns} />

            <InventorySort columns={sortColumns} /> */}
            {/* ページネーション追加 */}
            <nav
                aria-label="在庫一覧のページ切り替え"
                className="my-4 flex flex-wrap items-center justify-center gap-3"
            >
                <button
                    type="button"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    前へ
                </button>

                <span aria-live="polite">
                    {table.getPageCount() === 0
                        ? 0
                        : table.state.pagination.pageIndex + 1}
                    {" / "}
                    {table.getPageCount()} ページ
                    （全{productList.length}件）
                </span>

                <button
                    type="button"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    次へ
                </button>
            </nav>
            {/* スマホ用の表 */}
            <div className="min-[481px]:hidden">
                <InventoryCards
                    rows={table.getRowModel().rows as unknown as Parameters<typeof InventoryCards>[0]["rows"]}
                />
            </div>
            {/* PC用の表 */}
            <div className="mt-4 hidden min-[481px]:block">
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <table className="w-full min-w-[420px] table-fixed border-collapse text-base leading-6
                        [&_th]:text-center [&_td]:px-3 [&_td]:py-2 [&_td]:text-center
                        [&_td]:wrap-anywhere">
                        <InventoryTableHeader
                            headerGroups={table.getHeaderGroups()}
                        />

                        <InventoryTableBody
                            rows={table.getRowModel().rows}
                            visibleColumnCount={
                                table.getVisibleLeafColumns().length
                            }
                        />
                    </table>
                </div>
            </div>
        </div>
    );
}