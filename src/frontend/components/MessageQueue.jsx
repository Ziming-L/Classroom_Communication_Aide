import React, { useState } from "react";

export default function VerticalQueue() {
    const [queue, setQueue] = useState(["Item 1", "Item 2", "Item 3"]);

    const enqueue = () => {
        setQueue([...queue, `Item ${queue.length + 1}`]);
    };

    const dequeue = () => {
        setQueue(queue.slice(1));
    };

    return (
        <div style={styles.container}>
            <button onClick={enqueue}>Enqueue</button>
            <button onClick={dequeue} disabled={!queue.length}>
                Dequeue
            </button>
            <ul style={styles.queue}>
                {queue.map((item, index) => (
                    <li key={index} style={styles.item}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: { width: "1000px", textAlign: "left" },
    queue: {
        listStyle: "none",
        padding: 0,
        margin: "1rem 0",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    item: {
        background: "#61dafb",
        padding: "8px",
        borderRadius: "4px",
    },
};