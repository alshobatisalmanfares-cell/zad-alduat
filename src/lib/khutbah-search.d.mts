export function normalizeArabic(value?: string | null): string;
export function khutbahCategories(k: { category?: string; categories?: string[] }): string[];
export function matchesKhutbah(k: { title?: string; content?: string; category?: string; categories?: string[]; tags?: string[] }, query?: string, category?: string | null): boolean;