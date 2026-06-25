import { TAXI_PICKUP_POINTS } from './CityRoadGraph';

export type CustomerDemand = {
  id: string;
  pickupId: string;
  destinationId: string;
  patience: number;
  reward: number;
};

export function createCustomerDemands(count = 5): CustomerDemand[] {
  return Array.from({ length: count }, (_, index) => {
    const pickup = TAXI_PICKUP_POINTS[(index + 1) % TAXI_PICKUP_POINTS.length]!;
    const destination = TAXI_PICKUP_POINTS[(index + 4) % TAXI_PICKUP_POINTS.length]!;
    return {
      id: `customer_${index + 1}`,
      pickupId: pickup.id,
      destinationId: destination.id,
      patience: 60 - index * 6,
      reward: 22 + index * 8,
    };
  });
}

export function getVisibleCustomerDemands(seconds: number) {
  const all = createCustomerDemands();
  const visibleCount = 1 + Math.floor((seconds % 30) / 8);
  return all.slice(0, Math.min(visibleCount, all.length));
}
