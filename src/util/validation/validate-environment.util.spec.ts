import { createMock } from '@golevelup/ts-jest';
import { DetailedError } from '@util/error';
import { plainToInstance } from 'class-transformer';
import * as Joi from 'joi';
import * as underTest from './validate-environment.util';

jest.mock('class-transformer');
jest.mock('@util/error');

const mockPlainToInstance = jest.mocked(plainToInstance);
const mockDetailedError = jest.mocked(DetailedError);

describe('ValidateEnvironment', () => {
  let validationSchema: Joi.ObjectSchema<any>;

  beforeEach(() => {
    validationSchema = createMock<Joi.ObjectSchema>();

    jest
      .spyOn(validationSchema, 'validate')
      .mockReturnValue({ error: undefined } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should transform the configuration to the environment class', () => {
    const expectedConfiguration = { config: 'config' };
    const expectedClass = { foo: 'bar' };

    underTest.validateEnvironment({
      configuration: expectedConfiguration,
      environmentClass: expectedClass as any,
      validationSchema,
    });

    expect(mockPlainToInstance).toHaveBeenCalledWith<
      Parameters<typeof plainToInstance>
    >(expectedClass as any, expectedConfiguration);
  });

  it('should validate the transformed configuration against the schema', () => {
    const expected = { config: 'config' };

    mockPlainToInstance.mockReturnValueOnce(expected);

    const validationSchemaSpy = jest.spyOn(validationSchema, 'validate');

    underTest.validateEnvironment({ validationSchema } as any);

    expect(validationSchemaSpy).toHaveBeenCalledWith(
      expected,
      expect.objectContaining<Joi.ValidationOptions>({
        allowUnknown: true,
        abortEarly: false,
      }),
    );
  });

  describe('when the configuration is valid', () => {
    it('should return the validated configuration', () => {
      const expected = { foo: 'bar' };

      jest.spyOn(validationSchema, 'validate').mockReturnValueOnce({
        error: undefined,
        value: expected,
      } as any);

      const actual = underTest.validateEnvironment({ validationSchema } as any);

      expect(actual).toEqual(expected);
    });
  });

  describe('when the configuration is invalid', () => {
    beforeEach(() => {
      mockDetailedError.mockImplementation(() => {
        throw new Error('DetailedError');
      });
    });

    it('should throw an error', () => {
      expect.hasAssertions();

      jest.spyOn(validationSchema, 'validate').mockReturnValueOnce({
        error: {},
      } as any);

      expect(() =>
        underTest.validateEnvironment({ validationSchema } as any),
      ).toThrowErrorMatchingInlineSnapshot(`"DetailedError"`);
    });

    it('should instantiate DetailedError using the correct parameters', () => {
      expect.hasAssertions();

      const expected = 'validation_message';

      jest.spyOn(validationSchema, 'validate').mockReturnValueOnce({
        error: { message: expected },
      } as any);

      try {
        underTest.validateEnvironment({ validationSchema } as any);
      } catch (error) {
        // Ignore the error
      } finally {
        expect(mockDetailedError).toHaveBeenCalledWith<
          ConstructorParameters<typeof DetailedError>
        >(expect.stringMatching(expected));
      }
    });
  });
});
