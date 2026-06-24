import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type CloudCustomizations = {
  custom_vehicles: unknown[];
  custom_pedestrians: unknown[];
  armored_sprite: string | null;
  asset_overrides: Record<string, unknown>;
};

export const getMyCustomizations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CloudCustomizations | null> => {
    const { data, error } = await context.supabase
      .from("user_customizations")
      .select("custom_vehicles, custom_pedestrians, armored_sprite, asset_overrides")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      custom_vehicles: (data.custom_vehicles as unknown[]) ?? [],
      custom_pedestrians: (data.custom_pedestrians as unknown[]) ?? [],
      armored_sprite: data.armored_sprite ?? null,
      asset_overrides: (data.asset_overrides as Record<string, unknown>) ?? {},
    };
  });

export const saveMyCustomizations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: Partial<CloudCustomizations>) => d)
  .handler(async ({ data, context }) => {
    const payload = {
      user_id: context.userId,
      custom_vehicles: data.custom_vehicles ?? [],
      custom_pedestrians: data.custom_pedestrians ?? [],
      armored_sprite: data.armored_sprite ?? null,
      asset_overrides: data.asset_overrides ?? {},
    };
    const { error } = await context.supabase
      .from("user_customizations")
      .upsert(payload, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
