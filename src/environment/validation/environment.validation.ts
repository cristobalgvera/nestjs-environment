import { BaseEnvironment } from '../environment.type';
import { EnvironmentSchema } from '../types';

export function validateEnvironment<TEnvironment extends BaseEnvironment>(
  environment: TEnvironment,
  validationSchema: EnvironmentSchema<TEnvironment>,
): TEnvironment {
  const validation = validationSchema.validate(environment, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (validation.error)
    throw new Error(
      `${validation.error.message}, using environment: ${JSON.stringify(
        environment,
      )}`,
    );

  return validation.value;
}
