import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_khutab",
  title: "List Friday sermons",
  description:
    "List published Friday sermons (خطب الجمعة) with id, title, category and date. Optionally filter by category or a search term.",
  inputSchema: {
    search: z.string().optional().describe("Optional text to match in the sermon title or content."),
    category: z.string().optional().describe("Optional category name to filter by."),
    limit: z.number().int().optional().describe("Max sermons to return (default 20, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, category, limit }) => {
    const take = Math.min(Math.max(limit ?? 20, 1), 100);
    let query = supabaseAnon()
      .from("khutab")
      .select("id, title, category, date, created_at")
      .order("created_at", { ascending: false })
      .limit(take);
    if (category) query = query.eq("category", category);
    if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data ?? []) }],
      structuredContent: { khutab: data ?? [] },
    };
  },
});
