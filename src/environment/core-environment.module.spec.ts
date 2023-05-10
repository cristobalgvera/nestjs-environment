import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreEnvironmentModule as underTest } from './core-environment.module';
import { EnvironmentService } from './environment.service';

jest.mock('@nestjs/config', () => ({
  ConfigModule: {
    forRoot: jest.fn(),
  },
}));

jest.mock('./validation', () => ({
  validateEnvironment: jest.fn(),
}));

const mockConfigModuleForRoot = jest.mocked(ConfigModule.forRoot);

describe('CoreEnvironmentModule', () => {
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
        const expectedValidate = { foo: 'bar' };

        underTest.forRoot({
          validate: expectedValidate as any,
        });

        expect(mockConfigModuleForRoot).toHaveBeenCalledWith({
          cache: true,
          validate: expectedValidate,
        });
      });
    });
  });
});
