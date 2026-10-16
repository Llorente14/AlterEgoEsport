import { z } from 'zod';
import { parseDataFile } from './validate';

const partnersFileSchema = z.object({
  partners: z
    .array(
      z.object({
        name: z.string().min(1),
        /** File name in public/partners; null shows the name as a wordmark until a logo is added. */
        logo: z
          .string()
          .regex(/^[\w.-]+\.(png|svg|webp)$/, 'Nama file logo harus .png, .svg, atau .webp')
          .nullable(),
        /** Intrinsic logo size in px, so the logo reserves space before it loads. */
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
      })
      .refine((p) => !p.logo || (p.width && p.height), {
        message: 'Logo wajib punya width dan height',
        path: ['logo'],
      }),
    )
    .min(1),
});

export interface Partner {
  name: string;
  /** Public URL of the logo, or null for a text wordmark. */
  logoSrc: string | null;
  width?: number;
  height?: number;
}

export function buildPartners(raw: unknown, file: string): Partner[] {
  return parseDataFile(partnersFileSchema, raw, file).partners.map((p) => ({
    name: p.name,
    logoSrc: p.logo ? `/partners/${p.logo}` : null,
    ...(p.logo ? { width: p.width, height: p.height } : {}),
  }));
}
