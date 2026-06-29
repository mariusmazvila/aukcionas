// Reali, duomenimis pagrįsta sandorio analizė iš MŪSŲ pačių nuscrapintų skelbimų.
// Jokio išorinio API: "rinkos vertė" = panašių automobilių mediana iš `listings`.
// Visi kaštų tarifai yra PER-NAUDOTOJĄ (skirtingi perpardavinėtojai, skirtinga savikaina).
//
// Pastaba: AI žalos analizė (iš nuotraukų) čia neįeina — tai atskiras serverio
// sluoksnis (Vercel funkcija + Anthropic raktas), jungiamas vėliau.

export interface CostParams {
  auctionFeePct: number; // aukciono mokestis, % nuo kainos
  transport: number;     // transportas iki LT, €
  prep: number;          // paruošimas / detailing, €
  reserve: number;       // saugos rezervas, €
  repair: number;        // numatoma remonto sąmata, €
  targetProfit: number;  // norimas pelnas, €
}

export const DEFAULT_PARAMS: CostParams = {
  auctionFeePct: 6,
  transport: 650,
  prep: 250,
  reserve: 300,
  repair: 0,
  targetProfit: 1000,
};

// Numatyta remonto sąmata pagal būklę — vartotojas gali perrašyti.
export function defaultRepairForCondition(condition?: string | null): number {
  const c = (condition || '').toLowerCase();
  if (/damaged|accident|salvage|žal|dauž|avar/.test(c)) return 1500;
  if (/used|naudot/.test(c)) return 400;
  return 0;
}

export interface Comp {
  price: number | null;
  mileage_km: number | null;
  year: number | null;
  source: string | null;
}

// LT mažmeninės rinkos šaltiniai — jų kainos ≈ tikėtina perpardavimo kaina LT.
const LT_SOURCES = ['autoplius.lt', 'auto.lt', 'autogidas.lt'];
const DEPRECIATION_PER_KM = 0.04; // € už 1 km ridos skirtumą (apytikslis)

function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

export interface AnalysisResult {
  resale: number | null;             // tikėtina perpardavimo kaina LT
  resaleBasis: 'LT' | 'visi' | null; // iš kokių comparables apskaičiuota
  fee: number;                       // aukciono mokestis, €
  landed: number;                    // bendra savikaina, €
  profit: number | null;             // pelnas, €
  margin: number | null;             // pelnas / savikaina
  maxBid: number | null;             // maks. statymas norimam pelnui
  compCount: number;                 // kiek comparables panaudota
  confidence: 'low' | 'medium' | 'high';
  score: number | null;              // pelno balas 0–100
  breakdown: { label: string; value: number }[];
}

export function analyze(opts: {
  price: number;
  mileage_km?: number | null;
  comps: Comp[];
  params: CostParams;
}): AnalysisResult {
  const { price, mileage_km, comps, params } = opts;

  // 1) Rinkos / perpardavimo vertė iš comparables.
  //    Pirmenybė LT rinkos šaltiniams; jei jų mažai — visi comparables.
  const ltComps = comps.filter((c) => c.price != null && LT_SOURCES.includes((c.source || '').toLowerCase()));
  const allComps = comps.filter((c) => c.price != null);
  const useLt = ltComps.length >= 3;
  const basis = useLt ? ltComps : allComps;
  let resale = median(basis.map((c) => c.price as number));

  // Korekcija pagal ridos skirtumą (jei turime ridas).
  if (resale != null && mileage_km != null) {
    const mils = basis.map((c) => c.mileage_km).filter((m): m is number => m != null);
    const medMileage = median(mils);
    if (medMileage != null) {
      resale = Math.round(resale - (mileage_km - medMileage) * DEPRECIATION_PER_KM);
    }
  }

  // 2) Savikaina (su vartotojo tarifais).
  const fee = price * params.auctionFeePct / 100;
  const landed = Math.round(price + fee + params.transport + params.prep + params.reserve + params.repair);

  // 3) Pelnas + maks. statymas (kad pelnas ≥ norimas).
  //    maxBid·(1+fee%) + fiksuoti = resale  →  maxBid = (resale − fiksuoti)/(1+fee%)
  const profit = resale != null ? Math.round(resale - landed) : null;
  const margin = profit != null && landed > 0 ? profit / landed : null;
  const fixed = params.transport + params.prep + params.reserve + params.repair + params.targetProfit;
  const maxBid = resale != null ? Math.max(0, Math.round((resale - fixed) / (1 + params.auctionFeePct / 100))) : null;

  // 4) Likvidumas / pasitikėjimas — pagal comparables kiekį.
  const compCount = basis.length;
  const confidence = compCount >= 10 ? 'high' : compCount >= 4 ? 'medium' : 'low';

  // 5) Pelno balas 0–100: marža (iki 60) + likvidumas (iki 25) + bazinė rizika (15).
  //    (Rizikos dalis tobulės, kai prisidės AI žalos analizė ir amžiaus/ridos rizika.)
  let score: number | null = null;
  if (margin != null) {
    const marginScore = clamp((margin / 0.25) * 60, 0, 60); // 25% marža → 60 t.
    const liqScore = clamp((compCount / 15) * 25, 0, 25);
    const riskScore = 15;
    score = Math.round(clamp(marginScore + liqScore + riskScore, 0, 100));
  }

  const breakdown = [
    { label: 'Statymas (kaina)', value: Math.round(price) },
    { label: `Aukciono mokestis (${params.auctionFeePct}%)`, value: Math.round(fee) },
    { label: 'Transportas', value: params.transport },
    { label: 'Remontas', value: params.repair },
    { label: 'Paruošimas', value: params.prep },
    { label: 'Saugos rezervas', value: params.reserve },
  ];

  return {
    resale,
    resaleBasis: resale == null ? null : useLt ? 'LT' : 'visi',
    fee,
    landed,
    profit,
    margin,
    maxBid,
    compCount,
    confidence,
    score,
    breakdown,
  };
}
