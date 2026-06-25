{/* ==================== SECTION BAS ==================== */}
<div className="bg-[#120c08] border-t-2 border-[#4a3b32] p-2 space-y-2 relative">

  {/* 1. Les 4 boutons marrons */}
  <div className="grid grid-cols-4 gap-1.5">
    <div className="bg-gradient-to-b from-[#3d2a1c] to-[#24170e] border border-[#5c422f] rounded-lg p-1.5 text-center shadow-md">
      <div className="text-xs">🚖</div>
      <div className="text-[8px] font-black text-[#e5c158] mt-0.5 leading-none">GÉRER FLOTTE</div>
      <div className="text-[7px] text-zinc-500">990$</div>
    </div>
    <div className="bg-gradient-to-b from-[#3d2a1c] to-[#24170e] border border-[#5c422f] rounded-lg p-1.5 text-center shadow-md">
      <div className="text-xs">🔧</div>
      <div className="text-[8px] font-black text-[#e5c158] mt-0.5 leading-none">AMÉLIORATIONS QG</div>
      <div className="text-[7px] text-zinc-500">Niv. 0</div>
    </div>
    {/* RADIO - avec le pulse comme sur ta maquette */}
    <div className="bg-gradient-to-b from-[#3d2a1c] to-[#24170e] border-2 border-amber-500 rounded-lg p-1.5 text-center shadow-md animate-pulse">
      <div className="text-xs">📻</div>
      <div className="text-[8px] font-black text-[#e5c158] mt-0.5 leading-none">RADIO & MISSIONS</div>
      <div className="text-[7px] text-amber-400">2 appel(s)</div>
    </div>
    <div className="bg-gradient-to-b from-[#3d2a1c] to-[#24170e] border border-[#5c422f] rounded-lg p-1.5 text-center shadow-md">
      <div className="text-xs">⚔️</div>
      <div className="text-[8px] font-black text-[#e5c158] mt-0.5 leading-none">RIVALITÉ</div>
      <div className="text-[7px] text-zinc-500">0 vol.</div>
    </div>
  </div>

  {/* 2. LE POSTE RADIO - exactement comme image 2 */}
  <div className="flex justify-center -my-1">
    <div className="bg-[#0a0f1c] border border-[#e5c158]/40 rounded-full px-2 py-1 flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,0,0,0.8)]">
      <button className="w-6 h-6 rounded-full bg-gradient-to-b from-[#a31616] to-[#7a0e0e] border border-[#5a0a0a] flex items-center justify-center active:scale-95">
        <span className="text-[10px] text-white">⏮</span>
      </button>
      <button className="w-6 h-6 rounded-full bg-gradient-to-b from-[#ffca3a] to-[#e0a300] border border-[#a67c00] flex items-center justify-center active:scale-95">
        <span className="text-[10px] text-black">⏸</span>
      </button>
      <button className="w-6 h-6 rounded-full bg-gradient-to-b from-[#a31616] to-[#7a0e0e] border border-[#5a0a0a] flex items-center justify-center active:scale-95">
        <span className="text-[10px] text-white">⏭</span>
      </button>
      <div className="flex items-center gap-1 pl-1 pr-1">
        <span className="text-[10px]">🎤</span>
        <span className="text-[10px] text-[#e5c158] font-bold">Radio Pop</span>
      </div>
    </div>
  </div>

  {/* 3. Deuxième menu marron avec TES BOUTONS JAUNES */}
  <div className="bg-[#2b1d14] border border-[#5c422f] rounded-xl p-1.5">
    <div className="grid grid-cols-3 gap-1.5">
      <button className="bg-gradient-to-b from-[#ffca3a] to-[#e0a300] text-black border-2 border-[#a67c00] rounded-lg py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#8a6400] active:translate-y-0.5 flex flex-col items-center">
        <span className="text-sm leading-none">👤</span>
        <span className="text-[8px] font-black uppercase mt-0.5 truncate w-11/12">{playerName}</span>
      </button>
      <button onClick={onClose} className="bg-gradient-to-b from-[#ffca3a] to-[#e0a300] text-black border-2 border-[#a67c00] rounded-lg py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#8a6400] active:translate-y-0.5 flex flex-col items-center">
        <span className="text-sm leading-none">🏆</span>
        <span className="text-[8px] font-black uppercase mt-0.5">CLASSEMENT</span>
      </button>
      <button className="bg-gradient-to-b from-[#ffca3a] to-[#e0a300] text-black border-2 border-[#a67c00] rounded-lg py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#8a6400] active:translate-y-0.5 flex flex-col items-center">
        <span className="text-sm leading-none">📖</span>
        <span className="text-[8px] font-black uppercase mt-0.5">TUTO</span>
      </button>
    </div>
  </div>
</div>