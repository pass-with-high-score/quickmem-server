import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OptionDto } from './option.dto';
import { Rating } from '../entities/rating.enum';

export class CreateFlashcardDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsOptional()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  imageURL: string[];

  @IsOptional()
  @IsString()
  hint: string;

  @IsOptional()
  @IsString()
  explanation: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];

  @IsNotEmpty()
  @IsUUID()
  studySetId: string;

  @IsOptional()
  @IsEnum(Rating)
  rating: Rating;
}
