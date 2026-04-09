/**
 * Higher-Kinded Type (HKT) encoding for TypeScript.
 *
 * TypeScript lacks native HKT support. This module uses a URI-indexed
 * interface map to simulate them: each ADT registers itself by augmenting
 * {@link URItoKind} (1 type param) or {@link URItoKind2} (2 type params).
 *
 * @example
 * ```ts
 * declare module './hkt' {
 *   interface URItoKind<A> {
 *     readonly Maybe: Maybe<A>;
 *   }
 * }
 * ```
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface URItoKind<A> {
  readonly __phantom?: A;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface URItoKind2<E, A> {
  readonly __phantom?: [E, A];
}

export type URIS = keyof URItoKind<unknown>;

export type URIS2 = keyof URItoKind2<unknown, unknown>;

export type Kind<F extends URIS, A> = URItoKind<A>[F];

export type Kind2<F extends URIS2, E, A> = URItoKind2<E, A>[F];
