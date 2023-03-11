import { isOption, Option } from './option';
import { isResult, Result } from './result';

export type OptionMatcher<T> = {
  onSome: (value: T) => unknown;
  onNone: () => unknown;
};

export function isOptionMatcher<T>(
  matcher: unknown
): matcher is OptionMatcher<T> {
  return (
    typeof matcher === 'object' &&
    matcher !== null &&
    matcher !== undefined &&
    'onSome' in matcher &&
    typeof matcher.onSome === 'function' &&
    'onNone' in matcher &&
    typeof matcher.onNone === 'function'
  );
}

export type ResultMatcher<T, E extends Error> = {
  onOk: (value: T) => unknown;
  onError: (error: E) => unknown;
};

export function isResultMatcher<T, E extends Error>(
  matcher: unknown
): matcher is ResultMatcher<T, E> {
  return (
    typeof matcher === 'object' &&
    matcher !== null &&
    matcher !== undefined &&
    'onOk' in matcher &&
    typeof matcher.onOk === 'function' &&
    'onError' in matcher &&
    typeof matcher.onError === 'function'
  );
}

export function match<T, E extends Error | undefined = undefined>(
  pattern: E extends Error ? Result<T, E> : Option<T>,
  matcher: E extends Error ? ResultMatcher<T, E> : OptionMatcher<T>
) {
  if (isOption(pattern) && isOptionMatcher(matcher)) {
    if (pattern.isSome) {
      return matcher.onSome(pattern.value);
    }

    return matcher.onNone();
  }

  if (isResult(pattern) && isResultMatcher(matcher)) {
    if (pattern.isOk) {
      return matcher.onOk(pattern.value);
    }

    return matcher.onError(pattern.error);
  }

  throw new Error('Invalid option or matcher');
}
