type OptionBase<T> = {
  unwrapOrDefault: (fallback: T) => T;
  unwrapOrElse: (orElse: () => T) => T
  unwrapOrThrow: (errorMessage?: string) => T | never;
}

export type Some<T> = {
  isNone: false;
  isSome: true;
  value: T;
} & OptionBase<T>;

export type None<T> = {
  isNone: true;
  isSome: false;
} & OptionBase<T>;

export type Option<T> = Some<T> | None<T>;

export function some<T>(value: T): Some<T> {
  return {
    unwrapOrDefault: () => value,
    unwrapOrElse: () => value,
    unwrapOrThrow: () => value,

    isNone: false,
    isSome: true,
    value
  };
};

export function none<T>(): None<T> {
  return {
    unwrapOrDefault: (fallback: T): T => fallback,
    unwrapOrElse: (orElse: () => T): T => orElse(),
    unwrapOrThrow: (errorMessage?: string): never => {
      throw Error(errorMessage ? errorMessage : 'No value found');
    },

    isNone: true,
    isSome: false
  };
};

export function isOption<T>(obj: unknown): obj is Option<T> {
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
