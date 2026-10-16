// Fails the build when web assets exceed the size budgets in DESIGN.md.
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const MB = 1024 * 1024;

/** @type {{ pattern: RegExp; maxBytes: number; label: string }[]} */
export const BUDGETS = [
  { pattern: /\.glb$/i, maxBytes: 3 * MB, label: 'Model 3D (.glb) ≤ 3 MB' },
  { pattern: /\.(mp4|webm)$/i, maxBytes: 8 * MB, label: 'Video ≤ 8 MB' },
];

/**
 * @param {{ path: string; size: number }[]} files
 * @param {typeof BUDGETS} budgets
 * @returns {string[]} human-readable violations
 */
export function findViolations(files, budgets = BUDGETS) {
  const violations = [];
  for (const file of files) {
    const budget = budgets.find((b) => b.pattern.test(file.path));
    if (budget && file.size > budget.maxBytes) {
      const sizeMb = (file.size / MB).toFixed(2);
      violations.push(`${file.path}: ${sizeMb} MB melebihi batas "${budget.label}"`);
    }
  }
  return violations;
}

/** @param {string} dir */
function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [{ path: full, size: statSync(full).size }];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const publicDir = fileURLToPath(new URL('../public', import.meta.url));
  const files = listFiles(publicDir).map((f) => ({ ...f, path: relative(publicDir, f.path) }));
  const violations = findViolations(files);
  if (violations.length > 0) {
    console.error('Aset melebihi batas ukuran:\n' + violations.map((v) => `  - ${v}`).join('\n'));
    process.exit(1);
  }
  console.log(`check-assets: ${files.length} file OK`);
}
