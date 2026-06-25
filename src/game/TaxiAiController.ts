import { getBranchingVehiclePaths } from './VehicleNavigator';
import { TAXI_PICKUP_POINTS } from './CityRoadGraph';

export type TaxiAiStatus = 'idle' | 'to_client' | 'to_destination' | 'completed';

export type TaxiAiJob = {
  id: string;
  taxiId: string;
  pickupId: string;
  destinationId: string;
  status: TaxiAiStatus;
};

export function createTaxiJobs(taxiCount = 4): TaxiAiJob[] {
  return Array.from({ length: taxiCount }, (_, index) => {
    const pickup = TAXI_PICKUP_POINTS[index % TAXI_PICKUP_POINTS.length]!;
    const destination = TAXI_PICKUP_POINTS[(index + 3) % TAXI_PICKUP_POINTS.length]!;
    return {
      id: `job_${index + 1}`,
      taxiId: `taxi_${index + 1}`,
      pickupId: pickup.id,
      destinationId: destination.id,
      status: 'to_client',
    };
  });
}

export function getTaxiAiPreviewRoutes() {
  return getBranchingVehiclePaths().slice(0, 4);
}

export function advanceTaxiStatus(status: TaxiAiStatus): TaxiAiStatus {
  if (status === 'idle') return 'to_client';
  if (status === 'to_client') return 'to_destination';
  if (status === 'to_destination') return 'completed';
  return 'idle';
}
