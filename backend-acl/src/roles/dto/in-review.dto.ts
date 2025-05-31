import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ActionsDto } from './inReviewActions.dto';
import { IsNotEmpty } from 'class-validator';

export class InReviewDto {
  @IsString()
  @IsNotEmpty()
  permission: string;

  @ValidateNested()
  @Type(() => ActionsDto)
  @IsNotEmpty()
  actions: ActionsDto;
}
