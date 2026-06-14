// =====================================================================
//  DADES DEL MUNDIAL 2026  ·  MÒDUL LLAVOR ("dataset seed")
// ---------------------------------------------------------------------
//  Mode demo. Edita aquest fitxer per connectar resultats reals.
//  Format oficial confirmat per la FIFA: 48 seleccions, 12 grups de 4,
//  cada equip juga 3 partits de fase de grups (72 partits de grup).
//    https://gpcustomersupportfwc2026.tickets.fifa.com/hc/en-gb/articles/28784798873117
//  Seu: Canadà, Mèxic i EUA · 11 juny – 19 juliol 2026 · 104 partits · 16 ciutats.
//    https://inside.fifa.com/organisation/president/news/tournament-operation-center-world-cup-2026-miami-infatino
//  Partits d'Espanya documentats a la pàgina de suites de la FIFA (font FIFA):
//    Espanya–Cap Verd · dl 15 juny 2026 · 12:00 · Atlanta Stadium · M14
//    Espanya–Aràbia Saudita · dg 21 juny 2026 · 12:00 · Atlanta Stadium · M38
//    https://fifaworldcup26.suites.fifa.com
//  Espanya juga al GRUP H amb Cap Verd, Aràbia Saudita i Uruguai. Composició i
//  calendari del grup CONTRASTATS per fonts periodístiques (no marcats com a
//  "FIFA oficial"):
//    MLS Soccer: https://www.mlssoccer.com/news/2026-fifa-world-cup-group-h-preview-spain-cape-verde-saudi-arabia-uruguay
//    DAZN (US):  https://www.dazn.com/en-US/news/soccer/2026-world-cup-group-h-spain-cape-verde-saudi-arabia-uruguay/caegcl3n499u1tyga3z9ezpe4
//    DAZN (ES):  https://www.dazn.com/es-ES/news/f%C3%BAtbol/espana-mundial-2026-rivales-partidos-calendario-resultados/6staso5jyl9x1ldq47tpq8oot
//  La resta de seleccions per grup són una llavor de demostració realista
//  (caps de sèrie i nivells coherents), NO el sorteig oficial.
// =====================================================================

export const TOURNAMENT = {
  name: "Copa del Món FIFA 2026",
  hosts: "Canadà · Mèxic · EUA",
  start: "2026-06-11",
  end: "2026-07-19",
  totalMatches: 104,
  groupMatches: 72,
  teamCount: 48,
  groupCount: 12,
  hostCities: 16,
  finalVenue: "Nova York / Nova Jersey",
  finalDate: "2026-07-19",
  dataMode: "demo" as const,
};

export type TeamId = string;

export interface Team {
  id: TeamId;
  name: string;        // nom en català
  code: string;        // codi de 3 lletres
  confed: "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "AFC" | "OFC";
  fifaRank: number;    // rànquing FIFA aproximat (per al model)
  strength: number;    // força del model 0–100 (derivada del rànquing, editable)
  isSpain?: boolean;
}

export interface GroupSeed {
  id: string;          // "A" … "L"
  label: string;       // "Grup A"
  teams: TeamId[];     // 4 equips
}

// Color/emoji de bandera com a text per evitar dependències d'imatges.
export const FLAG: Record<string, string> = {
  ESP: "🇪🇸", CPV: "🇨🇻", KSA: "🇸🇦", MEX: "🇲🇽",
  CAN: "🇨🇦", USA: "🇺🇸", ARG: "🇦🇷", BRA: "🇧🇷",
  FRA: "🇫🇷", ENG: "🏴", POR: "🇵🇹", NED: "🇳🇱",
  GER: "🇩🇪", BEL: "🇧🇪", CRO: "🇭🇷", ITA: "🇮🇹",
  URU: "🇺🇾", COL: "🇨🇴", JPN: "🇯🇵", KOR: "🇰🇷",
  MAR: "🇲🇦", SEN: "🇸🇳", SUI: "🇨🇭", DEN: "🇩🇰",
  ECU: "🇪🇨", AUS: "🇦🇺", IRN: "🇮🇷", SRB: "🇷🇸",
  NGA: "🇳🇬", GHA: "🇬🇭", EGY: "🇪🇬", CIV: "🇨🇮",
  POL: "🇵🇱", AUT: "🇦🇹", TUR: "🇹🇷", UKR: "🇺🇦",
  QAT: "🇶🇦", PAN: "🇵🇦", CRC: "🇨🇷", JAM: "🇯🇲",
  PER: "🇵🇪", PAR: "🇵🇾", NZL: "🇳🇿", TUN: "🇹🇳",
  ALG: "🇩🇿", UZB: "🇺🇿", JOR: "🇯🇴", SCO: "🏴",
};

// El "🏴" pelat (sense subetiquetes regionals, com Escòcia o Anglaterra) es mostra
// com un quadre genèric en molts entorns. Per a aquests casos preferim ensenyar el
// codi de l'equip (p. ex. SCO) en una insígnia perquè sigui identificable arreu.
export function flagIsGeneric(flag: string | undefined): boolean {
  return !flag || flag === "🏴";
}

function s(rank: number) {
  // força del model derivada del rànquing (editable). 1r ≈ 92, 60è ≈ 40.
  return Math.max(34, Math.round(94 - Math.log2(rank + 1) * 9));
}

export const TEAMS: Record<TeamId, Team> = {
  ESP: { id: "ESP", name: "Espanya", code: "ESP", confed: "UEFA", fifaRank: 2, strength: 90, isSpain: true },
  CPV: { id: "CPV", name: "Cap Verd", code: "CPV", confed: "CAF", fifaRank: 70, strength: s(70) },
  KSA: { id: "KSA", name: "Aràbia Saudita", code: "KSA", confed: "AFC", fifaRank: 58, strength: s(58) },
  MEX: { id: "MEX", name: "Mèxic", code: "MEX", confed: "CONCACAF", fifaRank: 14, strength: s(14) },
  CAN: { id: "CAN", name: "Canadà", code: "CAN", confed: "CONCACAF", fifaRank: 31, strength: s(31) },
  USA: { id: "USA", name: "Estats Units", code: "USA", confed: "CONCACAF", fifaRank: 16, strength: s(16) },
  ARG: { id: "ARG", name: "Argentina", code: "ARG", confed: "CONMEBOL", fifaRank: 1, strength: 92 },
  BRA: { id: "BRA", name: "Brasil", code: "BRA", confed: "CONMEBOL", fifaRank: 5, strength: 88 },
  FRA: { id: "FRA", name: "França", code: "FRA", confed: "UEFA", fifaRank: 3, strength: 89 },
  ENG: { id: "ENG", name: "Anglaterra", code: "ENG", confed: "UEFA", fifaRank: 4, strength: 88 },
  POR: { id: "POR", name: "Portugal", code: "POR", confed: "UEFA", fifaRank: 6, strength: 87 },
  NED: { id: "NED", name: "Països Baixos", code: "NED", confed: "UEFA", fifaRank: 7, strength: 85 },
  GER: { id: "GER", name: "Alemanya", code: "GER", confed: "UEFA", fifaRank: 9, strength: 84 },
  BEL: { id: "BEL", name: "Bèlgica", code: "BEL", confed: "UEFA", fifaRank: 8, strength: 84 },
  CRO: { id: "CRO", name: "Croàcia", code: "CRO", confed: "UEFA", fifaRank: 10, strength: 82 },
  ITA: { id: "ITA", name: "Itàlia", code: "ITA", confed: "UEFA", fifaRank: 11, strength: 82 },
  URU: { id: "URU", name: "Uruguai", code: "URU", confed: "CONMEBOL", fifaRank: 15, strength: s(15) },
  COL: { id: "COL", name: "Colòmbia", code: "COL", confed: "CONMEBOL", fifaRank: 13, strength: s(13) },
  JPN: { id: "JPN", name: "Japó", code: "JPN", confed: "AFC", fifaRank: 17, strength: s(17) },
  KOR: { id: "KOR", name: "Corea del Sud", code: "KOR", confed: "AFC", fifaRank: 23, strength: s(23) },
  MAR: { id: "MAR", name: "Marroc", code: "MAR", confed: "CAF", fifaRank: 12, strength: 80 },
  SEN: { id: "SEN", name: "Senegal", code: "SEN", confed: "CAF", fifaRank: 18, strength: s(18) },
  SUI: { id: "SUI", name: "Suïssa", code: "SUI", confed: "UEFA", fifaRank: 19, strength: s(19) },
  DEN: { id: "DEN", name: "Dinamarca", code: "DEN", confed: "UEFA", fifaRank: 21, strength: s(21) },
  ECU: { id: "ECU", name: "Equador", code: "ECU", confed: "CONMEBOL", fifaRank: 24, strength: s(24) },
  AUS: { id: "AUS", name: "Austràlia", code: "AUS", confed: "AFC", fifaRank: 25, strength: s(25) },
  IRN: { id: "IRN", name: "Iran", code: "IRN", confed: "AFC", fifaRank: 20, strength: s(20) },
  SRB: { id: "SRB", name: "Sèrbia", code: "SRB", confed: "UEFA", fifaRank: 33, strength: s(33) },
  NGA: { id: "NGA", name: "Nigèria", code: "NGA", confed: "CAF", fifaRank: 41, strength: s(41) },
  GHA: { id: "GHA", name: "Ghana", code: "GHA", confed: "CAF", fifaRank: 68, strength: s(68) },
  EGY: { id: "EGY", name: "Egipte", code: "EGY", confed: "CAF", fifaRank: 36, strength: s(36) },
  CIV: { id: "CIV", name: "Costa d'Ivori", code: "CIV", confed: "CAF", fifaRank: 40, strength: s(40) },
  POL: { id: "POL", name: "Polònia", code: "POL", confed: "UEFA", fifaRank: 28, strength: s(28) },
  AUT: { id: "AUT", name: "Àustria", code: "AUT", confed: "UEFA", fifaRank: 22, strength: s(22) },
  TUR: { id: "TUR", name: "Turquia", code: "TUR", confed: "UEFA", fifaRank: 27, strength: s(27) },
  UKR: { id: "UKR", name: "Ucraïna", code: "UKR", confed: "UEFA", fifaRank: 30, strength: s(30) },
  QAT: { id: "QAT", name: "Qatar", code: "QAT", confed: "AFC", fifaRank: 37, strength: s(37) },
  PAN: { id: "PAN", name: "Panamà", code: "PAN", confed: "CONCACAF", fifaRank: 39, strength: s(39) },
  CRC: { id: "CRC", name: "Costa Rica", code: "CRC", confed: "CONCACAF", fifaRank: 54, strength: s(54) },
  JAM: { id: "JAM", name: "Jamaica", code: "JAM", confed: "CONCACAF", fifaRank: 56, strength: s(56) },
  PER: { id: "PER", name: "Perú", code: "PER", confed: "CONMEBOL", fifaRank: 46, strength: s(46) },
  PAR: { id: "PAR", name: "Paraguai", code: "PAR", confed: "CONMEBOL", fifaRank: 45, strength: s(45) },
  NZL: { id: "NZL", name: "Nova Zelanda", code: "NZL", confed: "OFC", fifaRank: 87, strength: s(87) },
  TUN: { id: "TUN", name: "Tunísia", code: "TUN", confed: "CAF", fifaRank: 49, strength: s(49) },
  ALG: { id: "ALG", name: "Algèria", code: "ALG", confed: "CAF", fifaRank: 43, strength: s(43) },
  UZB: { id: "UZB", name: "Uzbekistan", code: "UZB", confed: "AFC", fifaRank: 57, strength: s(57) },
  JOR: { id: "JOR", name: "Jordània", code: "JOR", confed: "AFC", fifaRank: 64, strength: s(64) },
  SCO: { id: "SCO", name: "Escòcia", code: "SCO", confed: "UEFA", fifaRank: 35, strength: s(35) },
};

// 12 grups · llavor demo. Espanya al Grup H amb Cap Verd, Aràbia Saudita i
// Uruguai (composició contrastada per fonts periodístiques: MLS Soccer i DAZN;
// vegeu nota de fonts a sota). Els partits Espanya–Cap Verd (M14) i
// Espanya–Aràbia Saudita (M38) estan documentats per la pàgina de suites FIFA.
// La resta de grups són una llavor de demostració realista, NO el sorteig oficial.
export const GROUPS: GroupSeed[] = [
  { id: "A", label: "Grup A", teams: ["MEX", "KOR", "POL", "NZL"] },
  { id: "B", label: "Grup B", teams: ["CAN", "BEL", "ECU", "JOR"] },
  { id: "C", label: "Grup C", teams: ["USA", "NED", "EGY", "PAN"] },
  { id: "D", label: "Grup D", teams: ["ARG", "AUT", "ALG", "JAM"] },
  { id: "E", label: "Grup E", teams: ["FRA", "JPN", "SEN", "SCO"] },
  { id: "F", label: "Grup F", teams: ["ENG", "QAT", "GHA", "PER"] },
  { id: "G", label: "Grup G", teams: ["BRA", "SUI", "IRN", "CRC"] },
  { id: "H", label: "Grup H", teams: ["ESP", "CPV", "KSA", "URU"] },
  { id: "I", label: "Grup I", teams: ["POR", "COL", "TUR", "UZB"] },
  { id: "J", label: "Grup J", teams: ["GER", "DEN", "NGA", "TUN"] },
  { id: "K", label: "Grup K", teams: ["CRO", "AUS", "CIV", "PAR"] },
  { id: "L", label: "Grup L", teams: ["ITA", "SRB", "MAR", "UKR"] },
];

export const SPAIN_GROUP_ID = "H";

export type MatchStatus = "upcoming" | "live" | "finished";

export interface Match {
  id: string;          // codi FIFA tipus "M14"
  group: string;       // "H"
  round: 1 | 2 | 3;    // jornada de la fase de grups
  date: string;        // ISO data
  time: string;        // hora local de la seu
  home: TeamId;
  away: TeamId;
  venue: string;
  city: string;
  status: MatchStatus;
  homeGoals?: number;
  awayGoals?: number;
  official?: boolean;  // true si la dada prové d'una font FIFA citada
}

// Calendari de la fase de grups (llavor). Els 2 partits d'Espanya amb codi i
// seu reals (font FIFA: M14 i M38). La resta del Grup H està contrastada per
// fonts periodístiques (MLS Soccer, DAZN); les hores són locals de la seu.
export const MATCHES: Match[] = [
  // ---- Jornada 1 (Grup H) ----
  { id: "M14", group: "H", round: 1, date: "2026-06-15", time: "12:00", home: "ESP", away: "CPV", venue: "Mercedes-Benz Stadium", city: "Atlanta", status: "upcoming", official: true },
  { id: "M13", group: "H", round: 1, date: "2026-06-15", time: "18:00", home: "KSA", away: "URU", venue: "Hard Rock Stadium", city: "Miami", status: "upcoming" },
  // ---- Jornada 2 (Grup H) ----
  { id: "M38", group: "H", round: 2, date: "2026-06-21", time: "12:00", home: "ESP", away: "KSA", venue: "Mercedes-Benz Stadium", city: "Atlanta", status: "upcoming", official: true },
  { id: "M39", group: "H", round: 2, date: "2026-06-21", time: "18:00", home: "URU", away: "CPV", venue: "Hard Rock Stadium", city: "Miami", status: "upcoming" },
  // ---- Jornada 3 (Grup H) ----
  { id: "M62", group: "H", round: 3, date: "2026-06-26", time: "19:00", home: "CPV", away: "KSA", venue: "NRG Stadium", city: "Houston", status: "upcoming" },
  { id: "M63", group: "H", round: 3, date: "2026-06-26", time: "19:00", home: "URU", away: "ESP", venue: "Estadio Akron", city: "Guadalajara", status: "upcoming" },

  // ---- Altres grups · mostres de jornada 1 (demostració) ----
  { id: "M01", group: "A", round: 1, date: "2026-06-11", time: "19:00", home: "MEX", away: "KOR", venue: "Estadio Azteca", city: "Ciutat de Mèxic", status: "upcoming" },
  { id: "M02", group: "A", round: 1, date: "2026-06-12", time: "16:00", home: "POL", away: "NZL", venue: "Estadio Akron", city: "Guadalajara", status: "upcoming" },
  { id: "M03", group: "B", round: 1, date: "2026-06-12", time: "13:00", home: "CAN", away: "JOR", venue: "BMO Field", city: "Toronto", status: "upcoming" },
  { id: "M04", group: "B", round: 1, date: "2026-06-12", time: "19:00", home: "BEL", away: "ECU", venue: "BC Place", city: "Vancouver", status: "upcoming" },
  { id: "M05", group: "C", round: 1, date: "2026-06-13", time: "13:00", home: "USA", away: "PAN", venue: "SoFi Stadium", city: "Los Angeles", status: "upcoming" },
  { id: "M06", group: "C", round: 1, date: "2026-06-13", time: "16:00", home: "NED", away: "EGY", venue: "Levi's Stadium", city: "San Francisco", status: "upcoming" },
  { id: "M07", group: "D", round: 1, date: "2026-06-13", time: "19:00", home: "ARG", away: "JAM", venue: "MetLife Stadium", city: "Nova Jersey", status: "upcoming" },
  { id: "M08", group: "D", round: 1, date: "2026-06-14", time: "13:00", home: "AUT", away: "ALG", venue: "Gillette Stadium", city: "Boston", status: "upcoming" },
  { id: "M09", group: "E", round: 1, date: "2026-06-14", time: "16:00", home: "FRA", away: "JPN", venue: "AT&T Stadium", city: "Dallas", status: "upcoming" },
  { id: "M10", group: "F", round: 1, date: "2026-06-14", time: "19:00", home: "QAT", away: "GHA", venue: "NRG Stadium", city: "Houston", status: "upcoming" },
  { id: "M11", group: "G", round: 1, date: "2026-06-14", time: "21:00", home: "BRA", away: "CRC", venue: "Arrowhead Stadium", city: "Kansas City", status: "upcoming" },
  { id: "M12", group: "G", round: 1, date: "2026-06-15", time: "15:00", home: "SUI", away: "IRN", venue: "Lincoln Financial Field", city: "Filadèlfia", status: "upcoming" },
  { id: "M16", group: "F", round: 1, date: "2026-06-15", time: "09:00", home: "ENG", away: "PER", venue: "BMO Field", city: "Toronto", status: "upcoming" },
];

// ---------------------------------------------------------------------
//  MODEL DE PROBABILITAT (Poisson) — estimacions de demostració.
//  NO són quotes d'apostes ni prediccions oficials.
// ---------------------------------------------------------------------
function poissonPmf(k: number, lambda: number) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}
function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// Gols esperats a partir de la diferència de força.
// Coeficient moderat perquè les estimacions siguin creïbles (els favorits
// no guanyen amb >90%): un Mundial sempre té sorpreses.
function expectedGoals(att: number, def: number) {
  const diff = att - def;
  return Math.max(0.45, 1.3 + diff * 0.028);
}

export interface MatchProb {
  win: number;
  draw: number;
  loss: number;
  xgFor: number;
  xgAgainst: number;
  expectedPoints: number;
}

export function matchProbability(homeId: TeamId, awayId: TeamId): MatchProb {
  const a = TEAMS[homeId];
  const b = TEAMS[awayId];
  const lamA = expectedGoals(a.strength, b.strength) + 0.12; // lleuger factor "casa/familiaritat"
  const lamB = expectedGoals(b.strength, a.strength);
  let win = 0, draw = 0, loss = 0;
  const MAX = 9;
  for (let i = 0; i <= MAX; i++) {
    for (let j = 0; j <= MAX; j++) {
      const p = poissonPmf(i, lamA) * poissonPmf(j, lamB);
      if (i > j) win += p;
      else if (i === j) draw += p;
      else loss += p;
    }
  }
  const total = win + draw + loss;
  win /= total; draw /= total; loss /= total;
  return {
    win, draw, loss,
    xgFor: lamA, xgAgainst: lamB,
    expectedPoints: win * 3 + draw * 1,
  };
}

// Probabilitat acumulada que Espanya acabi 1a/2a (passi) del grup, per jornada.
// Simulació Monte Carlo lleugera dels partits del grup.
export interface GroupOutlook {
  pFirstByRound: number[];   // [després J1, J2, J3]
  pAdvanceByRound: number[]; // top-2
  pWinGroup: number;
  expGroupPoints: number;
  finishDist: { first: number; second: number; third: number; fourth: number };
}

function simulateScore(att: number, def: number) {
  const lam = expectedGoals(att, def);
  // mostreig de Poisson
  let L = Math.exp(-lam), k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

export function groupOutlook(groupId: string, focusId: TeamId, runs = 4000): GroupOutlook {
  const grp = GROUPS.find((g) => g.id === groupId)!;
  const teams = grp.teams;
  // tots els enfrontaments de la lligueta
  const fixtures: [TeamId, TeamId, 1 | 2 | 3][] = [];
  // assigna jornades estàndard d'un grup de 4
  fixtures.push([teams[0], teams[1], 1], [teams[2], teams[3], 1]);
  fixtures.push([teams[0], teams[2], 2], [teams[3], teams[1], 2]);
  fixtures.push([teams[0], teams[3], 3], [teams[1], teams[2], 3]);

  const firstByRound = [0, 0, 0];
  const advanceByRound = [0, 0, 0];
  const finish = { first: 0, second: 0, third: 0, fourth: 0 };
  let totalPts = 0;

  for (let r = 0; r < runs; r++) {
    const pts: Record<string, number> = {};
    const gd: Record<string, number> = {};
    teams.forEach((t) => { pts[t] = 0; gd[t] = 0; });
    const roundResults: Record<number, void> = {} as any;

    for (let round = 1; round <= 3; round++) {
      fixtures.filter((f) => f[2] === round).forEach(([h, a]) => {
        const gh = simulateScore(TEAMS[h].strength, TEAMS[a].strength);
        const ga = simulateScore(TEAMS[a].strength, TEAMS[h].strength);
        gd[h] += gh - ga; gd[a] += ga - gh;
        if (gh > ga) pts[h] += 3;
        else if (gh < ga) pts[a] += 3;
        else { pts[h] += 1; pts[a] += 1; }
      });
      // posició provisional del focus després d'aquesta jornada
      const ranked = [...teams].sort((x, y) => pts[y] - pts[x] || gd[y] - gd[x] || Math.random() - 0.5);
      const pos = ranked.indexOf(focusId);
      if (pos === 0) firstByRound[round - 1]++;
      if (pos <= 1) advanceByRound[round - 1]++;
    }
    const finalRank = [...teams].sort((x, y) => pts[y] - pts[x] || gd[y] - gd[x] || Math.random() - 0.5);
    const fp = finalRank.indexOf(focusId);
    if (fp === 0) finish.first++;
    else if (fp === 1) finish.second++;
    else if (fp === 2) finish.third++;
    else finish.fourth++;
    totalPts += pts[focusId];
  }

  return {
    pFirstByRound: firstByRound.map((x) => x / runs),
    pAdvanceByRound: advanceByRound.map((x) => x / runs),
    pWinGroup: finish.first / runs,
    expGroupPoints: totalPts / runs,
    finishDist: {
      first: finish.first / runs,
      second: finish.second / runs,
      third: finish.third / runs,
      fourth: finish.fourth / runs,
    },
  };
}

// Classificació calculada a partir dels partits acabats (status === "finished").
export interface Standing {
  team: TeamId;
  p: number; w: number; d: number; l: number;
  gf: number; ga: number; gd: number; pts: number;
}

export function computeStandings(groupId: string): Standing[] {
  const grp = GROUPS.find((g) => g.id === groupId)!;
  const table: Record<string, Standing> = {};
  grp.teams.forEach((t) => {
    table[t] = { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });
  MATCHES.filter((m) => m.group === groupId && m.status === "finished").forEach((m) => {
    const h = table[m.home], a = table[m.away];
    if (!h || !a || m.homeGoals == null || m.awayGoals == null) return;
    h.p++; a.p++;
    h.gf += m.homeGoals; h.ga += m.awayGoals;
    a.gf += m.awayGoals; a.ga += m.homeGoals;
    if (m.homeGoals > m.awayGoals) { h.w++; a.l++; h.pts += 3; }
    else if (m.homeGoals < m.awayGoals) { a.w++; h.l++; a.pts += 3; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  });
  return Object.values(table)
    .map((t) => ({ ...t, gd: t.gf - t.ga }))
    .sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
}

export function teamsOfGroup(groupId: string): Team[] {
  return GROUPS.find((g) => g.id === groupId)!.teams.map((t) => TEAMS[t]);
}

export const SPAIN_MATCHES = MATCHES.filter(
  (m) => m.home === "ESP" || m.away === "ESP"
).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
