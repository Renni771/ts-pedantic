import { describe, test } from 'vitest';
import { isOption, none, some } from '../src';

describe('option', () => {
  describe('Some', () => {
    test('is not `none`.', ({ expect }) => {
      expect(some(0).isSome).toBeTruthy();
      expect(some(0).isNone).toBeFalsy();
    });

    test('contains a value.', ({ expect }) => {
      const definitelySome = some('hello world!');
      expect('value' in definitelySome).toBeTruthy();
    });
  });

  describe('None', () => {
    test('is not `some`.', ({ expect }) => {
      expect(none().isNone).toBeTruthy();
      expect(none().isSome).toBeFalsy();
    });

    test('does not contain a value.', ({ expect }) => {
      const definitelyNone = none();
      expect('value' in definitelyNone).toBeFalsy();
    });
  });

  describe('isOption', () => {
    test('identifies `some` as an option.', ({ expect }) => {
      expect(isOption(some(1))).toBeTruthy();
    });

    test('identifies `none` as an option.', ({ expect }) => {
      expect(isOption(none())).toBeTruthy();
    });
  });

  describe('unwrapOrDefault', () => {
    const one = 1;
    const fallback = -1;
    const definitelyOne = some(one);
    const notOne = none<number>();

    test('returns wrapped value when `some.`', ({ expect }) => {
      expect(definitelyOne.unwrapOrDefault(fallback)).toBe(one);
      expect(definitelyOne.unwrapOrDefault(fallback)).not.toBe(fallback);
    });

    test('returns fallback value when `none.`', ({ expect }) => {
      expect(notOne.unwrapOrDefault(fallback)).toBe(fallback);
      expect(notOne.unwrapOrDefault(fallback)).not.toBe(one);
    });
  });

  describe('unwrapOrElse', () => {
    const one = 1;
    const fallback = -1;
    const definitelyOne = some(one);
    const notOne = none<number>();

    test('returns wrapped value when `some`.', ({ expect }) => {
      expect(definitelyOne.unwrapOrElse(() => fallback)).toBe(one);
      expect(definitelyOne.unwrapOrElse(() => fallback)).not.toBe(fallback);
    });

    test('returns same typed value from `orElse` callback when `none.`', ({
      expect
    }) => {
      expect(notOne.unwrapOrElse(() => fallback)).toBe(fallback);
      expect(typeof notOne.unwrapOrElse(() => fallback)).toBe(typeof fallback);
    });
  });

  describe('unwrapOrThrow', () => {
    test('throws when `none.`', ({ expect }) => {
      expect(() => none().unwrapOrThrow()).toThrowError();
    });

    test('returns wrapped value when `some`.', ({ expect }) => {
      const value = 1;
      expect(() => some(value).unwrapOrThrow()).not.toThrow();
      expect(some(value).unwrapOrThrow()).toBe(value);
    });
  });

  describe('map', () => {
    const value = 1;
    const double = (num: number) => num * 2;

    test('does nothing when `none.`', ({ expect }) => {
      expect(none<number>().map(double).isNone).toBeTruthy();
      expect(none<number>().map(double).isSome).toBeFalsy();
    });

    test('returns mapped value when `some`.', ({ expect }) => {
      expect(some(value).map(double).unwrapOrThrow()).toBe(double(value));
      expect(some(value).map(double).isSome).toBeTruthy();
      expect(some(value).map(double).isNone).toBeFalsy();
    });
  });
});
