import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWriteHintBodyDto {
  @IsUUID()
  @IsNotEmpty()
  flashcardId: string;

  @IsNotEmpty()
  @IsString()
  studySetTitle: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  answer: string;
}
