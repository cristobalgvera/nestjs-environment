import { BaseEnvironment } from '../environment.type';

export type CoreEnvironmentModuleOptions<TEnvironment extends BaseEnvironment> =
  {
    validate: (configuration: Record<string, unknown>) => TEnvironment;
  };
