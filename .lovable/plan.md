## Mini contrôles radio en bas de l'écran

Ajouter une petite barre de contrôle radio fixée en bas de la carte du jeu, en plus du bouton 📻 en haut à droite (qui reste).

### Contenu de la barre (très compact)
- ⏮ Station précédente
- ⏯ Play / Pause
- ⏭ Station suivante
- Petit nom de la station en cours (tronqué)

### Style
- `position: fixed`, `bottom: 8px`, centrée horizontalement, `zIndex` élevé
- Boutons ronds ~28px, fond sombre semi-transparent, bordure dorée discrète
- Hauteur totale ~36px pour ne pas masquer la carte

### Comportement
- Prev/Next : navigue dans `STATIONS` (saute "off")
- Play/Pause : met en pause / reprend l'audio courant (pour les stations TTS, coupe/relance le cycle des brèves)
- État partagé avec le panneau existant via la même clé localStorage — pas de duplication d'état audio

### Fichier modifié
- `src/components/TaxiRadio.tsx` — ajout du mini-dock + état `paused`, logique prev/next/toggle
