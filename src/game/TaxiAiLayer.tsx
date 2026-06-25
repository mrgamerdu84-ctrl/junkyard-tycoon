import { useEffect, useMemo, useState } from "react";
import { createTaxiJobs, getTaxiAiPreviewRoutes } from "./TaxiAiController";
import { TAXI_PICKUP_POINTS } from "./CityRoadGraph";

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

function pickupPoint(id: string) {
  return TAXI_PICKUP_POINTS.find((p) => p.id === id);
}

export default function TaxiAiLayer() {
  const routes = useMemo(() => getTaxiAiPreviewRoutes().filter((route) => route.length > 1) as Point[][], []);
  const jobs = useMemo(() => createTaxiJobs(routes.length), [routes.length]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => setSeconds((Date.now() - start) / 1000), 90);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 11, pointerEvents: "none" }}>
      {jobs.map((job, index) => {
        const pickup = pickupPoint(job.pickupId);
        const destination = pickupPoint(job.destinationId);
        return (
          <span key={job.id}>
            {pickup && <b style={{ position: "absolute", left: `${pickup.x}%`, top: `${pickup.y}%`, transform: "translate(-50%,-50%)", fontSize: 10, color: "#fff", background: "rgba(15,23,42,.82)", border: "1px solid #facc15", borderRadius: 999, padding: "2px 5px" }}>CLIENT</b>}
            {destination && <b style={{ position: "absolute", left: `${destination.x}%`, top: `${destination.y}%`, transform: "translate(-50%,-50%)", fontSize: 10, color: "#111827", background: "#facc15", borderRadius: 999, padding: "2px 5px" }}>DEST</b>}
          </span>
        );
      })}
      {routes.map((route, index) => {
        const pos = sample(route, seconds * (0.035 + index * 0.008) + index * 0.18);
        return (
          <span
            key={`taxi-${index}`}
            title={`Taxi IA ${index + 1}`}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: 22,
              height: 13,
              marginLeft: -11,
              marginTop: -7,
              borderRadius: 7,
              background: "linear-gradient(90deg,#facc15,#f59e0b)",
              border: "1px solid rgba(255,255,255,.45)",
              boxShadow: "0 0 14px rgba(250,204,21,.65),0 5px 9px rgba(0,0,0,.45)",
              transform: `rotate(${pos.angle}deg)`,
              transition: "left .09s linear, top .09s linear, transform .09s linear",
            }}
          />
        );
      })}
    </div>
  );
}
