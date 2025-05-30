import { IsString } from '@nestjs/class-validator';

export class ActionsDto {
  @IsString()
  referenceDocumentAccess: string;

  @IsString()
  notify: string;
}
