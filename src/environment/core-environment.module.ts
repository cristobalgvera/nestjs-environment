import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentService } from './environment.service';
import { BaseEnvironment } from './environment.type';
import { CoreEnvironmentModuleOptions } from './types';
import { validateEnvironment } from './utils';

@Module({})
export class CoreEnvironmentModule {
  static forRoot<TEnvironment extends BaseEnvironment>(
    options: CoreEnvironmentModuleOptions<TEnvironment>,
  ): DynamicModule {
    const { environmentClass, validationSchema } = options;

    const ValidatedConfigModule = ConfigModule.forRoot({
      cache: true,
      validate: (configuration) =>
        validateEnvironment({
          configuration,
          environmentClass,
          validationSchema,
        }),
    });

    return {
      module: CoreEnvironmentModule,
      global: true,
      imports: [ValidatedConfigModule],
      providers: [EnvironmentService],
      exports: [EnvironmentService],
    };
  }
}
