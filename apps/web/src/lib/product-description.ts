export interface DescriptionSection {
  title: string;
  /** Lines in order; a line starting with "- " is a bullet. */
  lines: string[];
}

const SIZE_CHART = /^size charts?\b/i;

const TITLES: [RegExp, string][] = [
  [/^notes?$/i, 'Catatan'],
  [/^details?$/i, 'Detail'],
  [/^our packaging details?$/i, 'Isi Paket'],
  [/^spesifikasi$/i, 'Spesifikasi'],
];

/** A line opens a new section when it is a short label ending in ":" or a size chart header. */
function headingOf(line: string): string | null {
  const bare = line.replace(/:\s*$/, '').trim();
  if (SIZE_CHART.test(line) && !/[.]$/.test(line) && !/\b(slide|available|tersedia)\b/i.test(line)) {
    return 'Size Chart';
  }
  if (/^spesifikasi$/i.test(bare) || /^details?$/i.test(bare)) return TITLES.find(([re]) => re.test(bare))![1];
  if (line.trim().endsWith(':') && bare.length > 0 && bare.length <= 60) {
    return TITLES.find(([re]) => re.test(bare))?.[1] ?? bare;
  }
  return null;
}

/**
 * Group description lines (already split on " | ") into titled sections for the product accordion.
 * Text before the first heading becomes "Deskripsi". Size chart headers keep their column line.
 */
export function groupDescription(blocks: string[]): DescriptionSection[] {
  const sections: DescriptionSection[] = [{ title: 'Deskripsi', lines: [] }];
  for (const line of blocks) {
    const title = headingOf(line);
    if (title) {
      const columns = title === 'Size Chart' ? line.replace(SIZE_CHART, '').replace(/^[\s:;]+/, '').trim() : '';
      sections.push({ title, lines: columns ? [columns] : [] });
    } else {
      sections[sections.length - 1]!.lines.push(line);
    }
  }
  return sections.filter((s) => s.lines.length > 0);
}
