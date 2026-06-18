import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export const getLatestApkUrl = createServerFn({ method: "GET" })
  .handler(async () => {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient(url, key);

    const { data, error } = await supabase.storage.from("apks").list("", {
      limit: 100,
      sortBy: { column: "updated_at", order: "desc" },
    });
    if (error || !data || data.length === 0) return null;

    const apk = data.find((f) => f.name.toLowerCase().endsWith(".apk"));
    if (!apk) return null;

    const { data: signed } = await supabase.storage.from("apks").createSignedUrl(apk.name, 60 * 60 * 24);
    if (!signed?.signedUrl) return null;

    return { url: signed.signedUrl, name: apk.name };
  });
