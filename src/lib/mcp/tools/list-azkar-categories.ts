import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_azkar_categories",
  title: "List azkar categories",
  description: "List the distinct azkar categories available in the app, with how many entries each contains.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { data, error } = await supabaseAnon().from("azkar").select("category");
    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    const counts = new Map<string, number>();
    for (const row of data ?? []) counts.set(row.category, (counts.get(row.category) ?? 0) + 1);
    const categories = [...counts].map(([category, count]) => ({ category, count }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(categories) }],
      structuredContent: { categories },
    };
  },
});
