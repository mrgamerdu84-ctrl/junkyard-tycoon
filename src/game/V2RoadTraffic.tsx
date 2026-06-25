import { useEffect, useMemo, useState } from "react";
import { getBranchingVehiclePaths } from "./VehicleNavigator";

type Point = { x: number; y: number };

const INTERSECTIONS: Point[] = [
  { x: 49, y: 47 },
  { x: 84, y: 16 },
  { x: 86, y: 51 },
  { x: 40, y: 52 },
  { x: 67, y: 50 },
];

function nearIntersection(point: Point) {
  return INTERSECTIONS.some((i) => Math.hypot(point.x - i.x, point.y - i.y) < 7);
}

function sample(path: Point[], progress: number) {
  const max = path.length - 1;
  if (max < 1) return { x: 50, y: 50, angle: 0, slow: false };
  const raw = (progress % 1) * max;
  const index = Math.min(Math.floor(raw), max - 1);
  const ratio = raw - index;
  const a = path[index]!;
  const b = path[index + 1]!;
  const point = {
    x: a.x + (b.x - a.x) * ratio,
    y: a.y + (b.y - a.y) * ratio,
  };
  return {
    ...point,
    angle: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI,
    slow: nearIntersection(point),
  };
}

function progressFor(seconds: number, index: number) {
  const baseSpeed = 0.045 + index * 0.01;
  const pulseSlowdown = Math.sin(seconds * 0.9 + index) > 0.55 ? 0.55 : 1;
  return seconds * baseSpeed * pulseSlowdown + index * 0.2;
}

export default function V2RoadTraffic() {
  const paths = useMemo(() => getBranchingVehiclePaths().filter((path) => path.length > 1) as Point[][], []);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => setSeconds((Date.now() - start) / 1000), 80);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="v2-road-traffic" aria-hidden="true">
      {paths.map((path, index) => {
        const position = sample(path, progressFor(seconds, index));
        return (
          <span
            key={index}
            style={{
              position: "absolute",
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: position.slow ? 16 : 18,
              height: 10,
              marginLeft: -9,
              marginTop: -5,
              borderRadius: 6,
              background: position.slow ? "#f97316" : index % 3 === 0 ? "#fbbf24" : index % 3 === 1 ? "#38bdf8" : "#fb7185",
              boxShadow: position.slow ? "0 0 12px rgba(249,115,22,.65)" : "0 4px 8px rgba(0,0,0,.45)",
              opacity: position.slow ? 0.82 : 1,
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
