import { IsOptional, IsString, IsMongoId } from 'class-validator';

export class AssignRoleDto {
  @IsOptional()
  @IsString()
  @IsMongoId({ message: 'Invalid user ID format' })
  userId?: string;

  @IsOptional() 
  @IsString()
  @IsMongoId({ message: 'Invalid group ID format' })
  groupId?: string;
}