# Astro Landing Starter — Boilerplate klientų landing page'ams

## Projekto tikslas

Reusable boilerplate Astro + Tailwind pagrindu, skirtas klientų landing page projektams.
**Klientas keičiamas per vieną failą: `src/config.ts`** — nereikia liesti kodo.

**Pirmas klientas:** Innomode (elektrinių panelių statyba, Lietuva)

---

## Stack

| Technologija | Versija | Pastaba |
|---|---|---|
| Astro | ^6.x | SSG/SSR framework |
| Tailwind CSS | ^4.x | Stiliai per `@tailwindcss/vite` (ne PostCSS!) |
| TypeScript | strict | Visi failai `.ts` / `.astro` |
| @astrojs/mdx | ^5.x | Blog post'ams (MDX = Markdown + JSX komponentai) |
| @astrojs/sitemap | ^3.x | Automatinis sitemap — visi HTML puslapiai |
| @astrojs/rss | — | RSS feed — `/rss.xml` |
| @astrojs/partytown | — | GA4 + Meta Pixel be main thread blokavimo (TODO) |
| Netlify Forms | — | Kontaktų forma (nereikia backend'o) |

**Svarbu apie Tailwind v4:** Daugiau nėra `tailwind.config.js`. Tema konfigūruojama
tiesiai `global.css` faile su CSS kintamaisiais (`@theme { --color-brand: ... }`).

---

## Kaip pritaikyti naujam klientui

Tik 3 žingsniai:

1. **Redaguok `src/config.ts`** — pakeisk `siteName`, `siteUrl`, `companyEmail` ir kt.
2. **Sukurk `.env`** iš `.env.example` — įrašyk analytics ID'us
3. **Pakeisk `public/images/og-default.jpg`** — OG nuotrauka socialiniams tinklams

Viskas kita — komponentai, layouts, SEO — automatiškai paima duomenis iš config.

---

## Katalogų struktūra

```
src/
  config.ts              # ← VIENINTELĖ vieta klientų konfigūracijai (siteName, analytics...)
  components/
    seo/                 # SEO komponentai (BaseHead, SchemaOrg, OpenGraph...)
    layout/              # Header, Footer, Nav
    sections/            # Hero, Features, CTA, Contact sekcijos
    ui/                  # Atomai: Button, Card, Badge, Input...
  layouts/
    BaseLayout.astro     # Pagrindinis layout su SEO ir analytics
  pages/
    index.astro          # Pagrindinis puslapis
    blog/                # Blog puslapiai (Content Collections)
  content/
    blog/                # MDX blog post'ai
    config.ts            # Content Collections schema (TODO)
  styles/
    global.css           # Tailwind importas + tema (@theme kintamieji)
  lib/
    utils.ts             # cn(), formatDate(), slugify(), getCanonicalUrl()
public/
  images/                # Statiniai paveikslai (og-default.jpg, logo.svg...)
  fonts/                 # Web šriftai (jei self-hosted)
  favicon.svg
.env                     # Analytics ID'ai (nėra git'e!)
.env.example             # Šablonas .env failui (yra git'e)
```

---

## `src/config.ts` struktūra

```typescript
const config: SiteConfig = {
  siteName: "Kliento pavadinimas",
  siteUrl: "https://klientas.lt",
  siteDescription: "...",

  companyName: "Kliento UAB",
  companyEmail: "info@klientas.lt",
  companyPhone: "+370 ...",
  companyAddress: "..., Lietuva",

  socialLinks: {
    facebook: "https://facebook.com/...",  // opcionalus
    instagram: "",
    linkedin: "",
  },

  analyticsConfig,  // automatiškai iš .env (PUBLIC_GA_ID, PUBLIC_META_PIXEL_ID, PUBLIC_GTM_ID)

  defaultLocale: "lt",
  supportedLocales: ["lt"],

  ogImage: "/images/og-default.jpg",
};
```

---

## Komponentų biblioteka

### UI komponentai (`src/components/ui/`)

#### `Button.astro`
```astro
<!-- Nuoroda -->
<Button variant="primary" size="lg" href="/kontaktai">Susisiekti</Button>
<Button variant="outline" size="md" href="/paslaugos">Paslaugos</Button>
<Button variant="ghost" size="sm" href="https://..." external>Išorinis</Button>
<!-- Mygtukas (forma) -->
<Button variant="secondary" type="submit">Siųsti</Button>
```
Variantai: `primary` | `secondary` | `outline` | `ghost`
Dydžiai: `sm` | `md` | `lg`

#### `Container.astro`
```astro
<Container>turinys</Container>
<Container as="section" class="py-16">sekcija</Container>
```
`as` variantai: `div` | `section` | `article` | `main` | `aside` | `header` | `footer`

#### `Image.astro`
```astro
---
import heroImg from '../assets/hero.jpg';
---
<Image src={heroImg} alt="..." loading="eager" />
<Image src={heroImg} alt="..." widths={[400, 800]} sizes="100vw" />
```
Automatiškai generuoja AVIF + WebP `<source>` elementus. Naudoti TIK lokaliam paveikslams (`src/`).

### Sekcijų komponentai (`src/components/sections/`)

#### `Hero.astro`
```astro
<Hero
  headline="Pagrindinis šūkis"
  subheadline="Papildomas aprašymas"
  primaryCta={{ text: 'Susisiekti', href: '/kontaktai' }}
  secondaryCta={{ text: 'Sužinoti', href: '/paslaugos' }}
  image={heroImg}
  imageAlt="..."
  variant="split"  <!-- arba "centered" -->
/>
```
Named slots: `eyebrow`, `cta`, `image`, `extras`, `background`

#### `CTASection.astro`
```astro
<CTASection
  headline="Pasikonsultuokite nemokamai"
  description="..."
  primaryCta={{ text: 'Susisiekti', href: '/kontaktai' }}
  background="dark"  <!-- "light" | "brand" -->
/>
```

### Layout komponentai (`src/components/layout/`)

#### Navigacijos konfigūracija
Redaguok `src/config/navigation.ts` — Header ir Footer automatiškai atsinaujins:
```typescript
export const mainNav: NavItem[] = [
  { label: 'Pagrindinis', href: '/' },
  { label: 'Paslaugos', href: '/paslaugos' },
  // ...
];
```

#### Header funkcionalumas
- Sticky top su `backdrop-blur`
- Aktyvios nuorodos žymimos automatiškai pagal `Astro.request.url`
- Mobilusis meniu: hamburger toggle, uždarymas ESC / paspaudus šone / keičiant lango dydį
- Vanilla JS (ne React) — nulinis JS bundle poveikis

---

## Kaip pridėti naują blog post'ą

### Žingsnis po žingsnio

**1. Sukurk naują `.mdx` failą** `src/content/blog/` kataloge.
Failo pavadinimas tampa URL slug'u — naudok `kebab-case` be lietuviškų raidžių:

```
src/content/blog/elektros-skydu-montavimas.mdx
                  ↑ tai bus URL: /tinklarastis/elektros-skydu-montavimas/
```

**2. Užpildyk frontmatter'į** pagal schemą (`src/content.config.ts`):

```mdx
---
title: "Elektros skydų montavimo etapai"
description: "Žingsnis po žingsnio apie tai, kaip vyksta profesionalus elektros skydo montavimas pramoniniame objekte."
pubDate: 2024-04-20
# updatedDate: 2024-05-01   ← opcionalus, jei straipsnis buvo atnaujintas
author: "Innomode UAB"
tags: ["montavimas", "elektros skydai", "pramonė"]
draft: false                 ← true = nerodoma nei dev, nei prod
# heroImage: ./nuotraukos/montavimas.jpg  ← opcionalus, reliatyvus kelias nuo šio failo
---

Turinys čia...
```

**3. Parašyk turinį** standartine Markdown sintakse + MDX galimybėmis:

```mdx
## Pagrindiniai etapai

Montavimas susideda iš kelių pagrindinių žingsnių...

### 1. Projektavimas

Prieš pradedant montavimą...

- Pirmas punktas
- Antras punktas

### 2. Įrangos paruošimas

| Įranga | Kiekis |
|---|---|
| Skydas | 1 vnt. |
```

**4. Žymos (tags)** — naudok jau esamas arba kurk naujas:
- Naujos žymos automatiškai atsiranda `/tinklarastis/zyma/[slug]/` puslapyje
- `slugify()` automatiškai konvertuoja: `"elektros skydai"` → `/elektros-skydai/`
- Žymos rodomos filtruose tinklaraščio sąraše

**5. Hero nuotrauka** (opcionalas):
- Padėk nuotrauką bet kur `src/` kataloge, pvz. `src/assets/blog/`
- Nurodyk **reliatyvų** kelią nuo MDX failo: `heroImage: ../../assets/blog/nuotrauka.jpg`
- Astro automatiškai optimizuoja (WebP, lazy loading, teisingi dydžiai)
- **Nereikia** nurodyti `public/` — ten dedamos tik neoptimizuotos nuotraukos

**6. Draft režimas**:
- `draft: true` — straipsnis **nerenderinamas** nei `dev`, nei `build` metu
- Pakeisk į `draft: false` kai straipsnis paruoštas publikavimui

**7. Patikrinimas**:
```bash
npm run dev   # Atidaro localhost:4321/tinklarastis/
npm run build # Pilnas build patikrinimas
```

### Automatiškai generuojama

Pridėjus naują post'ą:
- ✅ `/tinklarastis/[slug]/` — individualus puslapis
- ✅ `/tinklarastis/` — sąrašas atsinaujina automatiškai
- ✅ `/tinklarastis/zyma/[tag]/` — naujos žymos gauna savo puslapius
- ✅ `/sitemap-0.xml` — URL automatiškai įtraukiamas
- ✅ `/rss.xml` — straipsnis atsiranda feed'e
- ✅ Schema.org `BlogPosting` JSON-LD — SEO structured data

---

## SEO komponentų naudojimas

### `SEO.astro` props

| Prop | Tipas | Default | Aprašas |
|---|---|---|---|
| `title` | `string` | — | Puslapio título dalis (bus `"titulo \| siteName"`) |
| `description` | `string?` | `config.siteDescription` | Meta description |
| `image` | `string?` | `config.ogImage` | OG nuotraukos kelias (abs. arba rel.) |
| `canonical` | `string?` | auto iš `siteUrl + pathname` | Kanoninis URL |
| `type` | `'website'\|'article'` | `'website'` | OG tipo — article blog post'ams |
| `publishDate` | `string?` | — | ISO data, tik `type="article"` |
| `modifiedDate` | `string?` | — | ISO data, tik `type="article"` |
| `author` | `string?` | — | Autoriaus vardas, tik `type="article"` |
| `noindex` | `boolean?` | `false` | `true` → `noindex, nofollow` |

### `StructuredData.astro` naudojimas

```astro
---
import StructuredData from '../components/seo/StructuredData.astro';
import type { BreadcrumbListSchema } from '../lib/schema';

const breadcrumb: BreadcrumbListSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pagrindinis", item: "https://innomode.lt" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://innomode.lt/blog" },
  ],
};
---
<StructuredData schema={breadcrumb} />
```

### `BlogLayout.astro` naudojimas

```astro
---
import BlogLayout from '../../layouts/BlogLayout.astro';
---

<BlogLayout
  title="Elektrinių skydų montavimas"
  description="Kaip montuojami elektriniai skydai pramoniniuose pastatuose."
  publishDate="2024-03-15"
  modifiedDate="2024-04-01"
  author="Innomode UAB"
>
  <article>...</article>
</BlogLayout>
```

---

## `src/lib/utils.ts` funkcijos

| Funkcija | Naudojimas |
|---|---|
| `cn(...classes)` | Tailwind klasių sujungimas su sąlygomis |
| `formatDate(isoString)` | ISO data → lietuviškas formatas (`2024 m. kovo 15 d.`) |
| `slugify(text)` | Tekstas → URL slug (tvarko ą, č, ę, ė, į, š, ų, ū, ž) |
| `getCanonicalUrl(siteUrl, pathname)` | Pilnas URL canonical ir OG žymėms |

---

## SEO infrastruktūros architektūra

### Sugeneruojami failai (build metu)

| Failas | Turinys |
|---|---|
| `/sitemap-index.xml` | Sitemap indeksas, nurodo į `/sitemap-0.xml` |
| `/sitemap-0.xml` | Visi HTML puslapiai su `https://innomode.lt/...` URL |
| `/robots.txt` | `Allow: *` + sitemap nuoroda |
| `/rss.xml` | RSS feed su blog straipsniais (tuščias kol nėra postų) |

### Sitemap filtras

`astro.config.mjs` → `sitemap({ filter: (page) => !page.includes('/thank-you') })`

Naudok filtrą puslapiams, kurių nenorime indeksuoti (thank-you, admin, preview...).

### Content Layer API (Astro 6)

Astro 6 pašalino legacy Content Collections. Naujas formatas:
- Config failas: `src/content.config.ts` (NE `src/content/config.ts`)
- Reikalingas `loader` (pvz., `glob` iš `astro/loaders`)
- Blog post'ų failai: `src/content/blog/*.md` arba `*.mdx`

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({ title: z.string(), publishDate: z.date(), ... }),
});
```

---

## Kaip pridėti analytics ID's per .env failą

### Žingsnis po žingsnio

**1. Sukurk `.env` failą** projekto šaknyje (jei dar nėra):
```bash
cp .env.example .env
```

**2. Įrašyk reikiamus ID'us** (tik tuos, kuriuos naudosi):

```env
# .env

# Svetainės URL (naudojamas sitemap ir RSS)
SITE_URL=https://innomode.lt

# --- Pasirink VIENĄ iš dviejų strategijų ---

# Strategija A: GA4 + Meta Pixel tiesiogiai
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_META_PIXEL_ID=123456789012345

# Strategija B: Google Tag Manager (valdo visus tags viduje)
# Naudok šią jei nori centralizuoto tag valdymo
# SVARBU: jei nustatysi GTM_ID, GA4 ir Pixel skriptai NEBUS krauti tiesiogiai
PUBLIC_GTM_ID=GTM-XXXXXXX
```

**3. Dev server'is automatiškai nuskaito `.env`** — nereikia restart'o.

**4. Patikrink naršyklėje:**
- Atidaryti DevTools → Network → filtruoti `google-analytics`, `fbevents`, `gtm.js`
- Turėtų matyti request'us į atitinkamus endpoint'us

### Kur skaitomi ID'ai

```
.env (PUBLIC_GA_ID=G-XXX)
    ↓ import.meta.env.PUBLIC_GA_ID
src/config.ts (analyticsConfig.gaId)
    ↓ import config from '../../config'
GoogleAnalytics.astro (if gaId && !gtmId → render)
    ↓ type="text/partytown"
Partytown Web Worker (ne main thread!)
    ↓ forward: ['dataLayer.push']
Main thread dataLayer (GA4 events veikia normaliai)
```

### Kodėl Partytown?

GA4 ir Meta Pixel skriptai įprastai blokuoja main thread'ą — tai tiesiogiai kenkia:
- **INP** (Interaction to Next Paint) — puslapio reagavimo laikas
- **TBT** (Total Blocking Time) — Lighthouse metrika
- **Core Web Vitals** — Google SEO reitingo faktorius

Partytown perkelia skriptus į [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API):
- Main thread lieka laisvas vartotojo interakcijoms
- Analytics veikia fone
- `dataLayer.push` ir `fbq` API proxy'inami atgal į main thread (per `forward` konfigūraciją)

### GTM vs tiesioginiai skriptai

| | GA4 + Pixel tiesiogiai | GTM |
|---|---|---|
| **Paprastumas** | ✅ Mažiau konfigūracijos | ❌ Reikia GTM account |
| **Lankstumas** | ❌ Kiekvienam tag'ui reikia kodo | ✅ Valdai tags be programuotojo |
| **Marketing komanda** | ❌ Reikia dev pagalbos | ✅ Marketing dirba savarankiškai |
| **Dvigubas sekimas** | — | ⚠️ Gali atsitikti jei nustatysi ir GTM, ir GA4 ID |

**Rekomendacija:** Nedideliems projektams — GA4 tiesiogiai. Jei marketing komanda aktyviai dirba su events — GTM.

---

## Analytics architektūra

Analytics ID'ai laikomi `.env` faile (ne `config.ts`), nes:
- Tie patys ID'ai gali skirtis tarp `dev` ir `production` aplinkų
- `.env` niekada nekopijuojamas į git (saugesnis workflow)

`config.ts` automatiškai skaito juos per `import.meta.env.PUBLIC_*`.
`PUBLIC_` prefiksas — Astro reikalavimas: tik tokie kintamieji pasiekiami naršyklėje.

---

## Progreso žurnalas

### ✅ Žingsnis 1 — Projekto inicializacija (2026-04-28)
- `npm create astro@latest` su minimal template, TypeScript strict
- Tailwind v4 per `npx astro add tailwind` → `@tailwindcss/vite` plugin
- Sukurta `src/layouts/BaseLayout.astro` su global.css importu
- Dev serveris veikia `localhost:4321`

### ✅ Žingsnis 2 — Konfigūracijos sistema (2026-04-28)
- `src/config.ts` su `SiteConfig` TypeScript interface ir Innomode placeholder duomenimis
- `src/lib/utils.ts` su `cn()`, `formatDate()`, `slugify()`, `getCanonicalUrl()`
- `.env.example` su analytics ID placeholder'iais
- Sukurta pilna katalogų struktūra (`components/seo/`, `components/layout/`, `components/sections/`, `components/ui/`)

### ✅ Žingsnis 3 — SEO infrastruktūra (2026-04-28)
- `src/lib/schema.ts` — TypeScript tipai 5 Schema.org tipams: `LocalBusinessSchema`, `OrganizationSchema`, `ServiceSchema`, `BlogPostingSchema`, `BreadcrumbListSchema` + `SchemaOrgType` union
- `src/components/seo/SEO.astro` — visas `<head>` SEO: title, description, robots, canonical, Open Graph (6 žymės), Twitter Card (4 žymės), article meta
- `src/components/seo/StructuredData.astro` — type-safe JSON-LD renderer su unicode escaping
- `src/layouts/BaseLayout.astro` — naudoja SEO + StructuredData, automatiškai injekcija `LocalBusiness` schema, `<slot name="head">` papildomiems `<head>` elementams
- `src/layouts/BlogLayout.astro` — wraps BaseLayout, prideda `BlogPosting` schema, `type="article"` meta
- `src/components/layout/Header.astro` — placeholder (bus pakeistas žingsnyje 4)
- `src/components/layout/Footer.astro` — placeholder su kontaktais iš config

### ✅ Žingsnis 4 — SEO infrastruktūra (2026-04-28)
- `@astrojs/sitemap` → generuoja `/sitemap-index.xml` + `/sitemap-0.xml` su visais HTML puslapiais
- `@astrojs/rss` → `/rss.xml` paruoštas blog feed'ui (kol kas tuščias, užpildys Content Collections)
- `src/pages/robots.txt.ts` — dinaminis endpoint (ne static file), automatiškai naudoja `config.siteUrl`
- `src/content.config.ts` — Content Layer API schema su `glob` loader'iu (Astro 6 formatas)
- `astro.config.mjs` → `site: config.siteUrl` — būtinas sitemap ir `context.site` RSS veikimui

**Architektūrinis sprendimas:** `config.ts` importuojamas tiesiogiai iš `astro.config.mjs`.
`import.meta.env.PUBLIC_*` ten grąžina `undefined` (ne klaidą) — analytics neveikia config kontekste,
bet tai nesvarbu: mums reikia tik `siteUrl`, kuris yra hardcoded string.

### ✅ Žingsnis 5 — Blog sistema (2026-04-28)
- `@astrojs/mdx` įdiegtas ir sukonfigūruotas
- `src/content.config.ts` — Content Layer API schema su `glob` loader, `image()` tipas heroImage
- `src/content/blog/elektros-paneliu-pasirinkimas.mdx` — ~500 žodžių sample post (LT)
- `src/components/blog/BlogCard.astro` — reusable post kortelė
- `src/pages/tinklarastis/index.astro` — sąrašas su žymų filtrais, paginacija ≥10
- `src/pages/tinklarastis/[slug].astro` — post su `render()`, related posts, breadcrumb
- `src/pages/tinklarastis/puslapis/[page].astro` — paginacijos puslapiai 2+
- `src/pages/tinklarastis/zyma/[tag].astro` — postai pagal žymą su šonine navigacija
- `src/pages/rss.xml.ts` — atnaujintas su tikrais post'ais

**Build output** (7 puslapiai):
```
/                                     ← pagrindinis
/tinklarastis/                        ← sąrašas
/tinklarastis/elektros-paneliu-pasirinkimas/  ← post
/tinklarastis/zyma/elektros-skydai/
/tinklarastis/zyma/montavimas/
/tinklarastis/zyma/patarimai/
/tinklarastis/zyma/pramone/           ← pramonė → slugify → pramone
```

**Architektūrinis pastabas:**
- `PAGE_SIZE` turi būti `getStaticPaths` viduje (ne išorėje) — Astro vykdo jį atskirame kontekste
- Related posts: filtruoja pagal bendrų žymų skaičių → fallback į naujausius
- Žymos URL: `slugify(tag)` — tvarko lietuviškas raides (pramonė → pramone)

### ✅ Žingsnis 6 — Analytics su Partytown (2026-04-28)
- `@astrojs/partytown` — perkelia analytics skriptus į Web Worker (gerina INP, TBT)
- `src/components/analytics/GoogleAnalytics.astro` — GA4, conditional, nenaudojama jei GTM aktyvus
- `src/components/analytics/MetaPixel.astro` — Meta Pixel su noscript fallback, conditional
- `src/components/analytics/GoogleTagManager.astro` — GTM head skriptas, conditional
- `BaseLayout.astro` atnaujintas: visi trys komponentai `<head>`; GTM noscript `<body>` pradžioje
- Partytown `forward: ['dataLayer.push', 'fbq']` — proxy'ina API į main thread
- **Tikrinimas:** be `.env` ID'ų — analytics skriptai visiškai nerender'inami (nulis HTTP request'ų)

### ✅ Žingsnis 7 — UI komponentų biblioteka (2026-04-28)
- `src/config/navigation.ts` — navigacijos struktūra (`mainNav`, `footerNav`)
- `src/components/ui/Container.astro` — max-width wrapper, `as` prop HTML elementui
- `src/components/ui/Button.astro` — 4 variantai × 3 dydžiai, auto `<a>`/`<button>`
- `src/components/ui/Image.astro` — `<Picture>` wrapper su AVIF+WebP, lazy, async
- `src/components/layout/Header.astro` — sticky, active links, vanilla JS mobile menu + ESC/outside-click/resize
- `src/components/layout/Footer.astro` — kontaktai iš config, socialiniai tinklai, footer nav stulpeliai
- `src/components/sections/Hero.astro` — `split`/`centered` variantai, named slots (eyebrow/cta/image/extras/background)
- `src/components/sections/CTASection.astro` — `dark`/`light`/`brand` fonas, named slots
- `src/pages/index.astro` — atnaujintas su Hero + CTASection

### ✅ Žingsnis 8 — Landing page sekcijos + Netlify (2026-04-28)
- `src/components/sections/FeaturesSection.astro` — universali paslaugų kortelių grotelė
  - Props: `headline`, `subheadline`, `features[]`, `columns` (2/3/4), `background` (white/light/dark)
  - Kortelės su inline SVG ikonėlėmis; su `href` — clickable nuoroda, be — statinis blokas
  - Named slot po kortelėmis (pvz. "Visos paslaugos" mygtukas)
- `src/components/sections/ContactForm.astro` — Netlify Forms kontaktų forma
  - `data-netlify="true"` + `form-name` paslėptas laukas (Netlify aptikimui)
  - Honeypot anti-spam: `netlify-honeypot="bot-field"` (be CAPTCHA)
  - Kairė: kontaktų info iš `config.ts`; dešinė: forma su vardas/el.paštas/telefonas/žinutė
  - `action="/aciu"` → redirect po sėkmingo submit'o
- `src/pages/aciu.astro` — "Ačiū" puslapis po formos (noindex)
- `src/pages/404.astro` — 404 klaidos puslapis (noindex)
- `netlify.toml` — build komanda, Node 20, saugumo antraštės, cache antraštės, 301 redirectai
- `src/pages/index.astro` — atnaujintas su FeaturesSection (6 paslaugos) + ContactForm

**Build output** (9 puslapių):
```
/                        ← su FeaturesSection + ContactForm
/aciu/                   ← thank-you puslapis
/404.html                ← klaidos puslapis
/tinklarastis/           ← blog sąrašas
/tinklarastis/[slug]/    ← blog post
/tinklarastis/zyma/*/    ← 4 žymų puslapiai
```

### ✅ Žingsnis 9 — Kontaktų forma + puslapis (2026-04-28)
- `src/components/forms/ContactForm.astro` — savarankiškas Netlify Forms komponentas
  - `name="contact"` + `data-netlify="true"` + `data-netlify-honeypot="bot-field"`
  - `<input name="bot-field" hidden>` — honeypot (ne CSS paslėptas, o HTML `hidden`)
  - `<input type="hidden" name="form-name" value="contact">` — Netlify reikalavimas
  - Laukai: vardas (required, minlength=2), email (required), telefonas (optional), žinutė (required, minlength=10)
  - `novalidate` + vanilla JS: lietuviški klaidos pranešimai per `setCustomValidity()`
  - Loading state: spinner + "Siunčiama..." po sėkmingos validacijos
  - `define:vars={{ formId }}` — unikalus ID leidžia kelis egzempliorius viename puslapyje
- `src/pages/kontaktai.astro` — kontaktų puslapis
  - Breadcrumb navigacija
  - 2 stulpeliai (lg): kairė = įmonės info (el. paštas, tel., adresas, darbo laikas, socialiniai) + dešinė = forma
  - Google Maps placeholder su instrukcija (pakeičiama nustatant `MAPS_EMBED_URL` failo viršuje)
- `src/pages/aciu.astro` — thank-you puslapis po formos (noindex, su sėkmės ikona)
- **Build output:** 10 puslapių (pridėta `/kontaktai/`)

### ✅ Žingsnis 10 — Innomode puslapių struktūra (2026-04-29)
- `src/pages/index.astro` — pilnas pagrindinis puslapis:
  - Hero → Skaičiai (4 statistikos) → „Kodėl mes" (FeaturesSection, 4 USP) → Paslaugų peržiūra (3 kortelės) → CTA → Atsiliepimai (3 placeholder) → Blog peržiūra (3 paskutiniai postai)
  - Blog preview: `getCollection('blog')` → sort pubDate desc → slice(0,3) → `<BlogCard>`
- `src/pages/apie-mus.astro` — įmonės pristatymas, statistikos, vertybės, komandos placeholder, CTA
- `src/pages/paslaugos/index.astro` — visų paslaugų grotelė + „Kaip dirbame" proceso žingsniai (5 etapai)
- `src/pages/paslaugos/elektros-paneliu-statymas.astro` — pilnas paslaugos puslapis:
  - Service + BreadcrumbList JSON-LD per `<Fragment slot="head">`
  - Skydų tipai, kokybės kontrolės sąrašas, techninės specifikacijos kortelė
- `src/pages/darbai.astro` — 8 placeholder projektų grotelė su vanilla JS filtro mygtukais
- `src/config/navigation.ts` — atnaujinta: `/projektai` → `/darbai`, pridėta `/apie-mus`
- **Pataisyta** `aciu.astro` ir `404.astro`: `robots="noindex"` → `noindex={true}` (BaseLayout `robots` prop ignoruotas)
- **Build output:** 14 puslapių

**Architektūrinė pastaba — kodėl server-rendered forma veikia su Netlify:**
Astro SSG generuoja statinį HTML kiekvienam puslapiui build metu.
Netlify nuskaito šį statinį HTML deploy metu ir aptinka formas su `data-netlify="true"`.
JS (loading state, validacija) yra **progresyvus pagerinimas** — forma veikia ir be JS.

---

## Netlify Forms

### Kaip veikia (nereikia backend'o)

Netlify automatiškai aptinka formas su `data-netlify="true"` per **deploy** metu (ne dev metu).
Forma turi būti **server-rendered HTML** — Astro SSG tai garantuoja automatiškai.

Minimalus HTML:
```html
<form
  name="contact"
  method="POST"
  data-netlify="true"
  data-netlify-honeypot="bot-field"
  action="/aciu"
>
  <input type="hidden" name="form-name" value="contact" />
  <input name="bot-field" hidden />
  <!-- laukai -->
</form>
```

**Svarbios detalės:**
- `name` ant `<form>` ir `value` ant `<input type="hidden" name="form-name">` turi **sutapti**
- `method="POST"` — Netlify tik POST formas priima
- `data-netlify-honeypot="bot-field"` + `<input name="bot-field" hidden>` — anti-spam be CAPTCHA
- Forma NEVEIKIA lokaliai (`npm run dev`) — veikia tik po deploy ant Netlify

### Kur rasti gautas žinutes (submissions)

```
Netlify Dashboard
  → Sites → [jūsų svetainė]
  → Forms
  → "contact" (arba kitas formos name)
  → [submissions sąrašas]
```

### Įjungti el. pašto pranešimus

Kai gaunama nauja žinutė, Netlify gali siųsti el. laišką automatiškai:

```
Netlify Dashboard
  → Sites → [svetainė]
  → Forms → Notifications
  → "Add notification" → Email notification
  → Įrašyti el. pašto adresą → Save
```

Galima nustatyti kelis gavėjus (kelis notification rules).

### Įjungti reCAPTCHA (jei reikia)

Netlify turi integruotą reCAPTCHA v2 — aktyvuojama be kodo pakeitimų:

```
Netlify Dashboard
  → Sites → [svetainė]
  → Forms → [forma]
  → Spam filters
  → Enable spam filtering → reCAPTCHA v2
```

Arba kode pridėk `data-netlify-recaptcha="true"` ant formos ir placeholder elementą:
```html
<form data-netlify="true" data-netlify-recaptcha="true" ...>
  <!-- ... laukai ... -->
  <div data-netlify-recaptcha="true"></div>
  <button type="submit">Siųsti</button>
</form>
```
Netlify automatiškai injektuoja reCAPTCHA widget'ą į tą `<div>`.

### Kelios formos tame pačiame projekte

Kiekviena forma turi unikalų `name`. Šiame projekte:

| Forma | `name` | Puslapis |
|---|---|---|
| Kontaktų forma | `contact` | `/kontaktai` |
| Sekcijų forma | `kontaktai` | `/` (pagrindinis) |

Papildomai (pvz. newsletter): pakeisk `name` ir `form-name` value į `newsletter`.

### Testavimas lokaliai

Netlify Forms neveikia `npm run dev` metu. Testavimo galimybės:
1. **Deploy preview** — push į branch → Netlify sukuria preview URL → testuok ten
2. **Netlify CLI** — `npx netlify dev` (emuliuoja Netlify aplinką lokaliai, reikia Netlify CLI ir `netlify.toml`)
3. **Formspree** arba **Basin** — alternativos testavimui dev aplinkoje (nereikia deploy)

---

## Sekcijų komponentai — naudojimas

### `FeaturesSection.astro`

```astro
---
const features = [
  {
    icon: `<svg ...>...</svg>`,  // inline SVG eilutė
    title: 'Paslaugos pavadinimas',
    description: 'Trumpas aprašymas ~1-2 sakiniai.',
    href: '/paslaugos/montavimas',  // opcionalus — kortelė tampa nuoroda
  },
];
---
<FeaturesSection
  headline="Mūsų paslaugos"
  subheadline="Papildomas aprašymas"
  features={features}
  columns={3}
  background="light"
>
  <!-- Slot po kortelėmis -->
  <div class="mt-10 text-center">
    <Button variant="outline" href="/paslaugos">Visos paslaugos</Button>
  </div>
</FeaturesSection>
```

### `ContactForm.astro`

```astro
<ContactForm
  headline="Susisiekite su mumis"
  description="Papasakokite apie savo projektą."
  formName="kontaktai"
  successUrl="/aciu"
  background="white"
/>
```

Kontaktų info (el. paštas, tel., adresas) automatiškai iš `config.ts`.

---

## Kaip pridėti naują paslaugos puslapį

### Žingsnis po žingsnio

**1. Sukurk failą** `src/pages/paslaugos/[slug].astro`

Failo pavadinimas tampa URL slug'u — naudok `kebab-case`:
```
src/pages/paslaugos/montavimas.astro   →   /paslaugos/montavimas/
src/pages/paslaugos/prieziura.astro    →   /paslaugos/prieziura/
```

**2. Pridėk Service schema** (SEO):

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import StructuredData from '../../components/seo/StructuredData.astro';
import CTASection from '../../components/sections/CTASection.astro';
import Breadcrumbs from '../../components/ui/Breadcrumbs.astro';
import config from '../../config';
import type { ServiceSchema } from '../../lib/schema';

const serviceSchema: ServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Elektros skydų montavimas",
  description: "Profesionalus elektros skydų montavimas ir paleidimas objekte.",
  provider: {
    "@type": "Organization",
    name: config.companyName,
    url: config.siteUrl,
  },
  areaServed: ["Vilnius", "Kaunas", "Lietuva"],
  serviceType: "Elektros skydų montavimas",
  url: `${config.siteUrl}/paslaugos/montavimas`,
};
---
```

**3. Perduok Service schema per `<Fragment slot="head">` ir naudok `<Breadcrumbs>`:**

```astro
<BaseLayout title="Montavimas" description="...">
  <Fragment slot="head">
    <StructuredData schema={serviceSchema} />
  </Fragment>

  <section class="bg-gray-50 border-b border-gray-100 py-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Pagrindinis', href: '/' },
          { label: 'Paslaugos', href: '/paslaugos' },
          { label: 'Montavimas', href: '/paslaugos/montavimas' },
        ]}
        class="mb-4"
      />
      <!-- h1, aprašymas... -->
    </div>
  </section>

  <!-- Puslapio turinys -->
</BaseLayout>
```

`<Breadcrumbs>` automatiškai generuoja `BreadcrumbList` JSON-LD — atskirai `BreadcrumbListSchema` **nereikia**.

**4. Pridėk nuorodą paslaugų sąraše:**
- `src/pages/paslaugos/index.astro` — `services` masyve pridėk naują įrašą su `href: '/paslaugos/montavimas'`
- `src/config/navigation.ts` — `footerNav` Paslaugų stulpelyje pridėk nuorodą

**5. ServiceSchema laukų reikšmės:**

| Laukas | Tipas | Aprašas |
|---|---|---|
| `name` | `string` | Paslaugos pavadinimas (rodoma Google) |
| `description` | `string` | Trumpas aprašas (1-2 sakiniai) |
| `provider.name` | `string` | Įmonės pavadinimas iš `config.companyName` |
| `areaServed` | `string[]` | Aptarnaujami miestai/regionai |
| `serviceType` | `string` | Paslaugos kategorija (laisva forma) |
| `url` | `string` | Kanoninė URL — `config.siteUrl + pathname` |

**6. Patikrinimas:**
```bash
npm run build   # Turi sugeneruoti /paslaugos/[slug]/index.html
```
Google Rich Results Test: `https://search.google.com/test/rich-results`

---

## Puslapių struktūra (Innomode)

| URL | Failas | Aprašas |
|---|---|---|
| `/` | `src/pages/index.astro` | Pagrindinis — Hero, USP, paslaugos, atsiliepimai, blog |
| `/apie-mus` | `src/pages/apie-mus.astro` | Apie įmonę, istorija, komanda |
| `/paslaugos` | `src/pages/paslaugos/index.astro` | Visos paslaugos + proceso žingsniai |
| `/paslaugos/elektros-paneliu-statymas` | `src/pages/paslaugos/elektros-paneliu-statymas.astro` | Paslaugos puslapis su Service schema |
| `/darbai` | `src/pages/darbai.astro` | Atliktų darbų galerija su filtravimo JS |
| `/kontaktai` | `src/pages/kontaktai.astro` | Kontaktai + Netlify Forms + Google Maps |
| `/tinklarastis` | `src/pages/tinklarastis/index.astro` | Blog sąrašas su žymų filtrais |
| `/aciu` | `src/pages/aciu.astro` | Thank-you po formos (noindex) |
| `/404` | `src/pages/404.astro` | 404 klaidos puslapis (noindex) |
| `/500` | `src/pages/500.astro` | 500 serverio klaidos puslapis (noindex) |

---

## Konvencijos

- **Kalbos:** Komponentų vardai angliškai, komentarai lietuviškai
- **Failų pavadinimai:** `PascalCase.astro` komponentams, `kebab-case.ts` utility
- **Importai:** Reliatyvūs keliai (tvarkysime path alias'us vėliau jei reikės)
- **Tailwind:** Utility klasės `.astro` failuose, `@apply` tik išimtiniais atvejais
- **TypeScript:** `strict` režimas, Props tipai visada `interface Props {}`
- **Analytics:** ID'ai tik `.env` faile, niekada hardcode'ti `config.ts` ar komponentuose

---

## Common tasks

### Dev serverio paleidimas
```bash
npm run dev        # localhost:4321
npm run build      # produkcinis build → dist/
npm run preview    # peržiūra po build
```

### Įmonės informacijos pakeitimas
Redaguok tik `src/config.ts` — pakeisk `siteName`, `companyEmail`, `companyPhone`, `companyAddress`, `socialLinks`.
Viskas kita atsinaujina automatiškai.

### Navigacijos pakeitimas
Redaguok `src/config/navigation.ts` — `mainNav` (Header) ir `footerNav` (Footer) masyvas.

### Naujo blog post'o pridėjimas
Sukurk `src/content/blog/mano-post.mdx` su frontmatter (žr. "Kaip pridėti naują blog post'ą").

### Naujo paslaugos puslapio pridėjimas
1. Sukurk `src/pages/paslaugos/[slug].astro` (žr. "Kaip pridėti naują paslaugos puslapį")
2. Pridėk į `src/pages/paslaugos/index.astro` → `services` masyvą
3. Pridėk į `src/config/navigation.ts` → `footerNav` Paslaugų stulpelį

### Breadcrumb navigacijos pridėjimas
```astro
import Breadcrumbs from '../components/ui/Breadcrumbs.astro';

<Breadcrumbs
  items={[
    { label: 'Pagrindinis', href: '/' },
    { label: 'Puslapis', href: '/puslapis' },
    { label: 'Dabartinis puslapis', href: '/puslapis/dabartinis' },
  ]}
  class="mb-6"
/>
```
Paskutinis elementas automatiškai non-clickable (current page). BreadcrumbList JSON-LD generuojamas automatiškai.

### Brand spalvos keitimas
`src/styles/global.css` → `@theme { --color-brand: oklch(...); }` — Tailwind klasės `text-brand`, `bg-brand` atsinaujins visur.

### Google Maps įjungimas kontaktų puslapyje
`src/pages/kontaktai.astro` → rask `const MAPS_EMBED_URL = ''` failo viršuje → įrašyk Google Maps embed URL.

### Analytics įjungimas
`.env` faile nustatyk `PUBLIC_GA_ID` arba `PUBLIC_GTM_ID` (žr. "Analytics" sekciją).

### Netlify Forms email pranešimų įjungimas
Netlify dashboard → **Forms** → forma → **Form notifications** → **Add notification** → **Email**.
