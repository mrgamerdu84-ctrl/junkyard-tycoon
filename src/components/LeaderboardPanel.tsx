type LeaderboardPanelProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function LeaderboardPanel({ open = true, onClose }: LeaderboardPanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 pointer-events-auto">
      <div className="w-full max-w-[420px] rounded-[18px] border-[3px] border-[#5a3a1f] bg-gradient-to-b from-[#3d2814] to-[#1a0c04] p-4 shadow-[inset_0_2px_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.75)] text-[#f0d9b5]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="m-0 text-[18px] font-black text-[#ffd97a] drop-shadow">🏆 Classement mondial</h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-full border-2 border-[#d4a85f] bg-[#1a0c04] text-[#ffd97a] font-black"
              aria-label="Fermer le classement"
            >
              ×
            </button>
          )}
        </div>

        <div className="rounded-[14px] border-2 border-[#3d2814] bg-[#1a0c04]/80 p-3 text-center">
          <p className="m-0 text-[13px] font-bold">Le classement est en cours de chargement.</p>
          <p className="mt-2 mb-0 text-[11px] text-[#8a6b4a]">Tes scores apparaîtront ici dès que les données seront disponibles.</p>
        </div>
      </div>
    </div>
  );
}
