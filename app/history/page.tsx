import Link from "next/link";
import {HistoryTable} from "../components/HistoryTable";
import { gethistories } from "../libs/getHistories";

export default async function StockHistory() {
        const historyList = await gethistories()
    return (
        <main>
            <div>
                <h1> 入出庫履歴</h1 >
            </div>
            <HistoryTable
                historyList ={historyList}
            />
            <div>
                <Link href="/">
                    在庫一覧
                </Link>
            </div>
        </main>
    )
}
