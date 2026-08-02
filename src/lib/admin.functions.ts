import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const KhutbahInput = z.object({
  title: z.string().min(1).max(300),
  category: z.string().max(120).default(""),
  date: z.string().max(60).default(""),
  content: z.string().min(1),
});

const DhikrInput = z.object({
  title: z.string().min(1).max(300),
  text: z.string().min(1),
  category: z.string().max(120).default(""),
  count: z.number().int().min(1).default(1),
  sort_order: z.number().int().default(0),
});

const Payload = z.object({
  password: z.string().min(1),
  action: z.enum([
    "khutbah.create",
    "khutbah.update",
    "khutbah.delete",
    "dhikr.create",
    "dhikr.update",
    "dhikr.delete",
    "hadith.set",
  ]),
  id: z.string().uuid().optional(),
  data: z.unknown().optional(),
});

export const adminMutate = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Payload.parse(data))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || data.password !== expected) {
      throw new Error("Unauthorized");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    switch (data.action) {
      case "khutbah.create": {
        const input = KhutbahInput.parse(data.data);
        const { data: row, error } = await supabaseAdmin
          .from("khutab").insert(input).select().single();
        if (error) throw new Error(error.message);
        return row;
      }
      case "khutbah.update": {
        if (!data.id) throw new Error("id required");
        const input = KhutbahInput.partial().parse(data.data);
        const { data: row, error } = await supabaseAdmin
          .from("khutab").update(input).eq("id", data.id).select().single();
        if (error) throw new Error(error.message);
        return row;
      }
      case "khutbah.delete": {
        if (!data.id) throw new Error("id required");
        const { error } = await supabaseAdmin
          .from("khutab").delete().eq("id", data.id);
        if (error) throw new Error(error.message);
        return { ok: true };
      }
      case "hadith.set": {
        const value = z.object({ value: z.string().min(1) }).parse(data.data).value;
        const { error } = await supabaseAdmin
          .from("app_settings")
          .upsert({ key: "hadith_of_day", value, updated_at: new Date().toISOString() });
        if (error) throw new Error(error.message);
        return { ok: true };
      }
    }
  });
