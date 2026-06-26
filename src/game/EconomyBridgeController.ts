import { loadAiTaxiWallet } from './AiTaxiWalletController';

export type EconomyBridgeSnapshot = {
  aiTaxiBalance: number;
  aiTaxiLifetimeEarned: number;
  aiTaxiPaidTrips: number;
  canSyncToMainWallet: boolean;
};

export function getEconomyBridgeSnapshot(): EconomyBridgeSnapshot {
  const wallet = loadAiTaxiWallet();
  return {
    aiTaxiBalance: wallet.balance,
    aiTaxiLifetimeEarned: wallet.lifetimeEarned,
    aiTaxiPaidTrips: wallet.paidTrips,
    canSyncToMainWallet: wallet.balance > 0,
  };
}

export function calculateMergedWalletPreview(mainWallet: number, snapshot = getEconomyBridgeSnapshot()) {
  return mainWallet + snapshot.aiTaxiBalance;
}
