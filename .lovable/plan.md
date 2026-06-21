## 1. Radio — Synthèse Vocale (TTS)

L'infra existe (`/api/public/radio-tts` + fallback `speechSynthesis` dans `TaxiRadio.tsx`). Le flash infos doit déjà parler — si silencieux, les causes probables sont :

- **iOS / WebView Android** : `speechSynthesis` exige un déverrouillage par geste utilisateur. Le `ttsUnlockedRef` actuel ne se déclenche que sur tap. À renforcer : prime aussi `speechSynthesis` au premier `click` global, et au démarrage de la station.
- **`a.play()` bloqué** quand le mp3 Lovable arrive : si le play échoue ET qu'on a déjà passé `accessToken`, on ne tombe pas sur `speakBrowser()`. À corriger : sur `catch` du `a.play()`, basculer sur `speakBrowser()` au lieu d'abandonner.
- **Voix française parfois absente au premier rendu** : `pickVoice` peut renvoyer `null` avant `onvoiceschanged`. Forcer un re-pick lazy à chaque `speak`.

**Modifs `src/components/TaxiRadio.tsx`** :
- Ajouter un unlock global `pointerdown` une fois (en plus de l'unlock existant).
- Dans `speak()`, sur `a.play()` rejeté → appeler `speakBrowser()` puis `wrapDone()` via `u.onend`.
- Garantir `window.speechSynthesis.resume()` après `cancel()` (workaround Chrome).

## 2. Vitesse du trafic

Dans `src/game/CityTraffic.tsx`, les durées des voitures sont fixées dans `buildCarsFromCustom()` (l. 348) puis multipliées par 1.15–1.55 dans `rerollSpec()` (l. 427). Ligne 251 = piétons, pas voitures (erreur du brief — on touche aux vraies voitures).

- Réduire `baseDur` : `78 → 14` (légers), `96 → 18` (lourds).
- Réduire le multiplicateur civil : `1.15 + Math.random() * 0.4` → `0.9 + Math.random() * 0.3` (autour de 12–17 s).
- Baisser le plancher `Math.max(22, ...)` → `Math.max(10, ...)`.

Résultat : voitures civiles ~12–18 s pour parcourir un path, taxis restent plus rapides via leur propre logique.

## 3. Panel Admin — Densité du trafic

Bug : `activeCars = allCustomCars.slice(0, civilVehicleCount)`. Si l'utilisateur a 4 véhicules custom, monter le slider à 36 n'ajoute rien — on est plafonné par la longueur réelle.

Correctif dans `src/game/CityTraffic.tsx` (`buildCarsFromCustom` + sélection) :

- Construire **N=civilVehicleCount** specs en bouclant modulo sur la liste des véhicules disponibles (`customs[i % customs.length]`).
- Inclure les URLs `getCivilCarUrls()` (assets civils par défaut + customs) pour qu'il y ait toujours de quoi remplir, même sans uploads.
- Varier `pathIdx`, `flip`, `delay` selon `i` pour éviter les superpositions.
- Élever le max du slider à `50` dans `AdminPanel.tsx` pour rendre la densité visible.

```text
N = civilVehicleCount  (0..50)
pool = [...getCivilCarUrls(), ...customsTrafic]
cars[i] = { url: pool[i % pool.length], pathIdx: allowed[i % allowed.length],
            flip: i%2, delay: -i*4, scale: 0.6 }
```

## Fichiers modifiés
- `src/components/TaxiRadio.tsx` — robustesse TTS (unlock + fallback play).
- `src/game/CityTraffic.tsx` — durées rapides + boucle N véhicules.
- `src/game/AdminPanel.tsx` — slider densité max 50.
