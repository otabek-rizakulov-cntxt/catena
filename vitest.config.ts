import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/index.ts'],
      reporter: ['text', 'text-summary', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    benchmark: {
      include: ['benchmarks/**/*.bench.ts'],
    },
  },
  resolve: {
    alias: {
      '@catena': './src',
    },
  },
});
