import { getInitialVehiclePaths } from "./VehicleNavigator";

const paths = getInitialVehiclePaths().filter((path) => path.length > 1);

export default function V2RoadTraffic() {
  return (
    <div className="v2-road-traffic" aria-hidden="true">
      <style>{`
        .v2-road-traffic{position:absolute;inset:0;z-index:8;pointer-events:none}.v2-car{position:absolute;left:var(--x);top:var(--y);width:18px;height:10px;margin:-5px 0 0 -9px;border-radius:6px 7px 7px 6px;background:linear-gradient(90deg,#fbbf24,#f59e0b);box-shadow:0 4px 8px rgba(0,0,0,.45),0 0 10px rgba(251,191,36,.25);transform:rotate(var(--r));animation:v2CarPulse 1.4s infinite}.v2-car:before{content:"";position:absolute;left:4px;top:2px;width:6px;height:6px;border-radius:2px;background:rgba(15,23,42,.65)}.v2-car:after{content:"";position:absolute;right:-2px;top:2px;width:3px;height:6px;border-radius:3px;background:#fde68a;box-shadow:0 0 5px #fde68a}.v2-car.blue{background:linear-gradient(90deg,#38bdf8,#0284c7);box-shadow:0 4px 8px rgba(0,0,0,.45),0 0 10px rgba(56,189,248,.25)}.v2-car.red{background:linear-gradient(90deg,#fb7185,#e11d48);box-shadow:0 4px 8px rgba(0,0,0,.45),0 0 10px rgba(251,113,133,.25)}.v2-car.green{background:linear-gradient(90deg,#34d399,#059669);box-shadow:0 4px 8px rgba(0,0,0,.45),0 0 10px rgba(52,211,153,.25)}@keyframes v2CarPulse{0%,100%{filter:brightness(.9)}50%{filter:brightness(1.18)}}
      `}</style>
      {paths.map((path, index) => {
        const a = path[0]!;
        const b = path[1]!;
        const angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        const colors = ["", "blue", "red", "green"];
        return <span key={index} className={`v2-car ${colors[index % colors.length]}`} style={{ "--x": `${a.x}%`, "--y": `${a.y}%`, "--r": `${angle}deg` } as React.CSSProperties} />;
      })}
    </div>
  );
}
