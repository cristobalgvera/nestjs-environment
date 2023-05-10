import { Transform } from 'class-transformer';
import { parseValue } from './parse-value.util';
import { ParseOptions } from './types';

export function Parse(options?: ParseOptions) {
  return Transform(parseValue, {
    toClassOnly: options?.toClass,
  });
}
