import { TransformFnParams } from 'class-transformer';

export function parseValue({ value }: TransformFnParams) {
  return JSON.parse(value);
}
