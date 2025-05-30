import { IsString, ValidateNested } from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';
import { InReviewDto } from './in-review.dto';

export class DocumentRepoAccessDto {
  @ValidateNested()
  @Type(() => InReviewDto)
  inReview: InReviewDto;

  @IsString()
  referenceDocument: string;

  @IsString()
  approved: string;

  @IsString()
  deactivated: string;
}
