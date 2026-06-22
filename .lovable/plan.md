# Plan global — chantiers restants

Bon ap. Voici le plan complet de ce qui reste à faire, dans l'ordre où je vais l'exécuter une fois que tu valides.

## Phase 2 — Refonte UI (HUD + onglets)

**Objectif** : alléger l'écran principal, regrouper les infos secondaires dans des panneaux à la demande, agrandir les zones tactiles.

**HUD principal (toujours visible)** — réduit à 4 éléments :
- Argent (montant + animation de gain)
- Jauge carburant
- Réputation (chiffre + petite barre)
- Bouton **SOS / Intervention** (gros, pouce-friendly)

**Bouton ☰ Menu (en haut à droite)** → ouvre un drawer mobile avec onglets :
- **Profil & Permis** — XP, niveau, permis débloqués, succès
- **Entreprise** — taxis possédés, upgrades, entretien, finances
- **Concurrents** — classement, parts de marché, événements rivaux
- **Événements** — flash news, crimes en cours, missions
- **Réglages** — admin, langue, sauvegarde manuelle, reset

**Boutons tactiles** : minimum 44×44 px (norme Apple), espacement ≥ 8 px, contrastes renforcés sur fond sombre.

**Fichiers touchés** :
- `src/game/TaxiTycoon.tsx` (extraction du HUD compact + drawer)
- nouveau `src/game/HudPanels/` (TabProfile, TabBusiness, TabCompetitors, TabEvents, TabSettings)
- réutilisation de `src/components/ui/sheet` et `tabs` (shadcn déjà présents)

---

## Phase 3 — Passages piétons (IA traversée)

**Objectif** : les piétons traversent uniquement aux passages piétons, attendent que la voie soit libre.

**Étapes** :
1. Génération automatique de **points de passage** aux intersections des `ROADS` (détection par proximité des extrémités/intersections de paths).
2. Chaque piéton qui veut changer de trottoir choisit le passage le plus proche, s'y dirige, **attend** que le feu soit rouge **et** qu'aucune voiture ne soit dans la zone (raycast court), puis traverse en ligne droite.
3. Rendu visuel : bandes blanches (zébra) dessinées sous le calque voitures, et marqueurs invisibles pour l'IA.
4. Synchronisation avec les feux existants (`trafficLights.ts`) — déjà compatible (feu vert piéton quand voiture rouge).

**Fichiers touchés** :
- `src/game/CityTraffic.tsx` (logique piétons + rendu zébra)
- nouveau helper `src/game/crosswalks.ts` (détection + lookup)

---

## Phase 4 — Audit des voies (validation map)

**Objectif** : s'assurer que **toutes** les routes sont utilisées par le trafic, sans véhicule hors-route.

**Étapes** :
1. Script de validation dev (console) qui liste les paths jamais empruntés par les `activeCars` au bout de N secondes.
2. Vérification que `buildCarsFromCustom` répartit bien sur **tous** les `allowedPaths` (actuellement `i % allowedPaths.length` → OK mais à confirmer avec peu de véhicules).
3. Augmentation du minimum de véhicules par path si certains sont déserts.
4. Vérification visuelle : capture d'écran Playwright pour confirmer qu'aucun véhicule ne sort de l'asphalte.

**Fichiers touchés** : `src/game/CityTraffic.tsx` (ajustement répartition si besoin).

---

## Audit global final

Une fois les 3 phases livrées, je fais une passe complète :

1. **Build & typecheck** — zéro erreur.
2. **Perf check Playwright** — mesure FPS sur mobile émulé (392×713), comparaison avant/après culling.
3. **Console** — vérification : aucun warning React, aucune erreur runtime.
4. **Visuel** — captures écran : home, jeu actif, drawer ouvert sur chaque onglet, vue parking en cours, vue passage piéton.
5. **Régressions à vérifier explicitement** :
   - Sauvegarde auto + reprise (localStorage `taxi-tycoon-v4`)
   - Stationnement dynamique (3-6 voitures garées)
   - Pourboires, usure, prix par district
   - Interventions police/ambulance/pompiers
   - Sons/sirènes ambiantes
6. **Rapport synthétique** : ce qui a changé, FPS avant/après, points d'attention restants.

---

## Ordre d'exécution

```
Phase 2 (UI)  →  Phase 3 (passages piétons)  →  Phase 4 (audit voies)  →  Audit global
```

Estimation : Phase 2 ≈ la plus longue (refacto HUD), les autres plus rapides.

**Rien d'autre ne sera touché** (économie, sauvegarde, IA taxi joueur, événements crimes, sons) sauf si l'audit final révèle un bug.

Quand tu reviens de manger, valide ce plan et j'enchaîne tout d'un coup.
