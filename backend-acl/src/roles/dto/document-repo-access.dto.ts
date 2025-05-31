import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InReviewDto } from './in-review.dto';
import { IsNotEmpty } from 'class-validator';

export class DocumentRepoAccessDto {
  @ValidateNested()
  @Type(() => InReviewDto)
  @IsNotEmpty()
  inReview: InReviewDto;

  @IsString()
  @IsNotEmpty()  // Add this
  referenceDocument: string;

  @IsString()
  @IsNotEmpty()  // Add this
  approved: string;

  @IsString()
  @IsNotEmpty()  // Add this
  deactivated: string;
}
