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

  return (
    <div className="fixed inset-0 z-[10000] bg-black/70 flex items-center justify-center p-4 font-sans">
      <div className="max-w-[420px] w-full flex flex-col gap-3 p-3">
        
        {/* Bannière Mise à jour */}
        <div className="bg-gradient-to-b from-amber-400 to-amber-600 rounded-[20px] p-4 flex justify-between items-center text-white shadow-lg border border-amber-500">
          <div>
            <div className="text-sm font-black">✨ Nouvelle mise à jour !</div>
            <div className="text-[10px] opacity-90">Version 1.0.0 disponible...</div>
          </div>
          <button className="bg-white text-amber-600 text-[11px] font-black px-3 py-1.5 rounded-full shadow-md">
            Mettre à jour
          </button>
        </div>

        {/* 1. JOUER */}
        <button 
          onClick={onClose}
          className="w-full font-black text-base uppercase tracking-wider p-4 rounded-[20px] flex items-center justify-center gap-2 border-2 border-amber-600 bg-gradient-to-b from-amber-300 to-amber-500 text-indigo-950 shadow-[0_4px_0px_#b45309] active:translate-y-[3px] active:shadow-[0_1px_0px_#b45309] transition-all"
        >
          <span>JOUER ▶</span>
        </button>

        {/* 2. ARÈNE MONDIALE */}
        <button className="w-full font-black text-base uppercase tracking-wider p-4 rounded-[20px] flex items-center justify-center gap-2 border-2 border-red-800 bg-gradient-to-b from-red-400 to-red-700 text-white shadow-[0_4px_0px_#991b1b] active:translate-y-[3px] active:shadow-[0_1px_0px_#991b1b] transition-all">
          <span>⚔️ ARÈNE MONDIALE</span>
        </button>

        {/* 3. CLASSEMENT */}
        <button className="w-full font-black text-base uppercase tracking-wider p-4 rounded-[20px] flex items-center justify-center gap-2 border-2 border-amber-600 bg-gradient-to-b from-amber-300 to-amber-500 text-indigo-950 shadow-[0_4px_0px_#b45309] active:translate-y-[3px] active:shadow-[0_1px_0px_#b45309] transition-all">
          <span>🏆 CLASSEMENT ({fmt(todayScore)} $)</span>
        </button>

        {/* 4. TUTO */}
        <button className="w-full font-black text-base uppercase tracking-wider p-4 rounded-[20px] flex items-center justify-center gap-2 border-2 border-amber-600 bg-gradient-to-b from-amber-300 to-amber-500 text-indigo-950 shadow-[0_4px_0px_#b45309] active:translate-y-[3px] active:shadow-[0_1px_0px_#b45309] transition-all">
          <span>📖 TUTO {unlocked ? "✅" : "🔒"}</span>
        </button>

        {/* 5. PSEUDO */}
        <button className="w-full font-black text-base uppercase tracking-wider p-4 rounded-[20px] flex items-center justify-center gap-2 border-2 border-amber-600 bg-gradient-to-b from-amber-300 to-amber-500 text-indigo-950 shadow-[0_4px_0px_#b45309] active:translate-y-[3px] active:shadow-[0_1px_0px_#b45309] transition-all">
          <span>✏️ PSEUDO : {playerName}</span>
        </button>

        {/* 6. MON PROFIL */}
        <button className="w-full font-black text-base uppercase tracking-wider p-4 rounded-[20px] flex items-center justify-center gap-2 border-2 border-blue-800 bg-gradient-to-b from-blue-400 to-blue-700 text-white shadow-[0_4px_0px_#1e40af] active:translate-y-[3px] active:shadow-[0_1px_0px_#1e40af] transition-all">
          <span>🪪 MON PROFIL</span>
        </button>

        {/* 7. DÉCONNEXION */}
        <button className="w-full font-black text-base uppercase tracking-wider p-4 rounded-[20px] flex items-center justify-center gap-2 border-2 border-zinc-700 bg-gradient-to-b from-zinc-500 to-zinc-600 text-white shadow-[0_4px_0px_#1f2937] active:translate-y-[3px] active:shadow-[0_1px_0px_#1f2937] transition-all">
          <span>🚪 DÉCONNEXION</span>
        </button>

        {/* 8. TÉLÉCHARGER L'APK */}
        <button className="w-full font-black text-base uppercase tracking-wider p-4 rounded-[20px] flex items-center justify-center gap-2 border-2 border-amber-600 bg-gradient-to-b from-amber-300 to-amber-500 text-indigo-950 shadow-[0_4px_0px_#b45309] active:translate-y-[3px] active:shadow-[0_1px_0px_#b45309] transition-all mt-2">
          <span>🤖 TÉLÉCHARGER L'APK</span>
        </button>

      </div>
    </div>
  );
}
