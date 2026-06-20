## Objectif

Rétablir la voix des animateurs radio en encaissant les 502 transitoires du gateway TTS upstream.

## Modifications

### `src/routes/api/public/radio-tts.ts`

1. **Timeout 8 s** sur le `fetch` vers `ai.gateway.lovable.dev` via `AbortSignal.timeout(8000)` — évite de tenir la connexion quand l'upstream ne répond pas.
2. **Retry automatique** : si la 1ʳᵉ tentative renvoie 502/503/504 ou time out, attendre 400 ms puis refaire un seul `fetch` identique. La plupart des 502 Cloudflare observés dans les logs sont transitoires et passent au 2ᵉ essai.
3. **Fallback inchangé** : si les deux tentatives échouent, on renvoie toujours `200 { fallback: true }` pour que le client bascule sur `SpeechSynthesis` sans déclencher d'erreur runtime.

Aucun changement côté client, ni sur la file d'attente DJ → chanson, ni sur le fallback navigateur existant.
