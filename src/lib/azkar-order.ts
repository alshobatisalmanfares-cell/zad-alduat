// Canonical display order for azkar categories (by daily usage frequency).
export const CATEGORY_ORDER: string[] = [
  "أذكار الصباح",
  "أذكار المساء",
  "أذكار الصلاة",
  "أذكار بعد الصلاة",
  "أذكار النوم",
  "أذكار الاستيقاظ",
  "أدعية مأثورة",
  "التسبيح والأذكار العامة",
  "التسبيح",
  "أدعية متنوعة",
];

export function categoryRank(name: string): number {
  const i = CATEGORY_ORDER.indexOf(name.trim());
  return i === -1 ? CATEGORY_ORDER.length : i;
}

export function sortCategories<T extends { name: string }>(list: T[]): T[] {
  return [...list].sort(
    (a, b) => categoryRank(a.name) - categoryRank(b.name) || a.name.localeCompare(b.name, "ar"),
  );
}
