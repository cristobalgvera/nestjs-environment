import { Transform } from 'class-transformer';
import { parseValue } from './parse-value.util';
import { ParseEnvironmentOptions } from './types';

export function ParseEnvironment(options?: ParseEnvironmentOptions) {
  return Transform(parseValue, {
    toClassOnly: options?.toClass,
  });
}
