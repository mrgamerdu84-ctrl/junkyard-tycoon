import React, { useState } from "react";

const joueurs = [
  { pos: 1, nom: "Toi", score: 12500 },
  { pos: 2, nom: "Marco", score: 9800 },
  { pos: 3, nom: "Lina", score: 7400 },
  { pos: 4, nom: "Sam", score: 5200 },
  { pos: 5, nom: "Alex", score: 3100 },
];

export default function LeaderboardPanel({ onClose = () => {} }) {
  const [list] = useState(joueurs);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-end justify-center sm:items-center">
      <div className="w-full max-w-[420px] bg-[#0b0400] sm:rounded-[28px] rounded-t-[28px] border-t-[5px] sm:border-[5px] border-[#7a4e2a] shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="h-16 bg-gradient-to-b from-[#2e1a0c] to-[#1a0c04] border-b-2 border-black px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#5c3a1f] to-[#281408] border-2 border-[#8c5e36] flex items-center justify-center text-[#ffda8a] font-bold">?</div>
            <div>
              <p className="text-[#f5e0b7] font-black text-sm tracking-wider leading-none">CLASSEMENT HEBDO</p>
              <p className="text-[#8c6b4a] text-xs">Jeudi 25 juin • Pertuis</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#1a0c04] border border-[#5c3a1f] text-[#f5e0b7]">×</button>
        </div>

        {/* LISTE */}
        <div className="bg-[#140903] p-3 max-h-[260px] overflow-y-auto">
          <div className="space-y-2">
            {list.map((j) => (
              <div key={j.pos} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 ${j.pos===1? "bg-gradient-to-r from-[#3b2512] to-[#1f1308] border-[#d4a85f]" : "bg-[#1a0e05] border-[#3a2412]"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-sm ${j.pos===1?"bg-[#d4a85f] text-black":j.pos===2?"bg-zinc-300 text-black":j.pos===3?"bg-[#a06a3d] text-black":"bg-[#24140a] text-[#8c6b4a]"}`}>{j.pos}</div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${j.pos===1?"text-[#ffd97a]":"text-[#e8d0a8]"}`}>{j.nom}</p>
                  <div className="w-full h-1.5 bg-black/60 rounded-full mt-1"><div className="h-full bg-[#d4a85f] rounded-full" style={{width:`${j.score/130}%`}}/></div>
                </div>
                <p className="text-[#ffd97a] font-black text-sm">{j.score.toLocaleString('fr-FR')} $</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 BOUTONS */}
        <div className="grid grid-cols-4 gap-2 p-2.5 bg-[#080200] border-t-2 border-[#1a0c04]">
          {[
            {i:"🚕",l1:"GÉRER",l2:"FLOTTE",s:"990$"},
            {i:"🔧",l1:"AMÉLIORATIONS",l2:"QG",s:"Niv.0"},
            {i:"📻",l1:"RADIO &",l2:"MISSIONS",s:"2 appel(s)",a:true},
            {i:"⚔️",l1:"RIVALITÉ",l2:"",s:"0 vol."},
          ].map((b,i)=>(
            <div key={i} className={`h-[78px] rounded-xl border-[3px] ${b.a?"border-[#d4a85f]":"border-[#3a2412]"} bg-gradient-to-b from-[#5a3a21] to-[#241207] flex flex-col items-center justify-center shadow-lg`}>
              <span className="text-lg">{b.i}</span>
              <span className="text-[#f5e0b7] font-black text-[10px] leading-tight text-center mt-1">{b.l1}<br/>{b.l2}</span>
              <span className={`text-[9px] ${b.a?"text-[#ffd97a]":"text-[#8c6b4a]"}`}>{b.s}</span>
            </div>
          ))}
        </div>

        {/* PANNEAU BOIS */}
        <div className="bg-[#0f0601] p-2.5 border-t-2 border-black">
          <div className="bg-gradient-to-b from-[#3e2814] to-[#1a0