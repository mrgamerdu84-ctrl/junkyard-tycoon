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
          </div>

          {/* TAXI D'OR */}
          <div className={`mt-4 p-3 rounded-xl flex items-center gap-3 border ${unlocked? "border-amber-600 bg-amber-950/20" : "border-zinc-800 bg-zinc-900/40 opacity-60"}`}>
            <span className="text-2xl">{unlocked? "🚖" : "🔒"}</span>
            <div>
              <h4 className={`text-xs font-black ${t.title} m-0 uppercase`}>TAXI D'OR</h4>
              <p className="text-[10px] text-zinc-300 m-0 mt-0.5">
                {unlocked? `Débloqué! Record : ${fmt(best)} $.` : "Termine 1er de la semaine pour l'obtenir."}
              </p>
            </div>
          </div>
        </div>

        {/* BAS */}
        <div className="bg-[#120c08] border-t-2 border-[#4a3b32] p-2 space-y-2">
          {/* 4 boutons marrons */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              {i:"🚖",t:"GÉRER FLOTTE",s:"990$"},
              {i:"🔧",t:"AMÉLIORATIONS QG",s:"Niv. 0"},
              {i:"📻",t:"RADIO & MISSIONS",s:"2 appel(s)",active:true},
              {i:"⚔️",t:"RIVALITÉ",s:"0 vol."},
            ].map((b,idx)=>(
              <div key={idx} className={`bg-gradient-to-b from-[#3d2a1c] to-[#24170e] border ${b.active? t.border+' border-2 animate-pulse':'border-[#5c422f]'} rounded-lg p-1.5 text-center shadow-md`}>
                <div className="text-xs">{b.i}</div>
                <div className={`text-[8px] font-black ${t.title} mt-0.5 leading-none`}>{b.t}</div>
                <div className={`text-[7px] ${b.active?'text-amber-400':'text-zinc-500'}`}>{b.s}</div>
              </div>
            ))}
          </div>

          {/* RADIO PLAYER */}
          <div className="flex justify-center -my-1">
            <div className="bg-[#0a0f1c] border border-[#e5c158]/40 rounded-full px-2 py-1 flex items-center gap-1.5 shadow-lg">
              <button className="w-6 h-6 rounded-full bg-gradient-to-b from-[#a31616] to-[#7a0e0e] border border-[#5a0a0a] flex items-center justify-center"><span className="text-white text-[10px]">⏮</span></button>
              <button className="w-6 h-6 rounded-full bg-gradient-to-b from-[#ffca3a] to-[#e0a300] border border-[#a67c00] flex items-center justify-center"><span className="text-black text-[10px]">⏸</span></button>
              <button className="w-6 h-6 rounded-full bg-gradient-to-b from-[#a31616] to-[#7a0e0e] border border-[#5a0a0a] flex items-center justify-center"><span className="text-white text-[10px]">⏭</span></button>
              <div className="flex items-center gap-1 pl-1"><span className="text-[10px]">🎤</span><span className="text-[10px] text-[#e5c158] font-bold">Radio Pop</span></div>
            </div>
          </div>

          {/* Boutons qui changent de couleur */}
          <div className="bg-[#2b1d14] border border-[#5c422f] rounded-xl p-1.5">
            <div className="grid grid-cols-3 gap-1.5">
              {[
                {icon:"👤",label:playerName},
                {icon:"🏆",label:"CLASSEMENT"},
                {icon:"📖",label:"TUTO"},
              ].map((b)=>(
                <button key={b.label} className={`bg-gradient-to-b ${t.btnFrom} ${t.btnTo} text-black border-2 ${t.btnBorder} rounded-lg py-1.5 ${t.shadow} active:translate-y-0.5 flex flex-col items-center`}>
                  <span className="text-sm leading-none">{b.icon}</span>
                  <span className="text-[8px] font-black uppercase mt-0.5 truncate w-11/12">{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}