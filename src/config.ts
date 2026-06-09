// Projekto konfigūracijos failas — čia keičiama pagrindinė svetainės info.
// Analytics ID'us dėk į .env (žr. .env.example).

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
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

// Analytics ID'ai iš .env
const analyticsConfig: AnalyticsConfig = {
  gaId: import.meta.env.PUBLIC_GA_ID,
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID,
  gtmId: import.meta.env.PUBLIC_GTM_ID,
};

const config: SiteConfig = {
  siteName: "AutoBid",
  siteUrl: "https://autobid.lt",
  siteDescription:
    "AutoBid — visų Lietuvos ir Europos automobilių aukcionų duomenys viename ekrane. Sutaupyk laiką, rask geriausias kainas.",

  companyName: "AutoBid UAB",
  companyEmail: "info@autobid.lt",
  companyPhone: "+370 600 00000",
  companyAddress: "Vilnius, Lietuva",

  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },

  analyticsConfig,

  defaultLocale: "lt",
  supportedLocales: ["lt"],

  ogImage: "/images/og-default.jpg",
};

export default config;
