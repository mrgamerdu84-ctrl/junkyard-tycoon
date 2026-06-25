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

const themes = {
  or: {
    title: "text-[#e5c158]",
    border: "border-[#e5c158]",
    bgActive: "from-[#3a321f] to-[#231e13]",
    btnFrom: "from-[#ffca3a]",
    btnTo: "to-[#e0a300]",
    btnBorder: "border-[#a67c00]",
  },
  bleu: {
    title: "text-[#58b4e5]",
    border: "border-[#58b4e5]",
    bgActive: "from-[#1f2f3a] to-[#13232e]",
    btnFrom: "from-[#3ab4ff]",
    btnTo: "to-[#0070e0]",
    btnBorder: "border-[#0050a6]",
  },
  vert: {
    title: "text-[#58e58a]",
    border: "border-[#58e58a]",
    bgActive: "from-[#1f3a2a] to-[#13231a]",
    btnFrom: "from-[#3aff8a]",
    btnTo: "to-[#00e05a]",
    btnBorder: "border-[#00a644]",
  },
};

export default function LeaderboardPanel({ onClose }: { onClose: () => void }) {
  const [days] = useState(mockDays);
  const [theme, setTheme] = useState<'or'|'bleu'|'vert'>('or');
  const t = themes[theme];

  const unlocked = false;
  const best = 15200;
  const playerName = "Aurélien";
  const ranked = [...days].sort((a, b) => b.score - a.score);

  const cycleTheme = () => setTheme(theme === 'or'? 'bleu' : theme === 'bleu'? 'vert' : 'or');

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center p-4 font-sans">
      <div className="max-w-[420px] w-full flex flex-col h-[90vh] bg-[#1b1c1e] border-4 border-[#4a3b32] rounded-[24px] overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#2d2f34]">
          <h2 className={`${t.title} font-black uppercase tracking-wider text-sm`}>
            🏆 CLASSEMENT
          </h2>
          <div className="flex gap-2">
            <button onClick={cycleTheme} className="bg-zinc-700 text-white w-7 h-7 rounded-full text-xs flex items-center justify-center">🎨</button>
            <button onClick={onClose} className="bg-zinc-700 text-white w-7 h-7 rounded-full flex items-center justify-center">×</button>
          </div>
        </div>

        {/* LISTE */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-zinc-900 to-zinc-950">
          {ranked.map((d, i) => (
            <div key={d.date} className={`flex items-center gap-3 p-3 rounded-xl border ${i===0 && d.score>0? `${t.border} bg-gradient-to-r ${t.bgActive}` : 'border-zinc-800 bg-zinc-900'}`}>
              <div className={`w-6 text-center font-black text-sm ${i===0? t.title : 'text-zinc-500'}`}>#{i+1}</div>
              <div className={`flex-1 ${t.title} font-bold text-xs uppercase`}>{d.label}<span className="text-zinc-500 ml-2 lowercase text-[10px]">{d.date.slice(5)}</span></div>
              <div className="text-white font-black text-sm">{fmt(d.score)} $</div>
            </div>
          ))}

          <div className="mt-4 p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h4 className={`text-xs font-black ${t.title} uppercase`}>TAXI D'OR</h4>
              <p className="text-[10px] text-zinc-300">Record : {fmt(best)} $</p>
            </div>
          </div>
        </div>

        {/* BAS */}
        <div className="bg-[#120c08] border-t-2 border-[#4a3b32] p-2 space-y-2">
          {/* 4 boutons marrons */}
          <div className="grid grid-cols-4 gap-1.5">
            <div className="bg-gradient-to-b from-[#3d2a1c] to-[#241