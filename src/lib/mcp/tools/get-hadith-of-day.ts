import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_hadith_of_day",
  title: "Get hadith of the day",
  description: "Get the current featured hadith of the day (حديث اليوم) shown on the app home page.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { data, error } = await supabaseAnon()
      .from("app_settings")
      .select("value, updated_at")
      .eq("key", "hadith_of_day")
      .maybeSingle();
    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    const text = data?.value ?? "";
    return {
      content: [{ type: "text" as const, text: text || "No hadith of the day is set." }],
      structuredContent: { hadith: text, updatedAt: data?.updated_at ?? null },
    };
  },
});
