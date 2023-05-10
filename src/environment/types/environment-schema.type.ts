import * as Joi from 'joi';
import { BaseEnvironment } from '../environment.type';

export type EnvironmentSchema<TEnvironment extends BaseEnvironment> =
  Joi.ObjectSchema<TEnvironment>;
