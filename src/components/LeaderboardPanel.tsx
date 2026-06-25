import { useEffect, useState } from "react";
import { getLast7Days, isSpecialTaxiUnlocked, getBestWeekScore, getTodayScore, getPlayerName, fetchCloudLast7Days } from "@/lib/leaderboard";
import { useAuth } from "@/lib/useAuth";
import goldTaxi from "@/assets/taxi-gold.png.asset.json";

export default function LeaderboardPanel({ onClose }: { onClose: () => void }) {
  const { user, pseudo: cloudPseudo } = useAuth();
  const [days, setDays] = useState(() => getLast7Days());
  const unlocked = isSpecialTaxiUnlocked();
  const best = getBestWeekScore();
  const playerName = user ? cloudPseudo : getPlayerName();

  useEffect(() => {
    if (user) {
      fetchCloudLast7Days().then((d) => { if (d) setDays(d); }).catch(() => {});
    } else {
      setDays(getLast7Days());
    }
  }, [user]);

  const todayKey = days[0]?.date;
  const todayScore = user ? (days.find((d) => d.date === todayKey)?.score ?? 0) : getTodayScore();

  return (
    <div className="lb-root">
      <style>{`
        /* Fond semi-transparent pour laisser voir la carte derrière */
        .lb-root { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; padding: 16px; font-family: system-ui, sans-serif; }
        
        /* Conteneur calqué sur la taille de l'écran de jeu */
        .lb-card { max-width: 420px; width: 100%; display: flex; flex-direction: column; gap: 12px; padding: 10px; }
        
        /* Style de base des gros boutons arrondis */
        .btn-menu { width: 100%; font-weight: 900; font-size: 16px; text-transform: uppercase; tracking-wider: 1px; padding: 16px; border-radius: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border: 2px solid rgba(0,0,0,0.2); box-shadow: 0 4px 0px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3); transition: transform 0.05s, box-shadow 0.05s; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }
        .btn-menu:active { transform: translateY(3px); box-shadow: 0 1px 0px rgba(0,0,0,0.3); }

        /* Couleurs exactes des boutons de l'image */
        .btn-yellow { background: linear-gradient(180deg, #fcd34d 0%, #f59e0b 100%); color: #1e1b4b; border-color: #d97706; }
        .btn-red { background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%); color: #fff; border-color: #991b1b; }
        .btn-blue { background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%); color: #fff; border-color: #1e40af; }
        .btn-gray { background: linear-gradient(180deg, #4b5563 0%, #374151 100%); color: #fff; border-color: #1f2937; }

        /* Notification de mise à jour en haut */
        .update-banner { background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%); border-radius: 20px; padding: 14px; position: relative; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; justify-content: space-between; items-center; }
        .update-btn { background: white; color: #d97706; font-size: 11px; font-weight: 900; padding: 6px 12px; border-radius: 9999px; border: none; cursor: pointer; shadow: 0 2px 4px rgba(0,0,0,0.2); }
      `}</style>
      
      <div className="lb-card">
        
        {/* Banner "Nouvelle mise à jour" si présente en haut (image 1000024755.jpg) */}
        <div className="update-banner">
          <div>
            <div style={{ fontSize: '13px', fontWeight: '900' }}>✨ Nouvelle mise à jour !</div>
            <div style={{ fontSize: '10px', opacity: 0.9 }}>Version 1.0.0 disponible...</div>
          </div>
          <button className="update-btn">Mettre à jour</button>
        </div>

        {/* 1. Bouton JOUER */}
        <button className="btn-menu btn-yellow" onClick={onClose}>
          <span>JOUER ▶</span>
        </button>

        {/* 2. Bouton ARÈNE MONDIALE */}
        <button className="btn-menu btn-red">
          <span>⚔️ ARÈNE MONDIALE</span>
        </button>

        {/* 3. Bouton CLASSEMENT (Affiche ton score actuel du jour dessus) */}
        <button className="btn-menu btn-yellow">
          <span>🏆 CLASSEMENT ({fmt(todayScore)} $)</span>
        </button>

        {/* 4. Bouton TUTO (Lié au statut de ton Taxi d'or) */}
        <button className="btn-menu btn-yellow">
          <span>📖 TUTO {unlocked ? "✅" : "🔒"}</span>
        </button>

        {/* 5. Bouton PSEUDO */}
        <button className="btn-menu btn-yellow">
          <span>✏️ PSEUDO : {playerName}</span>
        </button>

        {/* 6. Bouton MON PROFIL */}
        <button className="btn-menu btn-blue">
          <span>🪪 MON PROFIL</span>
        </button>

        {/* 7. Bouton DÉCONNEXION */}
        <button className="btn-menu btn-gray">
          <span>🚪 DÉCONNEXION</span>
        </button>

        {/* 8. Bouton TÉLÉCHARGER L'APK */}
        <button className="btn-menu btn-yellow" style={{ marginTop: '10px' }}>
          <span>🤖 TÉLÉCHARGER L'APK</span>
        </button>

      </div>
    </div>
  );
}
