import { TransformFnParams } from 'class-transformer';

export function parseValue({ value, key }: TransformFnParams): unknown {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Unable to parse JSON value for key: ${key}`);
  }
}
