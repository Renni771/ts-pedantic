type ResultBase<T, E> = {
  unwrapOrDefault: (fallback: T) => T;
  unwrapOrElse: (orElse: () => T) => T;
  unwrapOrThrow: (errorMessage?: string) => T | never;

  map: <TMappedValue>(
    mapper: (value: T) => TMappedValue
  ) => Result<TMappedValue, E>;

  mapError: <TMappedError>(
    mapper: (err: E) => TMappedError
  ) => Result<T, TMappedError>;
};

export type Ok<T, E> = {
  isOk: true;
  isError: false;
  value: T;
} & ResultBase<T, E>;

export type Err<T, E> = {
  isOk: false;
  isError: true;
  error: E;
} & ResultBase<T, E>;

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export function ok<T, E>(value: T): Result<T, E> {
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

export function error<T, E>(err: E): Result<T, E> {
  return {
    unwrapOrDefault: (fallback: T): T => fallback,
    unwrapOrElse: (orElse: () => T): T => orElse(),
    unwrapOrThrow: (errorMessage?: string): never => {
      throw new Error(errorMessage ? errorMessage : `No value to unwrap. Wrapped error: ${err}`);
    },

    map: () => error(err),
    mapError: <TMappedError>(
      mapper: (err: E) => TMappedError
    ) => {
      return error<T, TMappedError>(mapper(err));
    },

    isOk: false,
    isError: true,
    error: err
  };
}

export function isResult<T, E>(
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
    ((!('error' in obj) && 'value' in obj) ||
      ('error' in obj && !('value' in obj)))
  );
}
