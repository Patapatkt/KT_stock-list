"use client";

import type { SortDescriptor } from "@heroui/react";
import type { SortingState } from "@tanstack/react-table";

import { Pagination, Table } from "@heroui/react";
import {
	createColumnHelper,
	createPaginatedRowModel,
	createSortedRowModel,
	flexRender,
	rowPaginationFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { stockRow } from "../libs/getProducts";
import { InventoryCards } from "./InventoryCards";

type InventoryTableProps = {
	productList: stockRow[]//stockRow1行分の在庫データ
}

export type InventoryTableFeatures = typeof features

// --- TanStack Features & Column Definitions -------------------------------
const features = tableFeatures({
	paginatedRowModel: createPaginatedRowModel(),
	rowPaginationFeature,
	rowSortingFeature,
	sortFns: {
		alphanumeric: sortFn_alphanumeric,
	},
	sortedRowModel: createSortedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, stockRow>();

const columns = columnHelper.columns([
	columnHelper.accessor("shelf", { header: "棚番" }),
	columnHelper.accessor("productName", { header: "商品名" }),
	columnHelper.accessor("inquiry", { header: "仕様" }),
	columnHelper.accessor("quantity", { header: "現在庫" }),
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

export function TanstackTable(
	{ productList }: InventoryTableProps
) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useTable({
		columns,
		data: productList,
		features,
		initialState: { pagination: { pageIndex: 0, pageSize: PAGE_SIZE } },
		onSortingChange: setSorting,
		state: { sorting },
	});

	const sortDescriptor = useMemo(() => toSortDescriptor(sorting), [sorting]);

	const { pageIndex } = table.state.pagination;
	const pageCount = table.getPageCount();
	const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
	const start = pageIndex * PAGE_SIZE + 1;
	const end = Math.min((pageIndex + 1) * PAGE_SIZE, productList.length);

	const rows = table.getRowModel().rows; //現在のテーブルの行を取得

	return (
		<div className="flex w-full min-w-0 flex-col gap-4">
			<div className="min-[481px]:hidden">
				<InventoryCards
					products={rows.map((row) => row.original)}
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
							{start} to {end} of {productList.length} results
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