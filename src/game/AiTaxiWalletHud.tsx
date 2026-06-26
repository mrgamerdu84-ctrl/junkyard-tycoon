import { useEffect, useState } from "react";
import { loadAiTaxiWallet } from "./AiTaxiWalletController";

export default function AiTaxiWalletHud() {
  const [wallet, setWallet] = useState(() => loadAiTaxiWallet());

  useEffect(() => {
    const timer = window.setInterval(() => setWallet(loadAiTaxiWallet()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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
        pointerEvents: "none",
      }}
    >
      🚕 IA wallet<br />💰 {wallet.balance}€ · 🧾 {wallet.paidTrips} courses<br />📈 cumul {wallet.lifetimeEarned}€
    </div>
  );
}
