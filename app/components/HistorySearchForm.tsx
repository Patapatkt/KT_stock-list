"use client";

import { Accordion, Button, DatePicker, Description, Input, Label, ListBox, Select, TextField } from "@heroui/react";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { FcSearch } from "react-icons/fc";

type HistorySearchFormProps = {
	createdAtFrom?: string | string[];//検索開始時間
	createdAtTo: string | string[],//検索終了時間
	shelf?: string | string[];//棚番
	productName?: string | string[];//商品名
	inquiry?: string | string[];//仕様
	movementType?: string | string[]//区分        
}

export function HistorySearchForm({
	createdAtFrom,
	createdAtTo,
	shelf,
	productName,
	inquiry,
	movementType,
}: HistorySearchFormProps) {

	const [isSearchOpen, setIsSearchOpen] = useState(false);

	return (
		<form
			action="/history"
			method="get"
			aria-label="入出庫履歴"
		>
			<div className=" grid grid-cols-1 gap-3 lg:items-center">
				<Accordion
					onExpandedChange={(keys) => setIsSearchOpen(keys.has("search-fields"))}
					className="w-full  max-w-md min-[481px]:max-w-none">
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
							<Accordion.Body className="grid grid-cols-1 gap-4 pt-4 min-[481px]:grid-cols-2">
								<TextField className="min-w-0">
									<Label>検索開始日時</Label>
									<Input
										name="createdAtFrom"
										type="datetime-local"
										className="h-11 w-full text-center [&::-webkit-datetime-edit]:text-center"
									/>
								</TextField>
								<TextField className="min-w-0">
									<Label>検索終了日時</Label>
									<Input
										name="createdAtTo"
										type="datetime-local"
										className="h-11 w-full text-center [&::-webkit-datetime-edit]:text-center"
									/>
								</TextField>

								<TextField
									name="shelf"
									defaultValue={typeof shelf === "string" ? shelf : ""}
									className="min-w-0"
								>
									<Label>棚番</Label>
									<Description className="text-xs leading-4 text-slate-600 dark:text-slate-300">
										前方部分一致でも検索可
									</Description>
									<div className="mt-1 grid grid-cols-1 gap-2 min-[481px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] 
                                    min-[481px]:items-center min-[481px]:gap-4">

										<Input
											className="w-full h-11 text-center"
											placeholder="例：A12345/半角英数字で最大6文字 "
											maxLength={6}
										/>
									</div>
								</TextField>

								<TextField
									name="productName"
									defaultValue={typeof productName === "string" ? productName : ""}
									className="min-w-0"
								>
									<div className="mt-1 grid grid-cols-1 gap-2 min-[481px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] 
                                    min-[481px]:items-center min-[481px]:gap-4">
										<Label>商品名</Label>
										<Description className="text-xs leading-4 text-slate-600 dark:text-slate-300">
											前方部分一致でも検索可
										</Description>
										<Input className="w-full h-11 text-center" placeholder="例：りんご/全角英数字で検索" />
									</div>
								</TextField>

								<TextField
									name="inquiry"
									defaultValue={typeof inquiry === "string" ? inquiry : ""}
									className="min-w-0"
								>
									<Label>仕様</Label>
									<Description className="text-xs leading-4 text-slate-600 dark:text-slate-300">
										前方部分一致でも検索可
									</Description>
									<div className="mt-1 grid grid-cols-1 gap-2 min-[481px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] 
                                    min-[481px]:items-center min-[481px]:gap-4">
										<Input className="w-full h-11 text-center" placeholder="例：M/全角英数字で検索" />

									</div>
								</TextField>
								<div className="mt-1 text-center grid grid-cols-1 gap-2 min-[481px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] 
                                                        min-[481px]:items-center min-[481px]:gap-4">
									<Select
										name="movementType"
										className="w-full min-w-0"
										placeholder="入庫・出庫を選択"
									>
										<Label>区分</Label>
										<Select.Trigger>
											<Select.Value className="flex-1 text-center" />
											<Select.Indicator />
										</Select.Trigger>
										<Select.Popover
										>
											<ListBox>
												<ListBox.Item id="入庫" textValue="入庫">
													入庫
													<ListBox.ItemIndicator />
												</ListBox.Item>
												<ListBox.Item id="出庫" textValue="出庫">
													出庫
													<ListBox.ItemIndicator />
												</ListBox.Item>
											</ListBox>
										</Select.Popover>
									</Select>
								</div>

								{/* フォームを送信し、入力値をURLのクエリに載せる */}
								<Button type="submit" variant="primary" className="w-full h-11 lg:w-auto">
									検索
								</Button>
							</Accordion.Body>
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</div >
		</form >
	)
}
