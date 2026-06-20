import { useState, useEffect } from "react";

// ==========================================
// CONFIGURATION DE LA ROUTE (VOIES SÉPARÉES)
// ==========================================
const VOIE_DROITE = [
  { x: 10, y: 50 },
  { x: 50, y: 50 },
  { x: 90, y: 50 }
];

const VOIE_GAUCHE = [
  { x: 90, y: 56 }, // Un peu plus haut pour éviter la voie de droite
  { x: 50, y: 56 },
  { x: 10, y: 56 }
];

// TYPES POUR LE TRAFIC ET LES CRIMES
type Voiture = {
  id: string;
  voie: "droite" | "gauche";
  indexEtape: number;
  x: number;
  y: number;
  vitesse: number;
};

type CrimeEvent = {
  id: string;
  type: "cambriolage" | "braquage";
  statut: "en_cours" | "police_en_route" | "intercepte";
};

export default function TrafficManager() {
  // ÉTATS DE GESTION
  const [voitures, setVoitures] = useState<Voiture[]>([]);
  const [activeCrime, setActiveCrime] = useState<CrimeEvent | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // ==========================================
  // SYSTÈME DE CIRCULATION (AUTO-GÉNÉRATION)
  // ==========================================
  useEffect(() => {
    const intervalTrafic = setInterval(() => {
      if (voitures.length < 5) {
        const vaADroite = Math.random() > 0.5;
        const nouvelleVoiture: Voiture = {
          id: Math.random().toString(),
          voie: vaADroite ? "droite" : "gauche",
          indexEtape: 0,
          x: vaADroite ? VOIE_DROITE[0].x : VOIE_GAUCHE[0].x,
          y: vaADroite ? VOIE_DROITE[0].y : VOIE_GAUCHE[0].y,
          vitesse: 1.5
        };
        setVoitures((prev) => [...prev, nouvelleVoiture]);
      }
    }, 3500);

    return () => clearInterval(intervalTrafic);
  }, [voitures]);

  // DEPLACEMENT DES VOITURES SUR LEUR VOIE
  useEffect(() => {
    const boucleMouvement = setInterval(() => {
      setVoitures((prevVoitures) =>
        prevVoitures
          .map((voiture) => {
            const pointsCibles = voiture.voie === "droite" ? VOIE_DROITE : VOIE_GAUCHE;
            const cibleActuelle = pointsCibles[voiture.indexEtape];

            if (!cibleActuelle) return null;

            const diffX = cibleActuelle.x - voiture.x;
            const diffY = cibleActuelle.y - voiture.y;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);

            if (distance < 2) {
              return { ...voiture, indexEtape: voiture.indexEtape + 1 };
            }

            return {
              ...voiture,
              x: voiture.x + (diffX / distance) * voiture.vitesse,
              y: voiture.y + (diffY / distance) * voiture.vitesse
            };
          })
          .filter((v): v is Voiture => v !== null)
      );
    }, 50);

    return () => clearInterval(boucleMouvement);
  }, []);

  // ==========================================
  // SYSTÈME DE CRIMES ET D'ATTAQUES RAPIDES
  // ==========================================
  useEffect(() => {
    // Premier crime rapide après 4 secondes
    const initialCrime = setTimeout(() => {
      if (!activeCrime) {
        setActiveCrime({ id: "init", type: "braquage", statut: "en_cours" });
        setLogs((prev) => ["🚨 ALERTE : Un braquage à main armée est signalé à la casse !", ...prev]);
      }
    }, 4000);

    // Boucle de crimes toutes les 15 secondes
    const boucleCrimes = setInterval(() => {
      if (!activeCrime) {
        const typeCrime = Math.random() > 0.5 ? "braquage" : "cambriolage";
        setActiveCrime({
          id: Math.random().toString(),
          type: typeCrime,
          statut: "en_cours"
        });
        setLogs((prev) => [`🚨 ALERTE : Des intrus tentent un ${typeCrime} !`, ...prev]);
      }
    }, 15000);

    return () => {
      clearTimeout(initialCrime);
      clearInterval(boucleCrimes);
    };
  }, [activeCrime]);

  // ACTION : ENVOYER LES FORCES DE L'ORDRE
  const deployerPolice = () => {
    if (!activeCrime) return;
    
    setActiveCrime({ ...activeCrime, statut: "police_en_route" });
    setLogs((prev) => ["🚓 POLICE : Sirènes enclenchées, les patrouilles foncent sur place !", ...prev]);

    // La police arrive et neutralise les criminels après 2.5 secondes
    setTimeout(() => {
      setActiveCrime({ ...activeCrime, statut: "intercepte" });
      setLogs((prev) => [
        "👮 POLICE : 'Haut les mains ! Tout le monde au sol !'",
        "💥 FUSILLADE ! Des tirs retentissent devant la casse !",
        "⚡ Les braqueurs sont neutralisés et mis sous les verrous.",
        ...prev
      ]);

      // Fermeture de la crise après 4 secondes pour que le jeu reprenne son cours
      setTimeout(() => setActiveCrime(null), 4000);
    }, 2500);
  };

  // ==========================================
  // INTERFACE VISUELLE UNIQUÉE DU JEU
  // ==========================================
  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4">
      
      {/* 1. PANNEAU DU TRAFIC ROUTIER */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider text-center flex items-center justify-center gap-2">
          🚦 SÉCURITÉ ROUTIÈRE (CONTRÔLE DES VOIES)
        </h3>
        <p className="text-[10px] text-slate-400 text-center mt-1">
          Les véhicules suivent obligatoirement les corridors numériques Gauche/Droite.
        </p>
        
        <div className="mt-3 bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono">
          <div className="flex justify-between">
            <span>Voitures en circulation :</span>
            <span className="text-yellow-400 font-bold">{voitures.length} / 5</span>
          </div>
          <div className="mt-2 max-h-24 overflow-y-auto text-slate-400 text-[10px] flex flex-col gap-1">
            {voitures.map((v) => (
              <div key={v.id} className="border-b border-slate-900 pb-0.5">
                🚗 Axe {v.voie === "droite" ? "Droit (->)" : "Gauche (<-)"} | Coordonnées : X:{Math.round(v.x)} Y:{Math.round(v.y)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PANNEAU DES INCIDENTS ET DE LA POLICE */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border-2 border-red-900 shadow-xl">
        <h3 className="text-xs font-black text-red-500 uppercase tracking-widest text-center">
          🚨 ALARMES & CRIMINALITÉ DE JUNKY CITY
        </h3>

        {activeCrime ? (
          <div className="mt-3 bg-red-950/40 border border-red-800 p-3 rounded-xl text-xs">
            <div className="font-bold flex justify-between">
              <span>ALERTE INFRACTION :</span>
              <span className="text-red-400 uppercase font-extrabold tracking-wide">{activeCrime.type}</span>
            </div>
            <div className="mt-1 font-mono text-yellow-400 text-[11px]">
              SITUATION : {activeCrime.statut.replace(/_/g, " ").toUpperCase()}
            </div>
            
            {activeCrime.statut === "en_cours" && (
              <button
                onClick={deployerPolice}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2 rounded-xl border border-blue-400 shadow transition-transform active:scale-95 text-center text-xs tracking-wider"
              >
                🚓 ENVOYER LES UNITÉS D'INTERVENTION
              </button>
            )}
          </div>
        ) : (
          <div className="mt-3 bg-emerald-950/30 border border-emerald-800 p-2 rounded-xl text-center text-xs text-emerald-400 font-medium">
            🟢 Casse sous contrôle. Pas de menaces détectées.
          </div>
        )}

        {/* LOGS DE LA RADIO ET DES FUSILLADES */}
        <div className="mt-3 border-t border-slate-800 pt-2 bg-slate-950 p-2 rounded-lg shadow-inner">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Rapport Radio Central :</span>
          <div className="mt-1 max-h-28 overflow-y-auto text-[10px] font-mono text-slate-300 flex flex-col gap-1">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={`pb-1 border-b border-slate-900 ${log.includes('💥') ? 'text-orange-400 font-bold' : ''}`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
              }
              
