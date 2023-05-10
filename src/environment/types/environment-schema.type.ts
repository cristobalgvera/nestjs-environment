import * as Joi from 'joi';
import { EnvironmentBase } from './environment-base.type';

export type EnvironmentSchema<
  TEnvironment extends EnvironmentBase = EnvironmentBase,
> = Joi.ObjectSchema<TEnvironment>;
