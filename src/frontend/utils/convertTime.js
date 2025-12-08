export function formatToLocal(timestamp) {
    const dateObject = new Date(timestamp);

    const localDate = dateObject.toLocaleDateString();
    const localTime = dateObject.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return { localDate, localTime }
}