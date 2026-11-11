declare const Brand: unique symbol;

export type Branded<T, B> = T & { readonly [Brand]: B };

export type ItineraryId = Branded<string, 'ItineraryId'>;
export type DocumentId = Branded<string, 'DocumentId'>;
export type ChunkId = Branded<string, 'ChunkId'>;

export type CurrencyCode =
  | 'BRL'
  | 'USD'
  | 'EUR'
  | 'JPY'
  | 'GBP'
  | 'CHF'
  | 'CAD'
  | 'AUD'
  | (string & {});

export type CurrencyPair = `${CurrencyCode}/${CurrencyCode}`;

export type Result<T, E = string> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

export function Ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function Err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true;
}

export function isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false;
}

