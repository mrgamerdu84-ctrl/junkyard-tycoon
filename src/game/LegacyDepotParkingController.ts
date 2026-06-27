export type DepotParkingSpot = {
  id: string;
  x: number;
  y: number;
  angle: number;
};

export type DepotWorldPoint = {
  x: number;
  y: number;
};

const MAP_WIDTH = 1920;
const MAP_HEIGHT = 1080;

// Places alignées dans la cour du dépôt Taxi World sur la map legacy.
// Coordonnées en pourcentage pour rester stables avec l'image plein écran.
export const LEGACY_DEPOT_PARKING_SPOTS: DepotParkingSpot[] = [
  { id: 'taxi-01', x: 31.8, y: 68.5, angle: -8 },
  { id: 'taxi-02', x: 34.2, y: 68.0, angle: -8 },
  { id: 'taxi-03', x: 36.6, y: 67.5, angle: -8 },
  { id: 'taxi-04', x: 39.0, y: 67.0, angle: -8 },
  { id: 'taxi-05', x: 41.4, y: 66.5, angle: -8 },
  { id: 'taxi-06', x: 43.8, y: 66.0, angle: -8 },
];

export const LEGACY_DEPOT_EXIT_ROUTE = [
  { x: 37.5, y: 67.4 },
  { x: 42.2, y: 64.2 },
  { x: 47.8, y: 60.4 },
  { x: 53.5, y: 56.6 },
];

export function getLegacyDepotParkingSpot(index: number) {
  return LEGACY_DEPOT_PARKING_SPOTS[index % LEGACY_DEPOT_PARKING_SPOTS.length];
}

export function percentToLegacyWorld(point: DepotWorldPoint): DepotWorldPoint {
  return {
    x: (point.x / 100) * MAP_WIDTH,
    y: (point.y / 100) * MAP_HEIGHT,
  };
}

export function getLegacyDepotParkingWorldPoint(index: number): DepotWorldPoint {
  const spot = getLegacyDepotParkingSpot(index);
  return percentToLegacyWorld({ x: spot.x, y: spot.y });
}

export function getLegacyDepotExitWorldPoint(): DepotWorldPoint {
  const exit = LEGACY_DEPOT_EXIT_ROUTE[LEGACY_DEPOT_EXIT_ROUTE.length - 1];
  return percentToLegacyWorld(exit);
}

export function getLegacyTaxiParkingAssignment(taxiIndex: number) {
  const spot = getLegacyDepotParkingSpot(taxiIndex);
  const world = getLegacyDepotParkingWorldPoint(taxiIndex);
  const exit = getLegacyDepotExitWorldPoint();
  return {
    spot,
    world,
    exit,
  };
}
