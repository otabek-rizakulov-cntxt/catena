import { bench, describe } from 'vitest';
import {
  SemigroupSum,
  SemigroupString,
  MonoidSum,
  MonoidString,
  concatAll,
  foldMap,
  SetoidStrict,
  getSetoidArray,
  OrdNumber,
  min,
  max,
  clamp,
} from '../src';

describe('Semigroup', () => {
  bench('SemigroupSum.concat', () => {
    SemigroupSum.concat(3, 4);
  });

  bench('concatAll(SemigroupString) — 100 items', () => {
    const items = Array.from({ length: 100 }, (_, i) => String(i));
    concatAll(SemigroupString)('')(items);
  });
});

describe('Monoid', () => {
  bench('foldMap(MonoidSum) — 100 numbers', () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    foldMap(MonoidSum)((x: number) => x)(items);
  });

  bench('foldMap(MonoidString) — 100 items', () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    foldMap(MonoidString)((x: number) => String(x))(items);
  });
});

describe('Setoid', () => {
  bench('SetoidStrict.equals — primitives', () => {
    SetoidStrict.equals(42, 42);
  });

  bench('getSetoidArray — 100 elements', () => {
    const arr = Array.from({ length: 100 }, (_, i) => i);
    getSetoidArray(SetoidStrict as { equals: (a: number, b: number) => boolean }).equals(arr, arr);
  });
});

describe('Ord', () => {
  bench('OrdNumber.compare', () => {
    OrdNumber.compare(3, 7);
  });

  bench('min(OrdNumber)', () => {
    min(OrdNumber)(3, 7);
  });

  bench('max(OrdNumber)', () => {
    max(OrdNumber)(3, 7);
  });

  bench('clamp(OrdNumber)(0, 100)', () => {
    clamp(OrdNumber)(0, 100)(50);
  });
});
