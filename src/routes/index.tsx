import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import citymap from "@/assets/citymap2.jpg";
import TaxiTycoon from "@/game/TaxiTycoon";
import CityTraffic from "@/game/CityTraffic";
import CityCompetitors from "@/game/CityCompetitors";
import CityRivalTaxis from "@/game/CityRivalTaxis";
import CityPremiumDistricts from "@/game/CityPremiumDistricts";
import CityMissionLayer from "@/game/CityMissionLayer";
import V2RoadTraffic from "@/game/V2RoadTraffic";
import TaxiAiLayer from "@/game/TaxiAiLayer";
import CustomerDemandLayer from "@/game/CustomerDemandLayer";
import AiTaxiWalletHud from "@/game/AiTaxiWalletHud";
import ArmoredTruck from "@/game/ArmoredTruck";
import CrimeEvents from "@/game/CrimeEvents";
import InterventionDispatcher from "@/game/InterventionDispatcher";
import EmergencyStations from "@/game/EmergencyStations";
import RadarFlash from "@/game/RadarFlash";
import AdminPanel from "@/game/AdminPanel";
import VersionBanner from "@/game/VersionBanner";
import HomeScreen from "@/game/HomeScreen";
import SplashScreen from "@/game/SplashScreen";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "My Taxi World Rivalité V2" },
    { name: "description", content: "V2 Premium — bâtis un empire de taxis dans une ville vivante." },
    { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
  ]}),
  component: TaxiTycoonPage,
});

const ZOOM_LEVELS = [1, 1.5, 2, 2.75] as const;
const COLOR_THEMES = [
  { id: "gold", label: "Or", color: "#ffd97a", glow: "rgba(255,217,122,.36)" },
  { id: "blue", label: "Bleu", color: "#38bdf8", glow: "rgba(56,189,248,.36)" },
  { id: "green", label: "Vert", color: "#34d399", glow: "rgba(52,211,153,.36)" },
  { id: "pink", label: "Rose", color: "#f472b6", glow: "rgba(244,114,182,.36)" },
  { id: "red", label: "Rouge", color: "#fb7185", glow: "rgba(251,113,133,.36)" },
] as const;
type ColorThemeId = (typeof COLOR_THEMES)[number]["id"];

function TaxiTycoonPage() {
  const [phase, setPhase] = useState<"splash" | "home" | "game">("splash");
  const [zoomIdx, setZoomIdx] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [colorTheme, setColorTheme] = useState<ColorThemeId>(() => {
    if (typeof window === "undefined") return "gold";
    const saved = window.localStorage.getItem("mttw.colorTheme") as ColorThemeId | null;
    return COLOR_THEMES.some((t) => t.id === saved) ? saved! : "gold";
  });
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const zoom = ZOOM_LEVELS[zoomIdx];
  const theme = COLOR_THEMES.find((t) => t.id === colorTheme) ?? COLOR_THEMES[0];

  useEffect(() => { try { window.localStorage.setItem("mttw.colorTheme", colorTheme); } catch {} }, [colorTheme]);
  useEffect(() => {
    const el = worldRef.current; if (!el) return;
    const maxX = (zoom - 1) * el.clientWidth / 2;
    const maxY = (zoom - 1) * el.clientHeight / 2;
    setPan((p) => ({ x: Math.max(-maxX, Math.min(maxX, p.x)), y: Math.max(-maxY, Math.min(maxY, p.y)) }));
  }, [zoom]);

  const cycleZoom = () => { const next = (zoomIdx + 1) % ZOOM_LEVELS.length; setZoomIdx(next); if (next === 0) setPan({ x: 0, y: 0 }); };
  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    const target = e.target as HTMLElement;
    if (target.closest("button,input,[data-no-pan],.tt-hud,.adm-panel,.adm-btn,.tt-theme-picker")) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: pan.x, baseY: pan.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !worldRef.current) return;
    const maxX = (zoom - 1) * worldRef.current.clientWidth / 2;
    const maxY = (zoom - 1) * worldRef.current.clientHeight / 2;
    const nx = dragRef.current.baseX + (e.clientX - dragRef.current.startX);
    const ny = dragRef.current.baseY + (e.clientY - dragRef.current.startY);
    setPan({ x: Math.max(-maxX, Math.min(maxX, nx)), y: Math.max(-maxY, Math.min(maxY, ny)) });
  };
  const onPointerUp = (e: React.PointerEvent) => { dragRef.current = null; try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {} };

  if (phase === "splash") return <SplashScreen onDone={() => setPhase("home")} />;
  if (phase === "home") return <HomeScreen onPlay={() => setPhase("game")} />;

  return (
    <div className="tt-root tt-v2-premium" style={{ "--tt-accent": theme.color, "--tt-accent-glow": theme.glow } as React.CSSProperties}>
      <style>{`
        *{box-sizing:border-box}html,body,#root{margin:0;padding:0;background:#070912}.tt-root{position:relative;width:100vw;height:100dvh;min-height:100vh;overflow:hidden;background:#070912}.tt-world{position:absolute;inset:0;transform-origin:center center;transition:transform .18s ease-out;will-change:transform;touch-action:none}.tt-map{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;z-index:1;filter:saturate(1.18) contrast(1.04) brightness(.82)}.tt-vignette{position:absolute;inset:0;z-index:6;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.58) 100%),linear-gradient(180deg,rgba(4,7,15,.08),rgba(4,7,15,.38))}.tt-v2-badge{position:fixed;top:calc(12px + env(safe-area-inset-top));left:12px;z-index:10001;padding:6px 10px;border-radius:999px;border:1px solid var(--tt-accent);background:rgba(5,8,16,.88);color:var(--tt-accent);font:950 10px/1 system-ui,sans-serif;letter-spacing:.7px;box-shadow:0 0 16px var(--tt-accent-glow),0 8px 18px rgba(0,0,0,.45);pointer-events:none}.tt-theme-picker{position:fixed;top:calc(12px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:10000;display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:999px;border:2px solid rgba(255,217,122,.34);background:linear-gradient(180deg,rgba(16,20,34,.92),rgba(5,8,16,.94));box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 8px 22px rgba(0,0,0,.55);pointer-events:auto}.tt-theme-label{color:#f0d9b5;font:900 10px/1 system-ui,sans-serif;letter-spacing:.5px;text-transform:uppercase}.tt-theme-dot{width:24px;height:24px;border-radius:999px;border:2px solid rgba(255,255,255,.18);cursor:pointer;box-shadow:inset 0 1px 1px rgba(255,255,255,.35),0 2px 7px rgba(0,0,0,.55);touch-action:manipulation}.tt-theme-dot.active{border-color:#fff4c7;transform:translateY(-1px) scale(1.08);box-shadow:0 0 0 2px rgba(5,8,16,.9),0 0 14px var(--tt-accent-glow)}.tt-zoom-btn{position:fixed;right:12px;bottom:110px;z-index:9999;width:46px;height:46px;border-radius:50%;border:2px solid var(--tt-accent);background:rgba(12,14,22,.92);color:var(--tt-accent);font:900 10px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.6),0 0 12px var(--tt-accent-glow);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}.tt-zoom-btn:active{transform:scale(.94)}.tt-zoom-btn .ico{font-size:16px}.tt-root .tt-mission-wood,.tt-root .tt-missions-fab,.tt-root .tt-actions-fab,.tt-root .tt-missions-tab.active,.tt-root .tt-depot-card-inline,.tt-root .tt-shop-head h2,.tt-root .tt-trophy small,.tt-root .tt-wood-btn:nth-child(3),.tt-root .tt-coin{color:var(--tt-accent)!important;border-color:var(--tt-accent)!important}.tt-root .tt-wood-btn:nth-child(3),.tt-root .tt-mission-wood,.tt-root .tt-missions-tab.active{box-shadow:inset 0 2px 0 rgba(255,255,255,.12),0 0 12px var(--tt-accent-glow)!important}.tt-root .tt-mfab-badge,.tt-root .tt-c-time-fill{background:var(--tt-accent)!important}@media(max-width:520px){.tt-theme-picker{top:calc(8px + env(safe-area-inset-top))}.tt-theme-label{display:none}.tt-theme-dot{width:22px;height:22px}.tt-v2-badge{font-size:8px;padding:5px 8px}}@media(orientation:landscape) and (max-height:500px){.tt-theme-picker{top:8px;left:12px;transform:none}.tt-zoom-btn{bottom:12px;right:60px}.adm-panel{width:min(360px,60vw)!important;padding:10px 12px 14px!important}.adm-btn{top:8px!important;right:8px!important;width:38px!important}}
      `}</style>
      <div className="tt-v2-badge">V2 PREMIUM</div>
      <div className="tt-theme-picker" data-no-pan>
        <span className="tt-theme-label">Thème</span>
        {COLOR_THEMES.map((t) => <button key={t.id} className={`tt-theme-dot ${t.id === colorTheme ? "active" : ""}`} style={{ background: t.color }} title={`Thème ${t.label}`} aria-label={`Changer le thème en ${t.label}`} onClick={() => setColorTheme(t.id)} />)}
      </div>
      <div ref={worldRef} className="tt-world" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, cursor: zoom > 1 ? (dragRef.current ? "grabbing" : "grab") : "default" }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <img src={citymap} alt="Plan de la ville pour le jeu de taxi" className="tt-map" />
        <CityPremiumDistricts />
        <CityMissionLayer />
        <V2RoadTraffic />
        <TaxiAiLayer />
        <CustomerDemandLayer />
        <div className="tt-vignette" />
        <CityTraffic />
        <CityCompetitors />
        <CityRivalTaxis />
        <EmergencyStations />
        <CrimeEvents />
        <InterventionDispatcher />
        <TaxiTycoon />
        <ArmoredTruck />
      </div>
      <button className="tt-zoom-btn" data-no-pan onClick={cycleZoom} title="Zoom carte"><span className="ico">🔎</span><span>{zoom}x</span></button>
      <AiTaxiWalletHud />
      <RadarFlash />
      <AdminPanel />
      <VersionBanner />
    </div>
  );
}
