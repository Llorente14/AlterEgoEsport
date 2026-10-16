import { z } from 'zod';
import { parseDataFile } from './validate';

const foundersFileSchema = z.object({
  founders: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        role: z.string().min(1),
        /** Public URL of the portrait; null shows the logo-mask placeholder. */
        photo: z.string().nullable(),
      }),
    )
    .min(1),
});

export type Founder = z.infer<typeof foundersFileSchema>['founders'][number];

export function buildFounders(raw: unknown, file: string): Founder[] {
  const { founders } = parseDataFile(foundersFileSchema, raw, file);
  const ids = new Set<string>();
  for (const [index, founder] of founders.entries()) {
    if (ids.has(founder.id)) {
      throw new Error(`Data tidak valid:\n  - ${file} → founders[${index}].id: id "${founder.id}" dipakai dua kali`);
    }
    ids.add(founder.id);
  }
  return founders;
}
