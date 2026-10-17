import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { NEWS_CATEGORIES } from './lib/news';

/**
 * News articles: one Markdown file per article in src/content/news.
 * Adding a file adds an article; the file name becomes the URL slug.
 */
const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      date: z.coerce.date(),
      category: z.enum(NEWS_CATEGORIES),
      game: z.enum(['mlbb', 'cs2', 'pubgm']).optional(),
      excerpt: z.string().min(1).max(200),
      cover: image(),
      coverAlt: z.string().min(1),
      /** Crop focus for the cover, CSS object-position (e.g. "50% 12%"). Default: centre. */
      coverPosition: z.string().regex(/^\d{1,3}% \d{1,3}%$/).optional(),
      achievementId: z.string().optional(),
    }),
});

export const collections = { news };
