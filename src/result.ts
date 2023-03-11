type ResultBase<T, E extends Error> = {
  unwrapOrDefault: (fallback: T) => T;
  unwrapOrElse: (orElse: () => T) => T;
  unwrapOrThrow: (errorMessage?: string) => T | never;

  map: <TMappedValue>(
    mapper: (value: T) => TMappedValue
  ) => Result<TMappedValue, E>;

  mapError: <TMappedError extends Error>(
    mapper: (err: E) => TMappedError
  ) => Result<T, TMappedError>;
};

export type Ok<T, E extends Error> = {
  isOk: true;
  isError: false;
  value: T;
} & ResultBase<T, E>;

export type Err<T, E extends Error> = {
  isOk: false;
  isError: true;
  error: E;
} & ResultBase<T, E>;

export type Result<T, E extends Error> = Ok<T, E> | Err<T, E>;

export function ok<T, E extends Error>(value: T): Result<T, E> {
  return {
    unwrapOrDefault: () => value,
    unwrapOrElse: () => value,
    unwrapOrThrow: () => value,

    map: <TMappedValue>(mapper: (value: T) => TMappedValue) => {
      return ok<TMappedValue, E>(mapper(value));
    },
    mapError: () => ok(value),


    isOk: true,
    isError: false,
    value
  };
}

export function error<T, E extends Error>(err: E): Result<T, E> {
  return {
    unwrapOrDefault: (fallback: T): T => fallback,
    unwrapOrElse: (orElse: () => T): T => orElse(),
    unwrapOrThrow: (errorMessage?: string): never => {
      throw Error(errorMessage ? errorMessage : `Result error: ${err}`);
    },

    map: () => error(err),
    mapError: <TMappedError extends Error>(mapper: (err: E) => TMappedError) => {
      return error<T, TMappedError>(mapper(err));
    },

    isOk: false,
    isError: true,
    error: err
  };
}

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
}
