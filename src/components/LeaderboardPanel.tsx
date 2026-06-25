import { useState } from "react";

const mockDays = [
  { date: '2026-06-25', label: "Aujourd'hui", score: 12500 },
  { date: '2026-06-24', label: 'Hier', score: 9800 },
  { date: '2026-06-23', label: 'Lundi', score: 7400 },
  { date: '2026-06-22', label: 'Dimanche', score: 5200 },
  { date: '2026-06-21', label: 'Samedi', score: 3100 },
  { date: '2026-06-20', label: 'Vendredi', score: 0 },
  { date: '2026-06-19', label: 'Jeudi', score: 0 },
];

const fmt = (n: number) => Math.round(n).toLocaleString("fr-FR");

// 3 thèmes prêts à l'emploi
const themes = {
  or: {
    name: "Or",
    title: "text-[#e5c158]",
    border: "border-[#e5c158]",
    bgActive: "from-[#3a321f] to-[#231e13]",
    btnFrom: "from-[#ffca3a]",
    btnTo: "to-[#e0a300]",
    btnBorder: "border-[#a67c00]",
    shadow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#8a6400]",
  },
  bleu: {
    name: "Bleu",
    title: "text-[#58b4e5]",
    border: "border-[#58b4e5]",
    bgActive: "from-[#1f2f3a] to-[#13232e]",
    btnFrom: "from-[#3ab4ff]",
    btnTo: "to-[#0070e0]",
    btnBorder: "border-[#0050a6]",
    shadow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#004a8a]",
  },
  vert: {
    name: "Vert",
    title: "text-[#58e58a]",
    border: "border-[#58e58a]",
    bgActive: "from-[#1f3a2a] to-[#13231a]",
    btnFrom: "from-[#3aff8a]",
    btnTo: "to-[#00e05a]",
    btnBorder: "border-[#00a644]",
    shadow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#008a44]",
  },
};

export default function LeaderboardPanel({ onClose }: { onClose: () => void }) {
  const [days] = useState(mockDays);
  const [theme, setTheme] = useState<keyof typeof themes>('or');
  const t = themes[theme];

  const unlocked = false;
  const best = 15200;
  const playerName = "Aurélien";
  const todayScore = days[0].score;
  const ranked = [...days].sort((a, b) => b.score - a.score);

  const cycleTheme = () => {
    setTheme(theme === 'or'? 'bleu' : theme === 'bleu'? 'vert' : 'or');
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center p-4 font-sans">
      <div className="max-w-[420px] w-full flex flex-col h-[90vh] bg-[#1b1c1e] border-4 border-[#4a3b32] rounded-[24px] overflow-hidden shadow-2xl">

        {/* HEADER avec bouton couleurs */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#2d2f34]">
          <h2 className={`${t.title} font-black uppercase tracking-wider text-sm`}>
            🏆 CLASSEMENT HEBDOMADAIRE
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={cycleTheme}
              title={`Thème: ${t.name}`}
              className="bg-zinc-700 text-white w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center active:scale-90"
            >
              🎨
            </button>
            <button
              className="bg-zinc-700 text-white w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center active:scale-90"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        {/* LISTE */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="flex flex-col gap-2">
            {ranked.map((d, i) => (
              <div key={d.date} className={`flex items-center gap-3 p-3 rounded-xl border ${
                i === 0 && d.score > 0
                 ? `${t.border} bg-gradient-to-r ${t.bgActive}`
                  : "border-zinc-800 bg-zinc-900"
              }`}>
                <div className={`font-black text-sm w-6 text-center ${i === 0? t.title : "text-zinc-500"}`}>
                  #{i + 1}
                </div>
                <div className={`flex-1 ${t.title} font-bold text-xs uppercase tracking-wide`}>
                  {d.label}
                  <span className="text-zinc-500 text-[10px] ml-2 font-normal lowercase">{d.date.slice(5)}</span>
                </div>
                <div className="text-white font-black text-sm">{fmt(d.score)} $</div>
              </div>
            ))}
          </