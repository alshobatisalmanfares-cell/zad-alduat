import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_azkar",
  title: "List azkar and supplications",
  description:
    "List azkar and du'a (الأذكار والأدعية) with their full Arabic text, repetition count and category, ordered by sort order.",
  inputSchema: {
    category: z.string().optional().describe("Optional category, e.g. أذكار الصباح."),
    search: z.string().optional().describe("Optional text to match in the title or body."),
    limit: z.number().int().optional().describe("Max entries to return (default 50, max 200)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, search, limit }) => {
    const take = Math.min(Math.max(limit ?? 50, 1), 200);
    let query = supabaseAnon()
      .from("azkar")
      .select("id, title, text, category, count, sort_order")
      .order("sort_order", { ascending: true })
      .limit(take);
    if (category) query = query.eq("category", category);
    if (search) query = query.or(`title.ilike.%${search}%,text.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data ?? []) }],
      structuredContent: { azkar: data ?? [] },
    };
  },
});
