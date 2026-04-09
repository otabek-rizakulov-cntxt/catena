import { describe, it } from 'vitest';
import fc from 'fast-check';
import {
  SemigroupSum,
  SemigroupProduct,
  SemigroupString,
  SemigroupAll,
  SemigroupAny,
} from '../../src/algebraic/Semigroup';
import {
  MonoidSum,
  MonoidProduct,
  MonoidString,
  MonoidAll,
  MonoidAny,
} from '../../src/algebraic/Monoid';
import { SetoidNumber, SetoidString, SetoidBoolean } from '../../src/algebraic/Setoid';
import { OrdNumber, OrdString, OrdBoolean } from '../../src/algebraic/Ord';
import {
  semigroupAssociativity,
  monoidLeftIdentity,
  monoidRightIdentity,
  setoidReflexivity,
  setoidSymmetry,
  ordTotality,
  ordAntisymmetry,
  ordTransitivity,
} from './laws';

// ---------------------------------------------------------------------------
// Semigroup laws
// ---------------------------------------------------------------------------

describe('Semigroup associativity', () => {
  it('SemigroupSum', () => semigroupAssociativity(SemigroupSum, fc.integer()));
  it('SemigroupProduct', () =>
    semigroupAssociativity(SemigroupProduct, fc.integer({ min: -100, max: 100 })));
  it('SemigroupString', () => semigroupAssociativity(SemigroupString, fc.string()));
  it('SemigroupAll', () => semigroupAssociativity(SemigroupAll, fc.boolean()));
  it('SemigroupAny', () => semigroupAssociativity(SemigroupAny, fc.boolean()));
});

// ---------------------------------------------------------------------------
// Monoid laws
// ---------------------------------------------------------------------------

describe('Monoid left identity', () => {
  it('MonoidSum', () => monoidLeftIdentity(MonoidSum, fc.integer()));
  it('MonoidProduct', () => monoidLeftIdentity(MonoidProduct, fc.integer()));
  it('MonoidString', () => monoidLeftIdentity(MonoidString, fc.string()));
  it('MonoidAll', () => monoidLeftIdentity(MonoidAll, fc.boolean()));
  it('MonoidAny', () => monoidLeftIdentity(MonoidAny, fc.boolean()));
});

describe('Monoid right identity', () => {
  it('MonoidSum', () => monoidRightIdentity(MonoidSum, fc.integer()));
  it('MonoidProduct', () => monoidRightIdentity(MonoidProduct, fc.integer()));
  it('MonoidString', () => monoidRightIdentity(MonoidString, fc.string()));
  it('MonoidAll', () => monoidRightIdentity(MonoidAll, fc.boolean()));
  it('MonoidAny', () => monoidRightIdentity(MonoidAny, fc.boolean()));
});

// ---------------------------------------------------------------------------
// Setoid laws
// ---------------------------------------------------------------------------

describe('Setoid reflexivity', () => {
  it('SetoidNumber', () => setoidReflexivity(SetoidNumber, fc.integer()));
  it('SetoidString', () => setoidReflexivity(SetoidString, fc.string()));
  it('SetoidBoolean', () => setoidReflexivity(SetoidBoolean, fc.boolean()));
});

describe('Setoid symmetry', () => {
  it('SetoidNumber', () => setoidSymmetry(SetoidNumber, fc.integer()));
  it('SetoidString', () => setoidSymmetry(SetoidString, fc.string()));
  it('SetoidBoolean', () => setoidSymmetry(SetoidBoolean, fc.boolean()));
});

// ---------------------------------------------------------------------------
// Ord laws
// ---------------------------------------------------------------------------

describe('Ord totality', () => {
  it('OrdNumber', () => ordTotality(OrdNumber, fc.integer()));
  it('OrdString', () => ordTotality(OrdString, fc.string()));
  it('OrdBoolean', () => ordTotality(OrdBoolean, fc.boolean()));
});

describe('Ord antisymmetry', () => {
  it('OrdNumber', () => ordAntisymmetry(OrdNumber, fc.integer()));
  it('OrdString', () => ordAntisymmetry(OrdString, fc.string()));
  it('OrdBoolean', () => ordAntisymmetry(OrdBoolean, fc.boolean()));
});

describe('Ord transitivity', () => {
  it('OrdNumber', () => ordTransitivity(OrdNumber, fc.integer()));
  it('OrdString', () => ordTransitivity(OrdString, fc.string()));
  it('OrdBoolean', () => ordTransitivity(OrdBoolean, fc.boolean()));
});
