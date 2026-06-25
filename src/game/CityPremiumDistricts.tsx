const DISTRICTS = [
  { id: "downtown", name: "CENTRE-VILLE", icon: "🏙️", x: 42, y: 16, w: 24, h: 22, type: "towers" },
  { id: "airport", name: "AÉROPORT", icon: "✈️", x: 70, y: 9, w: 25, h: 18, type: "airport" },
  { id: "hotel", name: "HÔTEL VIP", icon: "🏨", x: 17, y: 15, w: 19, h: 18, type: "hotel" },
  { id: "station", name: "GARE", icon: "🚉", x: 29, y: 43, w: 23, h: 16, type: "station" },
  { id: "hospital", name: "HÔPITAL", icon: "🏥", x: 59, y: 45, w: 18, h: 18, type: "hospital" },
  { id: "homes", name: "RÉSIDENCES", icon: "🏘️", x: 10, y: 58, w: 24, h: 20, type: "homes" },
  { id: "park", name: "PARC", icon: "🌳", x: 39, y: 66, w: 21, h: 18, type: "park" },
  { id: "stadium", name: "STADE", icon: "🏟️", x: 67, y: 68, w: 19, h: 16, type: "stadium" },
  { id: "industrial", name: "ZONE INDUS.", icon: "🏭", x: 77, y: 42, w: 20, h: 19, type: "factory" },
  { id: "port", name: "PORT", icon: "⚓", x: 5, y: 82, w: 29, h: 13, type: "port" },
] as const;

function Blocks({ type }: { type: string }) {
  if (type === "airport") return <><span className="cpd-runway" /><span className="cpd-terminal">✈️</span></>;
  if (type === "park") return <><span className="cpd-lake" /><span className="cpd-tree t1">🌳</span><span className="cpd-tree t2">🌲</span><span className="cpd-tree t3">🌴</span></>;
  if (type === "stadium") return <span className="cpd-stadium">🏟️</span>;
  if (type === "port") return <><span className="cpd-water" /><span className="cpd-ship">🚢</span><span className="cpd-crane">🏗️</span></>;
  const count = type === "towers" ? 8 : type === "homes" ? 10 : 5;
  return <>{Array.from({ length: count }).map((_, i) => <span key={i} className={`cpd-block ${type}`} style={{ left: `${12 + (i % 4) * 20}%`, top: `${18 + Math.floor(i / 4) * 25}%`, height: `${type === "towers" ? 34 + (i % 4) * 13 : type === "homes" ? 20 : 30 + (i % 2) * 10}px` }} />)}</>;
}

export default function CityPremiumDistricts() {
  return (
    <div className="city-premium-districts" aria-hidden="true">
      <style>{`
        .city-premium-districts{position:absolute;inset:0;z-index:2;pointer-events:none;font-family:system-ui,sans-serif}.cpd-card{position:absolute;left:var(--x);top:var(--y);width:var(--w);height:var(--h);transform:rotateX(58deg) rotateZ(-38deg);transform-style:preserve-3d;border-radius:18px;border:1px solid rgba(255,217,122,.28);background:linear-gradient(145deg,rgba(7,16,31,.78),rgba(17,24,39,.58));box-shadow:0 18px 36px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.16);overflow:visible}.cpd-card:before{content:"";position:absolute;inset:6%;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(0deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:18px 18px;opacity:.55}.cpd-label{position:absolute;left:50%;top:-18px;transform:translateX(-50%) rotateZ(38deg) rotateX(-58deg);white-space:nowrap;padding:4px 8px;border-radius:999px;border:1px solid rgba(255,217,122,.45);background:rgba(5,8,16,.88);color:#ffd97a;font-size:10px;font-weight:950;text-shadow:0 1px 2px #000;box-shadow:0 6px 14px rgba(0,0,0,.38)}.cpd-block{position:absolute;width:13%;border-radius:4px 4px 2px 2px;background:linear-gradient(180deg,#dbeafe,#64748b 55%,#1e293b);box-shadow:8px 8px 0 rgba(0,0,0,.23),inset 0 2px 0 rgba(255,255,255,.35)}.cpd-block:after{content:"";position:absolute;inset:20% 18%;background:repeating-linear-gradient(180deg,rgba(255,217,122,.9) 0 2px,transparent 2px 6px)}.cpd-block.homes{width:12%;background:linear-gradient(180deg,#fef3c7,#b45309 60%,#78350f)}.cpd-block.hotel,.cpd-block.hospital,.cpd-block.station,.cpd-block.factory{background:linear-gradient(180deg,#f8fafc,#94a3b8 56%,#334155)}.cpd-runway{position:absolute;left:8%;top:43%;width:84%;height:18%;border-radius:8px;background:#111827;box-shadow:inset 0 0 0 2px rgba(255,255,255,.18)}.cpd-runway:after{content:"";position:absolute;left:8%;right:8%;top:46%;height:2px;background:repeating-linear-gradient(90deg,#fff 0 10px,transparent 10px 22px)}.cpd-terminal{position:absolute;left:16%;top:12%;font-size:30px;filter:drop-shadow(4px 6px 2px rgba(0,0,0,.35))}.cpd-lake,.cpd-water{position:absolute;inset:17% 12%;border-radius:45%;background:linear-gradient(135deg,#38bdf8,#0f766e);box-shadow:inset 0 2px 10px rgba(255,255,255,.35)}.cpd-tree{position:absolute;font-size:20px;filter:drop-shadow(4px 5px 2px rgba(0,0,0,.3))}.cpd-tree.t1{left:15%;top:18%}.cpd-tree.t2{left:62%;top:24%}.cpd-tree.t3{left:40%;top:58%}.cpd-stadium{position:absolute;left:22%;top:15%;width:58%;height:62%;border-radius:50%;display:grid;place-items:center;font-size:28px;background:radial-gradient(ellipse at center,#14532d 32%,#e5e7eb 34%,#94a3b8 58%,#1f2937 60%);box-shadow:9px 9px 0 rgba(0,0,0,.25)}.cpd-ship{position:absolute;left:42%;top:33%;font-size:28px}.cpd-crane{position:absolute;left:12%;top:18%;font-size:26px}.cpd-road-glow{position:absolute;inset:0;z-index:-1;background:radial-gradient(circle at 50% 50%,rgba(255,217,122,.12),transparent 58%)}@media(max-width:520px){.cpd-label{font-size:8px}.cpd-card{filter:saturate(1.15)}}
      `}</style>
      <div className="cpd-road-glow" />
      {DISTRICTS.map((d) => (
        <div key={d.id} className="cpd-card" style={{ "--x": `${d.x}%`, "--y": `${d.y}%`, "--w": `${d.w}%`, "--h": `${d.h}%` } as React.CSSProperties}>
          <span className="cpd-label">{d.icon} {d.name}</span>
          <Blocks type={d.type} />
        </div>
      ))}
    </div>
  );
}
