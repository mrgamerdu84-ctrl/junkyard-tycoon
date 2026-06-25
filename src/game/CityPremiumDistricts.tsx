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
  { x: 49, y: 22, label: "VIP" }, { x: 82, y: 16, label: "AIR" }, { x: 24, y: 21, label: "HOTEL" },
  { x: 40, y: 50, label: "TRAIN" }, { x: 68, y: 52, label: "SOS" }, { x: 77, y: 76, label: "MATCH" },
];
const LIGHTS = [{ x: 43, y: 34 }, { x: 49, y: 47 }, { x: 61, y: 47 }, { x: 39, y: 56 }];
const CROSSINGS = [{ x: 40, y: 44, r: -18 }, { x: 60, y: 49, r: 8 }, { x: 31, y: 50, r: -10 }, { x: 67, y: 55, r: 16 }];

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
      <path className="road-main ns" d="M50 5 C49 19 50 32 49 47 C48 62 49 77 50 95" />
      <path className="road-main ew" d="M5 50 C23 49 36 51 49 47 C62 44 78 48 95 49" />
      <path className="road-branch" d="M22 20 C35 21 43 32 49 47" />
      <path className="road-branch" d="M49 47 C60 36 70 26 84 16" />
      <path className="road-branch" d="M20 70 C34 61 41 58 49 47" />
      <path className="road-branch" d="M49 47 C62 57 72 62 86 51" />
      <path className="road-dash ns" d="M50 5 C49 19 50 32 49 47 C48 62 49 77 50 95" />
      <path className="road-dash ew" d="M5 50 C23 49 36 51 49 47 C62 44 78 48 95 49" />
      <path className="turn-lane" d="M42 47 C45 46 47 45 49 42" />
      <path className="turn-lane" d="M56 48 C53 49 51 51 50 55" />
      <circle className="roundabout central" cx="49" cy="47" r="4.8" />
      <circle className="roundabout airport" cx="84" cy="16" r="4" />
      <circle className="roundabout indus" cx="86" cy="51" r="4" />
    </svg>
  );
}

export default function CityPremiumDistricts() {
  return (
    <div className="city-premium-districts" aria-hidden="true">
      <style>{`
        .city-premium-districts{position:absolute;inset:0;z-index:2;pointer-events:none;font-family:system-ui,sans-serif}.cpd-roads{position:absolute;inset:0;z-index:1;filter:drop-shadow(0 10px 14px rgba(0,0,0,.46))}.cpd-roads path{fill:none;stroke-linecap:round;stroke-linejoin:round}.road-main{stroke:rgba(12,18,30,.96);stroke-width:5.3}.road-branch{stroke:rgba(15,23,42,.92);stroke-width:3.5}.road-dash{stroke:rgba(255,217,122,.66);stroke-width:.5;stroke-dasharray:2.2 3.2}.turn-lane{stroke:#f8fafc;stroke-width:.45;stroke-dasharray:1.5 2;opacity:.75}.roundabout{fill:#111827;stroke:#fbbf24;stroke-width:.85;filter:drop-shadow(0 4px 6px rgba(0,0,0,.45))}.roundabout.central{fill:#1f2937}.cpd-light{position:absolute;left:var(--x);top:var(--y);z-index:7;width:18px;height:18px;transform:translate(-50%,-50%);border-radius:5px;background:#030712;border:1px solid rgba(255,255,255,.28);display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px;padding:3px;box-shadow:0 0 12px rgba(0,0,0,.75)}.cpd-light i{border-radius:50%;background:#334155}.cpd-light i:nth-child(1){background:#ef4444;box-shadow:0 0 8px #ef4444}.cpd-light i:nth-child(2){background:#facc15;opacity:.48}.cpd-light i:nth-child(3){background:#22c55e;opacity:.7}.cpd-cross{position:absolute;left:var(--x);top:var(--y);z-index:6;width:52px;height:13px;transform:translate(-50%,-50%) rotate(var(--r));border-radius:2px;background:repeating-linear-gradient(90deg,#fff 0 7px,transparent 7px 13px);opacity:.82}.cpd-card{position:absolute;left:var(--x);top:var(--y);width:var(--w);height:var(--h);z-index:3;transform:rotateX(58deg) rotateZ(-38deg);transform-style:preserve-3d;border-radius:18px;border:1px solid rgba(255,217,122,.34);background:linear-gradient(145deg,rgba(8,18,34,.86),rgba(17,24,39,.62));box-shadow:0 20px 38px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.18);overflow:visible}.cpd-card:before{content:"";position:absolute;inset:6%;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.09) 1px,transparent 1px),linear-gradient(0deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:18px 18px;opacity:.55}.cpd-label{position:absolute;left:50%;top:-20px;transform:translateX(-50%) rotateZ(38deg) rotateX(-58deg);white-space:nowrap;padding:4px 8px;border-radius:999px;border:1px solid rgba(255,217,122,.55);background:rgba(5,8,16,.9);color:#ffd97a;font-size:10px;font-weight:950;text-shadow:0 1px 2px #000;box-shadow:0 6px 14px rgba(0,0,0,.42)}.cpd-mission{position:absolute;left:50%;bottom:-18px;transform:translateX(-50%) rotateZ(38deg) rotateX(-58deg);white-space:nowrap;color:#dbeafe;background:rgba(15,23,42,.78);border:1px solid rgba(148,163,184,.28);border-radius:999px;padding:3px 7px;font-size:8px;font-weight:850}.cpd-block{position:absolute;width:13%;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,#dbeafe,#64748b 55%,#1e293b);box-shadow:8px 8px 0 rgba(0,0,0,.24),inset 0 2px 0 rgba(255,255,255,.36)}.cpd-block:after{content:"";position:absolute;inset:20% 18%;background:repeating-linear-gradient(180deg,rgba(255,217,122,.9) 0 2px,transparent 2px 6px)}.cpd-block.homes{width:12%;background:linear-gradient(180deg,#fef3c7,#b45309 60%,#78350f)}.cpd-runway{position:absolute;left:8%;top:43%;width:84%;height:18%;border-radius:8px;background:#111827;box-shadow:inset 0 0 0 2px rgba(255,255,255,.18)}.cpd-runway:after{content:"";position:absolute;left:8%;right:8%;top:46%;height:2px;background:repeating-linear-gradient(90deg,#fff 0 10px,transparent 10px 22px)}.cpd-terminal{position:absolute;left:16%;top:12%;font-size:30px;filter:drop-shadow(4px 6px 2px rgba(0,0,0,.35))}.cpd-lake,.cpd-water{position:absolute;inset:17% 12%;border-radius:45%;background:linear-gradient(135deg,#38bdf8,#0f766e);box-shadow:inset 0 2px 10px rgba(255,255,255,.35)}.cpd-tree{position:absolute;font-size:20px;filter:drop-shadow(4px 5px 2px rgba(0,0,0,.3))}.cpd-tree.t1{left:15%;top:18%}.cpd-tree.t2{left:62%;top:24%}.cpd-tree.t3{left:40%;top:58%}.cpd-stadium{position:absolute;left:22%;top:15%;width:58%;height:62%;border-radius:50%;display:grid;place-items:center;font-size:28px;background:radial-gradient(ellipse at center,#14532d 32%,#e5e7eb 34%,#94a3b8 58%,#1f2937 60%);box-shadow:9px 9px 0 rgba(0,0,0,.25)}.cpd-ship{position:absolute;left:42%;top:33%;font-size:28px}.cpd-crane{position:absolute;left:12%;top:18%;font-size:26px}.cpd-hotspot{position:absolute;left:var(--x);top:var(--y);z-index:8;transform:translate(-50%,-50%);padding:4px 7px;border-radius:999px;background:#111827;color:#ffd97a;border:1px solid rgba(255,217,122,.65);font-size:8px;font-weight:950;box-shadow:0 0 14px rgba(255,217,122,.35);animation:cpdPulse 1.6s infinite}.cpd-traffic-dot{position:absolute;z-index:5;width:7px;height:7px;border-radius:999px;background:#fde68a;box-shadow:0 0 10px #fde68a;animation:cpdDrive 7s linear infinite}.cpd-traffic-dot.d2{animation-delay:-2.5s;background:#38bdf8;box-shadow:0 0 10px #38bdf8}.cpd-traffic-dot.d3{animation-delay:-4.5s;background:#f87171;box-shadow:0 0 10px #f87171}@keyframes cpdPulse{0%,100%{transform:translate(-50%,-50%) scale(.95)}50%{transform:translate(-50%,-50%) scale(1.08)}}@keyframes cpdDrive{0%{left:50%;top:5%}25%{left:49%;top:47%}50%{left:86%;top:49%}75%{left:49%;top:47%}100%{left:50%;top:95%}}@media(max-width:520px){.cpd-label{font-size:8px}.cpd-mission{display:none}.cpd-card{filter:saturate(1.15)}.cpd-cross{width:38px;height:10px}.cpd-light{width:14px;height:14px}}
      `}</style>
      <RoadNetwork />
      {LIGHTS.map((l, i) => <span key={i} className="cpd-light" style={{ "--x": `${l.x}%`, "--y": `${l.y}%` } as CSSProperties}><i/><i/><i/></span>)}
      {CROSSINGS.map((c, i) => <span key={i} className="cpd-cross" style={{ "--x": `${c.x}%`, "--y": `${c.y}%`, "--r": `${c.r}deg` } as CSSProperties} />)}
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
