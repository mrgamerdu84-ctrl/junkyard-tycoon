import { useEffect, useRef, useState } from "react";
import { GAME_ASSETS } from "@/game/gameAssets";
import { AMBIENT_NEWS, WELCOME_JINGLE, type RadioNews } from "@/lib/radioNews";
import junkyCityEmpireAsset from "@/assets/junky_city_empire.mp3.asset.json";
import ironToothAsset from "@/assets/iron_tooth.mp3.asset.json";

// CONFIGURATION DES VOIES DE TRAFIC (WAYPOINTS)
const VOIE_DROITE = [
  { x: 10, y: 50 },
  { x: 50, y: 50 },
  { x: 90, y: 50 }
];

const VOIE_GAUCHE = [
  { x: 90, y: 56 },
  { x: 50, y: 56 },
  { x: 10, y: 56 }
];

type Voiture = {
  id: string;
  voie: "droite" | "gauche";
  indexEtape: number;
  x: number;
  y: number;
  vitesse: number;
};

type Station = { id: string; name: string; emoji: string; url?: string; loop?: boolean; volume?: number; tts?: boolean; };

const STATIONS: Station[] = [
  { id: "main",     name: "Junky Empire Taxi",  emoji: "🚖", url: GAME_ASSETS["audio.music"], loop: true, volume: 0.4 },
  { id: "jce",      name: "Junky City Empire",  emoji: "🎵", url: junkyCityEmpireAsset.url, loop: true, volume: 0.6 },
  { id: "iron",     name: "Iron Tooth",         emoji: "🦷", url: ironToothAsset.url, loop: true, volume: 0.6 },
  { id: "infos",    name: "Junky Infos",        emoji: "📰", tts: true },
  { id: "pop",      name: "Radio Pop",          emoji: "🎤", url: "https://ice1.somafm.com/poptron-128-mp3", volume: 0.5 },
  { id: "electro",  name: "Radio Electro",      emoji: "🎧", url: "https://ice1.somafm.com/groovesalad-128-mp3", volume: 0.5 },
  { id: "rock",     name: "Radio Rock",         emoji: "🎸", url: "https://ice6.somafm.com/thetrip-128-mp3", volume: 0.5 },
  { id: "emotions", name: "Radio Émotions",     emoji: "💖", url: "https://ice1.somafm.com/lush-128-mp3", volume: 0.5 },
  { id: "kids",     name: "Radio Kids",         emoji: "🧸", url: "https://ice1.somafm.com/fluid-128-mp3", volume: 0.5 },
];

export default function TaxiRadio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const interludeRef = useRef<HTMLAudioElement | null>(null);
  const ambientTimerRef = useRef<number | null>(null);
  const ambientIdxRef = useRef<number>(0);

  const [stationId, setStationId] = useState<string>("main");
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ticker, setTicker] = useState<string>("");
  const [newsHour, setNewsHour] = useState<boolean>(false);

  // --- ÉTAT DU TRAFIC FLUIDE ---
  const [voitures, setVoitures] = useState<Voiture[]>([]);

  useEffect(() => {
    const apply = () => setNewsHour(new Date().getMinutes() < 10);
    apply();
    const t = window.setInterval(apply, 30000);
    return () => window.clearInterval(t);
  }, []);

  const speak = async (news: RadioNews, onComplete?: () => void) => {
    const text = news.fr; setTicker(text);
    let doneCalled = false;
    const done = () => { if (!doneCalled) { doneCalled = true; onComplete?.(); } };
    const failsafe = window.setTimeout(done, 15000);

    try {
      if (ttsAudioRef.current) ttsAudioRef.current.pause();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text); u.lang = "fr-FR";
        u.onend = () => { window.clearTimeout(failsafe); done(); };
        u.onerror = () => { window.clearTimeout(failsafe); done(); };
        window.speechSynthesis.speak(u);
      } else { done(); }
    } catch { done(); }
  };

  useEffect(() => {
    const st = STATIONS.find((s) => s.id === stationId);
    if (ambientTimerRef.current) window.clearInterval(ambientTimerRef.current);
    if (interludeRef.current) interludeRef.current.pause();
    setTicker("");

    if (!st || st.id === "off") { if (audioRef.current) audioRef.current.pause(); return; }

    if (st.tts || newsHour) {
      if (audioRef.current) audioRef.current.pause();
      speak(WELCOME_JINGLE);
      ambientTimerRef.current = window.setInterval(() => {
        const idx = ambientIdxRef.current % AMBIENT_NEWS.length;
        ambientIdxRef.current++;
        speak(AMBIENT_NEWS[idx]);
      }, 16000);
    } else if (st.url && audioRef.current) {
      audioRef.current.src = st.url;
      audioRef.current.volume = st.volume || 0.5;
      if (!paused) audioRef.current.play().catch(() => {});
    }
  }, [stationId, newsHour, paused]);

  // =========================================================
  // LOGIQUE DU TRAFIC INTELLIGENT (DROITE / GAUCHE RESPECTÉ)
  // =========================================================
  useEffect(() => {
    const intervalTrafic = setInterval(() => {
      if (voitures.length < 5) {
        const vaADroite = Math.random() > 0.5;
        setVoitures((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            voie: vaADroite ? "droite" : "gauche",
            indexEtape: 0,
            x: vaADroite ? VOIE_DROITE[0].x : VOIE_GAUCHE[0].x,
            y: vaADroite ? VOIE_DROITE[0].y : VOIE_GAUCHE[0].y,
            vitesse: 1.2
          }
        ]);
      }
    }, 3500);
    return () => clearInterval(intervalTrafic);
  }, [voitures]);

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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} loop />
      
      {/* BOUTON FLOTTANT DE LA RADIO */}
      <button 
        onClick={() => setOpen(!open)} 
        className="w-14 h-14 bg-yellow-500 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-105 transition-transform border-2 border-slate-900"
      >
        {STATIONS.find(s => s.id === stationId)?.emoji || "📻"}
      </button>

      {/* BOÎTE DE DIALOGUE PRINCIPALE */}
      {open && (
        <div className="absolute bottom-16 right-0 w-72 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-2xl p-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
          
          {/* SECTION CONTROLE DE LA MUSIQUE */}
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="font-bold text-yellow-500 text-sm">Taxi Autoradio</span>
            <button 
              onClick={() => setPaused(!paused)} 
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
            >
              {paused ? "▶️ Play" : "⏸️ Pause"}
            </button>
          </div>

          {/* TICKER INFOS */}
          {ticker && (
            <div className="bg-slate-950 p-2 rounded text-xs text-yellow-400 font-mono border border-yellow-600/30 animate-pulse">
              📢 {ticker}
            </div>
          )}

          {/* LISTE DES STATIONS RADIO */}
          <div className="grid grid-cols-1 gap-1 max-h-36 overflow-y-auto pr-1">
            {STATIONS.map((st) => (
              <button
                key={st.id}
                onClick={() => setStationId(st.id)}
                className={`flex items-center gap-2 w-full text-left text-xs p-1.5 rounded transition-colors ${
                  stationId === st.id ? "bg-yellow-500 text-slate-950 font-bold" : "bg-slate-950/60 hover:bg-slate-800 text-slate-200"
                }`}
              >
                <span>{st.emoji}</span>
                <span className="truncate">{st.name}</span>
              </button>
            ))}
          </div>

          {/* CONTRÔLE DE TRAFIC INJECTÉ */}
          <div className="border-t border-slate-700 pt-3 mt-1">
            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest text-center flex items-center justify-center gap-1">
              🚦 REGULATION FLUIDE DU TRAFIC
            </h4>
            <div className="mt-2 bg-slate-950 p-2 rounded border border-slate-800 text-[10px] font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Réseau Auto :</span>
                <span className="text-emerald-400 font-bold">FLUIDE 🟢</span>
              </div>
              <div className="flex justify-between text-slate-300 mt-0.5">
                <span>Voitures :</span>
                <span className="text-yellow-400 font-bold">{voitures.length} / 5</span>
              </div>
              
              <div className="mt-1.5 max-h-20 overflow-y-auto text-[9px] text-slate-500 flex flex-col gap-0.5 border-t border-slate-900 pt-1">
                {voitures.map((v) => (
                  <div key={v.id} className="flex justify-between">
                    <span>🚗 Voie {v.voie === "droite" ? "Droite (→)" : "Gauche (←)"}</span>
                    <span>X:{Math.round(v.x)} Y:{Math.round(v.y)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
          }
        
