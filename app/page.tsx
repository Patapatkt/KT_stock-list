// 親ページ在庫一覧を返す
import { Link } from "@heroui/react";
import { SeachContent } from "./components/InventorySearchContent";
import { SearchForm } from "./components/SearchForm";

export type HomeProps = {
  searchParams: Promise<{
    shelf?: string | string[];//string[]複数ある場合に対応
    productName?: string | string[];
    inquiry?: string | string[];
    sortDirection?: string | string[]; //11/18追加
    sortBy?: string | string[];
  }>;
};

export default async function Home(
  { searchParams }: HomeProps//定義した型からSearchParamsを取り出す
) {
  // 分割代入でsearchParamsから値を取り出す
  const { shelf, productName, inquiry } = await searchParams
  return (
    <div className="min-h-screen w-full bg-gray-400 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* ページ全幅にタイトル帯を表示する */}
      <header className="border-b border-slate-800 bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-5 text-center sm:px-6">
          <h1 className="text-2xl font-bold tracking-wide sm:text-3xl">
            在庫一覧
          </h1>
        </div>
      </header>
      {/* タイトルと左端をそろえ、検索フォームと結果の間に余白を取る */}
      <main className="mx-auto flex w-full max-w-5xl flex-col  item-center gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex w-full justify-center">
          <SearchForm
            shelf={shelf}
            productName={productName}
            inquiry={inquiry}
          />
        </div>
        <div className="flex w-full justify-center">
          <SeachContent
            searchParams={searchParams}
          />
        </div>
        <div className="flex justify-end">
          <Link
            href="/history"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-4 font-semibold text-white hover:bg-slate-700"
          >
            入出庫履歴へ
          </Link>
        </div>
      </main>
    </div>
  );
}
