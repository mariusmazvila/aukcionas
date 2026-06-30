# AutoBid — automobilių aukcionų stebėjimo ir analizės sistema

> **Perdavimo pastaba (skaityk pirma).** Šį projektą perėmei iš ankstesnio kūrėjo.
> Frontend'as (svetainė + AI analizės UI) jau gerokai pažengęs; backend'as
> (scraperis, kuris pildo Supabase `listings` lentelę) yra **kito žmogaus**
> atsakomybė. Žemiau — kas padaryta, kas liko, ir svarbios techninės ribos.
> Sekcijos „Kas padaryta / Kas liko" ir „Svarbios ribos" yra svarbiausios.

---

## Projekto tikslas

**autobid.lt** — SaaS automobilių perpardavinėtojams: stebėti kelis aukcionus
(Mobile.de, AutoScout24, Autoplius.lt, Alcopa, BCA, Copart...) vienoje vietoje
ir gauti **AI analizę** kiekvienam skelbimui — rinkos vertė, žala iš nuotraukų,
maksimalus statymas ir pelno potencialas.

Deploy: **Vercel** (autobidlt.vercel.app). Duomenys: **Supabase**.

---

## Stack

| Technologija | Pastaba |
|---|---|
| Astro ^6 | Statinis (SSG) — **nėra** SSR adapterio. Svarbu: puslapių „frontmatter" kodas vykdomas BUILD metu, ne per request. URL parametrai matomi tik kliento pusėje. |
| Tailwind CSS ^4 | Per `@tailwindcss/vite` (ne PostCSS). **Nėra `tailwind.config.js`** — tema `src/styles/global.css` faile (`@theme { ... }`, `@utility ...`). |
| TypeScript strict | `.ts` / `.astro` |
| Supabase (`@supabase/supabase-js`) | Duomenų bazė (`listings`) + planuojama Auth. Klientas `src/lib/supabase.ts`. |
| @astrojs/sitemap, @astrojs/partytown, @astrojs/mdx | SEO, analytics Web Worker'yje |

---

## Aplinkos kintamieji (`.env`)

```env
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
PUBLIC_GA_ID= / PUBLIC_META_PIXEL_ID= / PUBLIC_GTM_ID=   # analytics (neprivaloma)
```

⚠️ **SVARBU:** `.env` repo'e Supabase reikšmės gali būti TUŠČIOS (lokaliai jos
buvo tuščios). Be jų `supabase` klientas = `null` ir skelbimai NEUŽSIKRAUNA.
Įsitikink, kad `PUBLIC_SUPABASE_*` yra:
- lokaliai `.env` faile (dev),
- **ir Vercel projekto Environment Variables** (build + runtime), kitaip
  produkcijoje statiniai puslapiai sugeneruojami be duomenų.

`ANTHROPIC_API_KEY` (AI žalos analizei) gyvena **Supabase Edge Function secrets**,
ne `.env` — žr. „AI žalos analizė".

---

## Katalogų struktūra (aktualu)

```
src/
  config.ts                 # siteName, siteUrl, email...
  config/navigation.ts      # mainNav + footerNav (Header/Footer iš čia)
  lib/
    supabase.ts             # Supabase klientas (null jei nėra env)
    analysis.ts             # ⭐ Pelno analizės formulės (rinkos vertė, savikaina, pelnas, balas)
    utils.ts, schema.ts
  layouts/BaseLayout.astro  # SEO + analytics + Header/Footer; turi `solidHeader` propą
  components/
    layout/Header.astro     # VISADA baltas navbar, juodi meniu (Tesla stilius)
    layout/Footer.astro
    sections/, ui/, seo/, analytics/
  pages/
    index.astro             # Landing + paieškos panelė + "Karščiausia" (deals iš DB)
    kaip-veikia.astro       # lights2.webp pilno puslapio fonas
    kainodara.astro         # lights1.webp fonas; planai + DUK
    apie.astro              # /apie — old-car-3.webp fonas
    analizuoti.astro        # /analizuoti — URL įklijavimo demo (tik frontend)
    rezultatai.astro        # /rezultatai — paieškos rezultatai iš `listings` + filtrai (klientas)
    auto/demo.astro         # ⭐ Mašinos puslapis: realūs duomenys + "Išsami AI analizė"
    prisijungti.astro       # Login forma (DAR neprijungta prie Supabase Auth)
    registracija.astro      # Register forma (DAR neprijungta)
    404.astro, 500.astro, robots.txt.ts
  styles/global.css         # Tailwind + @theme + bg-brand-gradient + Inter + h1-h6 weight 500
supabase/
  functions/analyze-damage/index.ts   # ⭐ Deno Edge Function — Claude vision žalos analizė
public/images/              # webp nuotraukos (konvertuotos su sharp, q~78-82)
```

---

## Supabase: `listings` lentelė (31 stulpelis)

Šią lentelę pildo **scraperis (kito žmogaus kodas)**. Frontend tik skaito su anon raktu.

| Stulpelis | Tipas | | Stulpelis | Tipas |
|---|---|---|---|---|
| `id` | int8 (PK) | | `auction_end_date` | timestamptz |
| `source` | text | | `location_country` / `location_city` | text |
| `listing_id` | text | | `vin` | text |
| `url` | text | | `trim` | text |
| `make` / `model` | text | | `color` | text |
| `year` | int4 | | `registration` | text |
| `mileage_km` | int4 | | `first_registration_date` | date |
| `price` | numeric | | `vehicle_type` / `body_type` | text |
| `currency` | text | | `co2_g_km` / `engine_cc` | int4 |
| `fuel_type` / `transmission` | text | | `vat_recoverable` | text |
| `condition` | text | | `image_urls` | jsonb (nuotraukų URL masyvas) |
| `scraped_at`, `created_at`, `updated_at`, `dedupe_key` | meta | | | |

**Pastabos:**
- Aktyvumo signalas — **tik `auction_end_date`** (nėra `sold`/`is_active`
  stulpelio). Visur filtruojame `auction_end_date >= now()`.
- `currency` egzistuoja — kaina ne visada EUR, rodyk su valiuta.
- LT rinkos šaltiniai (autoplius.lt, auto.lt, autogidas.lt) `source` lauke =
  perpardavimo kainos etalonas (žr. `analysis.ts`).

---

## Dizaino sistema (svarbu, kad nenukryptum)

- **Šriftas: Inter** visur (`global.css` `*` taisyklė + Google Fonts `BaseLayout`).
- **Antraštės (h1–h6): svoris 500** — `global.css` `h1,h2,h3,h4,h5,h6 { font-weight:500 !important }`.
- **Brand spalva = mėlynas gradientas.** Naudok utility klasę **`bg-brand-gradient`**
  (apibrėžta `global.css`: `linear-gradient(135deg,#0344D3,#2D7FF9)`), o ne plokščią `#0344D3`.
  Tekstui/rėmeliams paliktas solidus `#0344D3`.
- **Navbar visada baltas, meniu juodas** (`Header.astro`). `solidHeader` propas
  istoriškai liko, bet navbar dabar visada baltas, tad propas įtakos neturi.
- **Pilno puslapio fonai** (kaip veikia / kainodara / apie): `fixed inset-0 -z-10`
  nuotrauka + tamsus `bg-zinc-950/70` overlay; sekcijos permatomos, baltos kortelės.
- Nuotraukos — webp (konvertuota `sharp`). Originalūs `.jpg` dar yra `public/images/`.

---

## ⭐ Pagrindinė funkcija: „Išsami AI analizė" (mašinos puslapis)

`/auto/demo?id=<listing_id>&...` — kortelės iš `index` ir `rezultatai` veda čia,
perduoda `id` (ir make/model/.../url/end kaip atsarginį variantą).

**Eiga (`src/pages/auto/demo.astro` apačios `<script>`):**
1. `fillReal()` — pagal `id` užkrauna realią `listings` eilutę ir užpildo:
   antraštę, kainą+valiutą, ridą/kurą/dėžę, **realų pabaigos atgalinį laiką**,
   nuotrauką (+ „+N nuotraukos" ženkliuką → veda į aukcioną), nuorodą į aukcioną,
   ir „Automobilio duomenys" sekciją (VIN, spalva, kėbulas, CO₂, ir t.t.).
2. **„Išsami AI analizė" mygtukas** (gradientas + shine + sparkle):
   - Parodo **AutoBid AI „mąstymo" seką** (LT žingsniai su spinneriais → varnelės;
     paskutinis sukasi kol baigiasi realus darbas). Tai premium UX efektas.
   - **Stage C (AI žala):** `runDamageAnalysis()` kviečia Supabase Edge Function
     `analyze-damage` su nuotraukomis → Claude vision grąžina struktūruotą žalą →
     atvaizduoja „Žalos analizė" sekciją, o remonto sąmatą įstato į kaštus.
   - **Stage A+B (pelnas):** užklausia comparables iš `listings` (ta pati
     markė+modelis, metai ±1, rida ±30%) → `analyze()` (`lib/analysis.ts`)
     suskaičiuoja rinkos vertę, savikainą, pelną, maks. statymą, pelno balą →
     atnaujina viršutines metrikas (nuima „DEMO" žymas).
3. **„Mano kaštai" panelė** — vartotojas įveda SAVO tarifus (aukciono mokestis %,
   transportas, remontas, paruošimas, rezervas, norimas pelnas). Saugoma
   `localStorage` (`autobid_costs`). Skirtingų perpardavinėtojų savikaina skiriasi.

**`lib/analysis.ts` formulės (peržiūrai/kalibravimui):**
- Rinkos vertė = panašių skelbimų **mediana** (pirmenybė LT šaltiniams; korekcija pagal ridą).
- Savikaina = kaina + mokestis% + transportas + remontas + paruošimas + rezervas.
- Pelnas = rinkos vertė − savikaina; Maks. statymas = (rinkos vertė − fiksuoti) / (1+mokestis%).
- Pelno balas 0–100 = marža + likvidumas + bazinė rizika. **Svoriai yra spėjimai — kalibruok.**

---

## AI žalos analizė — Supabase Edge Function

`supabase/functions/analyze-damage/index.ts` (Deno, `npm:@anthropic-ai/sdk`):
- Priima nuotraukų URL + markę/modelį/metus.
- `MODEL = "claude-opus-4-8"` (≈$0.20/analizę). Pigiau → `claude-haiku-4-5` (~$0.04).
  `MAX_IMAGES = 8` riboja kaštus.
- Claude **vision** + **strict tool use** → struktūruota ataskaita
  (bendra būklė, santrauka, pažeidimų sąrašas su rizika ir kaina, remonto sąmata €).
- Anthropic raktas lieka serveryje (Supabase secret) — niekada naršyklėje. CORS sutvarkytas.

**Deploy (vienkartinis):**
```bash
supabase functions deploy analyze-damage
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...   # iš console.anthropic.com
```
Arba per Supabase dashboard → Edge Functions (pavadinimas TIKSLIAI `analyze-damage`) → įklijuoti kodą → Deploy → Secrets.
Kol raktas neįdėtas — mygtukas dirba, AI žalos dalis tiesiog praleidžiama (graceful).

---

## ✅ Kas padaryta

- Visa svetainė: landing, kaip-veikia, kainodara, apie, analizuoti, rezultatai, mašinos puslapis, 404/500.
- Dizainas: Inter, antraščių svoris 500, mėlynas gradientas, baltas navbar, pilno puslapio fonai.
- Supabase prijungtas: `rezultatai` ir `index` rodo realius skelbimus; **paieškos filtrai** (klientas, `rezultatai.astro`); **tik aktyvūs** aukcionai (`auction_end_date >= now`).
- Nuoroda į **originalų aukcioną** ant kortelių ir mašinos puslapyje (nerodoma pasibaigusiems).
- Mašinos puslapis: realūs duomenys per `id`, nuotrauka + „+N", reali specifikacija.
- **„Išsami AI analizė"**: A+B pelno analizė (klientas) + C AI žala (edge function) + premium „mąstymo" UI.

## 🔜 Kas liko pabaigti

1. **Įdėti `ANTHROPIC_API_KEY`** į Supabase secrets (blokuota, kol gausi prieigą). Be jo AI žala neveikia.
2. **Vercel env:** užtikrinti `PUBLIC_SUPABASE_*` build + runtime, kad produkcijoje būtų duomenys.
3. **Auth:** `prisijungti` / `registracija` formos DAR neprijungtos prie Supabase Auth. Reikia `src/middleware.ts` + `/dashboard`.
4. **Kalibruoti** `analysis.ts` kaštų default'us ir balo svorius su realiais pavyzdžiais (kartu su backend kolega).
5. **Interaktyvi žalos schema** (kaip Alcopa: paspaudi ant raudonos detalės → nuotraukos). Planas: AI grąžina detalės kodą (enum), nupiešiam paspaudžiamą SVG mašiną. DAR nepadaryta.
6. **Realūs aukciono duomenys** (žalos schema, „Historique véhicule" istorija, pilnos nuotraukos) — reikia, kad **scraperis** juos išsaugotų Supabase (žr. žemiau). Tada AI naudos tikrus duomenis.
7. Placeholder puslapiai: `/privatumas`, `/salygos`, `/kontaktai`, `/straipsniai`, `/slaptazodis` — dar nesukurti.

---

## ⚠️ Svarbios techninės ribos (nepamiršk)

- **Claude NĖRA naršyklės robotas.** API negali pats nueiti į aukcioną, prisijungti,
  paspausti ant žalos schemos ar atsisiųsti istorijos PDF. `web_fetch` ima tik
  statinį tekstą. Tad **visus turtingus duomenis (žalos schema, per-detalė nuotraukos,
  istorija) turi surinkti SCRAPERIS** ir įrašyti į Supabase; AI tada juos analizuoja.
- **Kainų palyginimas su Autoplius/Autogidas — per duomenų bazę, ne live scraping.**
  Scraperis įtraukia tų šaltinių skelbimus į `listings`; `analysis.ts` juos naudoja
  kaip perpardavimo etaloną. Nedaryk live scraping iš frontend'o (lėta/trapu/ToS).
- **Statinis Astro:** puslapio frontmatter Supabase užklausa vykdoma BUILD metu.
  Bet kas, kas priklauso nuo URL parametrų ar vartotojo veiksmų — daroma kliento
  pusėje (žr. `rezultatai.astro` ir `auto/demo.astro` `<script>`).

---

## Common tasks

```bash
npm run dev       # localhost:4321 (dev)
npm run build     # produkcinis build → dist/
npm run preview   # peržiūra po build
```

- **Brand gradientas:** keisk `global.css` `@utility bg-brand-gradient`.
- **Navigacija:** `src/config/navigation.ts` (Header/Footer atsinaujina).
- **Naujas puslapis:** `src/pages/[slug].astro` → importuok `BaseLayout`.
- **Nuotraukos į webp:** `node -e "require('sharp')('in.jpg').resize({width:2000}).webp({quality:80}).toFile('out.webp')"`.

---

## Progreso žurnalas (santrauka)

- 2026-06-09: boilerplate (Astro 6 + Tailwind v4) → konvertuota į autobid.lt.
- 2026-06-29: Supabase prijungtas; `rezultatai`/`index` realūs skelbimai; filtrai; tik aktyvūs aukcionai; mašinos puslapio realūs duomenys + nuotrauka + nuoroda į aukcioną.
- 2026-06-29..30: dizaino sistema (Inter, gradientas, baltas navbar, fonai); `apie` puslapis; **„Išsami AI analizė"** — `lib/analysis.ts` (A+B) + `analyze-damage` edge function (C) + premium „mąstymo" UI.
