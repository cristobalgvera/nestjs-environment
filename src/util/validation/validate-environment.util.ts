import { BaseEnvironment } from '@lib/environment';
import { DetailedError } from '@util/error';
import { plainToInstance } from 'class-transformer';
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

  if (validation.error) throw new DetailedError(validation.error.message);

  return validation.value;
}
