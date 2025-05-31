import { IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ActionsDto {
  @IsString()
  referenceDocumentAccess: string;

  @IsString()
  notify: string;
}

class InReviewDto {
  @IsString()
  permission: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ActionsDto)
  actions: ActionsDto;
}

export class CreateDocumentRepoDto {
  @IsObject()
  @ValidateNested()
  @Type(() => InReviewDto)
  inReview: InReviewDto;

  @IsString()
  referenceDocument: string;

  @IsString()
  approved: string;

  @IsString()
  deactivated: string;
} 