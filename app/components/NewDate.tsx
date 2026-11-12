// 入出庫時間のコンポーネント

type NewDateProps ={
    value:string;
}

export function NewDate({
    value,
}:NewDateProps){
     return new Date(value).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}