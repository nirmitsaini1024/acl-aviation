import { IsEnum, IsNotEmpty, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AccessLevel } from 'src/ability/enums/access-level.enum';

export class GroupActionsDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  review: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  approval: AccessLevel;
}

export class GroupAccessDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  permission: AccessLevel;

  @ValidateNested()
  @Type(() => GroupActionsDto)
  @IsNotEmpty()
  actions: GroupActionsDto;
}

export class TaskAccessDto {
  @ValidateNested()
  @Type(() => GroupAccessDto)
  @IsNotEmpty()
  group: GroupAccessDto;

  @IsString()
  @IsNotEmpty()
  user: string;
}
