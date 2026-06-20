// =============================================================
// Lot 5 — Persistance backend (Lovable Cloud).
// Sauvegarde le `SaveData` du joueur connecté dans la table
// `public.game_saves` (RLS : un joueur ne voit/écrit que sa ligne).
// Le localStorage reste utilisé comme cache instantané ; le cloud
// sert de source de vérité au login et entre appareils.
// =============================================================
import { supabase } from "@/integrations/supabase/client";

export type CloudSavePayload = {
  data: unknown;
  updatedAt: string; // ISO
};

/** Récupère la sauvegarde du joueur connecté ou null si pas trouvée / pas connecté. */
export async function fetchCloudSave(): Promise<CloudSavePayload | null> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  const { data, error } = await supabase
    .from("game_saves")
    .select("data, updated_at")
    .eq("user_id", session.session.user.id)
    .maybeSingle();
  if (error) {
    console.warn("[cloudSave] fetch error", error.message);
    return null;
  }
  if (!data) return null;
  return { data: data.data, updatedAt: data.updated_at as string };
}

/** Upsert de la sauvegarde du joueur connecté. No-op si pas connecté. */
export async function pushCloudSave(payload: unknown): Promise<boolean> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return false;
  const userId = session.session.user.id;
  const { error } = await supabase
    .from("game_saves")
    .upsert(
      { user_id: userId, data: payload as never, version: 1 },
      { onConflict: "user_id" },
    );
  if (error) {
    console.warn("[cloudSave] push error", error.message);
    return false;
  }
  return true;
}
