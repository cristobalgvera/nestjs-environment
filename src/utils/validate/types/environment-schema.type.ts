import { BaseEnvironment } from '@core/environment';
import * as Joi from 'joi';

export type EnvironmentSchema<TEnvironment extends BaseEnvironment> =
  Joi.ObjectSchema<TEnvironment>;
