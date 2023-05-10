import { Transform } from 'class-transformer';
import { parseValue } from './parse-value.util';
import * as underTest from './parse.decorator';
import { ParseOptions } from './types';

jest.mock('class-transformer');
jest.mock('./parse-value.util');

const mockTransform = jest.mocked(Transform);
const mockParseValue = jest.mocked(parseValue);

describe('ParseDecorator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe.each<ParseOptions | undefined>([undefined, {}, { toClass: true }])(
    'when provided options are %o',
    (parseOptions) => {
      it('should call Transform with the correct arguments', () => {
        underTest.Parse(parseOptions);

        expect(mockTransform).toHaveBeenCalledWith<
          Parameters<typeof Transform>
        >(mockParseValue, {
          toClassOnly: parseOptions?.toClass,
        });
      });
    },
  );
});
