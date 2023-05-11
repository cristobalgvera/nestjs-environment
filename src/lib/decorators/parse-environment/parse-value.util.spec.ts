import { DetailedError } from '@util/error';
import * as underTest from './parse-value.util';

jest.mock('@util/error');
const mockDetailedError = jest.mocked(DetailedError);

describe('ParseValue', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
    beforeEach(() => {
      mockDetailedError.mockImplementation(() => {
        throw new Error('DetailedError');
      });
    });

    it('should throw an error', () => {
      const value = '{ invalid';

      expect(() =>
        underTest.parseValue({ value } as any),
      ).toThrowErrorMatchingInlineSnapshot(`"DetailedError"`);
    });

    it('should instantiate DetailedError using the proper values', () => {
      const key = 'foo';
      const value = '{ invalid';

      try {
        underTest.parseValue({ key, value } as any);
      } catch (error) {
        // Ignore the error
      } finally {
        expect(mockDetailedError).toHaveBeenCalledWith<
          ConstructorParameters<typeof DetailedError>
        >(
          expect.arrayContaining([
            expect.stringMatching(key),
            expect.stringMatching(value),
          ]),
        );
      }
    });
  });
});
