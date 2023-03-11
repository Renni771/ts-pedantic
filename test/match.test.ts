import { describe, test } from 'vitest';
import { error, match, none, ok, some } from '../src';
import { isOptionMatcher, isResultMatcher } from '../src/match';

describe('match', () => {
  test('correctly matches an `Option<T>`.', ({ expect }) => {
    const value = 'some value';
    const fallback = 'fallback value';
    const something = some(value);
    const nothing = none();

    expect(
      match(something, {
        onSome: (val) => val,
        onNone: () => fallback
      })
    ).toBe(value);

    expect(
      match(something, {
        onSome: (val) => val,
        onNone: () => fallback
      })
    ).not.toBe(fallback);

    expect(
      match(nothing, {
        onSome: () => 1,
        onNone: () => fallback
      })
    ).toBe(fallback);

    expect(
      match(nothing, {
        onSome: () => 1,
        onNone: () => fallback
      })
    ).not.toBe(1);
  });

  test('correctly matches an `Result<T, E>`.', ({ expect }) => {
    const value = 'some value';
    const fallback = 'fallback value';
    const okay = ok(value);
    const notOkay = error(new Error(':('));

    expect(
      match(okay, {
        onOk: (val) => val,
        onError: () => fallback
      })
    ).toBe(value);

    expect(
      match(okay, {
        onOk: (val) => val,
        onError: () => fallback
      })
    ).not.toBe(fallback);

    expect(
      match(notOkay, {
        onOk: () => 1,
        onError: () => fallback
      })
    ).toBe(fallback);

    expect(
      match(notOkay, {
        onOk: () => 1,
        onError: () => fallback
      })
    ).not.toBe(1);
  });

  test('throws at runtime when arguments are incorrectly typed.', ({
    expect
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => match({} as any, {} as any)).toThrowError();
  });

  test('isOptionMatcher identifies an `OptionMatcher`', ({ expect }) => {
    expect(isOptionMatcher({ onSome: () => 1, onNone: () => -1 })).toBeTruthy();
    expect(isOptionMatcher({ what: 'what?' })).toBeFalsy();
  });

  test('isResultMatcher identifies an `ResultMatcher`', ({ expect }) => {
    expect(isResultMatcher({ onOk: () => 1, onError: () => -1 })).toBeTruthy();
    expect(isResultMatcher({ what: 'what?' })).toBeFalsy();
  });
});
