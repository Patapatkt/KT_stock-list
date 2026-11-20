"use client";

import { useState } from "react";
import { Button, Description, Input, Label, TextField } from "@heroui/react";
import { Accordion } from "@heroui/react";
import { BiChevronDown } from "react-icons/bi";
import { FcSearch } from "react-icons/fc";

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
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	return (

		<form
			action="/"
			method="get"
			aria-label="在庫検索"
			className="mx-auto w-full max-w-lg rounded-xl p-4 sm:p-5"
		>

			{/* 狭い画面では縦並び、広い画面では入力欄とボタンを横並びにする */}
			<div className=" grid grid-cols-1 gap-3 lg:items-end">
				<Accordion
					onExpandedChange={(keys) => setIsSearchOpen(keys.has("search-fields"))}
					className="w-full max-w-md">
					<Accordion.Item id="search-fields">
						<Accordion.Heading>
							<Accordion.Trigger
								className="flex min-h-11 w-full items-center justify-between gap-3
                                rounded-lg border border-slate-300 bg-white px-4 py-2.5
                                text-left text-sm font-semibold text-slate-900
                                hover:bg-slate-50
                                focus-visible:outline-2 focus-visible:outline-offset-2
                                focus-visible:outline-blue-600 min-[481px]:text-base"
							>
								<FcSearch />
								{isSearchOpen ? "検索条件を閉じる" : "検索条件を開く"}
								<Accordion.Indicator>
									<BiChevronDown />
								</Accordion.Indicator>
							</Accordion.Trigger>
						</Accordion.Heading>
						<Accordion.Panel>
							<Accordion.Body className="grid gap-3 bg-white rounded-lg">
								{/* ここにスマホ版min-480pxだったら選択欄を表示 */}
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
										<Description className="text-xs leading-4 text-slate-600 dark:text-slate-300">
											半角英数字で最大6文字<br />
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
										<Description className="text-xs leading-4 text-slate-600 dark:text-slate-300">
											全角英数字で検索<br />
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
										className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:items-center sm:gap-4"
									>
										<Input className="w-full h-11" placeholder="例：M" />
										{/* 入力補足 */}
										<Description className="text-xs leading-4 text-slate-600 dark:text-slate-300">
											全角英数字で検索<br />
											前方部分一致でも検索可
										</Description>
									</div>
									<Button type="submit" variant="primary" className="text-end w-full h-11 lg:w-auto">
										検索
									</Button>
								</TextField>
							</Accordion.Body>
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
				<div
					className="grid gap-3 min-[481px]:hidden"
				>
					<label>
						並べる項目
						<select name="sortBy" >
							<option value="shelf">棚番</option>
							<option value="productName">商品名</option>
							<option value="inquiry">仕様</option>
							<option value="quantity">現在庫</option>
						</select>
					</label>
					<label>
						昇順・降順
						<select name="sortDirection">
							<option value="asc">昇順</option>
							<option value="desc">降順</option>
						</select>
					</label>
					<Button type="submit" variant="primary">
						並べ替え
					</Button>
				</div>
			</div>
		</form >
	);
}