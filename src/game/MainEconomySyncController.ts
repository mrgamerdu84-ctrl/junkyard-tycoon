import { loadAiTaxiWallet, saveAiTaxiWallet, type AiTaxiWallet } from './AiTaxiWalletController';

const MAIN_SAVE_KEY = 'taxi-tycoon-v4';

export type MainEconomySyncResult = {
  synced: boolean;
  credited: number;
  nextMoney: number;
};

function readMainSave(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(MAIN_SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function writeMainSave(save: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(save));
  } catch {}
}

export function syncAiTaxiWalletToMainEconomy(): MainEconomySyncResult {
  const wallet = loadAiTaxiWallet();
  const pending = Math.max(0, Math.floor(wallet.balance));
  const save = readMainSave();
  const currentMoney = typeof save?.money === 'number' ? save.money : 0;

  if (!save || pending <= 0) {
    return { synced: false, credited: 0, nextMoney: currentMoney };
  }

  const nextMoney = currentMoney + pending;
  writeMainSave({
    ...save,
    money: nextMoney,
    totalEarned: typeof save.totalEarned === 'number' ? save.totalEarned + pending : pending,
  });

  const nextWallet: AiTaxiWallet = {
    ...wallet,
    balance: 0,
  };
  saveAiTaxiWallet(nextWallet);

  return { synced: true, credited: pending, nextMoney };
}
