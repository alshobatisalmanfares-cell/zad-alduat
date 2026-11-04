export function normalizeArabic(value = "") {
  return String(value ?? "").normalize("NFKC").toLowerCase()
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06edـ]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي")
    .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
export function khutbahCategories(k) {
  return [...new Set((k.categories?.length ? k.categories : [k.category]).filter(Boolean))];
}
export function matchesKhutbah(k, query = "", category = null) {
  const categories = khutbahCategories(k);
  if (category && !categories.includes(category)) return false;
  const tokens = normalizeArabic(query).split(" ").filter(Boolean);
  const text = normalizeArabic([k.title, k.content, ...categories, ...(k.tags ?? [])].join(" "));
  return tokens.every(token => text.includes(token));
}