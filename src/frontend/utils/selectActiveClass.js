import { convertToTodayDate } from "./convertTime";

export function selectActiveClass(classes = []) {
    if (!classes.length) return null;

    const now = new Date();

    const active = classes.find(cls => {
        const start = convertToTodayDate(cls.class_start);
        const end = convertToTodayDate(cls.class_end);
        return now >= start && now <= end;
    });

    if (active) {
        return active;
    } else if (classes.length === 1) {
        return classes[0];
    }
    return null;
}
