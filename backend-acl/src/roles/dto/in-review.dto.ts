import { IsString, ValidateNested } from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';
import { ActionsDto } from './inReviewActions.dto';

export class InReviewDto {
  @IsString()
  permission: string;

  @ValidateNested()
  @Type(() => ActionsDto)
  actions: ActionsDto;
}
