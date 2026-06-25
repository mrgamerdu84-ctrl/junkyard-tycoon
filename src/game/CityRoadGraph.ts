export type RoadPoint = { id: string; x: number; y: number };
export type RoadEdge = { from: string; to: string; kind: "main" | "branch" | "roundabout"; speed: number };

export const ROAD_POINTS: RoadPoint[] = [
  { id: "north_airport", x: 84, y: 16 },
  { id: "north_gate", x: 50, y: 5 },
  { id: "downtown_north", x: 49, y: 28 },
  { id: "central_roundabout", x: 49, y: 47 },
  { id: "south_port", x: 50, y: 95 },
  { id: "west_residential", x: 20, y: 70 },
  { id: "west_hotels", x: 22, y: 20 },
  { id: "east_industrial", x: 86, y: 51 },
  { id: "east_stadium", x: 77, y: 76 },
  { id: "station", x: 40, y: 52 },
  { id: "hospital", x: 67, y: 50 },
];

export const ROAD_EDGES: RoadEdge[] = [
  { from: "north_gate", to: "downtown_north", kind: "main", speed: 1 },
  { from: "downtown_north", to: "central_roundabout", kind: "main", speed: 0.85 },
  { from: "central_roundabout", to: "south_port", kind: "main", speed: 1 },
  { from: "west_hotels", to: "central_roundabout", kind: "branch", speed: 0.75 },
  { from: "west_residential", to: "central_roundabout", kind: "branch", speed: 0.75 },
  { from: "central_roundabout", to: "north_airport", kind: "branch", speed: 0.9 },
  { from: "central_roundabout", to: "east_industrial", kind: "branch", speed: 0.85 },
  { from: "east_industrial", to: "east_stadium", kind: "branch", speed: 0.7 },
  { from: "central_roundabout", to: "station", kind: "branch", speed: 0.55 },
  { from: "central_roundabout", to: "hospital", kind: "branch", speed: 0.6 },
];

export const TAXI_PICKUP_POINTS = [
  { id: "pickup_vip", x: 49, y: 23, district: "Centre-ville", demand: "VIP" },
  { id: "pickup_airport", x: 82, y: 18, district: "Aéroport", demand: "Transfert" },
  { id: "pickup_station", x: 41, y: 49, district: "Gare", demand: "Train" },
  { id: "pickup_hospital", x: 67, y: 50, district: "Hôpital", demand: "Urgence" },
  { id: "pickup_home", x: 22, y: 70, district: "Résidences", demand: "Domicile" },
  { id: "pickup_factory", x: 83, y: 48, district: "Zone industrielle", demand: "Ouvriers" },
  { id: "pickup_ferry", x: 22, y: 87, district: "Port", demand: "Ferry" },
];

export function getRoadPoint(id: string) {
  return ROAD_POINTS.find((point) => point.id === id);
}
