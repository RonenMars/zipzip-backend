import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { AnySchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: AnySchema) {}
  public transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      const errorMessages = error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
