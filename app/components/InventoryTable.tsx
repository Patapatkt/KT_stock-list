"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SortDescriptor } from "@heroui/react";
import type { SortingState } from "@tanstack/react-table";
import { Pagination, Table } from "@heroui/react";
import {
	createColumnHelper,
	createPaginatedRowModel,
	flexRender,
	rowPaginationFeature,
	rowSortingFeature,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { useCreateAtom, useSelector } from "@tanstack/react-store";//ver9変更
import { useEffect, useMemo } from "react";
import type { stockRow } from "../libs/getProducts";
import { InventoryCards } from "./InventoryCards";
import { PageNation } from "../libs/pageNation";

type InventoryTableProps = {
	productList: stockRow[]//stockRow1行分の在庫データ
}

export type InventoryTableFeatures = typeof features;

// --- TanStack Features & Column Definitions -------------------------------
const features = tableFeatures({
	paginatedRowModel: createPaginatedRowModel(),
	rowPaginationFeature,
	rowSortingFeature,
});

const columnHelper = createColumnHelper<typeof features, stockRow>();

const columns = columnHelper.columns([
	columnHelper.accessor("location", { header: "棚番" }),
	columnHelper.accessor("productNumber", { header: "商品名" }),
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
const PAGE_SIZE = 1;

export function InventoryTable(
	{ productList }: InventoryTableProps
) {
	const sortingAtom = useCreateAtom<SortingState>([])
	const sorting = useSelector(sortingAtom)

	const table = useTable({
		columns,
		data: productList,
		features,
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: PAGE_SIZE,
			},
		},
		atoms: {
			sorting: sortingAtom
		},
	});

	const sortDescriptor = useMemo(() => toSortDescriptor(sorting), [sorting]);

	const { pageIndex } = table.state.pagination;
	const pageCount = table.getPageCount();
	const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
	const start = pageIndex * PAGE_SIZE + 1;
	const router = useRouter()

	const searchParams = useSearchParams();
	const pageParam = searchParams.get("page");
	const { page,totalCount, error: pageError } = PageNation({
		productList, PAGE_SIZE, pageParam
	})

	const end = Math.min((pageIndex + 1) * PAGE_SIZE, totalCount);

	const rows = table.getRowModel().rows; //現在のテーブルの行を取得

	useEffect(() => {
		const nextPageIndex = page - 1

		if (!pageError && pageIndex !== nextPageIndex) {
			table.setPageIndex(nextPageIndex);
		}
	}, [page,pageError, pageIndex, table]);

	if (pageError) {
		return <p>{pageError}</p>
	}
	function goToPage(page: number) {
		const params = new URLSearchParams(window.location.search);
		params.set("page", String(page));
		router.push(`?${params.toString()}`);
	}

	return (
		<div className="flex w-full min-w-0 flex-col gap-4">
			<div className="min-[481px]:hidden">
				<InventoryCards
					products={rows.map((row) => row.original)}
				/>
			</div>
			<div className="w-full rounded-2xl border border-gray-500">
				<Table>
					<Table.ScrollContainer
						className="hidden min-[481px]:block">
						<Table.Content
							aria-label="TanStack Table example"
							className="min-w-[600px]"
							sortDescriptor={sortDescriptor}
							onSortChange={(descriptor) => {
								table.setSorting(toSortingState(descriptor));

								const sortDirection =
									descriptor.direction === "ascending" ? "asc" : "desc";

								const params = new URLSearchParams(window.location.search);
								params.set("sortDirection", sortDirection);
								params.set("sortBy", String(descriptor.column));

								router.push(`?${params.toString()}`);
							}}
						>
							<Table.Header>
								{table.getHeaderGroups()[0]?.headers.map((header) => (
									<Table.Column
										key={header.id}
										allowsSorting={header.column.getCanSort()}
										id={header.id}
										isRowHeader={header.id === "location"}
										className="text-base font-semibold border-r border-gray-500 last:border-r-0"
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
								{rows.map((row) => (
									<Table.Row key={row.id} id={row.id} className="group">
										{row.getAllCells().map((cell) => (
											<Table.Cell key={cell.id}
												className="border-r border-gray-500 bg-white group-hover:bg-gray-100 last:border-r-0"
											>
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
								{totalCount === 0
									? "検索条件に一致する商品はありません"
									: `全${totalCount}件中${start} ～ ${end}件`
								}
							</Pagination.Summary>
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.Previous
										isDisabled={!table.getCanPreviousPage()}
										onPress={() => goToPage(pageIndex)}
									>
										<Pagination.PreviousIcon />
										前ページへ
									</Pagination.Previous>
								</Pagination.Item>
								{pages.map((p) => (
									<Pagination.Item key={p}>
										<Pagination.Link
											isActive={p === pageIndex + 1}
											onPress={() => {
												goToPage(p)
											}}
										>
											{p}
										</Pagination.Link>
									</Pagination.Item>
								))}
								<Pagination.Item>
									<Pagination.Next
										isDisabled={!table.getCanNextPage()}
										onPress={() => goToPage(pageIndex + 2)}
									>
										次ページへ
										<Pagination.NextIcon />
									</Pagination.Next>
								</Pagination.Item>
							</Pagination.Content>
						</Pagination>
					</Table.Footer>
				</Table>
			</div>
		</div>
	);
}