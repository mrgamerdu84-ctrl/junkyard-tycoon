import { LEGACY_DEPOT_EXIT_ROUTE, getLegacyDepotParkingSpot } from './LegacyDepotParkingController';

export type LegacyDepotFlowPoint = {
  x: number;
  y: number;
  angle: number;
};

export type LegacyDepotTaxiFlow = {
  parkingId: string;
  parking: LegacyDepotFlowPoint;
  exit: LegacyDepotFlowPoint;
  route: LegacyDepotFlowPoint[];
};

function pointAngle(a: { x: number; y: number }, b: { x: number; y: number }) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

function enrichRoute(points: { x: number; y: number }[]): LegacyDepotFlowPoint[] {
  return points.map((point, index) => {
    const next = points[Math.min(points.length - 1, index + 1)] ?? point;
    const previous = points[Math.max(0, index - 1)] ?? point;
    const ref = index < points.length - 1 ? next : previous;
    return {
      x: point.x,
      y: point.y,
      angle: pointAngle(point, ref),
    };
  });
}

export function getLegacyDepotTaxiFlow(taxiIndex: number): LegacyDepotTaxiFlow {
  const spot = getLegacyDepotParkingSpot(taxiIndex);
  const route = enrichRoute([
    { x: spot.x, y: spot.y },
    ...LEGACY_DEPOT_EXIT_ROUTE,
  ]);
  return {
    parkingId: spot.id,
    parking: { x: spot.x, y: spot.y, angle: spot.angle },
    exit: route[route.length - 1],
    route,
  };
}

export function interpolateLegacyDepotRoute(route: LegacyDepotFlowPoint[], progress: number): LegacyDepotFlowPoint {
  if (route.length === 0) return { x: 0, y: 0, angle: 0 };
  if (route.length === 1) return route[0];
  const safeProgress = Math.max(0, Math.min(1, progress));
  const scaled = safeProgress * (route.length - 1);
  const index = Math.floor(scaled);
  const nextIndex = Math.min(route.length - 1, index + 1);
  const local = scaled - index;
  const a = route[index];
  const b = route[nextIndex];
  return {
    x: a.x + (b.x - a.x) * local,
    y: a.y + (b.y - a.y) * local,
    angle: b.angle,
  };
}

export function getLegacyDepotExitPoint(taxiIndex: number) {
  return getLegacyDepotTaxiFlow(taxiIndex).exit;
}
