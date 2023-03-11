import { describe, test } from 'vitest';
import { isResult, ok, error } from '../src';

const someError = new Error('some error');

describe('result', () => {
  describe('Ok', () => {
    test('is not `Err`.', ({ expect }) => {
      expect(ok(0).isOk).toBeTruthy();
      expect(ok(0).isError).toBeFalsy();
    });

    test('contains a value and no error.', ({ expect }) => {
      const okay = ok(0);
      expect('value' in okay).toBeTruthy();
      expect('error' in okay).toBeFalsy();
    });
  });

  describe('Err', () => {
    test('is not `Ok`.', ({ expect }) => {
      expect(error(someError).isOk).toBeFalsy();
      expect(error(someError).isError).toBeTruthy();
    });

    test('contains an error and no value.', ({ expect }) => {
      const err = error(someError);
      expect('error' in err).toBeTruthy();
      expect('value' in err).toBeFalsy();
    });
  });

  describe('isResult', () => {
    test('identifies `ok` as a `Result`.', ({ expect }) => {
      expect(isResult(ok(1))).toBeTruthy();
    });

    test('identifies `error` as a `Result`.', ({ expect }) => {
      expect(isResult(error(someError))).toBeTruthy();
    });
  });

  describe('unwrapOrDefault', () => {
    const one = 1;
    const fallback = -1;
    const definitelyOne = ok(one);
    const notOne = error(someError);

    test('returns wrapped value when `ok.`', ({ expect }) => {
      expect(definitelyOne.unwrapOrDefault(fallback)).toBe(one);
      expect(definitelyOne.unwrapOrDefault(fallback)).not.toBe(fallback);
    });

    test('returns fallback value when `error.`', ({ expect }) => {
      expect(notOne.unwrapOrDefault(fallback)).toBe(fallback);
      expect(notOne.unwrapOrDefault(fallback)).not.toBe(one);
    });
  });

  describe('unwrapOrElse', () => {
    const one = 1;
    const fallback = -1;
    const definitelyOne = ok(one);
    const notOne = error(someError);

    test('returns wrapped value when `ok`.', ({ expect }) => {
      expect(definitelyOne.unwrapOrElse(() => fallback)).toBe(one);
      expect(definitelyOne.unwrapOrElse(() => fallback)).not.toBe(fallback);
    });

    test('returns same typed value from `orElse` callback when `error.`', ({
      expect
    }) => {
      expect(notOne.unwrapOrElse(() => fallback)).toBe(fallback);
      expect(typeof notOne.unwrapOrElse(() => fallback)).toBe(typeof fallback);
    });
  });

  describe('unwrapOrThrow', () => {
    test('throws when `error.`', ({ expect }) => {
      expect(() => error(someError).unwrapOrThrow()).toThrowError();
    });

    test('returns wrapped value when `ok`.', ({ expect }) => {
      const value = 1;
      expect(() => ok(value).unwrapOrThrow()).not.toThrow();
      expect(ok(value).unwrapOrThrow()).toBe(value);
    });
  });

  describe('map', () => {
    const value = 1;
    const double = (num: number) => num * 2;

    test('does nothing when `error.`', ({ expect }) => {
      expect(error<number, Error>(someError).map(double).isError).toBeTruthy();
      expect(error<number, Error>(someError).map(double).isOk).toBeFalsy();
    });

    test('returns mapped value when `ok`.', ({ expect }) => {
      expect(ok(value).map(double).unwrapOrThrow()).toBe(double(value));
      expect(ok(value).map(double).isOk).toBeTruthy();
      expect(ok(value).map(double).isError).toBeFalsy();
    });
  });
});
