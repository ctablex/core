import { bench } from '@arktype/attest';
import { Accessor } from './accessor';

interface FlatObject0 {}

interface FlatObject1 {
  a: number;
}

interface FlatObject2 {
  a: number;
  b: string;
}

interface FlatObject3 {
  a: number;
  b: string;
  c: boolean;
}

interface NestedObject1d1 {
  a: { b: number };
}

interface NestedObject1d2 {
  a: { b: { c: number } };
}

interface NestedObject2d1 {
  a: { b: number };
  c: { d: string };
}

interface NestedObject2d2 {
  a: { b: { c: number } };
  d: { e: { f: string } };
}

bench('bench accessor 0', () => {
  return {} as Accessor<FlatObject0>;
}).types([74, 'instantiations']);

bench('bench accessor 1', () => {
  return {} as Accessor<FlatObject1>;
}).types([131, 'instantiations']);

bench('bench accessor 2', () => {
  return {} as Accessor<FlatObject2>;
}).types([168, 'instantiations']);

bench('bench accessor 3', () => {
  return {} as Accessor<FlatObject3>;
}).types([217, 'instantiations']);

bench('bench accessor nested 1d1', () => {
  return {} as Accessor<NestedObject1d1>;
}).types([188, 'instantiations']);
bench('bench accessor nested 1d2', () => {
  return {} as Accessor<NestedObject1d2>;
}).types([246, 'instantiations']);
bench('bench accessor nested 2d1', () => {
  return {} as Accessor<NestedObject2d1>;
}).types([275, 'instantiations']);
bench('bench accessor nested 2d2', () => {
  return {} as Accessor<NestedObject2d2>;
}).types([383, 'instantiations']);
