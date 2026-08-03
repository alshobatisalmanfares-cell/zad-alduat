import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_khutbah",
  title: "Get a Friday sermon",
  description: "Get the full Arabic text of one Friday sermon (خطبة) by its id.",
  inputSchema: { id: z.string().describe("The sermon id returned by list_khutab.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const { data, error } = await supabaseAnon()
      .from("khutab")
      .select("id, title, category, date, content")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError(`No sermon found with id ${id}`);
    return {
      content: [{ type: "text" as const, text: `${data.title}\n\n${data.content}` }],
      structuredContent: { khutbah: data },
    };
  },
});
