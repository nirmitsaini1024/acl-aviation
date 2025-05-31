import { IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

export class CreateTenantDto {

  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsOptional()
  mobileNumber?: string;
}
