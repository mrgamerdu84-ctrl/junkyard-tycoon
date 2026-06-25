import { useEffect, useState } from "react";
import { getLast7Days, isSpecialTaxiUnlocked, getBestWeekScore, getTodayScore, getPlayerName, fetchCloudLast7Days } from "@/lib/leaderboard";
import { useAuth } from "@/lib/useAuth";

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

  // Tri des scores
  const ranked = [...days].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center p-4 font-sans">
      <div className="max-w-[420px] w-full flex flex-col h-[90vh] bg-[#1b1c1e] border-4 border-[#4a3b32] rounded-[24px] overflow-hidden shadow-2xl">
        
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#2d2f34]">
          <h2 className="text-[#e5c158] font-black uppercase tracking-wider text-sm shadow-sm">
            🏆 CLASSEMENT HEBDOMADAIRE
          </h2>
          <button 
            className="bg-zinc-700 text-white border-none w-7 h-7 rounded-full text-sm font-bold cursor-pointer flex items-center justify-center active:scale-90"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="flex flex-col gap-2">
            {ranked.map((d, i) => (
              <div key={d.date} className={`flex items-center gap-3 p-3 rounded-xl border ${
                i === 0 && d.score > 0 
                  ? "border-[#e5c158] bg-gradient-to-r from-[#3a321f] to-[#231e13]" 
                  : "border-zinc-800 bg-zinc-900"
              }`}>
                <div className={`font-black text-sm w-6 text-center ${i === 0 ? "text-[#e5c158]" : "text-zinc-500"}`}>
                  #{i + 1}
                </div>
                <div className="flex-1 text-[#e5c158] font-bold text-xs uppercase tracking-wide">
                  {d.label}
                  <span className="text-zinc-500 text-[10px] ml-2 font-normal lowercase">{d.date.slice(5)}</span>
                </div>
                <div className="text-white font-black text-sm">{fmt(d.score)} $</div>
              </div>
            ))}
          </div>

          {/* Statut Taxi d'Or */}
          <div className={`mt-4 p-3 rounded-xl flex items-center gap-3 border ${unlocked ? "border-amber-600 bg-amber-950/20" : "border-zinc-800 bg-zinc-900/40 opacity-60"}`}>
            <span className="text-2xl">{unlocked ? "🚖" : "🔒"}</span>
            <div>
              <h4 className="text-xs font-black text-[#e5c158] m-0 uppercase">TAXI D'OR</h4>
              <p className="text-[10px] text-zinc-300 m-0 mt-0.5">
                {unlocked ? `Débloqué ! Record : ${fmt(best)} $.` : "Termine 1er de la semaine pour l'obtenir."}
              </p>
            </div>
          </div>
        </div>

        {/* ==================== SECTION BAS : LES 4 BOUTONS MARRONS ET LE PROFIL BOIS ==================== */}
        <div className="bg-[#120c08] border-t-2 border-[#4a3b32] p-2 space-y-2">
          
          {/* Les 4 boutons de navigation (Flotte, QG, Radio, Rivalité) */}
          <div className="grid grid-cols-4 gap-1.5">
            <div className="bg-gradient-to-b from-[#3d2a1c] to-[#24170e] border border-[#5c422f] rounded-lg p-1.5 text-center shadow-md">
              <div className="text-xs">🚖</div>
              <div className="text-[8px] font-black text-[#e5c158] mt-0.5 leading-none">FLOTTE</div>
            </div>
            <div className="bg-gradient-to-b from-[#3d2a1c] to-[#24170e] border border-[#5c422f] rounded-lg p-1.5 text-center shadow-md">
              <div className="text-xs">🔧</div>
              <div className="text-[8px] font-black text-[#e5c158] mt-0.5 leading-none">AMÉLIO. QG</div>
            </div>
            <div className="bg-gradient-to-b from-[#3d2a1c] to-[#24170e] border border-[#5c422f] rounded-lg p-1.5 text-center shadow-md border-amber-500 animate-pulse">
              <div className="text-xs">📻</div>
              <div className="text-[8px] font-black text-[#e5c158] mt-0.5 leading-none">RADIO</div>
            </div>
            <div className="bg-gradient-to-b from-[#3d2a1c] to-[#24170e] border border-[#5c422f] rounded-lg p-1.5 text-center shadow-md">
              <div className="text-xs">⚔️</div>
              <div className="text-[8px] font-black text-[#e5c158] mt-0.5 leading-none">RIVALITÉ</div>
            </div>
          </div>

          {/* Le Bloc Profil Bois (Directeur, Classement Mondial, Tuto) */}
          <div 
            className="p-2.5 rounded-xl grid grid-cols-3 gap-2 items-center"
            style={{ background: 'linear-gradient(rgba(43, 29, 20, 0.95), rgba(26, 17, 11, 0.98)), url("https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=150")' }}
          >
            {/* Directeur */}
            <div className="text-center flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-amber-600 flex items-center justify-center text-[10px]">👤</div>
              <span className="text-[8px] font-black text-[#e5c158] truncate w-full mt-0.5">{playerName}</span>
              <div className="w-full bg-black/50 rounded-full h-1 mt-0.5 overflow-hidden"><div className="bg-emerald-500 h-full w-2/3"></div></div>
            </div>
            {/* Classement */}
            <div className="text-center flex flex-col items-center border-l border-r border-amber-900/30">
              <span className="text-sm">🏆</span>
              <span className="text-[8px] font-black text-[#e5c158] leading-tight">CLASSEMENT<br/>MONDIAL</span>
              <span className="text-[8px] text-white font-bold mt-0.5">{fmt(todayScore)} ¢</span>
            </div>
            {/* Tuto */}
            <div className="text-center flex flex-col items-center">
              <div className="w-6 h-8 bg-amber-900 border border-amber-950 rounded flex items-center justify-center font-black text-[7px] text-amber-950 shadow">TUTO</div>
              <span className="text-[8px] font-black text-[#e5c158] mt-0.5 leading-tight">CONTRATS</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
