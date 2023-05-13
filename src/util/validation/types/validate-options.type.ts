import { BaseEnvironment, EnvironmentModuleOptions } from '@lib/environment';

export type ValidateOptions<TEnvironment extends BaseEnvironment> = Readonly<
  { configuration: Record<string, unknown> } & Pick<
    EnvironmentModuleOptions<TEnvironment>,
    'validationSchema' | 'environmentClass'
  >
>;
