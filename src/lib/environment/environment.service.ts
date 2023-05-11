import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseEnvironment } from './environment.type';

@Injectable()
export class EnvironmentService<TEnvironment extends BaseEnvironment> {
  constructor(
    private readonly configService: ConfigService<TEnvironment, true>,
  ) {}

  get<Key extends keyof TEnvironment>(key: Key): TEnvironment[Key] {
    // FIX: Create the proper type for ConfigService.getOrThrow
    // @ts-expect-error: Type used by ConfigService is incorrect
    return this.configService.getOrThrow(key);
  }

  isProd(): boolean {
    return this.get('NODE_ENV') === 'production';
  }
}
