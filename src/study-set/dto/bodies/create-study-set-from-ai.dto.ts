import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DifficultyLevel } from '../../enums/difficult-level.enum';
import { QuestionType } from '../../enums/question-type.enum';

export class CreateStudySetFromAiDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  language: string;

  @IsOptional()
  @IsNumber()
  numberOfFlashcards: number;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @IsOptional()
  @IsEnum(QuestionType)
  questionType: QuestionType;
}
