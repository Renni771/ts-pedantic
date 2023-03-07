import { isOption, Option } from './option';
import { isResult, Result } from './result';

type OnSomeReturnType<T> = (value: T) => unknown;
type OnNoneReturnType = () => unknown;

type OptionMatcher<T> = {
  onSome: OnSomeReturnType<T>;
  onNone: OnNoneReturnType;
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
};

type OnOkReturnType<T> = (value: T) => unknown;
type OnErrorReturnType<E extends Error> = (error: E) => unknown;

type ResultMatcher<T, E extends Error> = {
  onOk: OnOkReturnType<T>;
  onError: OnErrorReturnType<E>;
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
};

export function match<T>(
  pattern: Option<T>,
  matcher: OptionMatcher<T>
): OnSomeReturnType<T> | OnNoneReturnType;

export function match<T, E extends Error>(
  pattern: Result<T, E>,
  matcher: ResultMatcher<T, E>
): OnOkReturnType<T> | OnErrorReturnType<E>;

export function match<T, E extends Error>(
  pattern: Option<T> | Result<T, E>,
  matcher: OptionMatcher<T> | ResultMatcher<T, E>
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
