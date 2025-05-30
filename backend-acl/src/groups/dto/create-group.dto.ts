import { IsArray, IsNotEmpty, IsString, IsMongoId } from '@nestjs/class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  groupName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  users: string[];
}
