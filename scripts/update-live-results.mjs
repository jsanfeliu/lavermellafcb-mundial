#!/usr/bin/env node
// =====================================================================
//  update-live-results.mjs
// ---------------------------------------------------------------------
//  Descarrega el marcador del Mundial 2026 de l'endpoint públic d'ESPN i
//  el normalitza a client/public/results-live.json perquè el frontend hi
//  faci el merge amb les dades llavor (MATCHES) i recalculi classificació
//  i probabilitats amb resultats reals.
//
//  Font (públic, sense clau):
//    https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard
//
//  Ús:   node scripts/update-live-results.mjs
//  Surt amb codi 1 si una selecció del Mundial no es pot mapejar (perquè
//  a CI no perdem dades en silenci) o si la descàrrega falla.
// =====================================================================

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "client", "public", "results-live.json");

const SOURCE = "ESPN public scoreboard";
const SOURCE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const WINDOW = "20260611-20260719";
const FETCH_URL = `${SOURCE_URL}?dates=${WINDOW}&limit=200`;

// Finestra del torneig: fora d'aquestes dates el script no fa res (exit 0)
// per evitar soroll anual. La programació del cron pot existir igualment.
const WINDOW_START = Date.UTC(2026, 5, 11); // 2026-06-11
const WINDOW_END = Date.UTC(2026, 6, 20);   // 2026-07-20 (inclusiu)

// ---------------------------------------------------------------------
//  Mapatge nom ESPN -> TeamId intern. La clau primària és l'abreviatura
//  d'ESPN (coincideix amb els nostres codis de 3 lletres); el displayName
//  serveix de reserva per a variants de nom.
// ---------------------------------------------------------------------
const INTERNAL_IDS = [
  "ESP", "CPV", "KSA", "MEX", "CAN", "USA", "ARG", "BRA", "FRA", "ENG",
  "POR", "NED", "GER", "BEL", "CRO", "URU", "COL", "JPN", "KOR", "MAR",
  "SEN", "SUI", "ECU", "AUS", "IRN", "GHA", "EGY", "CIV", "AUT", "TUR",
  "QAT", "PAN", "PAR", "NZL", "TUN", "ALG", "UZB", "JOR", "SCO", "RSA",
  "CZE", "BIH", "HAI", "CUW", "IRQ", "NOR", "COD", "SWE",
];

// Variants de displayName d'ESPN -> TeamId (per si l'abreviatura canviés).
const NAME_TO_ID = {
  "spain": "ESP",
  "cape verde": "CPV", "cabo verde": "CPV",
  "saudi arabia": "KSA",
  "mexico": "MEX",
  "canada": "CAN",
  "united states": "USA", "usa": "USA", "united states of america": "USA",
  "argentina": "ARG",
  "brazil": "BRA",
  "france": "FRA",
  "england": "ENG",
  "portugal": "POR",
  "netherlands": "NED",
  "germany": "GER",
  "belgium": "BEL",
  "croatia": "CRO",
  "uruguay": "URU",
  "colombia": "COL",
  "japan": "JPN",
  "south korea": "KOR", "korea republic": "KOR", "korea, republic of": "KOR",
  "morocco": "MAR",
  "senegal": "SEN",
  "switzerland": "SUI",
  "ecuador": "ECU",
  "australia": "AUS",
  "iran": "IRN", "ir iran": "IRN",
  "ghana": "GHA",
  "egypt": "EGY",
  "ivory coast": "CIV", "côte d'ivoire": "CIV", "cote d'ivoire": "CIV",
  "austria": "AUT",
  "turkey": "TUR", "türkiye": "TUR", "turkiye": "TUR",
  "qatar": "QAT",
  "panama": "PAN",
  "paraguay": "PAR",
  "new zealand": "NZL",
  "tunisia": "TUN",
  "algeria": "ALG",
  "uzbekistan": "UZB",
  "jordan": "JOR",
  "scotland": "SCO",
  "south africa": "RSA",
  "czechia": "CZE", "czech republic": "CZE",
  "bosnia-herzegovina": "BIH", "bosnia and herzegovina": "BIH", "bosnia & herzegovina": "BIH",
  "haiti": "HAI",
  "curaçao": "CUW", "curacao": "CUW",
  "iraq": "IRQ",
  "norway": "NOR",
  "dr congo": "COD", "congo dr": "COD", "democratic republic of the congo": "COD", "congo democratic republic": "COD",
  "sweden": "SWE",
};

// Detecta marcadors de posició de fases eliminatòries (1A, 2L, QFW1, RD16 W3…),
// que NO són seleccions i, per tant, no s'han de mapejar ni considerar errors.
function isPlaceholder(abbr, displayName) {
  if (/^[12][A-L]$/.test(abbr)) return true;                 // 1A … 2L
  if (/^(QF|SF|RD16|RD32|3RD|F)\b/i.test(abbr)) return true; // fases finals
  if (/W\d/i.test(abbr)) return true;                        // *W1, QFW1…
  if (/\b(Winner|Place|Round of|Quarterfinal|Semifinal|Final)\b/i.test(displayName || "")) return true;
  return false;
}

function resolveTeamId(team) {
  const abbr = (team.abbreviation || "").toUpperCase();
  if (INTERNAL_IDS.includes(abbr)) return abbr;
  const byName = NAME_TO_ID[(team.displayName || "").trim().toLowerCase()];
  if (byName) return byName;
  const byShort = NAME_TO_ID[(team.shortDisplayName || "").trim().toLowerCase()];
  if (byShort) return byShort;
  return null;
}

async function main() {
  const now = Date.now();
  if (now < WINDOW_START || now > WINDOW_END) {
    // Fora de la finestra del torneig: no toquem el fitxer, sortim net.
    console.log(
      `Fora de la finestra del Mundial (${WINDOW}). No es fa res. (ara=${new Date(now).toISOString()})`
    );
    return;
  }

  console.log(`Descarregant ${FETCH_URL} …`);
  const res = await fetch(FETCH_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; LaVermellaFCB-Mundial/1.0; +https://github.com/jsanfeliu/lavermellafcb-mundial)",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`ESPN ha respost ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const rawEvents = Array.isArray(data.events) ? data.events : [];
  console.log(`ESPN ha retornat ${rawEvents.length} esdeveniments.`);

  const events = [];
  const unmapped = new Set();

  for (const ev of rawEvents) {
    const comp = ev.competitions?.[0];
    if (!comp) continue;
    const home = comp.competitors?.find((c) => c.homeAway === "home");
    const away = comp.competitors?.find((c) => c.homeAway === "away");
    if (!home || !away) continue;

    const type = comp.status?.type || ev.status?.type || {};
    const completed = !!type.completed;
    const state = type.state || ""; // "pre" | "in" | "post"
    const inProgress = state === "in";

    const homeId = resolveTeamId(home.team);
    const awayId = resolveTeamId(away.team);

    // Marca com a no-mapejats només les seleccions reals (no placeholders).
    if (!homeId && !isPlaceholder(home.team.abbreviation, home.team.displayName)) {
      unmapped.add(home.team.displayName || home.team.abbreviation);
    }
    if (!awayId && !isPlaceholder(away.team.abbreviation, away.team.displayName)) {
      unmapped.add(away.team.displayName || away.team.abbreviation);
    }

    const toScore = (s) => (s == null || s === "" ? null : Number(s));

    events.push({
      espn_id: ev.id,
      date_utc: ev.date,
      status_name: type.name || null,
      status_detail: type.detail || type.shortDetail || null,
      state, // pre | in | post
      completed,
      in_progress: inProgress,
      venue: comp.venue?.fullName || null,
      venue_city: comp.venue?.address?.city || null,
      home: {
        id: homeId, // TeamId intern o null (placeholder de fase final)
        displayName: home.team.displayName || null,
        shortDisplayName: home.team.shortDisplayName || null,
        abbreviation: home.team.abbreviation || null,
        score: completed || inProgress ? toScore(home.score) : null,
      },
      away: {
        id: awayId,
        displayName: away.team.displayName || null,
        shortDisplayName: away.team.shortDisplayName || null,
        abbreviation: away.team.abbreviation || null,
        score: completed || inProgress ? toScore(away.score) : null,
      },
    });
  }

  const payload = {
    source: SOURCE,
    source_url: FETCH_URL,
    fetched_at: new Date().toISOString(),
    event_count: events.length,
    completed_count: events.filter((e) => e.completed).length,
    in_progress_count: events.filter((e) => e.in_progress).length,
    unmapped_teams: [...unmapped].sort(),
    note:
      "Resultats reals d'ESPN (públic). Les probabilitats del frontend són un model de demostració, no quotes d'apostes ni prediccions oficials.",
    events,
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(
    `Escrit ${OUT_PATH} · ${events.length} partits · ${payload.completed_count} acabats · ${payload.in_progress_count} en directe.`
  );

  if (unmapped.size > 0) {
    console.error(
      `ERROR: seleccions del Mundial sense mapejar: ${[...unmapped].join(", ")}`
    );
    console.error(
      "Afegeix-les a INTERNAL_IDS / NAME_TO_ID a scripts/update-live-results.mjs."
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Ha fallat l'actualització de resultats:", err.message || err);
  process.exit(1);
});
