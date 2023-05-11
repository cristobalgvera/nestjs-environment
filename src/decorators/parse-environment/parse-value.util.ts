import { TransformFnParams } from 'class-transformer';

export function parseValue({ value, key }: TransformFnParams): unknown {
  try {
    return JSON.parse(value);
  } catch (error) {
    const message = [
      '------------------------',
      `Unable to parse JSON value`,
      '',
      `Key: '${key}'`,
      `Value: '${value}'`,
      '------------------------',
    ].join('\n');

    throw new Error(message);
  }
}
