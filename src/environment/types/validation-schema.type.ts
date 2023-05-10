import * as Joi from 'joi';
import { BaseEnvironment } from '../environment.type';

export type ValidationSchema<TEnvironment extends BaseEnvironment> =
  Joi.ObjectSchema<TEnvironment>;
