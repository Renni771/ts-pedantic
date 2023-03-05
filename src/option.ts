interface OptionBase<T> {
  isSome: boolean;
  isNone: boolean;

  unwrapOrDefault: (fallback: T) => T;
  unwrapOrElse: (orElse: () => unknown) => T | ReturnType<typeof orElse>;
  unwrapOrThrow: (errorMessage?: string) => T | void;
}

export interface Some<T> extends OptionBase<T> {
  isNone: false;
  isSome: true;
  value: T;
}

export interface None<T> extends OptionBase<T> {
  isNone: true;
  isSome: false;
}

export type Option<T> = Some<T> | None<T>;

export const some = <T>(value: T): Some<T> => {
  return {
    unwrapOrDefault: () => value,
    unwrapOrElse: () => value,
    unwrapOrThrow: () => value,

    isNone: false,
    isSome: true,
    value
  };
};

export const none = <T>(): None<T> => {
  return {
    unwrapOrDefault: (fallback: T): T => fallback,
    unwrapOrElse: (callback: () => unknown): unknown => callback(),
    unwrapOrThrow: (errorMessage?: string): never => {
      throw Error(errorMessage ? errorMessage : 'No value found');
    },

    isNone: true,
    isSome: false
  };
};

export const isOption = <T>(obj: unknown): obj is Option<T> => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj !== undefined &&
    'isSome' in obj &&
    typeof obj.isSome === 'boolean' &&
    'isNone' in obj &&
    typeof obj.isNone === 'boolean' &&
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
