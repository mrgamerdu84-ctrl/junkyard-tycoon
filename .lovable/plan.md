# Pack radio + playlists par catégorie + TTS mobile

## 1. Importer les musiques du ZIP
- Extraire `radio_music_pack.zip` et placer les MP3 dans `src/assets/radio/{rock,pop,electro,retro-wave,relax}/`.
- Les fichiers sont importés via `import.meta.glob` (eager, `?url`) — Vite bundle-les automatiquement, pas de copier-coller d'URL.

Contenu réel du pack :
- rock : 4 morceaux
- pop : 3 morceaux
- electro : 1 morceau
- retro-wave : 1 morceau
- relax : 1 morceau (Émotions)
- **kids** : aucun (voir §3)

## 2. Playlists par radio dans `src/components/TaxiRadio.tsx`
- Remplacer le tableau actuel de `url` unique par un système `playlist: string[]` pour les stations locales : `pop`, `electro`, `rock`, `emotions`, `retro` (nouvelle), `kids`.
- Ajouter un `playlistIndexRef` par station (mémorisé dans une `Map<stationId, number>`).
- Quand on sélectionne une station, on charge `playlist[index]` et on incrémente l'index modulo `playlist.length` à chaque fin de piste (`onEnded`) → enchaînement auto + boucle infinie.
- Conserver la logique existante DJ→musique : à chaque fin de piste, on lit la jingle DJ puis on enchaîne la piste suivante.
- Les stations existantes non touchées : `main`, `jce`, `iron`, `infos` (inchangées).

## 3. Catégories vides (kids, fallback)
- Aucun morceau Kids fourni → on garde le flux SomaFM existant (`https://ice1.somafm.com/fluid-128-mp3`) en fallback pour `kids` uniquement.
- Toute autre catégorie sans piste locale retombe sur son flux SomaFM actuel.

## 4. TTS multi-plateforme (desktop/Android/iPhone)
Améliorations dans `TaxiRadio.tsx` sans casser la version actuelle :
- Déblocage `speechSynthesis` : ajouter `click` en plus de `pointerdown/touchstart/keydown`, retirer le `{ once: true }` pour conserver le déblocage sur iOS qui re-verrouille après chaque pause.
- Sur iOS Safari : avant chaque `speak()`, appeler `speechSynthesis.resume()` (workaround connu Chrome/iOS où le moteur passe en `paused`).
- Re-piocher la voix dans `pickVoice()` à chaque speak (les voix arrivent async sur Android).
- Sur le tap du bouton 📻 (`setOpen`), envoyer aussi une utterance silencieuse pour confirmer le déblocage utilisateur.
- Conserver le fallback serveur (Lovable AI mp3) déjà en place — il sert de plan B sur les WebView qui n'ont pas de voix native.

## 5. Audio mobile
- `<audio>` reçoit déjà `preload="auto"` ; ajouter `playsInline` et `crossOrigin="anonymous"` (utile pour les flux Soma) pour éviter les blocages iOS.
- Sur changement de station, toujours appeler `audio.load()` avant `audio.play()` (sinon iOS garde l'ancien buffer).

## 6. Hors-scope (non modifié)
- Aucune autre logique de jeu touchée (trafic, missions, IA, admin, tutoriel).
- `GAME_ASSETS`, `radioNews`, stations `main/jce/iron/infos`, UI ticker, horloge des infos : intactes.

## Fichiers
- **Nouveau** : `src/assets/radio/rock/*.mp3` (4), `pop/*.mp3` (3), `electro/*.mp3` (1), `retro-wave/*.mp3` (1), `relax/*.mp3` (1) — extraits du ZIP.
- **Modifié** : `src/components/TaxiRadio.tsx` (playlists + TTS mobile + audio iOS).

## Détails techniques
```ts
const rockTracks   = Object.values(import.meta.glob<string>("/src/assets/radio/rock/*.mp3",       { eager: true, query: "?url", import: "default" }));
const popTracks    = Object.values(import.meta.glob<string>("/src/assets/radio/pop/*.mp3",        { eager: true, query: "?url", import: "default" }));
const electroTracks= Object.values(import.meta.glob<string>("/src/assets/radio/electro/*.mp3",    { eager: true, query: "?url", import: "default" }));
const retroTracks  = Object.values(import.meta.glob<string>("/src/assets/radio/retro-wave/*.mp3", { eager: true, query: "?url", import: "default" }));
const relaxTracks  = Object.values(import.meta.glob<string>("/src/assets/radio/relax/*.mp3",      { eager: true, query: "?url", import: "default" }));

type Station = { id; name; emoji; url?; playlist?: string[]; loop?; volume?; tts? };
// rock: { playlist: rockTracks, loop: true }
// emotions: { playlist: relaxTracks, loop: true }  // calmes/émotionnels
// + nouvelle station "retro" : { playlist: retroTracks }
// kids: fallback stream si playlist vide
```

`onEnded` (station avec playlist) :
1. incrémente l'index modulo `playlist.length`
2. joue le DJ (`speak(djLine)`)
3. au callback, charge `playlist[newIndex]` et `play()`
