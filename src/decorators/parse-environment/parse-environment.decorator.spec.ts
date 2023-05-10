import { Transform } from 'class-transformer';
import * as underTest from './parse-environment.decorator';
import { parseValue } from './parse-value.util';
import { ParseEnvironmentOptions } from './types';

jest.mock('class-transformer');
jest.mock('./parse-value.util');

const mockTransform = jest.mocked(Transform);
const mockParseValue = jest.mocked(parseValue);

describe('ParseEnvironmentDecorator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe.each<ParseEnvironmentOptions | undefined>([
    undefined,
    {},
    { toClass: true },
  ])('when provided options are %o', (parseOptions) => {
    it('should call Transform with the correct arguments', () => {
      underTest.ParseEnvironment(parseOptions);

      expect(mockTransform).toHaveBeenCalledWith<Parameters<typeof Transform>>(
        mockParseValue,
        {
          toClassOnly: parseOptions?.toClass,
        },
      );
    });
  });
});
