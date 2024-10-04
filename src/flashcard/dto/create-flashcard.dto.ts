import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Rating } from '../entities/rating.enum';

export class CreateFlashcardDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsOptional()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  questionImageURL: string[];

  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsOptional()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  answerImageURL: string[];

  @IsOptional()
  @IsString()
  hint: string;

  @IsOptional()
  @IsString()
  explanation: string;

  @IsNotEmpty()
  @IsUUID()
  studySetId: string;

  @IsOptional()
  @IsEnum(Rating)
  rating: Rating;
}
