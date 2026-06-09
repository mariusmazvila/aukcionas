// Klientų konfigūracijos failas — keičiant klientą, redaguok TIK ŠĮ failą.
// Tikrus analytics ID'us dėk į .env (žr. .env.example).

// --- Tipų apibrėžimai ---

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export interface AnalyticsConfig {
  gaId?: string;        // Google Analytics 4 Measurement ID (G-XXXXXXXXXX)
  metaPixelId?: string; // Meta (Facebook) Pixel ID
  gtmId?: string;       // Google Tag Manager Container ID (GTM-XXXXXXX)
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  socialLinks: SocialLinks;
  analyticsConfig: AnalyticsConfig;
  defaultLocale: string;
  supportedLocales: string[];
  ogImage: string;
}

// --- Analytics ID'ai iš .env ---
// PUBLIC_ prefiksas — Astro taisyklė: tik PUBLIC_ kintamieji pasiekiami naršyklėje.
// Jei kintamasis nenustatytas, analytics tiesiog neįkeliamas (nėra klaidos).
const analyticsConfig: AnalyticsConfig = {
  gaId: import.meta.env.PUBLIC_GA_ID,
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID,
  gtmId: import.meta.env.PUBLIC_GTM_ID,
};

// --- Innomode konfigūracija (placeholder'iai — tikrus duomenis įrašyk čia) ---
const config: SiteConfig = {
  siteName: "Innomode",
  siteUrl: "https://innomode.lt",
  siteDescription:
    "Profesionalūs elektrinių skydų sprendimai pramonei ir statybai Lietuvoje. Kokybė, patikimumas, greitis.",

  companyName: "Innomode UAB",
  companyEmail: "info@innomode.lt",
  companyPhone: "+370 600 00000",
  companyAddress: "Gedimino pr. 1, Vilnius, Lietuva",

  socialLinks: {
    facebook: "https://facebook.com/innomode",
    instagram: "",
    linkedin: "",
  },

  analyticsConfig,

  defaultLocale: "lt",
  supportedLocales: ["lt"],

  ogImage: "/images/og-default.jpg",
};

export default config;
