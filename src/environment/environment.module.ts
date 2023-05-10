import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentService } from './environment.service';
import { EnvironmentBase, EnvironmentClass, EnvironmentSchema } from './types';
import { validateEnvironment } from './validation';

@Module({})
export class EnvironmentModule {
  static register<TEnvironment extends EnvironmentBase = EnvironmentBase>(
    EnvironmentClass: EnvironmentClass<TEnvironment>,
    environmentSchema: EnvironmentSchema<TEnvironment>,
  ): DynamicModule {
    return {
      module: EnvironmentModule,
      imports: [
        ConfigModule.forRoot({
          validate: (environmentValues) =>
            validateEnvironment<TEnvironment>(
              environmentValues,
              EnvironmentClass,
              environmentSchema,
            ),
          cache: true,
        }),
      ],
      providers: [EnvironmentService],
      exports: [EnvironmentService],
    };
  }
}
