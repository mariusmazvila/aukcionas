// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// config.ts importuojamas čia TIK siteUrl gauti.
// Pastaba: import.meta.env.PUBLIC_* kintamieji ŠI faile bus undefined —
// tai normalu, nes Vite dotenv krauna PO astro.config.mjs įvertinimo.
// Analytics konfigūracija veikia teisingai runtime metu (puslapio komponentuose).
import config from './src/config.ts';

import mdx from '@astrojs/mdx';

import partytown from '@astrojs/partytown';

export default defineConfig({
  // site būtinas sitemap generavimui ir context.site RSS endpoint'e
  site: config.siteUrl,

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      // Neįtraukti puslapių su noindex (thank-you, admin ir pan.)
      filter: (page) => !page.includes('/thank-you'),
    }),
    mdx(),
    partytown({
      config: {
        // forward: funkcijos, kurias Partytown proxy'ina iš worker'io į main thread'ą.
        // Be šio sąrašo GA4/GTM/Pixel skriptai veiktų worker'yje,
        // bet jų API nebūtų pasiekiama main thread'e (pvz., custom events).
        forward: ['dataLayer.push', 'fbq'],
      },
    }),
  ],
});