import type { CSSProperties } from "react";

type DistrictType = "towers" | "airport" | "hotel" | "station" | "hospital" | "homes" | "park" | "stadium" | "factory" | "port";

const DISTRICTS: { name: string; icon: string; x: number; y: number; w: number; h: number; type: DistrictType; mission: string }[] = [
  { name: "CENTRE-VILLE", icon: "🏙️", x: 40, y: 14, w: 25, h: 22, type: "towers", mission: "Business + VIP" },
  { name: "AÉROPORT", icon: "✈️", x: 70, y: 8, w: 26, h: 18, type: "airport", mission: "Transferts" },
  { name: "HÔTELS", icon: "🏨", x: 14, y: 13, w: 21, h: 19, type: "hotel", mission: "Clients premium" },
  { name: "GARE", icon: "🚉", x: 27, y: 42, w: 24, h: 17, type: "station", mission: "Trains" },
  { name: "HÔPITAL", icon: "🏥", x: 58, y: 43, w: 20, h: 19, type: "hospital", mission: "Urgences" },
  { name: "RÉSIDENCES", icon: "🏘️", x: 9, y: 57, w: 25, h: 20, type: "homes", mission: "Trajets quotidiens" },
  { name: "PARC", icon: "🌳", x: 38, y: 66, w: 22, h: 18, type: "park", mission: "Touristes" },
  { name: "STADE", icon: "🏟️", x: 67, y: 68, w: 20, h: 17, type: "stadium", mission: "Matchs" },
  { name: "ZONE INDUS.", icon: "🏭", x: 77, y: 40, w: 20, h: 20, type: "factory", mission: "Ouvriers" },
  { name: "PORT", icon: "⚓", x: 5, y: 82, w: 29, h: 13, type: "port", mission: "Ferry" },
];

const HOTSPOTS = [
  { x: 49, y: 22, label: "VIP" },
  { x: 82, y: 16, label: "AIR" },
  { x: 24, y: 21, label: "HOTEL" },
  { x: 40, y: 50, label: "TRAIN" },
  { x: 68, y: 52, label: "SOS" },
  { x: 77, y: 76, label: "MATCH" },
];

function Blocks({ type }: { type: DistrictType }) {
  if (type === "airport") return <><span className="cpd-runway" /><span className="cpd-terminal">✈️</span></>;
  if (type === "park") return <><span className="cpd-lake" /><span className="cpd-tree t1">🌳</span><span className="cpd-tree t2">🌲</span><span className="cpd-tree t3">🌴</span></>;
  if (type === "stadium") return <span className="cpd-stadium">🏟️</span>;
  if (type === "port") return <><span className="cpd-water" /><span className="cpd-ship">🚢</span><span className="cpd-crane">🏗️</span></>;
  const count = type === "towers" ? 9 : type === "homes" ? 12 : 6;
  return <>{Array.from({ length: count }).map((_, i) => <span key={i} className={`cpd-block ${type}`} style={{ left: `${10 + (i % 4) * 21}%`, top: `${16 + Math.floor(i / 4) * 24}%`, height: `${type === "towers" ? 34 + (i % 4) * 14 : type === "homes" ? 18 + (i % 2) * 5 : 30 + (i % 3) * 8}px` }} />)}</>;
}

function RoadNetwork() {
  return (
    <svg className="cpd-roads" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path className="road-main" d="M9 88 C24 71 29 58 41 50 C54 41 64 45 78 48 C88 50 94 36 91 17" />
      <path className="road-main" d="M21 20 C35 22 45 28 53 26 C64 24 71 17 86 16" />
      <path className="road-main" d="M19 68 C35 60 45 58 58 52 C68 47 75 44 88 48" />
      <path className="road-main" d="M49 23 C48 35 44 43 40 50 C36 58 41 67 49 75" />
      <path className="road-line" d="M9 88 C24 71 29 58 41 50 C54 41 64 45 78 48 C88 50 94 36 91 17" />
      <path className="road-line" d="M21 20 C35 22 45 28 53 26 C64 24 71 17 86 16" />
      <path className="road-line" d="M19 68 C35 60 45 58 58 52 C68 47 75 44 88 48" />
    </svg>
  );
}

export default function CityPremiumDistricts() {
  return (
    <div className="city-premium-districts" aria-hidden="true">
      <style>{`
        .city-premium-districts{position:absolute;inset:0;z-index:2;pointer-events:none;font-family:system-ui,sans-serif}.cpd-roads{position:absolute;inset:0;z-index:1;filter:drop-shadow(0 8px 12px rgba(0,0,0,.42))}.cpd-roads path{fill:none;stroke-linecap:round}.cpd-roads .road-main{stroke:rgba(15,23,42,.92);stroke-width:3.2}.cpd-roads .road-line{stroke:rgba(255,217,122,.5);stroke-width:.45;stroke-dasharray:2 3}.cpd-card{position:absolute;left:var(--x);top:var(--y);width:var(--w);height:var(--h);z-index:3;transform:rotateX(58deg) rotateZ(-38deg);transform-style:preserve-3d;border-radius:18px;border:1px solid rgba(255,217,122,.34);background:linear-gradient(145deg,rgba(8,18,34,.86),rgba(17,24,39,.62));box-shadow:0 20px 38px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.18);overflow:visible}.cpd-card:before{content:"";position:absolute;inset:6%;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.09) 1px,transparent 1px),linear-gradient(0deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:18px 18px;opacity:.55}.cpd-label{position:absolute;left:50%;top:-20px;transform:translateX(-50%) rotateZ(38deg) rotateX(-58deg);white-space:nowrap;padding:4px 8px;border-radius:999px;border:1px solid rgba(255,217,122,.55);background:rgba(5,8,16,.9);color:#ffd97a;font-size:10px;font-weight:950;text-shadow:0 1px 2px #000;box-shadow:0 6px 14px rgba(0,0,0,.42)}.cpd-mission{position:absolute;left:50%;bottom:-18px;transform:translateX(-50%) rotateZ(38deg) rotateX(-58deg);white-space:nowrap;color:#dbeafe;background:rgba(15,23,42,.78);border:1px solid rgba(148,163,184,.28);border-radius:999px;padding:3px 7px;font-size:8px;font-weight:850}.cpd-block{position:absolute;width:13%;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,#dbeafe,#64748b 55%,#1e293b);box-shadow:8px 8px 0 rgba(0,0,0,.24),inset 0 2px 0 rgba(255,255,255,.36)}.cpd-block:after{content:"";position:absolute;inset:20% 18%;background:repeating-linear-gradient(180deg,rgba(255,217,122,.9) 0 2px,transparent 2px 6px)}.cpd-block.homes{width:12%;background:linear-gradient(180deg,#fef3c7,#b45309 60%,#78350f)}.cpd-runway{position:absolute;left:8%;top:43%;width:84%;height:18%;border-radius:8px;background:#111827;box-shadow:inset 0 0 0 2px rgba(255,255,255,.18)}.cpd-runway:after{content:"";position:absolute;left:8%;right:8%;top:46%;height:2px;background:repeating-linear-gradient(90deg,#fff 0 10px,transparent 10px 22px)}.cpd-terminal{position:absolute;left:16%;top:12%;font-size:30px;filter:drop-shadow(4px 6px 2px rgba(0,0,0,.35))}.cpd-lake,.cpd-water{position:absolute;inset:17% 12%;border-radius:45%;background:linear-gradient(135deg,#38bdf8,#0f766e);box-shadow:inset 0 2px 10px rgba(255,255,255,.35)}.cpd-tree{position:absolute;font-size:20px;filter:drop-shadow(4px 5px 2px rgba(0,0,0,.3))}.cpd-tree.t1{left:15%;top:18%}.cpd-tree.t2{left:62%;top:24%}.cpd-tree.t3{left:40%;top:58%}.cpd-stadium{position:absolute;left:22%;top:15%;width:58%;height:62%;border-radius:50%;display:grid;place-items:center;font-size:28px;background:radial-gradient(ellipse at center,#14532d 32%,#e5e7eb 34%,#94a3b8 58%,#1f2937 60%);box-shadow:9px 9px 0 rgba(0,0,0,.25)}.cpd-ship{position:absolute;left:42%;top:33%;font-size:28px}.cpd-crane{position:absolute;left:12%;top:18%;font-size:26px}.cpd-hotspot{position:absolute;left:var(--x);top:var(--y);z-index:6;transform:translate(-50%,-50%);padding:4px 7px;border-radius:999px;background:#111827;color:#ffd97a;border:1px solid rgba(255,217,122,.65);font-size:8px;font-weight:950;box-shadow:0 0 14px rgba(255,217,122,.35);animation:cpdPulse 1.6s infinite}.cpd-traffic-dot{position:absolute;z-index:5;width:7px;height:7px;border-radius:999px;background:#fde68a;box-shadow:0 0 10px #fde68a;animation:cpdDrive 7s linear infinite}.cpd-traffic-dot.d2{animation-delay:-2.5s;background:#38bdf8;box-shadow:0 0 10px #38bdf8}.cpd-traffic-dot.d3{animation-delay:-4.5s;background:#f87171;box-shadow:0 0 10px #f87171}@keyframes cpdPulse{0%,100%{transform:translate(-50%,-50%) scale(.95)}50%{transform:translate(-50%,-50%) scale(1.08)}}@keyframes cpdDrive{0%{left:9%;top:88%}25%{left:40%;top:50%}50%{left:78%;top:48%}75%{left:88%;top:28%}100%{left:91%;top:17%}}@media(max-width:520px){.cpd-label{font-size:8px}.cpd-mission{display:none}.cpd-card{filter:saturate(1.15)}}
      `}</style>
      <RoadNetwork />
      <span className="cpd-traffic-dot" /><span className="cpd-traffic-dot d2" /><span className="cpd-traffic-dot d3" />
      {DISTRICTS.map((d) => (
        <div key={d.name} className="cpd-card" style={{ "--x": `${d.x}%`, "--y": `${d.y}%`, "--w": `${d.w}%`, "--h": `${d.h}%` } as CSSProperties}>
          <span className="cpd-label">{d.icon} {d.name}</span><span className="cpd-mission">{d.mission}</span><Blocks type={d.type} />
        </div>
      ))}
      {HOTSPOTS.map((h) => <span key={h.label} className="cpd-hotspot" style={{ "--x": `${h.x}%`, "--y": `${h.y}%` } as CSSProperties}>{h.label}</span>)}
    </div>
  );
}
