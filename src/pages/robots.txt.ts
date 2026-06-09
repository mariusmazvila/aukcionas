// Dinaminis robots.txt — automatiškai naudoja siteUrl iš config.ts
// Pranašumas prieš public/robots.txt: sitemap URL visada teisingas, nereikia rankiniu būdu keisti
import type { APIRoute } from 'astro';
import config from '../config';

export const GET: APIRoute = () => {
  const content = [
    'User-agent: *',
    'Allow: /',
    '',
    // @astrojs/sitemap generuoja sitemap-index.xml (ne sitemap.xml)
    `Sitemap: ${config.siteUrl}/sitemap-index.xml`,
  ].join('\n');

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
