import { createMock } from '@golevelup/ts-jest';
import * as Joi from 'joi';
import * as underTest from './validate.util';

describe('validate', () => {
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

  it('should validate the transformed configuration against the schema', () => {
    const expected = { config: 'config' };

    const validationSchemaSpy = jest.spyOn(validationSchema, 'validate');

    underTest.validateEnvironment(expected, validationSchema);

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

      const actual = underTest.validateEnvironment({} as any, validationSchema);

      expect(actual).toEqual(expected);
    });
  });

  describe('when the configuration is invalid', () => {
    it('should throw an error', () => {
      expect.hasAssertions();

      jest.spyOn(validationSchema, 'validate').mockReturnValueOnce({
        error: { message: 'validation_message' },
        value: undefined,
      } as any);

      expect(() =>
        underTest.validateEnvironment({} as any, validationSchema),
      ).toThrowErrorMatchingInlineSnapshot(
        `"validation_message, using environment: {}"`,
      );
    });
  });
});
