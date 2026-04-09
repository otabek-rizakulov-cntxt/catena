/**
 * Bundle size reporter.
 *
 * Reports the size of each dist artifact after build (raw + gzipped).
 *
 * Run: npm run build && npx tsx scripts/bundle-size.ts
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const distDir = join(import.meta.dirname, '../dist');

interface FileInfo {
  name: string;
  raw: number;
  gzip: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

try {
  const files = readdirSync(distDir).filter(
    (f) => f.endsWith('.js') || f.endsWith('.cjs') || f.endsWith('.d.ts') || f.endsWith('.d.cts'),
  );

  const infos: FileInfo[] = files.map((name) => {
    const content = readFileSync(join(distDir, name));
    return {
      name,
      raw: content.byteLength,
      gzip: gzipSync(content).byteLength,
    };
  });

  console.log('\n📦 catena bundle sizes\n');
  console.log('File'.padEnd(24) + 'Raw'.padStart(12) + 'Gzipped'.padStart(12));
  console.log('─'.repeat(48));

  let totalRaw = 0;
  let totalGzip = 0;

  for (const info of infos) {
    console.log(
      info.name.padEnd(24) + formatBytes(info.raw).padStart(12) + formatBytes(info.gzip).padStart(12),
    );
    totalRaw += info.raw;
    totalGzip += info.gzip;
  }

  console.log('─'.repeat(48));
  console.log('Total'.padEnd(24) + formatBytes(totalRaw).padStart(12) + formatBytes(totalGzip).padStart(12));
  console.log();
} catch {
  console.error('dist/ not found — run `npm run build` first');
  process.exit(1);
}
