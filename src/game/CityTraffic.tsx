import { useEffect, useRef, useState } from "react";
import { useAdminConfig } from "./adminConfig";
import { listCustomVehicles } from "./gameAssets";

export const VILLAGE_PATHS = new Set<number>([1]);
export const SIDEWALK_LOCK_OFFSET = 64;
const LANE_HALF = 11;

/* eslint-disable prettier/prettier */
export const ROADS = [
  "M 1917.0 46.0 C 1916.0 47.4 1914.1 50.2 1911.2 54.5 C 1908.4 58.8 1904.2 66.4 1899.8 71.5 C 1895.3 76.6 1890.2 81.1 1884.5 85.0 C 1878.8 88.9 1871.8 91.8 1865.5 95.0 C 1859.2 98.2 1852.8 101.4 1846.5 104.5 C 1840.2 107.6 1833.8 110.5 1827.5 113.5 C 1821.2 116.5 1815.0 119.6 1808.8 122.8 C 1802.5 125.9 1796.5 129.1 1790.2 132.2 C 1784.0 135.4 1777.8 138.6 1771.5 141.8 C 1765.2 144.9 1758.8 148.1 1752.5 151.2 C 1746.2 154.4 1739.8 157.6 1733.5 160.8 C 1727.2 163.9 1720.6 166.8 1714.5 170.2 C 1708.4 173.7 1702.6 177.3 1697.0 181.2 C 1691.4 185.2 1686.7 190.2 1681.0 193.8 C 1675.3 197.3 1669.2 200.2 1662.8 202.5 C 1656.3 204.8 1648.9 205.4 1642.2 207.5 C 1635.6 209.6 1629.1 212.1 1622.8 215.0 C 1616.4 217.9 1610.5 221.7 1604.2 225.0 C 1598.0 228.3 1591.8 231.7 1585.5 235.0 C 1579.2 238.3 1572.8 241.7 1566.5 245.0 C 1560.2 248.3 1553.8 251.5 1547.5 254.8 C 1541.2 258.0 1534.8 261.1 1528.5 264.2 C 1522.2 267.4 1515.8 270.6 1509.5 273.8 C 1503.2 276.9 1496.8 280.0 1490.5 283.2 C 1484.2 286.5 1478.0 289.7 1471.8 293.0 C 1465.5 296.3 1459.5 299.8 1453.2 303.0 C 1447.0 306.2 1440.8 309.4 1434.5 312.5 C 1428.2 315.6 1421.9 318.7 1415.5 321.5 C 1409.1 324.3 1402.7 327.0 1396.2 329.5 C 1389.8 332.0 1382.9 333.7 1376.8 336.5 C 1370.6 339.3 1364.8 342.5 1359.2 346.2 C 1353.8 350.0 1349.1 354.8 1343.8 358.8 C 1338.4 362.8 1332.8 366.6 1327.0 370.2 C 1321.2 373.9 1315.1 377.4 1309.0 380.8 C 1302.9 384.1 1296.8 387.4 1290.5 390.5 C 1284.2 393.6 1277.8 396.4 1271.5 399.5 C 1265.2 402.6 1259.0 405.8 1252.8 409.0 C 1246.5 412.2 1240.5 415.7 1234.2 419.0 C 1228.0 422.3 1221.8 425.7 1215.5 429.0 C 1209.2 432.3 1202.8 435.7 1196.5 439.0 C 1190.2 442.3 1183.8 445.5 1177.5 448.8 C 1171.2 452.0 1164.9 455.5 1158.5 458.2 C 1152.1 461.0 1145.6 463.2 1139.0 465.0 C 1132.4 466.8 1125.2 466.6 1119.0 469.0 C 1112.8 471.4 1107.0 474.8 1101.8 479.2 C 1096.5 483.7 1092.2 492.1 1087.2 495.8 C 1082.3 499.4 1077.2 501.1 1072.0 501.0 C 1066.8 501.0 1061.2 497.5 1056.0 495.0 C 1050.8 492.5 1045.6 489.4 1040.5 485.8 C 1035.4 482.1 1031.0 476.7 1025.5 473.2 C 1020.0 469.8 1013.9 467.2 1007.2 465.2 C 1000.6 463.3 993.0 462.7 985.8 461.8 C 978.5 460.8 971.2 460.2 963.8 459.8 C 956.3 459.3 948.8 459.4 941.2 459.2 C 933.8 459.1 926.2 459.0 918.8 459.0 C 911.2 459.0 903.7 458.8 896.2 459.0 C 888.8 459.2 881.5 459.8 874.2 460.5 C 867.0 461.2 859.3 461.6 852.8 463.5 C 846.2 465.4 840.2 468.2 834.8 472.0 C 829.3 475.8 825.2 481.4 820.2 486.0 C 815.3 490.6 810.2 495.1 805.0 499.5 C 799.8 503.9 793.4 507.5 789.0 512.5 C 784.6 517.5 781.1 523.2 778.5 529.5 C 775.9 535.8 776.2 544.2 773.5 550.5 C 770.8 556.8 767.0 562.4 762.2 567.2 C 757.5 572.1 750.1 575.2 744.8 579.8 C 739.4 584.2 734.6 589.1 730.2 594.2 C 725.9 599.4 723.2 605.9 718.8 610.8 C 714.3 615.6 709.2 619.9 703.5 623.5 C 697.8 627.1 690.8 629.4 684.5 632.5 C 678.2 635.6 671.8 638.8 665.5 642.0 C 659.2 645.2 652.8 648.7 646.5 652.0 C 640.2 655.3 633.8 658.7 627.5 662.0 C 621.2 665.3 614.7 668.5 608.5 672.0 C 602.3 675.5 596.2 679.0 590.2 682.8 C 584.3 686.5 578.8 690.8 572.8 694.2 C 566.8 697.8 560.6 700.9 554.2 703.8 C 547.9 706.6 541.2 708.8 534.8 711.2 C 528.2 713.8 521.8 716.2 515.2 718.8 C 508.8 721.2 502.2 723.6 495.8 726.2 C 489.3 728.9 482.9 731.6 476.5 734.5 C 470.1 737.4 463.8 740.5 457.5 743.5 C 451.2 746.5 444.8 749.6 438.5 752.8 C 432.2 755.9 425.8 759.0 419.5 762.2 C 413.2 765.5 407.0 768.7 400.8 772.0 C 394.5 775.3 388.4 778.7 382.2 782.0 C 376.1 785.3 369.9 788.7 363.8 792.0 C 357.6 795.3 351.5 798.7 345.2 802.0 C 339.0 805.3 332.8 808.5 326.5 811.8 C 320.2 815.0 313.8 818.1 307.5 821.2 C 301.2 824.4 295.1 827.5 289.0 830.5 C 282.9 833.5 277.0 836.4 271.0 839.5 C 265.0 842.6 259.0 845.8 253.0 849.0 C 247.0 852.2 241.1 855.7 235.0 859.0 C 228.9 862.3 222.8 865.5 216.5 868.8 C 210.2 872.0 203.8 875.0 197.5 878.2 C 191.2 881.5 185.0 884.7 178.8 888.0 C 172.5 891.3 166.5 894.7 160.2 898.0 C 154.0 901.3 147.8 904.5 141.5 907.8 C 135.2 911.0 128.8 914.0 122.5 917.2 C 116.2 920.5 110.0 923.7 103.8 927.0 C 97.5 930.3 91.4 933.6 85.2 937.0 C 79.1 940.4 72.9 943.8 66.8 947.2 C 60.6 950.7 54.1 954.0 48.2 957.8 C 42.4 961.5 36.8 965.4 31.5 969.5 C 26.2 973.6 20.6 978.5 16.5 982.5 C 12.4 986.5 9.2 990.2 7.0 993.5 C 4.8 996.8 4.0 1000.2 3.0 1002.5 C 2.0 1004.8 1.3 1006.2 1.0 1007.0",
];

export function lockToSidewalk(pathPoint: any, tangent: any, side: number, x: number, y: number) {
  return { x, y };
}

type BakedPoint = { x: number; y: number; angle: number; nx: number; ny: number };

export default function CityTraffic() {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const carNodes = useRef<(SVGGElement | null)[]>([]);
  const [customCars, setCustomCars] = useState<any[]>([]);
  const [bakedPath, setBakedPath] = useState<BakedPoint[]>([]);

  const config = useAdminConfig();
  const fluidityQuality = config?.trafficFluidity || "medium";

  // 1. Charger les voitures civiles au démarrage
  useEffect(() => {
    const customList = listCustomVehicles() || [];
    const specs = customList.map((c: any, i: number) => ({
      id: c.id || `civil_${i}`,
      duration: 25 + Math.random() * 15,
      delay: -(Math.random() * 40),
      side: Math.random() > 0.5 ? 1 : -1,
      imageUrl: c.imageUrl,
    }));
    
    // Limitation stricte pour le trafic sur mobile
    const maxAllowed = fluidityQuality === "low" ? 4 : fluidityQuality === "medium" ? 7 : 10;
    setCustomCars(specs.slice(0, maxAllowed));
  }, [fluidityQuality]);

  // 2. Le secret magique : On "cuit" les coordonnées une seule fois pour toutes !
  useEffect(() => {
    const path = pathRefs.current[0];
    if (!path) return;
    const totalLen = path.getTotalLength();
    if (totalLen <= 1) return;

    const points: BakedPoint[] = [];
    const steps = 250; // Nombre de points de repère sur la carte

    for (let i = 0; i <= steps; i++) {
      const dist = (i / steps) * totalLen;
      const p = path.getPointAtLength(dist);
      const pNext = path.getPointAtLength(Math.min(totalLen, dist + 2));
      
      const dx = pNext.x - p.x;
      const dy = pNext.y - p.y;
      const L = Math.hypot(dx, dy) || 1;
      
      points.push({
        x: p.x,
        y: p.y,
        angle: (Math.atan2(dy, dx) * 180) / Math.PI,
        nx: -dy / L * LANE_HALF,
        ny: dx / L * LANE_HALF
      });
    }
    setBakedPath(points);
  }, [customCars]);

  // 3. Boucle d'affichage instantanée : Plus aucune formule, que de la lecture directe !
  useEffect(() => {
    if (bakedPath.length === 0 || customCars.length === 0) return;

    let raf = 0;
    const maxIdx = bakedPath.length - 1;

    const step = () => {
      const timeSec = performance.now() / 1000;

      for (let i = 0; i < customCars.length; i++) {
        const car = customCars[i];
        const node = carNodes.current[i];
        if (!node) continue;

        const progressTime = timeSec + car.delay;
        const rawFrac = (progressTime % car.duration) / car.duration;
        const frac = car.side === -1 ? 1 - rawFrac : rawFrac;

        // On va chercher directement le point dans l'index pré-calculé
        const bakedIdx = Math.min(maxIdx, Math.max(0, Math.floor(frac * maxIdx)));
        const pt = bakedPath[bakedIdx];

        if (!pt) continue;

        const posX = pt.x + pt.nx * car.side;
        const posY = pt.y + pt.ny * car.side;
        let finalAngle = pt.angle;
        if (car.side === -1) finalAngle += 180;

        node.setAttribute(
          "transform",
          `translate(${posX.toFixed(1)}, ${posY.toFixed(1)}) rotate(${finalAngle.toFixed(1)})`
        );
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [bakedPath, customCars]);

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ pointerEvents: "none" }}>
      <g id="road-paths-references" display="none">
        {ROADS.map((d, idx) => (
          <path key={idx} ref={(el) => { pathRefs.current[idx] = el; }} d={d} />
        ))}
      </g>

      <g id="civil-traffic-layer">
        {customCars.map((car, i) => (
          <g key={car.id} ref={(el) => { carNodes.current[i] = el; }}>
            {car.imageUrl && (
              <g transform="rotate(90)">
                <image href={car.imageUrl} x={-25} y={-25} width={50} height={50} preserveAspectRatio="xMidYMid meet" />
              </g>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
