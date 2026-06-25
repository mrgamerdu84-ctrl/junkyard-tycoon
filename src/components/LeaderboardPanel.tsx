import { useState } from "react";

const joueurs = [
  { pos: 1, nom: "Toi", score: 12500, couleur: "text-[#ffd97a]" },
  { pos: 2, nom: "Marco", score: 9800, couleur: "text-zinc-300" },
  { pos: 3, nom: "Lina", score: 7400, couleur: "text-[#cd7f32]" },
  { pos: 4, nom: "Sam", score: 5200, couleur: "text-zinc-400" },
  { pos: 5, nom: "Alex", score: 3100, couleur: "text-zinc-500" },
];

export default function LeaderboardPanel({ onClose = () => {} }) {
  const [selected] = useState(1);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-end justify-center">
      {/* Conteneur principal style jeu */}
      <div className="w-full max-w-[420px] bg-[#110703] border-t-[6px] border-[#6b4426] rounded-t-[32px] shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-hidden">

        {/* Barre du haut comme sur ta capture */}
        <div className="relative h-[52px] bg-gradient-to-b from-[#2a1a0f] to-[#1a0e06] border-b-2 border-black/60 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#5a3c22] to-[#2d1a0c] border-2 border-[#8a5e3a] flex items-center justify-center text-[#ffd97a] font-black">?</div>
            <div>
              <div className="text-[#f0d9a8] font-black text-[13px] leading-none tracking-wide">CLASSEMENT HEBDO</div>
              <div className="text-[#8a6b4d] text-[10px]">Jeudi 25 juin • Pertuis</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#2a1a0f] border border-[#5a3c22] text-[#f0d9a8] font-bold">×</button>
        </div>

        {/* TABLEAU */}
        <div className="bg-[url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=300')] bg-cover bg-center">
          <div className="bg-[#0d0602]/85 backdrop-blur-[2px] p-3 max-h-[38vh] overflow-y-auto">
            {joueurs.map((j) => (
              <div key={j.pos} className={`mb-2 last:mb-0 flex items-center gap-3 p-[10px] rounded-[14px] border-2 transition-all ${
                j.pos === selected
                 ? 'bg-gradient-to-r from-[#3a2414]/90 to-[#1f1208]/90 border-[#d4a85f] shadow-[0_0_15px_rgba(212,168,95,0.3)]'
                  : 'bg-[#1a0e06]/70 border-[#3a2414] border'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[13px] ${
                  j.pos===1? 'bg-[#d4a85f] text-black' : j.pos===2? 'bg-zinc-400 text-black' : j.pos===3? 'bg-[#a66a3c] text-black' : 'bg-[#2a1a0f] text-[#8a6b4d] border border-[#3a2414]'
                }`}>{j.pos}</div>
                <div className="flex-1">
                  <div className={`font-bold text-[13px] ${j.couleur}`}>{j.nom}</div>
                  <div className="h-[4px] w-full bg-black/50 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#d4a85f] to-[#8a5e3a]" style={{width: `${(j.score/13000)*100}%`}}></div>
                  </div>
                </div>
                <div className="text-[#ffd97a] font-black text-[15px] tracking-wide">{j.score.toLocaleString('fr-FR')} $</div>
              </div>
            ))}
          </div>
        </div>

        {/* LES 4 GROS BOUTONS MARRONS - identiques à ta capture 2 */}
        <div className="bg-[#0a0502] p-2.5 grid grid-cols-4 gap-2 border-t-2 border-[#2a1a0f]">
          {[
            {icon:'🚕', label:'GÉRER', sub:'FLOTTE', info:'990$'},
            {icon:'🔧', label:'AMÉLIORATIONS', sub:'QG', info:'Niv. 0'},
            {icon:'📻', label:'RADIO &', sub:'MISSIONS', info:'2 appel(s)', active:true},
            {icon:'⚔️', label:'RIVALITÉ', sub:'', info:'0 vol.'},
          ].map((b,i)=>(
            <button key={i} className={`relative h-[72px] rounded-[16px] border-[3px] ${b.active?'border-[#d4a85f]':'border-[#3a2414]'} bg-gradient-to-b from-[#5e3f25] to-[#28160a] shadow-[inset_0_2px_0_rgba(255,255,255,0.08),inset_0_-3px_0_rgba(0,0,0,0.6),0_4px_8px_rgba(0,0,0,0.7)] active:translate-y-[1px] flex flex-col items-center justify-center`}>
              <span className="text-[22px] leading-none drop-shadow-[0_2px_0_black]">{b.icon}</span>
              <span className="text-[#f0d9a8] font-black text-[10px] leading-[11px] mt-1 tracking-wide text-center">{b.label}<br/>{b.sub}</span>
              <span className={`text-[9px] mt-0.5 ${b.active?'text-[#ffd97a]':'text-[#8a6b4d]'}`}>{b.info}</span>
              {b.active && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#d4a85f] rounded-full animate-pulse"></div>}
            </button>
          ))}
        </div>

        {/* PANNEAU BOIS DU BAS - Terminé proprement */}
        <div className="bg-[#160a03] p-3 border-t-[3px] border-black flex justify-between items-center text-center">
          {/* Directeur */}
          <div className="flex-1 flex flex-col items-center border-r border-[#3a2414]">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-[#d4a85f] flex items-center justify-center text-xs">👤</div>
            <span className="text-[10px] font-black text-[#d4a85f] mt-1">DIRECTEUR</span>
            <span className="text-[8px] text-zinc-400">QG Niveau 1</span>
          </div>

          {/* Classement */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xl">🏆</span>
            <span className="text-[10px] font-black text-[#ffd97a] mt-0.5">CLASSEMENT</span>
            <span className="text-[9px] text-zinc-400">MONDIAL</span>
          </div>

          {/* Tuto */}
          <div className="flex-1 flex flex-col items-center border-l border-[#3a2414]">
            <div className="w-6 h-8 bg-amber-900 border border-amber-950 rounded flex items-center justify-center font-black text-[8px] text-amber-950 shadow">TUTO</div>
            <span className="text-[10px] font-black text-[#d4a85f] mt-1">CONTRATS</span>
          </div>
        </div>

      </div>
    </div>
  );
}
