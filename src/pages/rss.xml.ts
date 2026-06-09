// RSS feed — automatiškai generuojamas iš Content Collections blog įrašų.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import config from '../config';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('blog');

  const posts = allPosts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${config.siteName} | Tinklaraštis`,
    description: config.siteDescription,
    site: context.site ?? config.siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/tinklarastis/${post.id}/`,
    })),
    customData: [
      `<language>${config.defaultLocale}</language>`,
      `<copyright>© ${new Date().getFullYear()} ${config.companyName}</copyright>`,
    ].join('\n'),
    stylesheet: false,
  });
}
