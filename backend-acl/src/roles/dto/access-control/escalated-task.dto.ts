import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccessLevel } from 'src/ability/enums/access-level.enum';

export class EscalatedTaskAccessDto {
  @IsEnum(AccessLevel)
  @IsNotEmpty()
  notify: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  assign: AccessLevel;

  @IsEnum(AccessLevel)
  @IsNotEmpty()
  escalatedTaskAccess: AccessLevel;
}
