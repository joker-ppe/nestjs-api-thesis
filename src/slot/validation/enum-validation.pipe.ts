// enum-validation.pipe.ts

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class EnumValidationPipe implements PipeTransform {
  constructor(private enumType: any) {} // Pass the enum type as a parameter

  transform(value: any, metadata: ArgumentMetadata) {
    if (this.isEnumValue(value, this.enumType)) {
      return value;
    }
    throw new BadRequestException(
      `Invalid value for ${metadata.data} parameter.`,
    );
  }

  private isEnumValue(value: any, enumType: any): boolean {
    const enumValues = Object.values(enumType);
    return enumValues.includes(value);
  }
}
