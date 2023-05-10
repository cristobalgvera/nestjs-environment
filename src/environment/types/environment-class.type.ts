import { ClassConstructor } from 'class-transformer';
import { EnvironmentBase } from './environment-base.type';

export type EnvironmentClass<
  TEnvironment extends EnvironmentBase = EnvironmentBase,
> = ClassConstructor<TEnvironment>;
