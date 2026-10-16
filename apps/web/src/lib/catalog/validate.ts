import type { z } from 'zod';

/** Thrown when a data file does not match its schema; the message names the file and entry. */
export class CatalogDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CatalogDataError';
  }
}

/**
 * Parse raw data with a schema, failing loudly with the file name and the path of each bad entry
 * (e.g. `data/mlbb.json → players[3].nickname: Required`).
 */
export function parseDataFile<T extends z.ZodType>(schema: T, raw: unknown, file: string): z.infer<T> {
  const result = schema.safeParse(raw);
  if (result.success) return result.data;

  const issues = result.error.issues.map((issue) => {
    const path = issue.path
      .map((part, i) => (typeof part === 'number' ? `[${part}]` : i === 0 ? String(part) : `.${String(part)}`))
      .join('');
    return `  - ${file} → ${path || '(root)'}: ${issue.message}`;
  });
  throw new CatalogDataError(`Data tidak valid:\n${issues.join('\n')}`);
}
