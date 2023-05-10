import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import * as Joi from 'joi';
import * as underTest from './environment.validation';
import { createMock } from '@golevelup/ts-jest';

jest.mock('class-transformer', () => ({
  plainToInstance: jest.fn(),
}));

const plainToInstanceMock = jest.mocked(plainToInstance);

describe('EnvironmentValidation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateEnvironment', () => {
    let environmentSchema: Joi.ObjectSchema<any>;
    let transformedEnvironment: Record<string, unknown>;

    beforeEach(() => {
      environmentSchema = createMock<Joi.ObjectSchema>();
      transformedEnvironment = { id: 'id' };

      plainToInstanceMock.mockReturnValue(transformedEnvironment);
      jest
        .spyOn(environmentSchema, 'validate')
        .mockReturnValue({ error: undefined } as any);
    });

    it('should transform the configuration to an Environment class', () => {
      const expectedConfig = { config: 'config' };
      const expectedEnvironmentClass = {};

      underTest.validateEnvironment(
        expectedConfig,
        expectedEnvironmentClass as any,
        environmentSchema,
      );

      expect(plainToInstanceMock).toHaveBeenCalledWith(
        expectedEnvironmentClass,
        expectedConfig,
        expect.objectContaining<ClassTransformOptions>({
          enableImplicitConversion: true,
        }),
      );
    });

    it('should validate the transformed configuration against the schema', () => {
      const expected = { config: 'config' };

      plainToInstanceMock.mockReturnValueOnce(expected);

      const environmentSchemaSpy = jest.spyOn(environmentSchema, 'validate');

      underTest.validateEnvironment({} as any, {} as any, environmentSchema);

      expect(environmentSchemaSpy).toHaveBeenCalledWith(
        expected,
        expect.objectContaining<Joi.ValidationOptions>({
          allowUnknown: true,
          abortEarly: false,
        }),
      );
    });

    describe('when the configuration is valid', () => {
      it('should return the validated configuration', () => {
        const expected = { ...transformedEnvironment };

        jest.spyOn(environmentSchema, 'validate').mockReturnValueOnce({
          error: undefined,
          value: expected,
        } as any);

        const actual = underTest.validateEnvironment(
          {} as any,
          {} as any,
          environmentSchema,
        );

        expect(actual).toEqual(expected);
      });
    });

    describe('when the configuration is invalid', () => {
      it('should throw an error', () => {
        expect.hasAssertions();

        jest.spyOn(environmentSchema, 'validate').mockReturnValueOnce({
          error: { message: 'validation_message' },
          value: undefined,
        } as any);

        expect(() =>
          underTest.validateEnvironment(
            {} as any,
            {} as any,
            environmentSchema,
          ),
        ).toThrowErrorMatchingInlineSnapshot(`"validation_message"`);
      });
    });
  });
});
