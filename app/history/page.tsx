import Link from "next/link";
import { HistorySearchForm } from "../components/HistorySearchForm";
import { HistoryContent } from "../components/HistoryContent";

export type HistoryProps = {
    searchParams: Promise<{
        createdAtFrom?: string | string[];
        createdAtTo?: string | string[];
        shelf?: string | string[];
        productName?: string | string[];
        inquiry?: string | string[];
        quantity?: string | string[];
        movementType?: "IN" | "OUT" | undefined;
    }>
}

export default async function StockHistory({
    searchParams }: HistoryProps
) {
    const {
        createdAtFrom, createdAtTo, shelf, productName, inquiry, movementType
    } = await searchParams

    return (
        <div className="min-h-screen w-full bg-slate-100 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            {/* ページ全幅にタイトル帯を表示する */}
            <header className="border-b border-slate-800 bg-slate-900 text-white">
                <div className="mx-auto max-w-5xl px-4 py-5 text-center sm:px-6">
                    <h1 className="text-2xl font-bold tracking-wide sm:text-3xl">
                        入出庫履歴
                    </h1 >
                </div>
            </header >
            <main className="mx-auto flex w-full max-w-5xl flex-col  item-center gap-6 px-4 py-6 sm:px-6 sm:py-8">
                <div className="flex w-full justify-center">

                    <HistorySearchForm
                        createdAtFrom={createdAtFrom}
                        createdAtTo={createdAtTo ?? ""}
                        shelf={shelf}
                        productName={productName}
                        inquiry={inquiry}
                        movementType={movementType}
                    />
                </div>
                <div>
                    <HistoryContent
                        searchParams={searchParams}
                    />
                </div>

                <div className="flex justify-end">
                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-4 font-semibold text-white hover:bg-slate-700"
                    >
                        在庫一覧へ
                    </Link>
                </div>
            </main>
        </div >
    )
}
