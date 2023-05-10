import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentBase } from './types';

@Injectable()
export class EnvironmentService<
  TEnvironment extends EnvironmentBase = EnvironmentBase,
> {
  constructor(
    private readonly configService: ConfigService<TEnvironment, true>,
  ) {}

  get<Key extends keyof TEnvironment>(key: Key): TEnvironment[Key] {
    // FIX: Create the proper type for ConfigService.getOrThrow
    // @ts-expect-error: Type used by ConfigService is incorrect
    return this.configService.getOrThrow(key);
  }

  isSwaggerEnabled(): boolean {
    return this.get('ENABLE_SWAGGER');
  }

  isProd(): boolean {
    return this.get('NODE_ENV') === 'production';
  }
}
