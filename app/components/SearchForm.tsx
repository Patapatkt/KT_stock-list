"use client";

import { Button, Description, Input, Label, TextField } from "@heroui/react";

type SearchFormProps = {
    shelf?: string | string[];
    productName?: string | string[];
    inquiry?: string | string[];
};

export function SearchForm({
    shelf,
    productName,
    inquiry,
}: SearchFormProps) {
    return (
        <form
            action="/"
            method="get"
            aria-label="在庫検索"
            className="max-auto w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-4
                       dark:border-zinc-700 dark:bg-zinc-900 sm:p-5"
        >
            <h2 className="mb-4 text-xl font-semibold">検索条件</h2>

            {/* 狭い画面では縦並び、広い画面では入力欄とボタンを横並びにする */}
            <div className=" grid grid-cols-1 gap-4 lg:items-end">
                <TextField
                    name="shelf"
                    defaultValue={typeof shelf === "string" ? shelf : ""}
                    className="min-w-0"
                >
                    <Label>棚番</Label>
                    <div
                        className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:items-center sm:gap-4"
                    >
                        <Input
                            className="w-full h-11"
                            placeholder="例：A1"
                            maxLength={6}
                        />
                        {/* 入力補足 */}
                        <Description className="text-sm leading-5 text-slate-600 dark:text-slate-300">
                            半角英数字で最大6文字<br/>
                            先頭の数文字でも検索可
                        </Description>
                    </div>
                </TextField>

                <TextField
                    name="productName"
                    defaultValue={typeof productName === "string" ? productName : ""}
                    className="min-w-0"
                >
                    <Label>商品名</Label>
                    <div
                        className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:items-center sm:gap-4"
                    >
                        <Input className="w-full h-11" placeholder="例：りんご" />

                        {/* 入力補足 */}
                        <Description className="text-sm leading-5 text-slate-600 dark:text-slate-300">
                            全角英数字で検索<br/>
                            前方部分一致でも検索可
                        </Description>
                    </div>
                </TextField>

                <TextField
                    name="inquiry"
                    defaultValue={typeof inquiry === "string" ? inquiry : ""}
                    className="min-w-0"
                >
                    <Label>仕様</Label>
                    <div
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end"
                    >
                        <Input className="w-full h-11" placeholder="例：M" />
                        {/* 入力補足 */}
                        <Description className="text-sm leading-5 text-slate-600 dark:text-slate-300">
                            全角英数字で検索<br/>
                            前方部分一致でも検索可
                        </Description>
                    </div>
                </TextField>

                {/* フォームを送信し、入力値をURLのクエリに載せる */}
                <Button type="submit" variant="primary" className="w-full h-11 lg:w-auto">
                    検索
                </Button>
            </div>
        </form>
    );
}