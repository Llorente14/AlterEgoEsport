import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getCategories, getProducts } from '../lib/catalog';
import { NEWS_CATEGORIES } from '../lib/news';
import { STATIC_PUBLIC_PATHS, sitemapXml } from '../lib/seo';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const articles = await getCollection('news');
  const paths = [
    ...STATIC_PUBLIC_PATHS,
    ...getCategories().map((c) => `/store/kategori/${c.category}`),
    ...getProducts().map((p) => `/store/${p.slug}`),
    ...NEWS_CATEGORIES.map((c) => `/news/kategori/${c.toLowerCase()}`),
    ...articles.map((a) => `/news/${a.id}`),
  ];
  return new Response(sitemapXml(String(site ?? 'http://localhost'), paths), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
