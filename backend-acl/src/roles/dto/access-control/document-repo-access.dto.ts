import { IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { AccessLevel } from 'src/ability/enums/access-level.enum';


export class ActionsDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  referenceDocumentAccess: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  notify: AccessLevel;
}

export class InReviewDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  permission: AccessLevel;

  @ValidateNested()
  @Type(() => ActionsDto)
  @IsNotEmpty()
  actions: ActionsDto;
}


export class DocumentRepoAccessDto {
  @ValidateNested()
  @Type(() => InReviewDto)
  @IsNotEmpty()
  inReview: InReviewDto;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  referenceDocument: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  approved: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  deactivated: AccessLevel;
}
