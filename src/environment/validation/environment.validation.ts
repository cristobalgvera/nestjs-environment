import { plainToInstance } from 'class-transformer';
import type {
  EnvironmentBase,
  EnvironmentClass,
  EnvironmentSchema,
} from '../types';

export function validateEnvironment<
  TEnvironemnt extends EnvironmentBase = EnvironmentBase,
>(
  environmentValues: Record<string, unknown>,
  EnvironmentClass: EnvironmentClass<TEnvironemnt>,
  environmentSchema: EnvironmentSchema<TEnvironemnt>,
): TEnvironemnt {
  const environment = plainToInstance(EnvironmentClass, environmentValues, {
    enableImplicitConversion: true,
  });

  const validation = environmentSchema.validate(environment, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (validation.error) throw new Error(validation.error.message);

  return validation.value;
}
