import { IsNotEmpty, IsEnum, IsString, IsEmail } from '@nestjs/class-validator';

export class UsersDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsEnum(['Super Admin', 'Admin',"TSA","FAA","Security"])
  @IsNotEmpty()
  role: string;
}
