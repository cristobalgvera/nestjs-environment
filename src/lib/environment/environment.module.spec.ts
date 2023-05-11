import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from '@util/validation';
import { EnvironmentModule as underTest } from './environment.module';
import { EnvironmentService } from './environment.service';

jest.mock('@util/validation');
jest.mock('@nestjs/config', () => ({
  ConfigModule: {
    forRoot: jest.fn(),
  },
}));

const mockConfigModuleForRoot = jest.mocked(ConfigModule.forRoot);
const mockValidateEnvironment = jest.mocked(validateEnvironment);

describe('EnvironmentModule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('forRoot', () => {
    beforeEach(() => {
      mockConfigModuleForRoot.mockReturnValue({} as any);
    });

    it('should return a dynamic module with proper attributes', () => {
      const expectedConfigModule = { foo: 'bar' };

      mockConfigModuleForRoot.mockReturnValueOnce(expectedConfigModule as any);

      const actual = underTest.forRoot({} as any);

      expect(actual).toEqual(
        expect.objectContaining<Partial<DynamicModule>>({
          module: underTest,
          global: true,
          imports: [expectedConfigModule as any],
          providers: [EnvironmentService],
          exports: [EnvironmentService],
        }),
      );
    });

    describe('when creating the ConfigModule', () => {
      it('should call ConfigModule with the proper arguments', () => {
        underTest.forRoot({} as any);

        expect(mockConfigModuleForRoot).toHaveBeenCalledWith({
          cache: true,
          validate: expect.any(Function),
        });
      });

      it('should call validateEnvironment with the proper arguments', () => {
        const expectedConfiguration = { foo: 'config' };
        const expectedEnvironmentClass = { foo: 'class' };
        const expectedValidationSchema = { bar: 'validation_schema' };

        mockConfigModuleForRoot.mockImplementationOnce(
          (opts) => opts?.validate?.(expectedConfiguration) as any,
        );

        underTest.forRoot({
          environmentClass: expectedEnvironmentClass as any,
          validationSchema: expectedValidationSchema as any,
        });

        expect(mockValidateEnvironment).toHaveBeenCalledWith<
          Parameters<typeof validateEnvironment>
        >({
          configuration: expectedConfiguration,
          environmentClass: expectedEnvironmentClass as any,
          validationSchema: expectedValidationSchema as any,
        });
      });
    });
  });
});
