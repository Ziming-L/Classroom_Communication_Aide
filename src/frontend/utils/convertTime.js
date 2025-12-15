export function formatToLocal(timestamp) {
    const dateObject = new Date(timestamp);

    const localDate = dateObject.toLocaleDateString();
    const localTime = dateObject.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return { localDate, localTime }
}

export function convertToTodayDate(timeString) {
    const now = new Date();
    const [time, offset] = timeString.split("-");
    const [hour, minute, second] = time.split(":").map(Number);

    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);
    // Apply timezone offset
    const utcOffset = parseInt(offset, 10);
    d.setHours(d.getHours() - utcOffset);

    return d;
}

export const convertToUTCTime = (hhmm) => {
    const [hour, minute] = hhmm.split(":").map(Number);
    const localDate = new Date();
    localDate.setHours(hour, minute, 0, 0);

    return localDate.toISOString().substring(11, 19) + "+00:00";
};


export const formatUtcToLocal = (utcTime) => {
    if (!utcTime) return "";
    const normalized = utcTime.replace(/\+00$/, "Z");
    const date = new Date(`2025-12-12T${normalized}`);

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export function timeAgo(isoTime) {
    const now = new Date();
    const created = new Date(isoTime);
    const diff = now - created;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 10) {
        return "Just now";
    }
    if (seconds < 60) {
        return `${seconds}s ago`;
    }
    if (minutes < 60) {
        return `${minutes}m ago`;
    }
    if (hours < 24) {
        return `${hours}h ago`;
    } 
    return `${days}d ago`;
}

