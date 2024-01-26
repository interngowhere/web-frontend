export default function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: "Asia/Singapore",
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}