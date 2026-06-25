import { useEffect, useMemo, useState } from "react";
import { getInitialVehiclePaths } from "./VehicleNavigator";

type Point = { x: number; y: number };

function sample(path: Point[], progress: number) {
  const max = path.length - 1;
  if (max < 1) return { x: 50, y: 50, angle: 0 };
  const raw = (progress % 1) * max;
  const index = Math.min(Math.floor(raw), max - 1);
  const ratio = raw - index;
  const a = path[index]!;
  const b = path[index + 1]!;
  return {
    x: a.x + (b.x - a.x) * ratio,
    y: a.y + (b.y - a.y) * ratio,
    angle: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI,
  };
}

export default function V2RoadTraffic() {
  const paths = useMemo(() => getInitialVehiclePaths().filter((path) => path.length > 1) as Point[][], []);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => setSeconds((Date.now() - start) / 1000), 80);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="v2-road-traffic" aria-hidden="true">
      {paths.map((path, index) => {
        const position = sample(path, seconds * (0.045 + index * 0.01) + index * 0.2);
        return (
          <span
            key={index}
            style={{
              position: "absolute",
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: 18,
              height: 10,
              marginLeft: -9,
              marginTop: -5,
              borderRadius: 6,
              background: index % 3 === 0 ? "#fbbf24" : index % 3 === 1 ? "#38bdf8" : "#fb7185",
              boxShadow: "0 4px 8px rgba(0,0,0,.45)",
              transform: `rotate(${position.angle}deg)`,
              transition: "left .08s linear, top .08s linear, transform .08s linear",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </div>
  );
}
