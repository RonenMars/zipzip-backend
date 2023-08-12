import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { AnySchema } from 'joi';
import { translate } from '@i18n/translate';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: AnySchema) {}
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
