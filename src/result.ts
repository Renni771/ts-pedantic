type ResultBase<T> = {
  unwrapOrDefault: (fallback: T) => T;
  unwrapOrElse: (orElse: () => T) => T;
  unwrapOrThrow: (errorMessage?: string) => T | never;
}

export type Ok<T> = {
  isOk: true;
  isError: false;
  value: T;
} & ResultBase<T>;

export type Err<T, E extends Error> = {
  isOk: false;
  isError: true;
  error: E;
} & ResultBase<T>;

export type Result<T, E extends Error> = Ok<T> | Err<T, E>;

export function ok<T>(value: T): Ok<T> {
  return {
    unwrapOrDefault: () => value,
    unwrapOrElse: () => value,
    unwrapOrThrow: () => value,

    isOk: true,
    isError: false,
    value
  };
};

export function error<T, E extends Error>(error: E): Err<T, E> {
  return {
    unwrapOrDefault: (fallback: T): T => fallback,
    unwrapOrElse: (orElse: () => T): T => orElse(),
    unwrapOrThrow: (errorMessage?: string): never => {
      throw Error(errorMessage ? errorMessage : `Result error: ${error}`);
    },

    isOk: false,
    isError: true,
    error
  };
};

export function isResult<T, E extends Error>(
  obj: unknown
): obj is Result<T, E> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj !== undefined &&
    'isOk' in obj &&
    typeof obj.isOk === 'boolean' &&
    'isError' in obj &&
    typeof obj.isError === 'boolean' &&
    'unwrapOrThrow' in obj &&
    typeof obj.unwrapOrThrow === 'function' &&
    'unwrapOrElse' in obj &&
    typeof obj.unwrapOrElse === 'function' &&
    'unwrapOrDefault' in obj &&
    typeof obj.unwrapOrDefault === 'function' &&
    'unwrapErrorOrThrow' in obj &&
    typeof obj.unwrapErrorOrThrow === 'function' &&
    ('error' in obj || 'value' in obj)
  );
};
