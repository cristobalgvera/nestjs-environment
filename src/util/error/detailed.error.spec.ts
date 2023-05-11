import { DetailedError } from './detailed.error';

describe('DetailedError', () => {
  describe('when the message is a string', () => {
    it('should return the message', () => {
      const expected = 'foo';

      const actual = new DetailedError(expected);

      expect(actual.message).toContain(expected);
    });
  });

  describe('when the error is an array of strings', () => {
    it('should return the message', () => {
      const detail = ['foo', 'bar'];
      const expected = detail.join('\n');

      const actual = new DetailedError(detail);

      expect(actual.message).toContain(expected);
    });
  });
});
