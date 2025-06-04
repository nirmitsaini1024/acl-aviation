import {
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AccessLevel } from 'src/ability/enums/access-level.enum';

export class UploadActionsDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  uploadWorkingCopy: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  uploadReferenceDocument: AccessLevel;
}

export class UploadDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  permission: AccessLevel;

  @ValidateNested()
  @Type(() => UploadActionsDto)
  @IsNotEmpty()
  actions: UploadActionsDto;
}

export class ReviewAdministrationAccessDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  permission: AccessLevel;

  @ValidateNested()
  @Type(() => UploadDto)
  @IsNotEmpty()
  upload: UploadDto;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  signOff: AccessLevel;
}

export class ApprovedActionsDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  finalCopy: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  summary: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  annotatedDocs: AccessLevel;
}

export class ApprovedDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  permission: AccessLevel;

  @ValidateNested()
  @Type(() => ApprovedActionsDto)
  @IsNotEmpty()
  actions: ApprovedActionsDto;
}

export class AdminDocumentRepositoryViewDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  permission: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  pending: AccessLevel;

  @ValidateNested()
  @Type(() => ApprovedDto)
  @IsNotEmpty()
  approved: ApprovedDto;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  deactivated: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  referenceDocuments: AccessLevel;
}

export class ReviewAdministrationDto {
  @ValidateNested()
  @Type(() => ReviewAdministrationAccessDto)
  @IsNotEmpty()
  reviewAdministrationAccess: ReviewAdministrationAccessDto;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  reviewManagement: AccessLevel;

  @ValidateNested()
  @Type(() => AdminDocumentRepositoryViewDto)
  @IsNotEmpty()
  adminDocumentRepositoryView: AdminDocumentRepositoryViewDto;
}
