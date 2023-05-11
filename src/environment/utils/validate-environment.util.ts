import { plainToInstance } from 'class-transformer';
import { BaseEnvironment } from '../environment.type';
import { ValidateOptions } from './types';

export function validateEnvironment<TEnvironment extends BaseEnvironment>({
  configuration,
  validationSchema,
  environmentClass,
}: ValidateOptions<TEnvironment>): TEnvironment {
  const environment = plainToInstance(environmentClass, configuration);

  const validation = validationSchema.validate(environment, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (validation.error) throw new Error(`${validation.error.message}`);

  return validation.value;
}
