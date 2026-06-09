# AutoBid — automobilių aukcionų stebėjimo sistema

## Projekto tikslas

**autobid.lt** — SaaS produktas, leidžiantis automobilių pardavėjams ir pirkėjams stebėti kelis aukcionus vienu metu. Realaus laiko duomenys, kainų įspėjimai, palyginimas ir eksportas.

---

## Stack

| Technologija | Versija | Pastaba |
|---|---|---|
| Astro | ^6.x | SSG/SSR framework |
| Tailwind CSS | ^4.x | Stiliai per `@tailwindcss/vite` (ne PostCSS!) |
| TypeScript | strict | Visi failai `.ts` / `.astro` |
| @astrojs/sitemap | ^3.x | Automatinis sitemap |
| @astrojs/partytown | — | GA4 + Meta Pixel be main thread blokavimo |
| Supabase | — | Auth + duomenų bazė (TODO: prijungti) |

**Svarbu apie Tailwind v4:** Nėra `tailwind.config.js`. Tema konfigūruojama
`src/styles/global.css` faile su CSS kintamaisiais (`@theme { --color-brand: ... }`).

---

## Katalogų struktūra

```
src/
  config.ts              # Svetainės konfigūracija (siteName, siteUrl, email...)
  components/
    analytics/           # GoogleAnalytics, MetaPixel, GoogleTagManager
    layout/              # Header, Footer
    sections/            # Hero, FeaturesSection, CTASection
    ui/                  # Button, Container, Image, Breadcrumbs
    seo/                 # SEO, StructuredData
  layouts/
    BaseLayout.astro     # Pagrindinis layout su SEO + analytics
  pages/
    index.astro          # Landing page
    kaip-veikia.astro    # Kaip veikia puslapis
    kainodara.astro      # Kainodara
    prisijungti.astro    # Login (TODO: Supabase)
    registracija.astro   # Register (TODO: Supabase)
    404.astro            # 404 puslapis
    500.astro            # 500 puslapis
    robots.txt.ts        # Dinaminis robots.txt
  config/
    navigation.ts        # mainNav + footerNav
  lib/
    utils.ts             # cn(), formatDate(), slugify(), getCanonicalUrl()
    schema.ts            # TypeScript tipai Schema.org JSON-LD
  styles/
    global.css           # Tailwind importas + @theme kintamieji
public/
  images/                # og-default.jpg ir kiti statiniai paveikslai
  favicon.svg
.env                     # Analytics ID'ai (nėra git'e!)
.env.example             # Šablonas .env failui
```

---

## Puslapių struktūra

| URL | Failas | Aprašas |
|---|---|---|
| `/` | `src/pages/index.astro` | Landing page — hero, privalumai, kainos preview, CTA |
| `/kaip-veikia` | `src/pages/kaip-veikia.astro` | Detalus veikimo aprašymas |
| `/kainodara` | `src/pages/kainodara.astro` | Planai ir DUK |
| `/prisijungti` | `src/pages/prisijungti.astro` | Login forma (TODO: Supabase) |
| `/registracija` | `src/pages/registracija.astro` | Registracijos forma (TODO: Supabase) |
| `/404` | `src/pages/404.astro` | 404 klaidos puslapis |
| `/500` | `src/pages/500.astro` | 500 serverio klaidos puslapis |

---

## `src/config.ts` struktūra

```typescript
const config: SiteConfig = {
  siteName: "AutoBid",
  siteUrl: "https://autobid.lt",
  siteDescription: "...",
  companyName: "AutoBid UAB",
  companyEmail: "info@autobid.lt",
  ...
};
```

---

## Navigacijos konfigūracija

Redaguok `src/config/navigation.ts` — Header ir Footer automatiškai atsinaujins:

```typescript
export const mainNav: NavItem[] = [
  { label: 'Kaip veikia', href: '/kaip-veikia' },
  { label: 'Kainodara', href: '/kainodara' },
  { label: 'Prisijungti', href: '/prisijungti' },
];
```

---

## Komponentų biblioteka

### UI komponentai (`src/components/ui/`)

#### `Button.astro`
```astro
<Button variant="primary" size="lg" href="/registracija">Registruotis</Button>
<Button variant="outline" size="md" href="/kainodara">Kainodara</Button>
<Button variant="ghost" size="sm" href="https://..." external>Išorinis</Button>
<Button variant="secondary" type="submit">Siųsti</Button>
```
Variantai: `primary` | `secondary` | `outline` | `ghost`
Dydžiai: `sm` | `md` | `lg`

#### `Container.astro`
```astro
<Container>turinys</Container>
<Container as="section" class="py-16">sekcija</Container>
```

### Sekcijų komponentai (`src/components/sections/`)

#### `Hero.astro`
```astro
<Hero
  headline="Visi aukcionai. Viename ekrane."
  subheadline="..."
  primaryCta={{ text: 'Pradėti', href: '/registracija' }}
  secondaryCta={{ text: 'Kaip veikia', href: '/kaip-veikia' }}
  variant="centered"
/>
```

#### `FeaturesSection.astro`
```astro
<FeaturesSection
  headline="Pagrindiniai privalumai"
  features={[{ icon: `<svg>...`, title: '...', description: '...' }]}
  columns={3}
  background="white"
/>
```

#### `CTASection.astro`
```astro
<CTASection
  headline="Pradėk šiandien"
  primaryCta={{ text: 'Registruotis', href: '/registracija' }}
  background="dark"
/>
```

---

## SEO infrastruktūra

| Failas | Turinys |
|---|---|
| `/sitemap-index.xml` | Sitemap indeksas |
| `/sitemap-0.xml` | Visi HTML puslapiai |
| `/robots.txt` | Allow: * + sitemap nuoroda |

### `BaseLayout.astro` — Organization schema

Kiekviename puslapyje automatiškai injekcija `Organization` JSON-LD (ne `LocalBusiness` — autobid.lt yra SaaS, ne fizinė parduotuvė).

---

## Analytics

Analytics ID'ai laikomi `.env` faile:

```env
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_META_PIXEL_ID=123456789
PUBLIC_GTM_ID=GTM-XXXXXXX
```

`config.ts` automatiškai skaito per `import.meta.env.PUBLIC_*`.
Partytown perkelia skriptus į Web Worker (gerina INP, TBT).

---

## TODO: Supabase integracija

- [ ] Įdiegti `@supabase/supabase-js` ir `@supabase/ssr`
- [ ] Sukurti `src/lib/supabase.ts` — klientas
- [ ] Prijungti `prisijungti.astro` formą prie Supabase Auth
- [ ] Prijungti `registracija.astro` formą prie Supabase Auth
- [ ] Sukurti `src/middleware.ts` — apsaugoti `/dashboard` puslapius
- [ ] Sukurti `/dashboard` puslapį su pagrindine UI

---

## Common tasks

### Dev serverio paleidimas
```bash
npm run dev        # localhost:4321
npm run build      # produkcinis build → dist/
npm run preview    # peržiūra po build
```

### Brand spalvos keitimas
`src/styles/global.css` → `@theme { --color-brand: oklch(...); }` — Tailwind klasės `text-brand`, `bg-brand` atsinaujins visur.

### Analytics įjungimas
`.env` faile nustatyk `PUBLIC_GA_ID` arba `PUBLIC_GTM_ID`.

### Naujo puslapio pridėjimas
1. Sukurk `src/pages/[slug].astro`
2. Importuok `BaseLayout` ir naudok kaip wrapper
3. Pridėk nuorodą `src/config/navigation.ts` jei reikia

---

## Progreso žurnalas

### ✅ Pradinis setup (boilerplate iš Innomode projekto, 2026-06-09)
- Astro 6 + Tailwind v4 + TypeScript strict
- SEO infrastruktūra (SEO.astro, StructuredData.astro, sitemap, robots.txt)
- Analytics su Partytown (GA4, Meta Pixel, GTM)
- UI komponentų biblioteka (Button, Container, Image, Breadcrumbs)
- Layout komponentai (Header, Footer) su vanilla JS mobile menu
- Sekcijų komponentai (Hero, FeaturesSection, CTASection)

### ✅ Konvertavimas į autobid.lt (2026-06-09)
- Pašalinta visa Innomode specifika (paslaugos, darbai, kontaktai, blog)
- Pašalinta Netlify Forms integracija ir netlify.toml
- Atnaujinta `src/config.ts` → autobid.lt
- Pakeista Organization schema vietoje LocalBusiness
- Nauja navigacija: Kaip veikia / Kainodara / Prisijungti
- Landing page `index.astro`: Hero → aukcionų šaltiniai → 6 privalumai → 3 žingsniai → kainų preview → CTA
- Sukurti puslapiai: `kaip-veikia`, `kainodara`, `prisijungti`, `registracija`

### 🔜 Sekantys žingsniai
- Vizualinio dizaino tobulinimas (stiliai, spalvų schema, tipografija)
- Supabase Auth integracija (login + register)
- Dashboard UI po prisijungimo
