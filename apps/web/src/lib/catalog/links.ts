import { z } from 'zod';
import { parseDataFile } from './validate';

const link = z.object({ label: z.string().min(1), url: z.url() });
const social = z.object({ platform: z.string().min(1), handle: z.string().min(1), url: z.url() });

const linksFileSchema = z.object({
  shopee: z.array(link.extend({ country: z.string().length(2) })).min(1),
  tokopedia: link,
  whatsapp: link,
  offlineStore: z.object({ name: z.string(), area: z.string(), mapsUrl: z.url() }),
  social: z.object({
    'alterego-esports': z.array(social),
    'alter-merch': z.array(social),
  }),
  linktree: z.url(),
});

export type SiteLinks = z.infer<typeof linksFileSchema> & {
  /** The Indonesian Shopee store: default target for "Beli Sekarang". */
  shopeeHome: string;
};

export function buildLinks(raw: unknown, file: string): SiteLinks {
  const data = parseDataFile(linksFileSchema, raw, file);
  const home = data.shopee.find((s) => s.country === 'ID') ?? data.shopee[0]!;
  return { ...data, shopeeHome: home.url };
}
