import { getBranchingVehiclePaths } from './VehicleNavigator';
import { TAXI_PICKUP_POINTS } from './CityRoadGraph';

export type TaxiAiStatus = 'idle' | 'to_client' | 'to_destination' | 'completed';

export type TaxiAiJob = {
  id: string;
  taxiId: string;
  pickupId: string;
  destinationId: string;
  status: TaxiAiStatus;
  fare: number;
  phaseDuration: number;
};

export type ActiveTaxiTrip = {
  taxiId: string;
  customerId: string;
  phase: TaxiAiStatus;
  progress: number;
  reward: number;
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
      fare: 18 + index * 7,
      phaseDuration: 9 + index * 2,
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

export function getTaxiStatusAt(job: TaxiAiJob, seconds: number): TaxiAiStatus {
  const step = Math.floor((seconds % (job.phaseDuration * 4)) / job.phaseDuration);
  if (step === 0) return 'to_client';
  if (step === 1) return 'to_destination';
  if (step === 2) return 'completed';
  return 'idle';
}

export function taxiStatusLabel(status: TaxiAiStatus) {
  if (status === 'idle') return 'LIBRE';
  if (status === 'to_client') return 'CLIENT';
  if (status === 'to_destination') return 'DEST';
  return 'PAYÉ';
}

export function getTaxiAiEarningsSummary(jobs: TaxiAiJob[], seconds: number) {
  const completedJobs = jobs.filter((job, index) => getTaxiStatusAt(job, seconds + index * 1.5) === 'completed');
  return {
    completed: completedJobs.length,
    totalFare: completedJobs.reduce((sum, job) => sum + job.fare, 0),
    active: jobs.length - completedJobs.length,
  };
}

export function getActiveTaxiTrip(taxiId: string, customerId: string, reward: number, seconds: number): ActiveTaxiTrip {
  const loop = seconds % 18;
  const phase: TaxiAiStatus = loop < 7 ? 'to_client' : loop < 14 ? 'to_destination' : 'completed';
  return {
    taxiId,
    customerId,
    phase,
    progress: Math.min(1, (loop % 7) / 7),
    reward,
  };
}

export function getActiveTripEarnings(trips: ActiveTaxiTrip[]) {
  const completedTrips = trips.filter((trip) => trip.phase === 'completed');
  return {
    completed: completedTrips.length,
    earned: completedTrips.reduce((sum, trip) => sum + trip.reward, 0),
  };
}
