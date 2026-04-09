/**
 * Tree-shaking validation script.
 *
 * Builds a minimal consumer that imports only `pipe` and `Maybe`,
 * then verifies the output does NOT contain code from unused modules
 * (e.g. Either, Async, Reader, IO, algebraic structures).
 *
 * Run: npx tsx scripts/check-treeshake.ts
 */
import { build } from 'tsup';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const tmpDir = join(import.meta.dirname, '../.treeshake-test');
const entryFile = join(tmpDir, 'entry.ts');

mkdirSync(tmpDir, { recursive: true });

writeFileSync(
  entryFile,
  `import { pipe, Maybe } from '../src/index';
const result = pipe(Maybe.just(1), Maybe.map(x => x + 1), Maybe.getOrElse(() => 0));
console.log(result);
`,
);

const mustNotContain = [
  'EitherURI',
  'AsyncURI',
  'ReaderURI',
  'IOURI',
  'SemigroupSum',
  'MonoidSum',
  'SetoidStrict',
  'OrdNumber',
  'isNil',
  'ifElse',
];

async function main() {
  await build({
    entry: [entryFile],
    outDir: join(tmpDir, 'out'),
    format: ['esm'],
    dts: false,
    clean: true,
    splitting: false,
    treeshake: true,
    sourcemap: false,
    silent: true,
    target: 'es2022',
    noExternal: [/.*/],
  });

  const output = readFileSync(join(tmpDir, 'out/entry.js'), 'utf-8');
  const leaked: string[] = [];

  for (const token of mustNotContain) {
    if (output.includes(token)) {
      leaked.push(token);
    }
  }

  rmSync(tmpDir, { recursive: true, force: true });

  if (leaked.length > 0) {
    console.error('Tree-shaking FAILED — unused symbols found in output:');
    for (const s of leaked) {
      console.error(`  - ${s}`);
    }
    process.exit(1);
  }

  const sizeKB = (Buffer.byteLength(output) / 1024).toFixed(2);
  console.log(`Tree-shaking OK — output contains only pipe + Maybe`);
  console.log(`  Bundle size (pipe + Maybe only): ${sizeKB} KB`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
