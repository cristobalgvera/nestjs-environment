import * as underTest from './parse-value.util';

describe('ParseValue', () => {
  describe('when the value is a valid JSON', () => {
    it.each([{ foo: 'bar' }, ['foo', 'bar'], 'foo', 1234, true])(
      'should parse the value to %p',
      (expected) => {
        const value = JSON.stringify(expected);

        const actual = underTest.parseValue({ value } as any);

        expect(actual).toEqual(expected);
      },
    );
  });

  describe('when the value is not a valid JSON', () => {
    it('should throw an error', () => {
      const key = 'foo';
      const value = '{ invalid: JSON';

      expect(() =>
        underTest.parseValue({ value, key } as any),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Unable to parse JSON value for key: foo"`,
      );
    });
  });
});
