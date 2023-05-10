import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentService } from './environment.service';
import { BaseEnvironment } from './environment.type';
import { CoreEnvironmentModuleOptions } from './types';

@Module({})
export class CoreEnvironmentModule {
  static forRoot<TEnvironment extends BaseEnvironment>({
    validate,
  }: CoreEnvironmentModuleOptions<TEnvironment>): DynamicModule {
    const ValidatedConfigModule = ConfigModule.forRoot({
      cache: true,
      validate,
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
