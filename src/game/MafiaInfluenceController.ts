export type MafiaDistrictStatus = 'calm' | 'watched' | 'taxed' | 'hostile';

export type MafiaDistrict = {
  id: string;
  name: string;
  influence: number;
  status: MafiaDistrictStatus;
  racketFee: number;
  risk: number;
};

export const MAFIA_DISTRICTS: MafiaDistrict[] = [
  { id: 'downtown', name: 'Centre-ville', influence: 18, status: 'watched', racketFee: 15, risk: 0.18 },
  { id: 'industrial', name: 'Zone industrielle', influence: 34, status: 'taxed', racketFee: 28, risk: 0.34 },
  { id: 'harbor', name: 'Port', influence: 52, status: 'hostile', racketFee: 45, risk: 0.52 },
  { id: 'suburbs', name: 'Banlieue', influence: 9, status: 'calm', racketFee: 8, risk: 0.09 },
];

export function getMafiaPressureScore(districts = MAFIA_DISTRICTS) {
  if (districts.length === 0) return 0;
  const total = districts.reduce((sum, district) => sum + district.influence, 0);
  return Math.round(total / districts.length);
}

export function getMafiaEventLabel(district: MafiaDistrict) {
  if (district.status === 'hostile') return `⚠️ Mafia active au ${district.name} · racket ${district.racketFee}€`;
  if (district.status === 'taxed') return `💵 Taxe mafieuse au ${district.name} · ${district.racketFee}€`;
  if (district.status === 'watched') return `👁️ Surveillance mafieuse au ${district.name}`;
  return `✅ ${district.name} calme`;
}

export function calculateMafiaFarePenalty(fare: number, district: MafiaDistrict) {
  if (district.status === 'calm') return fare;
  const penalty = Math.round(fare * district.risk);
  return Math.max(0, fare - penalty - district.racketFee);
}
