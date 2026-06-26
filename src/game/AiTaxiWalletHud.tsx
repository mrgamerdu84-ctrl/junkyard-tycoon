import { useEffect, useState } from "react";
import { loadAiTaxiWallet } from "./AiTaxiWalletController";
import { syncAiTaxiWalletToMainEconomy } from "./MainEconomySyncController";

export default function AiTaxiWalletHud() {
  const [wallet, setWallet] = useState(() => loadAiTaxiWallet());
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setWallet(loadAiTaxiWallet()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const syncWallet = () => {
    const result = syncAiTaxiWalletToMainEconomy();
    setWallet(loadAiTaxiWallet());
    setLastSync(result.synced ? `+${result.credited}€ envoyés` : "Rien à synchroniser");
  };

  return (
    <div
      aria-label="Portefeuille taxis IA"
      style={{
        position: "fixed",
        left: 12,
        bottom: 172,
        zIndex: 10002,
        padding: "7px 9px",
        borderRadius: 12,
        background: "rgba(15,23,42,.9)",
        border: "1px solid rgba(134,239,172,.58)",
        color: "#fff",
        font: "900 10px/1.25 system-ui,sans-serif",
        boxShadow: "0 8px 18px rgba(0,0,0,.42)",
      }}
    >
      🚕 IA wallet<br />💰 {wallet.balance}€ · 🧾 {wallet.paidTrips} courses<br />📈 cumul {wallet.lifetimeEarned}€
      <button
        type="button"
        onClick={syncWallet}
        disabled={wallet.balance <= 0}
        style={{
          display: "block",
          marginTop: 6,
          padding: "4px 7px",
          borderRadius: 999,
          border: "1px solid rgba(134,239,172,.7)",
          background: wallet.balance > 0 ? "rgba(34,197,94,.18)" : "rgba(148,163,184,.14)",
          color: "#fff",
          font: "900 10px/1 system-ui,sans-serif",
          cursor: wallet.balance > 0 ? "pointer" : "default",
        }}
      >
        Transférer au jeu
      </button>
      {lastSync && <div style={{ marginTop: 4, color: "#bbf7d0" }}>{lastSync}</div>}
    </div>
  );
}
