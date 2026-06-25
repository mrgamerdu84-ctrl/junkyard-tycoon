{/* INTERFACE JEU - À COLLER TEL QUEL */}
<div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
  <div className="max-w-[420px] mx-auto pointer-events-auto">

    {/* 4 GROS BOUTONS */}
    <div className="grid grid-cols-4 gap-1.5 px-2 pb-2">
      <button className="h-[88px] rounded-[14px] border-[3px] border-[#3d2814] bg-gradient-to-b from-[#5a3f25] to-[#28150a] shadow-[inset_0_2px_0_rgba(255,255,255,0.08),0_4px_8px_#000] active:translate-y-[1px] flex flex-col items-center justify-center">
        <span className="text-[22px] leading-none">🚕</span>
        <span className="text-[#f0d9b5] font-black text-[10px] leading-[11px] mt-1 text-center">GÉRER<br/>FLOTTE</span>
        <span className="text-[#8a6b4a] text-[9px] mt-0.5">990$</span>
      </button>

      <button className="h-[88px] rounded-[14px] border-[3px] border-[#3d2814] bg-gradient-to-b from-[#5a3f25] to-[#28150a] shadow-[inset_0_2px_0_rgba(255,255,255,0.08),0_4px_8px_#000] active:translate-y-[1px] flex flex-col items-center justify-center">
        <span className="text-[22px] leading-none">🔧</span>
        <span className="text-[#f0d9b5] font-black text-[10px] leading-[11px] mt-1 text-center">AMÉLIORATIONS<br/>QG</span>
        <span className="text-[#8a6b4a] text-[9px] mt-0.5">Niv. 0</span>
      </button>

      <button className="h-[88px] rounded-[14px] border-[3px] border-[#d4a85f] bg-gradient-to-b from-[#5a3f25] to-[#28150a] shadow-[inset_0_2px_0_rgba(255,255,255,0.12),0_0_12px_rgba(212,168,95,0.3)] active:translate-y-[1px] flex flex-col items-center justify-center relative">
        <span className="text-[22px] leading-none">📻</span>
        <span className="text-[#ffd97a] font-black text-[10px] leading-[11px] mt-1 text-center">RADIO &<br/>MISSIONS</span>
        <span className="text-[#ffd97a] text-[9px] mt-0.5">2 appel(s)</span>
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffd97a] rounded-full animate-pulse"></span>
      </button>

      <button className="h-[88px] rounded-[14px] border-[3px] border-[#3d2814] bg-gradient-to-b from-[#5a3f25] to-[#28150a] shadow-[inset_0_2px_0_rgba(255,255,255,0.08),0_4px_8px_#000] active:translate-y-[1px] flex flex-col items-center justify-center">
        <span className="text-[22px] leading-none">⚔️</span>
        <span className="text-[#f0d9b5] font-black text-[10px] leading-[11px] mt-1 text-center">RIVALITÉ</span>
        <span className="text-[#8a6b4a] text-[9px] mt-0.5">0 vol.</span>
      </button>
    </div>

    {/* PANNEAU BOIS DU BAS */}
    <div className="mx-2 mb-2 p-2.5 rounded-[18px] border-[3px] border-[#5a3a1f] bg-gradient-to-b from-[#3d2814] to-[#1a0c04] shadow-[inset_0_2px_0_rgba(255,255,255,0.05)]">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#1a0c04] border-2 border-[#5a3a1f] flex items-center justify-center text-[#6b4f31]">?</div>
          <p className="text-[#f0d9b5] font-bold text-[10px] mt-1">[NOM]</p>
        </div>
        <button className="flex flex-col items-center justify-center">
          <span className="text-[24px] leading-none">🏆</span>
          <span className="text-[#ffd97a] font-black text-[10px] leading-[11px] mt-1">CLASSEMENT<br/>MONDIAL</span>
        </button>
        <div className="flex flex-col items-center relative">
          <div className="w-7 h-9 bg-[#5a3a1f] border-2 border-[#3d2814] rounded-[4px] flex items-center justify-center text-[8px] font-black text-black">TUTO</div>
          <span className="text-[#f0d9b5] text-[9px] mt-1">CONT & MAN</span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1a0c04] border-2 border-[#d4a85f] flex items-center justify-center text-[12px]">⚙️</div>
        </div>
      </div>
    </div>

  </div>
</div>