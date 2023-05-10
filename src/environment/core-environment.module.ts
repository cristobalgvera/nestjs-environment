import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentService } from './environment.service';
import { EnvironmentBase, EnvironmentClass, EnvironmentSchema } from './types';
import { validateEnvironment } from './validation';

@Module({})
export class CoreEnvironmentModule {
  static forRoot<TEnvironment extends EnvironmentBase = EnvironmentBase>(
    EnvironmentClass: EnvironmentClass<TEnvironment>,
    environmentSchema: EnvironmentSchema<TEnvironment>,
  ): DynamicModule {
    const ValidatedConfigModule = ConfigModule.forRoot({
      cache: true,
      validate: (environmentValues) =>
        validateEnvironment<TEnvironment>(
          environmentValues,
          EnvironmentClass,
          environmentSchema,
        ),
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
