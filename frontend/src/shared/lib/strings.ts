export const truncateTextInCenter = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;

    const start = text.slice(0, Math.floor(maxLength / 2) - 1);
    const end = text.slice(-Math.floor(maxLength / 2) + 1);

    return `${start}...${end}`;
};

export const capitalize = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}
