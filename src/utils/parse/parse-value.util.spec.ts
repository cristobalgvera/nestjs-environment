import * as underTest from './parse-value.util';

describe('ParseValue', () => {
  it('should parse the value', () => {
    const expected = { foo: 'bar' };

    const actual = underTest.parseValue({
      value: JSON.stringify(expected),
    } as any);

    expect(actual).toEqual(expected);
  });
});
