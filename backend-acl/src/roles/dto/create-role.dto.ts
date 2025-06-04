import { IsNotEmpty, IsOptional, IsString, ValidateNested } from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';
import { DocumentRepoAccessDto } from './access-control/document-repo-access.dto';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsString()
  @IsOptional()
  middlename?: string;

  @IsString()
  @IsNotEmpty()
  roleTitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

@ValidateNested()
@Type(() => DocumentRepoAccessDto)
@IsNotEmpty()
documentRepoAccess: DocumentRepoAccessDto;
}
