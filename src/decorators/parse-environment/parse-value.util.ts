import { DetailedError } from '@util/error';
import { TransformFnParams } from 'class-transformer';

export function parseValue({ value, key }: TransformFnParams): unknown {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new DetailedError([
      `Unable to parse JSON value:`,
      `  - Key: '${key}'`,
      `  - Value: '${value}'`,
    ]);
  }
}
