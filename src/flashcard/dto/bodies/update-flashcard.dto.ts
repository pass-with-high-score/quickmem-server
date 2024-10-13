import { IsOptional, IsString } from 'class-validator';

export class UpdateFlashcardDto {
  @IsOptional()
  @IsString()
  term?: string;

  @IsOptional()
  @IsString()
  definition?: string;

  @IsOptional()
  @IsString()
  definitionImageURL?: string;

  @IsOptional()
  @IsString()
  hint?: string;

  @IsOptional()
  @IsString()
  explanation?: string;
}
