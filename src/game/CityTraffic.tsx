import { useEffect, useRef, useState } from "react";
import { useAdminConfig } from "./adminConfig";
import { listCustomVehicles } from "./gameAssets";
import { buildRoadCache, getRoadPoint, hasRoadCache } from "./RoadCache";

export const VILLAGE_PATHS = new Set<number>([1]);
export const SIDEWALK_LOCK_OFFSET = 64;
const LANE_HALF = 11;

// Route de secours légère. Les routes complètes pourront être réinjectées ensuite
// depuis l'ancienne version du fichier sans changer le moteur RoadCache.
export const ROADS = [
  "M 40 920 C 280 760 520 650 760 540 C 1000 430 1240 320 1880 80",
  "M 120 120 C 420 260 700 380 960 540 C 1220 700 1500 820 1800 960",
];

export function lockToSidewalk(
  pathPoint: { x: number; y: number },
  tangent: { dx: number; dy: number },
  side: 1 | -1,
  x: number,
  y: number,
): { x: number; y: number } {
  const len = Math.hypot(tangent.dx, tangent.dy) || 1;
  const nx = -tangent.dy / len;
  const ny = tangent.dx / len;
  const dist = ((x - pathPoint.x) * nx + (y - pathPoint.y) * ny) * side;
  if (dist >= SIDEWALK_LOCK_OFFSET) return { x, y };
  return {
    x: pathPoint.x + nx * SIDEWALK_LOCK_OFFSET * side,
    y: pathPoint.y + ny * SIDEWALK_LOCK_OFFSET * side,
  };
}

type CivilCar = {
  id: string;
  duration: number;
  delay: number;
  side: 1 | -1;
  imageUrl?: string;
};

export default function CityTraffic() {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const carNodes = useRef<(SVGGElement | null)[]>([]);
  const [customCars, setCustomCars] = useState<CivilCar[]>([]);
  const [cacheReady, setCacheReady] = useState(false);

  const config = useAdminConfig();
  const fluidityQuality = config?.trafficFluidity || "medium";

  useEffect(() => {
    const customList = listCustomVehicles() || [];
    const maxAllowed = fluidityQuality === "low" ? 4 : fluidityQuality === "medium" ? 7 : 10;
    const specs = customList.slice(0, maxAllowed).map((car: any, i: number) => ({
      id: car.id || `civil_${i}`,
      duration: 25 + Math.random() * 15,
      delay: -(Math.random() * 40),
      side: Math.random() > 0.5 ? 1 : -1,
      imageUrl: car.imageUrl || car.url,
    })) as CivilCar[];
    setCustomCars(specs);
  }, [fluidityQuality]);

  useEffect(() => {
    let raf = 0;
    const build = () => {
      const paths = pathRefs.current.filter(Boolean) as SVGPathElement[];
      if (paths.length !== ROADS.length) {
        raf = requestAnimationFrame(build);
        return;
      }
      buildRoadCache(paths, fluidityQuality === "low" ? 220 : fluidityQuality === "medium" ? 360 : 500);
      setCacheReady(hasRoadCache());
    };
    raf = requestAnimationFrame(build);
    return () => cancelAnimationFrame(raf);
  }, [fluidityQuality]);

  useEffect(() => {
    if (!cacheReady || customCars.length === 0) return;

    let raf = 0;
    const step = () => {
      const timeSec = performance.now() / 1000;

      for (let i = 0; i < customCars.length; i++) {
        const car = customCars[i];
        const node = carNodes.current[i];
        if (!node) continue;

        const rawFrac = ((timeSec + car.delay) % car.duration) / car.duration;
        const frac = car.side === -1 ? 1 - rawFrac : rawFrac;
        const pt = getRoadPoint(0, frac, LANE_HALF * car.side);
        if (!pt) continue;

        const angle = car.side === -1 ? pt.angle + 180 : pt.angle;
        node.setAttribute(
          "transform",
          `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})`,
        );
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [cacheReady, customCars]);

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      style={{ pointerEvents: "none" }}
    >
      <g id="road-paths-references" display="none">
        {ROADS.map((d, idx) => (
          <path
            key={idx}
            ref={(el) => {
              pathRefs.current[idx] = el;
            }}
            d={d}
          />
        ))}
      </g>

      <g id="civil-traffic-layer">
        {customCars.map((car, i) => (
          <g
            key={car.id}
            ref={(el) => {
              carNodes.current[i] = el;
            }}
          >
            {car.imageUrl && (
              <g transform="rotate(90)">
                <image
                  href={car.imageUrl}
                  x={-25}
                  y={-25}
                  width={50}
                  height={50}
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
