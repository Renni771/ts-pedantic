interface ResultBase<T> {
  isOk: boolean;
  isError: boolean;

  unwrapOrDefault: (fallback: T) => T;
  unwrapOrElse: (callback: () => unknown) => T | ReturnType<typeof callback>;
  unwrapOrThrow: () => T | void;
}

export interface Ok<T> extends ResultBase<T> {
  isOk: true;
  isError: false;
  value: T;
}

export interface Err<T, E extends Error> extends ResultBase<T> {
  isOk: false;
  isError: true;
  error: E;
}

export type Result<T, E extends Error> = Ok<T> | Err<T, E>;

export const ok = <T>(value: T): Ok<T> => {
  return {
    unwrapOrDefault: () => value,
    unwrapOrElse: () => value,
    unwrapOrThrow: () => value,

    isOk: true,
    isError: false,
    value
  };
};

export const error = <T, E extends Error>(error: E): Err<T, E> => {
  return {
    unwrapOrDefault: (fallback: T): T => fallback,
    unwrapOrElse: (callback: () => unknown): unknown => callback(),
    unwrapOrThrow: (errorMessage?: string): never => {
      throw Error(errorMessage ? errorMessage : `Result error: ${error}`);
    },

    isOk: false,
    isError: true,
    error
  };
};

export const isResult = <T, E extends Error>(
  obj: unknown
): obj is Result<T, E> => {
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
