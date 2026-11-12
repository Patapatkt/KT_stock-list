import { Accordion, Button, Description, Input, Label, TextField } from "@heroui/react";
import { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";

type HIstorySearchFormProps = {
    createdAt?: string | string[];//入出庫時間
    shelf?: string | string[];//棚番
    productName?: string | string[];//商品名
    inquiry?: string | string[];//仕様
    movementType?: string | string[]//区分        
}

export async function HIstorySearchForm({
    shelf,
    productName,
    inquiry,
}: HIstorySearchFormProps) {

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 480px)");
        const updateIsMobile = () => setIsMobile(mediaQuery.matches);

        updateIsMobile();
        mediaQuery.addEventListener("change", updateIsMobile);

        return () => mediaQuery.removeEventListener("change", updateIsMobile);
    }, []);

    return (
        <form
            action="/history"
            method="get"
            aria-label="入出庫履歴"
        >
            <h2 className="mb-3 text-xl font-semibold">検索条件</h2>

            <div className=" grid grid-cols-1 gap-3 lg:items-end">
                <Accordion
                    expandedKeys={!isMobile || isSearchOpen ? ["search-fields"] : []}
                    onExpandedChange={(keys) => setIsSearchOpen(keys.has("search-fields"))}
                    className="w-full max-w-md">
                    <Accordion.Item id="search-fields">
                        <Accordion.Heading
                            className={isMobile ? undefined : "hidden"}
                        >
                            <Accordion.Trigger>
                                {isSearchOpen ? "検索条件を閉じる" : "検索条件を開く"}
                                <Accordion.Indicator>
                                    <BiChevronDown />
                                </Accordion.Indicator>
                            </Accordion.Trigger>
                        </Accordion.Heading>
                        <Accordion.Panel>
                            <Accordion.Body className="grid gap-3">
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


                                    {/* フォームを送信し、入力値をURLのクエリに載せる */}
                                    <Button type="submit" variant="primary" className="w-full h-11 lg:w-auto">
                                        検索
                                    </Button>
                                </TextField>
                            </Accordion.Body>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </div>
        </form >
    )
}
