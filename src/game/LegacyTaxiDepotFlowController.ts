import { getLegacyTaxiParkingAssignment, percentToLegacyWorld, LEGACY_DEPOT_EXIT_ROUTE } from './LegacyDepotParkingController';

export type LegacyTaxiDepotWaypoint = {
  x: number;
  y: number;
};

export type LegacyTaxiDepotFlow = {
  parking: LegacyTaxiDepotWaypoint;
  exit: LegacyTaxiDepotWaypoint;
  outRoute: LegacyTaxiDepotWaypoint[];
  returnRoute: LegacyTaxiDepotWaypoint[];
};

export function getLegacyTaxiDepotFlow(taxiIndex: number): LegacyTaxiDepotFlow {
  const assignment = getLegacyTaxiParkingAssignment(taxiIndex);
  const exitRoute = LEGACY_DEPOT_EXIT_ROUTE.map(percentToLegacyWorld);
  const outRoute = [assignment.world, ...exitRoute];
  return {
    parking: assignment.world,
    exit: assignment.exit,
    outRoute,
    returnRoute: [...outRoute].reverse(),
  };
}

export function getLegacyTaxiDepotSpawnPoint(taxiIndex: number): LegacyTaxiDepotWaypoint {
  return getLegacyTaxiDepotFlow(taxiIndex).parking;
}

export function getLegacyTaxiDepotExitPoint(taxiIndex: number): LegacyTaxiDepotWaypoint {
  return getLegacyTaxiDepotFlow(taxiIndex).exit;
}
