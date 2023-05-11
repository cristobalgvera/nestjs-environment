import {
  BaseEnvironment,
  CoreEnvironmentModuleOptions,
} from '@lib/environment';

export type ValidateOptions<TEnvironment extends BaseEnvironment> = Readonly<
  {
    configuration: Record<string, unknown>;
  } & Pick<
    CoreEnvironmentModuleOptions<TEnvironment>,
    'validationSchema' | 'environmentClass'
  >
>;
