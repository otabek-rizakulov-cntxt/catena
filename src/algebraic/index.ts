export {
  type Semigroup,
  concatAll,
  SemigroupSum,
  SemigroupProduct,
  SemigroupString,
  SemigroupAll,
  SemigroupAny,
  getSemigroupArray,
} from './Semigroup';

export {
  type Monoid,
  foldMap,
  MonoidSum,
  MonoidProduct,
  MonoidString,
  MonoidAll,
  MonoidAny,
  getMonoidArray,
} from './Monoid';

export {
  type Setoid,
  SetoidStrict,
  SetoidNumber,
  SetoidString,
  SetoidBoolean,
  getSetoidArray,
} from './Setoid';

export {
  type Ord,
  type Ordering,
  fromCompare,
  OrdNumber,
  OrdString,
  OrdBoolean,
  min,
  max,
  clamp,
} from './Ord';
