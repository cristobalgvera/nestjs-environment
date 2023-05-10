# NestJS Environment

<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
  </a>
</p>

Environment module configuration library that allows you to easily setup
and validate your environment with minimal configuration.

- Type safe environment usage.
- Complex environments variables (arrays and objects) validation.

## Installation

```bash
npm install @cristobalgvera/nestjs-environment
```

## Usage

The most basic usage possible is the following:

1. Create the `Environment` class. It needs to implements `BaseEnvironment`.

   ```ts
   // environment/environment.model.ts

   import { BaseEnvironment } from '@cristobalgvera/nestjs-environment';

   export class Environment implements BaseEnvironment {
     NODE_ENV: string;
     PORT: number;
   }
   ```

1. Create a validation schema for that `Environment` using `Joi`. Remember to
   create the test file too.

   ```ts
   // environment/environment.schema.ts

   import * as Joi from 'joi';
   import { Environment } from './environment.model';

   export const environmentSchema = Joi.object<Environment, true>({
     NODE_ENV: Joi.string()
       .valid('development', 'test', 'production')
       .default('development'),
     PORT: Joi.number().port().default(8080),
   });
   ```

1. Import the `EnvironmentModule` usign the `forRoot` static method and provide
   the `Environment` class and the validation schema.

   ```ts
   // app.module.ts

   import { EnvironmentModule } from '@cristobalgvera/nestjs-environment';
   import { Module } from '@nestjs/common';
   import { Environment, environmentSchema } from './environment';

   @Module({
     imports: [
       EnvironmentModule.forRoot({
         environmentClass: Environment,
         validationSchema: environmentSchema,
       }),
     ],
   })
   export class AppModule {}
   ```

1. Use the `EnvironmentService` in any place you want through DI. You need
   to provide as generic parameter the `Environment` class previously created
   and it will be type-safe.

   ```ts
   // test.service.ts

   import { EnvironmentService } from '@cristobalgvera/nestjs-environment';
   import { Injectable } from '@nestjs/common';
   import { Environment } from './environment';

   @Injectable()
   export class TestService {
     constructor(
       private readonly environmentService: EnvironmentService<Environment>,
     ) {}

     getPort(): number {
       const port = this.environmentService.get('PORT');
       //     ^? const port: number
       return port;
     }
   }
   ```

1. Finally, to test it, simply mock it.

   ```ts
   // test.service.spec.ts

   import { TestBed } from '@automock/jest';
   import { EnvironmentService } from '@cristobalgvera/nestjs-environment';
   import { Environment } from './environment';
   import { TestService } from './test.service';

   describe('TestService', () => {
     let underTest: TestService;
     let environmentService: EnvironmentService<Environment>;

     beforeEach(() => {
       const { unit, unitRef } = TestBed.create(TestService).compile();

       underTest = unit;
       environmentService = unitRef.get(EnvironmentService);
     });

     describe('getPort', () => {
       const environment = {
         PORT: 1234,
       } as Readonly<Environment>;

       beforeEach(() => {
         jest
           .spyOn(environmentService, 'get')
           .mockImplementation((key) => environment[key]);
       });

       it('should return the port', () => {
         const actual = underTest.getPort();

         expect(actual).toEqual(environment.PORT);
       });
     });
   });
   ```

### Advance usage

Following the same structure described above, you can create complex
environment variables that can be validated. This complex types can be
arrays or custom objects that has an inner validation too.

The unique change you have to do it the following:

1. Add the `ParseEnvironment` decorator to the complex types.

   ```ts
   // environment/environmen.model.ts

   import {
     BaseEnvironment,
     ParseEnvironment,
   } from '@cristobalgvera/nestjs-environment';
   import { User } from './user.model';

   export class Environment implements BaseEnvironment {
     NODE_ENV: 'development' | 'test' | 'production';
     PORT: number;
     IS_SWAGGER_ENABLED: boolean;

     @ParseEnvironment() // <-- Use this to parse arrays of primitive values
     ALLOWED_NAMES: string[];

     @ParseEnvironment({ toClass: true }) // <-- Use this to parse classes
     USER_VALUE: User;

     @ParseEnvironment({ toClass: true }) // <-- Use this to parse arrays of classes
     USERS: User[];
   }
   ```

1. Create the validation schema. Note the usage of a `userSchema` to validate
   the users. This way you can easily tests separately each schema.

   ```ts
   // environment/environment.schema.ts

   import * as Joi from 'joi';
   import { Environment } from './environment.model';
   import { userSchema } from './user.schema'; // Users can have their own schema

   export const environmentSchema = Joi.object<Environment, true>({
     NODE_ENV: Joi.string()
       .valid('development', 'test', 'production')
       .default('development'),
     PORT: Joi.number().port().default(8080),
     IS_SWAGGER_ENABLED: Joi.boolean().default(true),
     ALLOWED_NAMES: Joi.array().items(Joi.string().required()).required(),
     USER_VALUE: userSchema.required(),
     USERS: Joi.array().items(userSchema).required(),
   });
   ```
