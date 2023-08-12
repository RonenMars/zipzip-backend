import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { AnySchema } from 'joi';
import { translate } from './validations';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: AnySchema) {}
  public transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      const errorMessages = error.details.map((d) => ({
        name: d.path[0],
        message: translate(d.message),
      }));
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
