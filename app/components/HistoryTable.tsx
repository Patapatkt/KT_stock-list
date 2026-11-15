"use client";

import { createColumnHelper, createPaginatedRowModel, createSortedRowModel, flexRender, SortingState, stockFeatures, tableFeatures, useTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Pagination, SortDescriptor, Table } from "@heroui/react";
import { HistoryCards } from "./HistoryCard";
import { historyRow } from "../libs/getHistories";

// 入出庫履歴の表示コンポーネント
type HistoryTableProps = {
  historyList: historyRow[];
}

export type HistoryTableFeatures = typeof features;

// 標準機能に、実際に行を並び替える処理を追加する
const features = tableFeatures({
  ...stockFeatures,
  sortedRowModel: createSortedRowModel(),
  // ページネーション追加
  paginatedRowModel: createPaginatedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, historyRow>();

const columns = columnHelper.columns([
  columnHelper.accessor("createdAt", {
    header: "入出庫時間",
    cell: ({ getValue }) => getValue()?.replace("T", "-") ?? "",
  }),
  columnHelper.accessor("shelf", { header: "棚番" }),
  columnHelper.accessor("productName", { header: "商品名" }),
  columnHelper.accessor("inquiry", { header: "仕様" }),
  columnHelper.accessor("movementType", {
    header: "区分",
    cell: ({ getValue }) => {
      const movementType = getValue();
      return movementType === "IN" ? "入庫" : movementType ==="OUT"?"出庫":""
    }}),
  columnHelper.accessor("quantity", { header: "数量" }),
]);

// --- Sorting Bridge -------------------------------------------------------
// Convert TanStack SortingState → React Aria SortDescriptor
function toSortDescriptor(sorting: SortingState): SortDescriptor | undefined {
  const first = sorting[0];

  if (!first) return undefined;

  return {
    column: first.id,
    direction: first.desc ? "descending" : "ascending",
  };
}
// Convert React Aria SortDescriptor → TanStack SortingState
function toSortingState(descriptor: SortDescriptor): SortingState {
  return [{ desc: descriptor.direction === "descending", id: descriptor.column as string }];
}

// --- Component ------------------------------------------------------------
const PAGE_SIZE = 4;

export function HistoryTable({
  historyList,
}: HistoryTableProps) {
  const tableData = useMemo(
    () => historyList.map((history) => ({
      ...history,
      createdAt: history.createdAt ?? "",
      shelf: history.shelf ?? "",
      productName: history.productName ?? "",
      inquiry: history.inquiry ?? "",
      movementType: history.movementType ?? "",
      memo: "",
    })),
    [historyList],
  );

  // 初期表示は更新時間の昇順
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: false },
  ]);

  const table = useTable({
    features,

    data: tableData,
    columns,
    initialState: { pagination: { pageIndex: 0, pageSize: PAGE_SIZE } },
    onSortingChange: setSorting,
    state: { sorting },

  });

  const sortDescriptor = useMemo(() => toSortDescriptor(sorting), [sorting]);

  const { pageIndex } = table.state.pagination;
  const pageCount = table.getPageCount();
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const start = historyList.length === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
  const end = Math.min((pageIndex + 1) * PAGE_SIZE, historyList.length);

  const rows = table.getRowModel().rows; //現在のテーブルの行を取得

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="min-[481px]:hidden">
        <HistoryCards
          historyList={rows.map(({ original }) => original)}
        />
      </div>
      <Table>
        <Table.ScrollContainer
          className="hidden min-[481px]:block">
          <Table.Content
            aria-label="TanStack Table example"
            className="min-w-[600px]"
            sortDescriptor={sortDescriptor}
            onSortChange={(d) => setSorting(toSortingState(d))}
          >
            <Table.Header>
              {table.getHeaderGroups()[0]?.headers.map((header) => (
                <Table.Column
                  key={header.id}
                  allowsSorting={header.column.getCanSort()}
                  id={header.id}
                  isRowHeader={header.id === "shelf"}
                >
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id} id={row.id}>
                  {row.getAllCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer>
          <Pagination size="sm">
            <Pagination.Summary>
              {historyList.length === 0
                ? "該当する入出庫履歴はありません"
                : `全${historyList.length}件中${start} ～ ${end}件`
              }
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={!table.getCanPreviousPage()}
                  onPress={() => table.previousPage()}
                >
                  <Pagination.PreviousIcon />
                  Prev
                </Pagination.Previous>
              </Pagination.Item>
              {pages.map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link
                    isActive={p === pageIndex + 1}
                    onPress={() => table.setPageIndex(p - 1)}
                  >
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={!table.getCanNextPage()}
                  onPress={() => table.nextPage()}
                >
                  Next
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Table.Footer>
      </Table>
    </div>
  );
}