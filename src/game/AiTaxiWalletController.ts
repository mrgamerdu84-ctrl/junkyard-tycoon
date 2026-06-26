import type { AppliedTripRevenue } from './ActiveTripRevenueController';

const AI_TAXI_WALLET_KEY = 'mttw.v2.aiTaxiWallet';

export type AiTaxiWallet = {
  balance: number;
  lifetimeEarned: number;
  paidTrips: number;
};

export const DEFAULT_AI_TAXI_WALLET: AiTaxiWallet = {
  balance: 0,
  lifetimeEarned: 0,
  paidTrips: 0,
};

export function applyRevenueToAiTaxiWallet(wallet: AiTaxiWallet, revenue: AppliedTripRevenue): AiTaxiWallet {
  return {
    balance: wallet.balance + revenue.earned,
    lifetimeEarned: wallet.lifetimeEarned + revenue.earned,
    paidTrips: wallet.paidTrips + revenue.paidTrips,
  };
}

export function loadAiTaxiWallet(): AiTaxiWallet {
  if (typeof window === 'undefined') return DEFAULT_AI_TAXI_WALLET;
  try {
    const raw = window.localStorage.getItem(AI_TAXI_WALLET_KEY);
    if (!raw) return DEFAULT_AI_TAXI_WALLET;
    return { ...DEFAULT_AI_TAXI_WALLET, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_AI_TAXI_WALLET;
  }
}

export function saveAiTaxiWallet(wallet: AiTaxiWallet) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AI_TAXI_WALLET_KEY, JSON.stringify(wallet));
  } catch {}
}
