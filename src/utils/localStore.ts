export const getStoreLocal = (item: string) => {
    if (typeof window !== "undefined") {
        return localStorage.getItem(item) as string;
    }
};
export const removeStoreLocal = (item: string) => {
    if (typeof window !== "undefined") {
        return localStorage.removeItem(item);
    }
};
export const setStoreLocal = (item: string, token: string) => {
    if (typeof window !== "undefined") {
        return localStorage.setItem(item, token);
    }
};
