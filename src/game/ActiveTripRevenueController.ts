import type { ActiveTaxiTrip } from './TaxiAiController';

export type ActiveTripRevenueState = {
  walletPreview: number;
  paidTrips: number;
  pendingTrips: number;
};

export function calculateActiveTripRevenue(trips: ActiveTaxiTrip[], baseWallet = 0): ActiveTripRevenueState {
  const paidTrips = trips.filter((trip) => trip.phase === 'completed');
  const pendingTrips = trips.length - paidTrips.length;
  return {
    walletPreview: baseWallet + paidTrips.reduce((sum, trip) => sum + trip.reward, 0),
    paidTrips: paidTrips.length,
    pendingTrips,
  };
}

export function formatTripRevenueLabel(state: ActiveTripRevenueState) {
  return `CA courses IA: ${state.walletPreview}€ · ${state.paidTrips} payées · ${state.pendingTrips} en cours`;
}
