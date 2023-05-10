import { BaseEnvironment } from '../../environment.type';
import { CoreEnvironmentModuleOptions } from '../../types';

export type ValidateOptions<TEnvironment extends BaseEnvironment> = Pick<
  CoreEnvironmentModuleOptions<TEnvironment>,
  'validationSchema' | 'environmentClass'
> & { configuration: Record<string, unknown> };
