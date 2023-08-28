import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { AnySchema } from 'joi';
import { translate } from '@i18n/translate';

/**
 * A custom NestJS pipe for validating incoming data using Joi schemas.
 *
 * @class
 * @implements {PipeTransform}
 * @param {AnySchema} schema - The Joi schema used for validation.
 *
 * @example
 * import { Controller, Post, Body } from '@nestjs/common';
 * import { JoiValidationPipe } from './your-pipe-module';
 * import Joi from 'joi';
 *
 * @Controller('example')
 * export class ExampleController {
 *   @Post('validate')
 *   validateData(@Body(new JoiValidationPipe(Joi.object({ *** ... define your validation schema here ... ***  }))) data) {
 *     // This endpoint will automatically validate the incoming data.
 *     return data;
 *   }
 * }
 */
@Injectable()
export class JoiValidationPipe implements PipeTransform {
  /**
   * Constructor for the JoiValidationPipe class.
   *
   * @constructor
   * @param {AnySchema} schema - The Joi schema used for validation.
   */
  constructor(private schema: AnySchema) {}

  /**
   * Transforms the incoming data by validating it against the provided Joi schema.
   *
   * @function
   * @param {any} value - The value to be transformed and validated.
   * @returns {any} The transformed and validated value if it passes validation.
   * @throws {BadRequestException} If the data does not pass validation, a BadRequestException with error messages is thrown.
   */
  public transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      const errorMessages = error.details.map((d) => {
        let fieldName = d?.context?.key;
        if (!fieldName) {
          if (d.message.includes('.phone.')) {
            fieldName = 'phone';
          }
        }
        return {
          name: fieldName,
          message: translate(d.message),
        };
      });
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
