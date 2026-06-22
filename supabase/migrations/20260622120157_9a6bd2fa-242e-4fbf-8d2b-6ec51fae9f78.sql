
-- Fonctions trigger uniquement : pas appelables via l'API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tt_set_updated_at() FROM PUBLIC, anon, authenticated;

-- Fonction dépréciée : on la supprime
DROP FUNCTION IF EXISTS public.submit_defi_score(uuid, integer);

-- RPCs utilisateur : retirer l'accès à anon, garder authenticated
REVOKE ALL ON FUNCTION public.add_license_xp(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_license_xp(integer) TO authenticated;

REVOKE ALL ON FUNCTION public.create_defi(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_defi(text, integer) TO authenticated;

REVOKE ALL ON FUNCTION public.submit_defi_run(uuid, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_defi_run(uuid, integer, integer) TO authenticated;

REVOKE ALL ON FUNCTION public.find_user_by_pseudo(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_user_by_pseudo(text) TO authenticated;

-- has_role : appelée par les policies RLS pour les utilisateurs authentifiés
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
