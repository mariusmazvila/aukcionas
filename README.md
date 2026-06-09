# Astro Landing Starter

Reusable boilerplate for Lithuanian client landing pages built with Astro 6 + Tailwind CSS v4.

**Current client:** Innomode (electrical panels, Lithuania)

## Stack

- **Astro 6** — SSG, generates static HTML
- **Tailwind CSS v4** — `@tailwindcss/vite` plugin, no `tailwind.config.js`
- **TypeScript** — strict mode
- **Netlify** — hosting, Forms (no backend needed), CDN

---

## Quick start

```bash
git clone <repo-url> my-project
cd my-project
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

---

## New client setup

Three files to change:

### 1. `src/config.ts`

```ts
const config: SiteConfig = {
  siteName: "Client Name",
  siteUrl: "https://client.lt",
  siteDescription: "...",
  companyName: "Client UAB",
  companyEmail: "info@client.lt",
  companyPhone: "+370 ...",
  companyAddress: "..., Lietuva",
  socialLinks: {
    facebook: "https://facebook.com/...",
    instagram: "",
    linkedin: "",
  },
  // analyticsConfig — from .env automatically
};
```

### 2. `.env`

```env
SITE_URL=https://client.lt

# Pick one analytics strategy:
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_META_PIXEL_ID=123456789012345
# OR (Google Tag Manager — manages all tags):
# PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 3. `public/images/og-default.jpg`

Replace with the client's OG image (1200×630 px).

### 4. Navigation

Edit `src/config/navigation.ts` — Header and Footer update automatically.

### 5. Content pages

Pages are in `src/pages/`. All text is Lithuanian by default; update for the client's language/content.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `SITE_URL` | No | Overrides `config.siteUrl` for sitemap/RSS |
| `PUBLIC_GA_ID` | No | Google Analytics 4 Measurement ID (`G-...`) |
| `PUBLIC_META_PIXEL_ID` | No | Meta Pixel ID |
| `PUBLIC_GTM_ID` | No | Google Tag Manager ID (`GTM-...`). If set, GA4 and Pixel scripts are NOT loaded directly — manage them inside GTM |

`PUBLIC_` prefix is required by Astro for variables accessible in the browser.

---

## Netlify deploy

### First deploy

1. Push the repo to GitHub/GitLab.
2. Go to [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Select the repo. Build settings are pre-configured in `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Under **Site configuration → Environment variables**, add your `.env` values.
5. Click **Deploy site**.

### Custom domain

Netlify dashboard → **Domain management** → **Add a domain** → follow DNS instructions.

### Netlify Forms — contact form

Forms are detected automatically at deploy time (Astro generates static HTML with `data-netlify="true"`).

**After first deploy:**
1. Netlify dashboard → **Forms** — you'll see the `kontaktai` form.
2. To get email notifications: **Forms** → **kontaktai** → **Form notifications** → **Add notification** → **Email**.

The form does **not** work on `npm run dev` — only after deploying to Netlify (or `netlify dev` with Netlify CLI).

### 500 error page

`500.astro` generates `/500/index.html`. To use it as a custom 5xx page on Netlify Pro/Enterprise, add to `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/500"
  status = 500
  conditions = {Status = ["5xx"]}
```

---

## Adding content

### New blog post

Create `src/content/blog/my-post-title.mdx`:

```mdx
---
title: "Post title"
description: "Meta description."
pubDate: 2024-05-01
author: "Company Name"
tags: ["tag1", "tag2"]
draft: false
---

Content here...
```

The post is automatically added to `/tinklarastis/`, `/rss.xml`, and sitemap.

### New service page

1. Create `src/pages/paslaugos/my-service.astro`.
2. Copy `elektros-paneliu-statymas.astro` as a template.
3. Add `ServiceSchema` structured data in the frontmatter.
4. Add the page to `footerNav` in `src/config/navigation.ts`.

---

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview built site locally |
| `npm run astro check` | TypeScript type-check |
