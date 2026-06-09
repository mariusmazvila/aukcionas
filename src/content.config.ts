import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  // schema kaip funkcija — būtina heroImage image() tipui
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // z.coerce.date() — priima tiek string "2024-03-15", tiek Date objektą iš YAML
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // image() — Astro validuoja, kad failas egzistuoja, ir grąžina ImageMetadata
      heroImage: image().optional(),
      // default čia yra fallback; geriau nurodyti autoriaus vardą frontmatter'yje
      author: z.string().default('Innomode UAB'),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
