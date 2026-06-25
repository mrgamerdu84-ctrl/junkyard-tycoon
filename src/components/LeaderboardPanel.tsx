import { useEffect, useState } from "react";
import { getLast7Days, isSpecialTaxiUnlocked, getBestWeekScore, getTodayScore, getPlayerName, fetchCloudLast7Days } from "@/lib/leaderboard";
import { useAuth } from "@/lib/useAuth";
import goldTaxi from "@/assets/taxi-gold.png.asset.json";

const fmt = (n: number) => Math.round(n).toLocaleString("fr-FR");

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

  // Tri par score décroissant pour le classement mondial de la semaine
  const ranked = [...days].sort((a, b) => b.score - a.score);

  return (
    <div className="lb-root">
      <style>{`
        .lb-root { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; padding: 16px; font-family: system-ui, sans-serif; }
        
        /* Conteneur principal façon mockup de l'image (Sombre et métallique) */
        .lb-card { background: linear-gradient(180deg, #2d2f34 0%, #1b1c1e 100%); border: 3px solid #4a3b32; border-radius: 20px; max-width: 420px; width: 100%; max-height: 92vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7); }
        
        /* En-tête */
        .lb-head { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .lb-title { color: #e5c158; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); }
        .lb-close { background: #374151; color: #fff; border: none; width: 28px; height: 28px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.1s; }
        .lb-close:active { transform: scale(0.9); }
        
        /* Zone de défilement pour la liste des scores */
        .lb-body-scroll { flex: 1; overflow-y: auto; padding: 16px; space-y: 8px; }
        
        /* Lignes du classement (Boutons gris métallisé épais) */
        .lb-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .lb-row { display: flex; align-items: center; gap: 12px; background: linear-gradient(145deg, #32343a, #1f2023); border: 2px solid #4b5563; padding: 12px; border-radius: 12px; box-shadow: inset 1px 1px 0px rgba(255,255,255,0.05), 2px 2px 5px rgba(0,0,0,0.3); }
        .lb-row.gold { border-color: #e5c158; background: linear-gradient(145deg, #3a321f, #231e13); }
        
        .lb-rank { font-size: 16px; font-weight: 900; color: #9ca3af; width: 24px; text-align: center; }
        .lb-row.gold .lb-rank { color: #e5c158; text-shadow: 0 0 5px rgba(229,193,88,0.4); }
        
        .lb-day { flex: 1; color: #e5c158; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; text-shadow: 1px 1px 1px rgba(0,0,0,0.5); }
        .lb-date { color: #9ca3af; font-size: 11px; margin-left: 8px; font-weight: normal; text-transform: none; }
        .lb-score { color: #fff; font-weight: 900; font-size: 14px; }
        
        /* Bloc d'infos du Taxi d'Or */
        .lb-taxi-banner { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(229,193,88,0.2); border-radius: 12px; padding: 12px; display: flex; gap: 12px; align-items: center; margin-top: 10px; }
        .lb-taxi-banner.locked { border-color: rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); }
        .lb-taxi-banner img { width: 55px; height: 55px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5)); object-fit: contain; }
        .lb-taxi-banner.locked img { opacity: 0.2; filter: grayscale(1); }
        .lb-taxi-info h4 { margin: 0 0 2px; color: #e5c158; font-size: 12px; font-weight: 900; text-transform: uppercase; }
        .lb-taxi-banner.locked .lb-taxi-info h4 { color: #9ca3af; }
        .lb-taxi-info p { margin: 0; color: #d1d5db; font-size: 10px; line-height: 1.3; }

        /* ==================== SECTION BAS EFFET BOIS SOMBRE ==================== */
        .lb-wood-footer { padding: 14px 12px; border-top: 4px solid #2b1d14; display: grid; grid-cols: 3; gap: 8px; align-items: center; background: linear-gradient(rgba(43, 29, 20, 0.97), rgba(26, 17, 11, 0.99)), url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=200'); background-size: cover; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
        
        /* Colonne Profil Directeur */
        .lb-footer-profile { display: flex; flex-direction: column; align-items: center; text-align: center; border-right: 1px solid rgba(74, 59, 50, 0.4); padding-right: 4px; }
        .lb-avatar-circle { w-9; h-9; width: 36px; height: 36px; border-radius: 50%; bg-gray-700; background: #374151; border: 1px solid #e5c158; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.5); margin-bottom: 4px; }
        .lb-avatar-circle svg { width: 16px; height: 16px; color: #9ca3af; }
        .lb-director-name { font-size: 9px; font-weight: 900; color: #e5c158; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-shadow: 1px 1px 1px rgba(0,0,0,0.8); }
        .lb-xp-bar-container { width: 100%; bg: #000; background: rgba(0,0,0,0.6); border-radius: 9999px; h-1.5; height: 5px; margin: 4px 0; border: 1px solid #1a110b; overflow: hidden; }
        .lb-xp-bar-fill { background: #10b981; h-full; height: 100%; rounded-full; }
        .lb-qg-level { font-size: 8px; color: #d1d5db; font-weight: bold; }

        /* Colonne Trophée & Rang */
        .lb-footer-center { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .lb-trophy-icon { color: #e5c158; font-size: 22px; margin-bottom: 2px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); animation: lb-bounce 2s infinite; }
        .lb-rank-title { font-size: 9px; font-weight: 900; color: #e5c158; tracking-wide: 0.5px; line-height: 1.1; text-shadow: 1px 1px 1px rgba(0,0,0,0.8); }
        .lb-pseudo-label-container { width: 100%; border-top: 1px solid rgba(229,193,88,0.2); margin: 5px 0 3px; position: relative; display: flex; justify-content: center; }
        .lb-pseudo-txt { position: absolute; background: #2b1d14; padding: 0 4px; font-size: 7px; color: #855b38; font-weight: bold; top: -5px; letter-spacing: 0.5px; }
        .lb-pen-icon { color: #4a3b32; font-size: 9px; margin-top: 2px; }

        /* Colonne Carnet Tuto */
        .lb-footer-manuals { display: flex; flex-direction: column; align-items: center; text-align: center; border-left: 1px solid rgba(74, 59, 50, 0.4); padding-left: 4px; }
        .lb-tuto-book { width: 30px; height: 40px; background: #78350f; border: 2px solid #451a03; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; position: relative; transform: rotate(-3deg); margin-bottom: 2px; }
        .lb-tuto-book-text { font-size: 8px; font-weight: 900; color: #451a03; letter-spacing: 0.5px; }
        .lb-tuto-book-spine { position: absolute; left: 2px; top: 2px; bottom: 2px; w-0.5; width: 2px; background: rgba(0,0,0,0.2); }
        .lb-manuals-title { font-size: 9px; font-weight: 900; color: #e5c158; line-height: 1.1; text-shadow: 1px 1px 1px rgba(0,0,0,0.8); }

        @keyframes lb-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
      
      <div className="lb-card">
        {/* EN-TÊTE DU PANNEAU */}
        <div className="lb-head">
          <h2 className="lb-title">🏆 Classement Mondial</h2>
          <button className="lb-close" onClick={onClose}>×</button>
        </div>

        {/* CORPS DE DEFILEMENT (LISTE + BANNIÈRE BONU) */}
        <div className="lb-body-scroll">
          
          {/* Liste ordonnée des scores de la semaine */}
          <div className="lb-list">
            {ranked.map((d, i) => (
              <div key={d.date} className={`lb-row ${i === 0 && d.score > 0 ? "gold" : ""}`}>
                <div className="lb-rank">{i + 1}</div>
                <div className="lb-day">
                  {d.label}
                  <span className="lb-date">{d.date.slice(5)}</span>
                </div>
                <div className="lb-score">{fmt(d.score)} $</div>
              </div>
            ))}
          </div>

          {/* Bannière d'infos Taxi d'Or intégrée au défilement */}
          <div className={`lb-taxi-banner ${unlocked ? "" : "locked"}`}>
            <img src={goldTaxi.url} alt="Taxi d'Or" />
            <div className="lb-taxi-info">
              <h4>{unlocked ? "🏆 Taxi d'Or Débloqué !" : "Taxi d'Or — Verrouillé"}</h4>
              <p>
                {unlocked
                  ? `Félicitations ! Meilleur score : ${fmt(best)} $. Bonus actif : tarifs +50%, consommation -30%.`
                  : "Termine en tête du classement de la semaine pour l'obtenir. Bonus : tarifs +50%, conso -30%."}
              </p>
            </div>
          </div>

        </div>

        {/* ==================== 3. BANDEAU COMPOSANT DU BAS (EFFET BOIS) ==================== */}
        <div className="lb-wood-footer">
          
          {/* Profil Directeur (Données dynamiques du jeu) */}
          <div className="lb-footer-profile">
            <div className="lb-avatar-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div className="lb-director-name">{playerName || "DIRECTEUR"}</div>
            <div className="lb-xp-bar-container">
              <div className="lb-xp-bar-fill" style={{ width: "65%" }}></div>
            </div>
            <div className="lb-qg-level">QG NIVEAU 3 (3 Capacité)</div>
          </div>

          {/* Classement Général / Score du jour */}
          <div className="lb-footer-center">
            <div className="lb-trophy-icon">🏆</div>
            <div className="lb-rank-title">CLASSEMENT<br/>MONDIAL</div>
            <div className="lb-pseudo-label-container">
              <span className="lb-pseudo-txt">SCORE DU JOUR</span>
            </div>
            <div style={{ fontSize: "10px", fontWeight: "bold", color: "#fff", marginTop: "2px" }}>
              {fmt(todayScore)} $
            </div>
          </div>

          {/* Livre Tuto & Documentation */}
          <div className="lb-footer-manuals">
            <div className="lb-tuto-book">
              <div className="lb-tuto-book-spine"></div>
              <span className="lb-tuto-book-text">TUTO</span>
            </div>
            <div className="lb-manuals-title">CONTRATS &<br/>MANUELS</div>
          </div>

        </div>

      </div>
    </div>
  );
}
