import { IsString, IsNotEmpty } from 'class-validator';

export class ActionsDto {
  @IsString()
  @IsNotEmpty()
  referenceDocumentAccess: string;

  @IsString()
  @IsNotEmpty()
  notify: string;
}