import type { CSSProperties } from "react";

const TAXI_STATIONS = [
  { x: 49, y: 39, label: "CENTRE" },
  { x: 40, y: 52, label: "GARE" },
  { x: 82, y: 25, label: "AÉROPORT" },
  { x: 68, y: 56, label: "HÔPITAL" },
  { x: 22, y: 72, label: "RÉSID." },
  { x: 78, y: 47, label: "INDUS." },
  { x: 19, y: 28, label: "HÔTELS" },
  { x: 22, y: 86, label: "PORT" },
  { x: 76, y: 78, label: "STADE" },
] as const;

const LANDMARKS = [
  { x: 82, y: 17, icon: "✈️", title: "Terminal", sub: "VIP + parking" },
  { x: 40, y: 48, icon: "🚉", title: "Gare", sub: "Quais + taxis" },
  { x: 67, y: 50, icon: "🏥", title: "Urgences", sub: "Priorité" },
  { x: 19, y: 20, icon: "🏨", title: "Hôtels", sub: "Premium" },
  { x: 20, y: 86, icon: "⚓", title: "Port", sub: "Ferry" },
  { x: 77, y: 76, icon: "🏟️", title: "Stade", sub: "Événements" },
  { x: 47, y: 73, icon: "🌳", title: "Parc", sub: "Touristes" },
  { x: 82, y: 52, icon: "🏭", title: "Entrepôts", sub: "Ouvriers" },
] as const;

const DEMAND_ZONES = [
  { x: 49, y: 23, label: "VIP", tone: "gold" },
  { x: 82, y: 18, label: "AIR", tone: "blue" },
  { x: 41, y: 49, label: "TRAIN", tone: "blue" },
  { x: 67, y: 50, label: "SOS", tone: "red" },
  { x: 19, y: 21, label: "HOTEL", tone: "gold" },
  { x: 77, y: 77, label: "MATCH", tone: "gold" },
  { x: 22, y: 70, label: "DOMICILE", tone: "green" },
  { x: 83, y: 48, label: "USINE", tone: "blue" },
  { x: 22, y: 87, label: "FERRY", tone: "blue" },
] as const;

export default function CityMissionLayer() {
  return (
    <div className="city-mission-layer" aria-hidden="true">
      <style>{`
        .city-mission-layer{position:absolute;inset:0;z-index:9;pointer-events:none;font-family:system-ui,sans-serif}.cml-station,.cml-landmark,.cml-demand{position:absolute;left:var(--x);top:var(--y);transform:translate(-50%,-50%);filter:drop-shadow(0 8px 12px rgba(0,0,0,.45))}.cml-station{display:grid;place-items:center;width:42px;height:28px;border-radius:10px;border:1px solid rgba(255,217,122,.7);background:linear-gradient(180deg,rgba(15,23,42,.95),rgba(3,7,18,.95));color:#ffd97a;font-size:8px;font-weight:950;box-shadow:0 0 16px rgba(255,217,122,.35)}.cml-station:before{content:"🚖";position:absolute;top:-15px;font-size:16px}.cml-station:after{content:"";position:absolute;inset:-5px;border-radius:14px;border:1px solid rgba(255,217,122,.28);animation:cmlPulse 1.8s infinite}.cml-landmark{min-width:72px;padding:5px 7px;border-radius:12px;border:1px solid rgba(148,163,184,.35);background:rgba(4,9,18,.78);backdrop-filter:blur(4px);color:#e5e7eb;text-align:left}.cml-landmark b{display:block;color:#ffd97a;font-size:9px;line-height:10px}.cml-landmark small{display:block;color:#bfdbfe;font-size:7px;line-height:9px}.cml-landmark .ico{float:left;margin-right:5px;font-size:17px;line-height:18px}.cml-demand{z-index:10;padding:3px 6px;border-radius:999px;background:rgba(3,7,18,.86);border:1px solid rgba(255,255,255,.18);font-size:7px;font-weight:950;letter-spacing:.2px;color:#fff;box-shadow:0 0 14px rgba(255,255,255,.16);animation:cmlBeacon 2.2s infinite}.cml-demand.gold{color:#ffd97a;border-color:rgba(255,217,122,.58);box-shadow:0 0 14px rgba(255,217,122,.32)}.cml-demand.blue{color:#7dd3fc;border-color:rgba(56,189,248,.55);box-shadow:0 0 14px rgba(56,189,248,.28)}.cml-demand.green{color:#86efac;border-color:rgba(52,211,153,.55);box-shadow:0 0 14px rgba(52,211,153,.25)}.cml-demand.red{color:#fca5a5;border-color:rgba(248,113,113,.58);box-shadow:0 0 14px rgba(248,113,113,.32)}.cml-route{position:absolute;inset:0;z-index:-1;background:radial-gradient(circle at 82% 17%,rgba(255,217,122,.12),transparent 9%),radial-gradient(circle at 40% 48%,rgba(56,189,248,.12),transparent 9%),radial-gradient(circle at 67% 50%,rgba(248,113,113,.12),transparent 8%),radial-gradient(circle at 22% 70%,rgba(52,211,153,.1),transparent 10%),radial-gradient(circle at 22% 87%,rgba(56,189,248,.1),transparent 9%)}@keyframes cmlPulse{0%,100%{opacity:.35;transform:scale(.92)}50%{opacity:1;transform:scale(1.08)}}@keyframes cmlBeacon{0%,100%{transform:translate(-50%,-50%) scale(.95);opacity:.85}50%{transform:translate(-50%,-50%) scale(1.08);opacity:1}}@media(max-width:520px){.cml-landmark{display:none}.cml-station{width:34px;height:24px;font-size:7px}.cml-station:before{font-size:14px;top:-13px}.cml-demand{font-size:6px;padding:2px 5px}}
      `}</style>
      <div className="cml-route" />
      {TAXI_STATIONS.map((s) => <span key={s.label} className="cml-station" style={{ "--x": `${s.x}%`, "--y": `${s.y}%` } as CSSProperties}>{s.label}</span>)}
      {LANDMARKS.map((l) => <span key={l.title} className="cml-landmark" style={{ "--x": `${l.x}%`, "--y": `${l.y}%` } as CSSProperties}><span className="ico">{l.icon}</span><b>{l.title}</b><small>{l.sub}</small></span>)}
      {DEMAND_ZONES.map((d) => <span key={d.label} className={`cml-demand ${d.tone}`} style={{ "--x": `${d.x}%`, "--y": `${d.y}%` } as CSSProperties}>{d.label}</span>)}
    </div>
  );
}
