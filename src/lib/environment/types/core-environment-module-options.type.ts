import { ClassConstructor } from 'class-transformer';
import { BaseEnvironment } from '../environment.type';
import { ValidationSchema } from './validation-schema.type';

export type CoreEnvironmentModuleOptions<TEnvironment extends BaseEnvironment> =
  Readonly<{
    environmentClass: ClassConstructor<TEnvironment>;
    validationSchema: ValidationSchema<TEnvironment>;
  }>;
