import { IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

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
}
