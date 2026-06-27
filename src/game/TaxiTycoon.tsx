  import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ROADS, VILLAGE_PATHS, SIDEWALK_LOCK_OFFSET, lockToSidewalk } from "./CityTraffic";
import { GAME_ASSETS, listCustomVehicles } from "./gameAssets";
import { shouldStopAhead, nowSeconds, registerAccident, clearAccident, getAccidents, type AccidentZone } from "./trafficLights";
import { getAdmin, useAdminConfig } from "./adminConfig";
import { recordEarning, isSpecialTaxiUnlocked } from "@/lib/leaderboard";
import { pushNews } from "@/lib/radioNews";
import { useRealWorldEnv, weatherLabelFr, weatherLabelEn, refreshRealWorldEnv } from "@/lib/realWorldEnv";
import { WeatherNightOverlay } from "@/components/WeatherNightOverlay";
import LeaderboardPanel from "@/components/LeaderboardPanel";
import TutorialDialog from "@/components/TutorialDialog";
import { getLicense, addLicenseXp, rollClientTier, tierFareMult, tierXp } from "@/lib/license";
import { pickSpecialMission, SPECIAL_COOLDOWN_MS } from "@/lib/specialMissions";
import { getGameTime, periodLabel } from "./cityClock";



// Skins centralisés — pour changer un taxi / la voiture de police,
// édite `src/game/gameAssets.ts` (clés "taxi.*" / "police.car").
const TAXI_YELLOW_URL = GAME_ASSETS["taxi.yellow"];
const TAXI_BLACK_URL = GAME_ASSETS["taxi.black"];
const TAXI_RED_URL = GAME_ASSETS["taxi.red"];
const POLICE_CAR_URL = GAME_ASSETS["police.car"];
const AMBULANCE_URL = GAME_ASSETS["emergency.ambulance"];
const FIRETRUCK_URL = GAME_ASSETS["emergency.firetruck"];

const MUSIC_URL = GAME_ASSETS["audio.music"];

// Taille unifiée de tous les véhicules (taxi joueur, police, urgences, civils, customs)
export const VEHICLE_SIZE = 36;

/* ============================================================
 * TAXI TYCOON — entreprise de taxis idle
 * Le neveu hérite d'un entrepôt délabré. Les taxis sortent du dépôt,
 * vont chercher les clients qui spawnent sur la map, les déposent,
 * encaissent. Le joueur achète des taxis, améliore le dépôt, repeint.
 * ============================================================ */

export type DepotTier = {
  name: string;
  cost: number;
  maxTaxis: number;
  fareMult: number;
  spawnEvery: number; // secondes
  badge: string;
  ring: string;
  core: string;
  flag: string;
};

const DEPOT_TIERS: DepotTier[] = [
  { name: "GARAGE ABANDONNÉ", cost: 0,     maxTaxis: 1,  fareMult: 1.0, spawnEvery: 8.0, badge: "🏚️", ring: "#5a4030", core: "#3a2a1f", flag: "#7a5030" },
  { name: "ATELIER ROUILLÉ",  cost: 1500,  maxTaxis: 2,  fareMult: 1.3, spawnEvery: 6.5, badge: "🔧", ring: "#7a5a35", core: "#4a3a25", flag: "#c08a3a" },
  { name: "GARAGE RÉNOVÉ",    cost: 7500,  maxTaxis: 4,  fareMult: 1.7, spawnEvery: 5.0, badge: "🏢", ring: "#a07a4a", core: "#604832", flag: "#e8b850" },
  { name: "STATION MODERNE",  cost: 35000, maxTaxis: 7,  fareMult: 2.2, spawnEvery: 3.8, badge: "🏬", ring: "#3a8ad0", core: "#1f4a7a", flag: "#5cb8ff" },
  { name: "QG TAXICORP",      cost: 150000,maxTaxis: 12, fareMult: 3.2, spawnEvery: 2.6, badge: "🏛️", ring: "#f5c542", core: "#7a5a10", flag: "#fde68a" },
];

export const TAXI_COLORS = [
  { id: "yellow", name: "Jaune", body: "#f5c542", trim: "#9c7a1c" },
];

export const TAXI_PAINTS = [
  { id: "blue", name: "Bleu joueur", color: "#38bdf8", filter: "hue-rotate(172deg) saturate(1.65) brightness(1.03)" },
  { id: "yellow", name: "Jaune taxi", color: "#f5c542", filter: "none" },
  { id: "green", name: "Vert", color: "#22c55e", filter: "hue-rotate(92deg) saturate(1.55) brightness(0.96)" },
  { id: "pink", name: "Rose", color: "#ec4899", filter: "hue-rotate(305deg) saturate(1.45) brightness(1.05)" },
  { id: "white", name: "Blanc", color: "#f8fafc", filter: "grayscale(1) brightness(1.45) contrast(0.95)" },
] as const;

type TaxiMode = "idle" | "leaving_depot" | "roaming" | "to_pickup" | "to_dest" | "returning" | "entering_depot" | "to_gas" | "refueling" | "depositing";
type LanePosition = { x: number; y: number; angle: number };
type Taxi = {
  id: number;
  pathIdx: number;    // path actuel emprunté (0..ROADS.length-1)
  pos: number;        // longueur le long du path actuel
  target: number;
  lane?: LanePosition;
  mode: TaxiMode;
  speed: number;
  colorId: string;
  jobId: number | null;
  fuel: number;       // 0..100
  refuelUntil?: number; // timestamp ms : fin du remplissage
  ridesSinceDeposit: number; // nb courses depuis le dernier dépôt au QG
  depositUntil?: number;     // timestamp ms : fin du dépôt au QG
  mustDeposit?: boolean;     // flag : doit déposer au QG en retournant
  // Dépôt legacy : position/chemin direct hors route pour éviter les téléportations visibles.
  parkingIndex?: number;
  depotRoute?: { x: number; y: number }[];
  depotRouteStep?: number;
  depotXY?: { x: number; y: number; angle: number };
  depotAngle?: number;
  // Transition douce lors d'un changement de path (acceptation de course) :
  // on évite le « saut » visuel en interpolant entre la position d'origine
  // et la nouvelle position sur le path pickup pendant TRANSITION_MS.
  transitionFromX?: number;
  transitionFromY?: number;
  transitionUntil?: number;
};
const TRANSITION_MS = 700;


// Mécanique : retour au QG tous les N courses, attente de DEPOSIT_MS
const DEPOSIT_EVERY_RIDES = 3;
const DEPOSIT_MS = 5000;

type JobStatus = "offered" | "accepted";
type Job = {
  id: number;
  pickupPath: number;
  pickup: number;       // longueur sur pickupPath
  dropoffPath: number;
  dropoff: number;      // longueur sur dropoffPath
  fare: number;
  deadline: number;     // epoch ms — quand le client annule s'il n'est pas accepté
  duration: number;     // ms (pour la barre)
  status: JobStatus;
  sidePickup: 1 | -1;
  sideDrop: 1 | -1;
  acceptedAt?: number;
  tier?: "normal" | "vip" | "star" | "special";
  specialMissionId?: string;
  specialFareMult?: number;
  specialXp?: number;
  // Compagnie qui "détient" la mission (couleur de pastille).
  // "player" = joueur ; sinon = id de concurrent. Peut changer dynamiquement
  // pendant que la mission est "offered" (vol / reprise entre compagnies).
  claimedBy?: string;
  claimedColor?: string;
};



const DEFAULT_DEPOT_POS = 0.78; // fallback si mode "suit le circuit" (legacy)
const SAVE_KEY = "taxi-tycoon-v4";
const BASE_SPEED = 74; // px (sur viewBox 1920) par seconde — taxis un peu plus vifs que la circulation
const SPEED_UPGRADE_COST_BASE = 800;
const TAXI_COST_BASE = 600;
const MAX_JOBS_BASE = 3;
const FUEL_REFILL_MS = 4000;
const FUEL_LOW_THRESHOLD = 25;


// === Dépôt legacy Taxi World ===
// Coordonnées issues du calque parking déjà posé sur l'ancienne branche.
// On les garde ici pour que TaxiTycoon.tsx reste autonome quand tu remplaces juste ce fichier.
type LegacyDepotPoint = { x: number; y: number };
const LEGACY_MAP_W = 1920;
const LEGACY_MAP_H = 1080;
const LEGACY_DEPOT_PARKING_SPOTS = [
  { id: "taxi-01", x: 31.8, y: 68.5, angle: -8 },
  { id: "taxi-02", x: 34.2, y: 68.0, angle: -8 },
  { id: "taxi-03", x: 36.6, y: 67.5, angle: -8 },
  { id: "taxi-04", x: 39.0, y: 67.0, angle: -8 },
  { id: "taxi-05", x: 41.4, y: 66.5, angle: -8 },
  { id: "taxi-06", x: 43.8, y: 66.0, angle: -8 },
] as const;
const LEGACY_DEPOT_EXIT_ROUTE: LegacyDepotPoint[] = [
  { x: 37.5, y: 67.4 },
  { x: 42.2, y: 64.2 },
  { x: 47.8, y: 60.4 },
  { x: 53.5, y: 56.6 },
];
function legacyPercentToWorld(point: LegacyDepotPoint): LegacyDepotPoint {
  return { x: (point.x / 100) * LEGACY_MAP_W, y: (point.y / 100) * LEGACY_MAP_H };
}
function getLegacyTaxiDepotFlow(taxiIndex: number) {
  const spot = LEGACY_DEPOT_PARKING_SPOTS[taxiIndex % LEGACY_DEPOT_PARKING_SPOTS.length];
  const parking = legacyPercentToWorld({ x: spot.x, y: spot.y });
  const exitRoute = LEGACY_DEPOT_EXIT_ROUTE.map(legacyPercentToWorld);
  const outRoute = [parking, ...exitRoute];
  return {
    spot,
    parking: { ...parking, angle: spot.angle },
    exit: exitRoute[exitRoute.length - 1],
    outRoute,
    returnRoute: [...outRoute].reverse(),
  };
}
function pointAngle(a: LegacyDepotPoint, b: LegacyDepotPoint) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}
function moveTaxiOnDepotRoute(taxi: Taxi, dt: number) {
  const route = taxi.depotRoute;
  if (!route || route.length === 0) return true;
  let stepIndex = taxi.depotRouteStep ?? 0;
  let current = taxi.depotXY ?? { ...route[0], angle: route[1] ? pointAngle(route[0], route[1]) : (taxi.depotAngle ?? 0) };
  let remaining = Math.max(0, taxi.speed * dt);
  while (remaining > 0 && stepIndex < route.length - 1) {
    const target = route[stepIndex + 1];
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= 0.001 || remaining >= dist) {
      current = { x: target.x, y: target.y, angle: dist > 0.001 ? pointAngle(current, target) : (current.angle ?? 0) };
      remaining -= dist;
      stepIndex += 1;
    } else {
      const k = remaining / dist;
      current = { x: current.x + dx * k, y: current.y + dy * k, angle: pointAngle(current, target) };
      remaining = 0;
    }
  }
  taxi.depotRouteStep = stepIndex;
  taxi.depotXY = current;
  taxi.depotAngle = current.angle;
  return stepIndex >= route.length - 1;
}

// === Livrées de taxi inspirées de vraies compagnies (yellow body only) ===
export type Livery = {
  id: string;
  name: string;
  city: string;
  roofLabel: string;
  roofBg: string;
  roofFg: string;
  stripe: "checker" | "band" | "dots" | "none";
  stripeColor: string;
  image: string;
  faceRight: boolean; // true if image's car nose points right
};

export const LIVERIES: Livery[] = [
  { id: "classic",  name: "Classic Cab",   city: "Origine",     roofLabel: "TAXI",      roofBg: "#1a1d22", roofFg: "#fde047", stripe: "none",    stripeColor: "#1a1d22", image: TAXI_YELLOW_URL, faceRight: true  },
  { id: "executive", name: "Executive",    city: "Berline noire", roofLabel: "VIP",     roofBg: "#0a0c10", roofFg: "#fde047", stripe: "none",    stripeColor: "#0a0c10", image: TAXI_BLACK_URL,  faceRight: false },
  { id: "sport",    name: "Sport Cab",     city: "Coupé rouge",  roofLabel: "TAXI",     roofBg: "#1a1d22", roofFg: "#ffffff", stripe: "none",    stripeColor: "#1a1d22", image: TAXI_RED_URL,    faceRight: false },
];

/** Liste complète des livrées : base + skins uploadés via le panel admin. */
export function getAllLiveries(): Livery[] {
  const customTaxis = listCustomVehicles()
    .filter((v) => v.category === "taxi")
    .map<Livery>((v) => ({
      id: `custom_${v.id}`,
      name: v.name,
      city: "Custom (admin)",
      roofLabel: "TAXI",
      roofBg: "#1a1d22",
      roofFg: "#fde047",
      stripe: "none",
      stripeColor: "#1a1d22",
      image: v.url,
      faceRight: true,
    }));
  return [...LIVERIES, ...customTaxis];
}

type SaveData = {
  money: number;
  customersServed: number;
  totalEarned: number;
  depotTier: number;
  taxiSpeedLvl: number;
  taxis: { colorId: string }[];
  defaultColor: string;
  jobsCompleted: number;
  liveryId: string;
  // ====== Boutique QG ======
  hqCapacityLvl: number;   // +1 taxi de capacité par niveau (0..5)
  hqProductionLvl: number; // -15% cooldown sortie par niveau (0..5)
  hqRevenueLvl: number;    // +10% revenu par niveau (0..5)
  cityFund: number;        // 💰 Caisse de la ville (alimentée par les amendes)
  playerTaxiColor: string; // couleur visuelle du taxi joueur
  taxiWear: number;        // 🔧 usure flotte 0..100 — au-delà de 70 pénalise les revenus
};


const HQ_UPGRADE_MAX = 5;
const HQ_UPGRADE_BASE_COST = { capacity: 1200, production: 1500, revenue: 2000 } as const;

// === Niveaux de prospérité de la ville ===
// La ville grandit avec sa caisse — chaque palier débloque un nouveau statut.
export const CITY_LEVELS: { name: string; threshold: number; emoji: string }[] = [
  { name: "Village",     threshold: 0,     emoji: "🏘️" },
  { name: "Bourg",       threshold: 500,   emoji: "🏡" },
  { name: "Petite ville", threshold: 1500,  emoji: "🏪" },
  { name: "Ville",       threshold: 4000,  emoji: "🏙️" },
  { name: "Grande ville", threshold: 9000,  emoji: "🌆" },
  { name: "Métropole",   threshold: 20000, emoji: "🌇" },
];

export function getCityLevel(fund: number) {
  let lvl = 0;
  for (let i = 0; i < CITY_LEVELS.length; i++) {
    if (fund >= CITY_LEVELS[i].threshold) lvl = i;
  }
  return { index: lvl, ...CITY_LEVELS[lvl], next: CITY_LEVELS[lvl + 1] };
}

const DEFAULT_SAVE: SaveData = {
  money: 250,
  customersServed: 0,
  totalEarned: 0,
  depotTier: 0,
  taxiSpeedLvl: 0,
  taxis: [{ colorId: "yellow" }],
  defaultColor: "yellow",
  jobsCompleted: 0,
  liveryId: "classic",
  hqCapacityLvl: 0,
  hqProductionLvl: 0,
  hqRevenueLvl: 0,
  cityFund: 0,
  playerTaxiColor: "blue",
  taxiWear: 0,
};




function loadSave(): SaveData {
  if (typeof window === "undefined") return DEFAULT_SAVE;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return DEFAULT_SAVE;
    return { ...DEFAULT_SAVE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SAVE;
  }
}

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + "M";
  if (n >= 10_000) return Math.round(n / 1000) + "k";
  return Math.round(n).toLocaleString("fr-FR");
}

function TaxiSprite({
  withClient,
  moving,
  image,
  faceRight,
  paintFilter = "none",
  markerColor,
  size = VEHICLE_SIZE,
}: {
  withClient: boolean;
  moving: boolean;
  image: string;
  faceRight: boolean;
  paintFilter?: string;
  markerColor?: string;
  size?: number;
}) {
  // Side-view PNG on transparent square. Car body fills ~70% of width and
  // sits horizontally centered in the source — so we draw it large and let
  // the transparent padding overflow the road; SVG image origin is the car center.
  const S = size;
  return (
    <g>
      {/* Shadow under the car body (visible car ~60% of sprite width) */}
      <ellipse cx="0" cy={S * 0.04} rx={S * 0.34} ry={S * 0.07} fill="rgba(0,0,0,0.5)" />
      <g>
        {moving && (
          <animateTransform attributeName="transform" type="translate" values="0 -0.3; 0 0.3; 0 -0.3" dur="0.22s" repeatCount="indefinite" />
        )}
        <g transform={faceRight ? "rotate(90)" : "rotate(-90)"}>
          <image href={image} x={-S / 2} y={-S / 2} width={S} height={S} preserveAspectRatio="xMidYMid meet" style={{ filter: paintFilter }} />
        </g>
        {markerColor && <circle cx="0" cy={-S * 0.56} r="4.2" fill={markerColor} stroke="#0a0c10" strokeWidth="1.2" />}
        {withClient && (
          <g transform="translate(0,-4)">
            <circle r="3" fill="#ffd9b0" stroke="#1a1d22" strokeWidth="0.5" />
          </g>
        )}
      </g>
    </g>
  );
}

function RoadAlignedVehicleSprite({
  image,
  size = VEHICLE_SIZE,
  opacity = 1,
  children,
}: {
  image: string;
  size?: number;
  opacity?: number;
  children?: ReactNode;
}) {
  return (
    <g transform="rotate(90)">
      <image href={image} x={-size / 2} y={-size / 2} width={size} height={size} preserveAspectRatio="xMidYMid meet" opacity={opacity} />
      {children}
    </g>
  );
}




function Depot({ tier, x, y, scale = 1, rotation = 0, capLvl = 0, revLvl = 0, prodLvl = 0, night = 0 }: { tier: DepotTier; x: number; y: number; scale?: number; rotation?: number; capLvl?: number; revLvl?: number; prodLvl?: number; night?: number }) {
  // QG "Garage industriel chic" — SVG vue du ciel.
  // Évolue avec les upgrades : places parking (cap), néons (rev), enseigne lumineuse (prod).
  const W = 260;
  const H = 260;
  const _tier = tier; void _tier;
  const lit = night > 0.35;
  const neonOp = 0.55 + 0.09 * revLvl; // plus de revLvl = néons + lumineux
  const slots = 4 + capLvl; // 4..9 places
  const slotW = (W - 60) / slots;
  return (
    <g transform={`translate(${x},${y}) scale(${scale}) rotate(${rotation})`}>
      {/* ombre */}
      <ellipse cx="0" cy={H / 2 - 8} rx={W / 2 + 6} ry="18" fill="rgba(0,0,0,0.5)" />

      {/* Dalle béton + marquages */}
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx="6" fill="#2a2d33" stroke="#0a0b0d" strokeWidth="2" />
      {/* Hachures bordure */}
      <g opacity="0.55">
        {Array.from({ length: 18 }).map((_, i) => (
          <rect key={i} x={-W / 2 + i * (W / 18)} y={-H / 2} width={W / 36} height="6" fill="#f5c542" />
        ))}
      </g>

      {/* Bâtiment principal (atelier toit plat) */}
      <rect x={-W / 2 + 16} y={-H / 2 + 22} width={W - 32} height={H / 2 - 10} rx="3" fill="#3a3e46" stroke="#0a0b0d" strokeWidth="1.5" />
      {/* Skylights */}
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={-W / 2 + 30 + i * ((W - 60) / 4)} y={-H / 2 + 34} width={(W - 80) / 4} height="14" rx="1" fill={lit ? "#ffe48a" : "#7d8390"} opacity={lit ? 0.95 : 0.6} />
      ))}
      {/* Cheminée d'aération */}
      <circle cx={W / 2 - 36} cy={-H / 2 + 32} r="6" fill="#1a1d22" stroke="#000" strokeWidth="1" />
      <circle cx={W / 2 - 36} cy={-H / 2 + 32} r="2.5" fill="#5a5f68" />

      {/* Enseigne au sol */}
      <rect x={-70} y={-H / 2 + 6} width={140} height={14} rx="3" fill="#0a0b0d" stroke={lit ? "#f5c542" : "#7a5f1a"} strokeWidth="1.5" opacity={lit ? neonOp + 0.3 : 0.9} />
      <text x="0" y={-H / 2 + 16} fontSize="11" fontWeight="900" textAnchor="middle" fill={lit ? "#fff7c0" : "#f5c542"} letterSpacing="2" style={{ filter: lit ? "drop-shadow(0 0 4px #f5c542)" : undefined }}>TAXI DEPOT</text>

      {/* Parvis : places de parking taxis (visibles, jaunes) */}
      <g>
        {Array.from({ length: slots }).map((_, i) => {
          const px = -W / 2 + 30 + i * slotW + slotW / 2;
          const py = 30;
          return (
            <g key={i}>
              <rect x={px - slotW / 2 + 3} y={py - 18} width={slotW - 6} height="36" rx="2" fill="#1f2228" stroke="#f5c542" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.9" />
              {/* numéro */}
              <text x={px} y={py + 24} fontSize="6" textAnchor="middle" fill="#f5c542" opacity="0.6">{String(i + 1).padStart(2, "0")}</text>
            </g>
          );
        })}
      </g>

      {/* Bandes de circulation au sol (entrée / sortie) */}
      <path d={`M ${-W / 2 + 8} ${H / 2 - 14} L ${W / 2 - 8} ${H / 2 - 14}`} stroke="#f5c542" strokeWidth="2" strokeDasharray="8 6" opacity="0.7" />
      {/* Flèche entrée */}
      <path d={`M ${-W / 2 + 16} ${H / 2 - 6} l 10 -4 l -10 -4 z`} fill="#f5c542" opacity="0.8" />
      <path d={`M ${W / 2 - 16} ${H / 2 - 6} l -10 -4 l 10 -4 z`} fill="#f5c542" opacity="0.8" />

      {/* Néons bord de toit */}
      {lit && (
        <g>
          <rect x={-W / 2 + 16} y={-H / 2 + 20} width={W - 32} height="2" fill="#ffd84a" opacity={neonOp}>
            <animate attributeName="opacity" values={`${neonOp};${Math.min(1, neonOp + 0.25)};${neonOp}`} dur="2.4s" repeatCount="indefinite" />
          </rect>
          <rect x={-W / 2 + 16} y={H / 2 / 2 + 10} width={W - 32} height="1.5" fill="#ffd84a" opacity={neonOp * 0.7} />
        </g>
      )}

      {/* Plot d'entrée illuminé (proportionnel à prodLvl) */}
      <g>
        {Array.from({ length: 2 }).map((_, i) => {
          const cx = i === 0 ? -W / 2 + 8 : W / 2 - 8;
          return (
            <g key={i} transform={`translate(${cx},${H / 2 - 26})`}>
              <circle r="5" fill="#0e1217" stroke="#f5c542" strokeWidth="1.2" />
              <circle r="2.5" fill={lit ? "#ffd84a" : "#5a4818"} opacity={lit ? Math.min(1, 0.6 + 0.08 * prodLvl) : 0.7} />
            </g>
          );
        })}
      </g>

      {/* Halo nuit global */}
      {lit && <circle r={W * 0.62} fill="#f5c542" opacity={night * 0.08} />}
    </g>
  );
}


function RivalDepot({ x, y }: { x: number; y: number }) {
  // Vrai QG concurrent : dalle, immeuble 2 étages, vitrines, enseigne lumineuse,
  // places de parking rouges, antenne radio. Aucun simple cube.
  const W = 220;
  const H = 200;
  return (
    <g transform={`translate(${x},${y})`} filter="