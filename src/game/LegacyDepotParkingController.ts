export type DepotParkingSpot = {
  id: string;
  x: number;
  y: number;
  angle: number;
};

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
