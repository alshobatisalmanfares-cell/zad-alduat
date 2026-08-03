import { defineMcp } from "@lovable.dev/mcp-js";
import listKhutab from "./tools/list-khutab";
import getKhutbah from "./tools/get-khutbah";
import listAzkar from "./tools/list-azkar";
import listAzkarCategories from "./tools/list-azkar-categories";
import getHadithOfDay from "./tools/get-hadith-of-day";

export default defineMcp({
  name: "zad-the-preacher-s-provision",
  title: "Zād: The Preacher's Provision",
  version: "0.1.0",
  instructions:
    "Read-only tools for Zād (زاد الدعاة), an Arabic Islamic app for preachers. Use list_khutab and get_khutbah for Friday sermons, list_azkar_categories and list_azkar for azkar and supplications, and get_hadith_of_day for the featured hadith. All text is Arabic.",
  tools: [listKhutab, getKhutbah, listAzkarCategories, listAzkar, getHadithOfDay],
});
