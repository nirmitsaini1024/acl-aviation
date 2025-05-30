import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  middlename?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsEnum(['12 hours', '1 day', '3 days', '7 days'])
  @IsNotEmpty()
  reminder: string;

  
}
