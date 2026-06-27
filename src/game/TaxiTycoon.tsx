import { useEffect, useRef } from "react";

// 1. Définition des états de la mission d'un taxi
type TaxiStatus = 
  | "IDLE"        // Attend sur sa place assignée
  | "DEPARTING"   // Sort de sa place vers la sortie du dépôt
  | "TO_CLIENT"   // Roule vers le client sur la route
  | "WITH_CLIENT" // Effectue la course avec le client
  | "RETURNING"   // Revient vers l'entrée du dépôt
  | "PARKING";    // Rentre dans le dépôt et rejoint sa place exacte

interface ParkingSlot {
  id: number;
  x: number;
  y: number;
}

interface TaxiEntity {
  id: string;
  slotId: number;         // Place de parking fixe et unique
  status: TaxiStatus;
  currentX: number;
  currentY: number;
  angle: number;
  speed: number;
  pathIdx: number;        // Index de la route SVG qu'il utilise
  progress: number;       // Progression le long du tracé (0 à 1)
  targetX: number;        // Destination de la course
  targetY: number;
}

// 2. Configuration fixe du Dépôt (Coordonnées d'exemples alignées sur ton QG)
const DEPOT_EXIT = { x: 960, y: 350 }; // Point de sortie vers la route principale
const PARKING_SLOTS: ParkingSlot[] = [
  { id: 1, x: 920, y: 280 },
  { id: 2, x: 960, y: 280 },
  { id: 3, x: 1000, y: 280 },
  { id: 4, x: 1040, y: 280 },
];

export function useTaxiSimulation(taxisActive: any[], pathRefs: React.MutableRefObject<(SVGPathElement | null)[]>) {
  const taxiInstances = useRef<TaxiEntity[]>([]);
  const nodesRef = useRef<(SVGGElement | null)[]>([]);
  let lastTime = performance.now();

  // Initialisation : Assigne une place fixe à chaque taxi possédé au démarrage
  useEffect(() => {
    taxiInstances.current = taxisActive.map((taxi, index) => {
      const slot = PARKING_SLOTS[index % PARKING_SLOTS.length];
      return {
        id: taxi.id,
        slotId: slot.id,
        status: "IDLE",
        currentX: slot.x,
        currentY: slot.y,
        angle: 0,
        speed: 4, // Vitesse de déplacement fluide
        pathIdx: 0,
        progress: 0,
        targetX: 0,
        targetY: 0
      };
    });
  }, [taxisActive]);

  // Déclencheur : Quand une mission arrive (Appelé par ton système d'économie existant)
  const dispatchTaxi = (taxiId: string, clientPathIdx: number) => {
    const taxi = taxiInstances.current.find(t => t.id === taxiId);
    if (taxi && taxi.status === "IDLE") {
      taxi.pathIdx = clientPathIdx;
      taxi.progress = 0;
      taxi.status = "DEPARTING"; // Démarre le moteur et quitte sa place
    }
  };

  // Boucle de simulation principale (Calculs physiques ultra-fluides)
  useEffect(() => {
    let rafId: number;

    const updateLoop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      taxiInstances.current.forEach((taxi, index) => {
        const node = nodesRef.current[index];
        if (!node) return;

        const slot = PARKING_SLOTS.find(s => s.id === taxi.slotId) || PARKING_SLOTS[0];
        let nextX = taxi.currentX;
        let nextY = taxi.currentY;

        // --- MACHINE D'ÉTAT SANS TÉLÉPORTATION ---
        switch (taxi.status) {
          
          case "IDLE":
            // Reste immobile sur sa place fixe
            nextX = slot.x;
            nextY = slot.y;
            break;

          case "DEPARTING":
            // Interpolation fluide vers la sortie du dépôt (Lignes de fuite internes)
            const dxExit = DEPOT_EXIT.x - taxi.currentX;
            const dyExit = DEPOT_EXIT.y - taxi.currentY;
            const distExit = Math.hypot(dxExit, dyExit);

            if (distExit < 5) {
              taxi.status = "TO_CLIENT"; // Il a franchi les portes, il rejoint la route
            } else {
              taxi.angle = Math.atan2(dyExit, dxExit) * (180 / Math.PI);
              nextX += (dxExit / distExit) * taxi.speed * 60 * dt;
              nextY += (dyExit / distExit) * taxi.speed * 60 * dt;
            }
            break;

          case "TO_CLIENT":
          case "WITH_CLIENT":
            // Progression fluide le long des routes SVG (Collé aux voies)
            const path = pathRefs.current[taxi.pathIdx];
            if (path) {
              const totalLength = path.getTotalLength();
              taxi.progress += (taxi.speed * 15 * dt) / totalLength;

              if (taxi.progress >= 1) {
                taxi.progress = 1;
                if (taxi.status === "TO_CLIENT") {
                  // Client récupéré -> Passe à la course
                  taxi.status = "WITH_CLIENT";
                  taxi.progress = 0; // Recommence le trajet ou prend le trajet retour
                } else {
                  // Course terminée -> Encaissement via ton système actuel, puis retour au dépôt
                  taxi.status = "RETURNING";
                }
              }

              const point = path.getPointAtLength(taxi.progress * totalLength);
              const nextPoint = path.getPointAtLength(Math.min(totalLength, (taxi.progress * totalLength) + 2));
              
              taxi.angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
              nextX = point.x;
              nextY = point.y;
            }
            break;

          case "RETURNING":
            // Roule depuis la fin de sa course vers l'entrée du dépôt
            const dxDepot = DEPOT_EXIT.x - taxi.currentX;
            const dyDepot = DEPOT_EXIT.y - taxi.currentY;
            const distDepot = Math.hypot(dxDepot, dyDepot);

            if (distDepot < 5) {
              taxi.status = "PARKING"; // Entre dans l'enceinte du dépôt
            } else {
              taxi.angle = Math.atan2(dyDepot, dxDepot) * (180 / Math.PI);
              nextX += (dxDepot / distDepot) * taxi.speed * 60 * dt;
              nextY += (dyDepot / distDepot) * taxi.speed * 60 * dt;
            }
            break;

          case "PARKING":
            // Reprend exactement sa place de parking attitrée de départ
            const dxSlot = slot.x - taxi.currentX;
            const dySlot = slot.y - taxi.currentY;
            const distSlot = Math.hypot(dxSlot, dySlot);

            if (distSlot < 2) {
              taxi.status = "IDLE"; // Garé, moteur coupé, attend la prochaine mission
              nextX = slot.x;
              nextY = slot.y;
            } else {
              taxi.angle = Math.atan2(dySlot, dxSlot) * (180 / Math.PI);
              nextX += (dxSlot / distSlot) * taxi.speed * 60 * dt;
              nextY += (dySlot / distSlot) * taxi.speed * 60 * dt;
            }
            break;
        }

        // Enregistrement des coordonnées actuelles
        taxi.currentX = nextX;
        taxi.currentY = nextY;

        // 3. Injection visuelle directe dans la matrice (Zéro re-render, gain massif de FPS)
        node.setAttribute(
          "transform",
          `translate(${nextX.toFixed(1)}, ${nextY.toFixed(1)}) rotate(${taxi.angle.toFixed(1)})`
        );
      });

      rafId = requestAnimationFrame(updateLoop);
    };

    rafId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(rafId);
  }, [pathRefs]);

  return { nodesRef, dispatchTaxi };
}
